import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DataTableRequest } from "app/modules/common/models";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { MediationList } from "../models/mediation-list";
import { MediationsFilter } from "../models/mediations-filter";
import { MediationService } from "../services/mediation.service";

export class MediationsDataSource implements DataSource<MediationList> 
{
    private casesSubject = new BehaviorSubject<MediationList[]>([]);
    private casesTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    /**constructor */
    constructor(private mediationService: MediationService) {}

    get users$()
    {
        return this.casesSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.casesTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<MediationList[]> 
    {
        return this.casesSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.casesSubject.complete();
        this.loadingSubject.complete();
        this.casesTotalRecordsSubject.complete();
    }

    getMediations(filter : MediationsFilter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
        this.mediationService.getMediations(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            if(resp.success)
            {
                this.casesTotalRecordsSubject.next(resp.result?.totalRecord);
                this.casesSubject.next(resp.result?.data);
            }
        });
        

    }  
}