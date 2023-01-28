import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, tap } from 'rxjs';
import { MediationsDataSource } from '../datasources/mediations-datasource';
import { MediationsFilterComponent } from '../mediations-filter/mediations-filter.component';
import { MediationsFilter } from '../models/mediations-filter';
import { MediationService } from '../services/mediation.service';

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
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /*constructor*/
  constructor(private mediationService : MediationService, private router : Router){}

  ngOnInit(): void {
       
    this.breadCrumbItems = [
       { label: 'Mediations', active: true, url : '/mediation/mediations' }
    ];

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
}
