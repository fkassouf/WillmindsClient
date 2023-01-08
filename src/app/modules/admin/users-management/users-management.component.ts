import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { merge, tap } from 'rxjs';
import { AdminService } from '../admin.service';
import { UsersDataSource } from '../datasources/users-datasource';
import { UsersFilter } from '../models/user-filter';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit, AfterViewInit {
  breadCrumbItems!: Array<{}>;
  dataSource: UsersDataSource;
  displayedColumns= ["email", "firstName", "lastName", "isEnabled"];
  usersFilter : UsersFilter = new UsersFilter();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private adminService : AdminService, private authService : AuthenticationService, 
    private tostr : ToastrService, private router : Router){}

  ngOnInit(): void {
       
    this.breadCrumbItems = [
       { label: 'Users-Management', active: true, url : '/admin/users-management' }
    ];

    this.dataSource = new UsersDataSource(this.adminService);
    this.dataSource.getUsers(this.usersFilter, 'email', 'asc', 0, 10);

  }

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort?.sortChange, this.paginator?.page)
    .pipe(tap(() => this.loadUsersPage()))
    .subscribe();
  }

  loadUsersPage() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSource.getUsers(
        this.usersFilter,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
  }

  /*Toggle user status*/
  toggleStatus(event : any, user : any)
  {
      this.adminService.deactivate(event.checked, user.id).subscribe(resp=>{
        if(resp.success)
        {
           this.tostr.success(user.email + (event.checked? ' enabled ' : ' disabled ') + ' successfully');
           this.loadUsersPage();
        }
        else
        {
          this.tostr.error(resp.message);
        }
      })
  }

  addNewUser()
  {
     this.router.navigate(['/admin/new-user']);
  }

}
