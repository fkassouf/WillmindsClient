import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { environment } from 'environments/environment';
import { DataTableRequest } from '../common/models';
import { Account, AdminAccount } from '../auth/models';
import { RegisterMediator } from './models/register-mediator';


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

    getRoles(): Observable<any>
    {
       return this._httpClient.get<any>(environment.api + '/Account/GetRoles');
    }

    getLanguagesList(): Observable<any>
    {
       return this._httpClient.get<any>(environment.api + '/Mediator/GetLanguagesList');
    }

    getDisputeList(): Observable<any>
    {
       return this._httpClient.get<any>(environment.api + '/Mediator/GetDisputeList');
    }

    getMediationList(): Observable<any>
    {
       return this._httpClient.get<any>(environment.api + '/Mediator/GetMediationList');
    }

    activate(active : boolean, id : string) : Observable<any>
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/SuperAdmin/SetActive?id=' + id + '&status=' + active;
        return this._httpClient.post<any>(url, null);
    }

     /**
     * Sign up
     *
     * @param account
     */
     createAdminUser(account : AdminAccount): Observable<any>
     {
         return this._httpClient.post<any>(environment.api + '/SuperAdmin/CreateAdmin', account);
     }

     /**
     * Sign up
     *
     * @param account
     */
     createMediatorUser(mediator : RegisterMediator, image : File | null): Observable<any>
     {
        const formData = new FormData();
        formData.append('mediator', JSON.stringify(mediator));
        if(image != null)
        {
            formData.append("image", image || '');
        }
         return this._httpClient.post<any>(environment.api + '/Mediator/Create', formData);
     }

     /*get entity account by id */
     getEntityById(id : number): Observable<any>
     {
        return this._httpClient.get<any>(environment.api + '/Entity/GetById?id=' + id);
     }

   
}
