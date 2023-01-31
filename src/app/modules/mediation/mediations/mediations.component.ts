import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { User } from 'app/core/user/user.types';
import { MediationCaseStatusEnum } from 'app/modules/common/models/_enums';
import { merge, tap } from 'rxjs';
import { MediationsDataSource } from '../datasources/mediations-datasource';
import { MediationsFilterComponent } from '../mediations-filter/mediations-filter.component';
import { MediationsFilter } from '../models/mediations-filter';
import { MediationService } from '../services/mediation.service';
import { ROLES } from 'app/core/enums/core-enum';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mediations',
  templateUrl: './mediations.component.html',
  styleUrls: ['./mediations.component.scss']
})
export class MediationsComponent implements OnInit, AfterViewInit {
  @ViewChild('mediationsFilter') mediationsFilter : MediationsFilterComponent;
  breadCrumbItems!: Array<{}>;
  dataSource: MediationsDataSource;
  displayedColumns= ["caseNumber", "createdOn", "requesterName", "requesterEmail", 
  "requesterTelephone", "caseStatus", "lastUpdatedOn", "actions"];
  filter : MediationsFilter = new MediationsFilter();
  mediationCaseStatusEnum = MediationCaseStatusEnum;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentUser : User;
  roles = ROLES;
  /*constructor*/
  constructor(private mediationService : MediationService, 
    private router : Router, private authService : AuthenticationService, private toastrService : ToastrService){}

  ngOnInit(): void {
       
    this.breadCrumbItems = [
       { label: 'Mediations', active: true, url : '/mediation/mediations' }
    ];
    this.currentUser = this.authService.user$;
    this.dataSource = new MediationsDataSource(this.mediationService);
    this.dataSource.getMediations(this.filter, 'createdOn', 'desc', 0, 10);
  }

  ngAfterViewInit() : void {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort?.sortChange, this.paginator?.page)
    .pipe(tap(() => this.loadMediationsPage()))
    .subscribe();
  }

  loadMediationsPage() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSource.getMediations(
        this.filter,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
  }

  editCase(id : any)
  {
    this.router.navigate(['/mediation/mediation-case', id]);
  }

  addNewRequest()
  {
    this.router.navigate(['/mediation/mediation-case', '-1']);
  }

  toggleFilter()
  {
     this.mediationsFilter.toggleFilter();
  }

  filterMediations(filter : MediationsFilter)
  {
    
      this.filter = filter;
      this.loadMediationsPage();
  }

  get existsFilter() : boolean
  {
      return this.filter.caseNumber != null || 
      this.filter.requesterName != null ||
      this.filter.statusId != null ||
      this.filter.fromDate != null || 
      this.filter.toDate != null;
  }

  openDetails(mediation : any)
  {
      this.router.navigate(['/mediation/mediation-flow', mediation.id])
  }

  adminApprove(caseId : number, approve : boolean)
  {
    let approveTxt = '<span class="text-red-500">reject</span>';
    let approvedText = 'rejected'
    if(approve)
    {
      approveTxt = '<span class="text-green-500">approve</span>';
      approvedText = 'approved'
    }
    Swal.fire({
      html: 'Are you sure you want to ' + approveTxt + ' this mediation request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#f59e0b'
      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.mediationService.adminApprove(caseId, approve).subscribe(resp=>{
          if(resp.success)
          {
            this.toastrService.success('Request ' + approvedText + ' successfully');
            this.loadMediationsPage();
          }
          else
          {
            this.toastrService.error(resp.message);
          }
        })
        
      } 
    })
  }
}
