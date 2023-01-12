import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { environment } from 'environments/environment';
import { DataTableRequest } from '../common/models';


@Injectable({
    providedIn: 'root'
})
export class AdminService
{
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        
    }

    getUsers(dataTableRequest : DataTableRequest) : Observable<any>
    {
        const headers = {'content-type' : 'application/json'};
        let body = JSON.stringify(dataTableRequest);
        let url = environment.api + '/Admin/GetUsers';
        return this._httpClient.post<any>(url, body, {headers : headers});
    }

    activate(active : boolean, id : string) : Observable<any>
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/SuperAdmin/SetActive?id=' + id + '&status=' + active;
        return this._httpClient.post<any>(url, null);
    }

   
}
