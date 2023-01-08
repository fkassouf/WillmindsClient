import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DataTableRequest } from "app/modules/common/models/datatable-request";
import { BehaviorSubject, catchError, Observable, finalize, of } from "rxjs";
import { AdminService } from "../admin.service";
import { UsersFilter } from "../models/user-filter";
import { UserModel } from "../models/user-model";


export class UsersDataSource implements DataSource<UserModel> 
{
    private usersSubject = new BehaviorSubject<UserModel[]>([]);
    private usersTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private adminService: AdminService) {}

    get users$()
    {
        return this.usersSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.usersTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<UserModel[]> 
    {
        return this.usersSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.usersSubject.complete();
        this.loadingSubject.complete();
        this.usersTotalRecordsSubject.complete();
    }

    getUsers(filter : UsersFilter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
        this.adminService.getUsers(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            if(resp.success)
            {
                this.usersTotalRecordsSubject.next(resp.result?.totalRecord);
                this.usersSubject.next(resp.result?.data);
            }
        });
        

    }  

}