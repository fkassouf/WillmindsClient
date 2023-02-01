import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class VerificationService
{
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        
    }

    mediationRequestAccept(token : string, accept : boolean)
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/Party/PartyApprove';
        return this._httpClient.post<any>(url, {token : token, accept : accept}, {headers : headers});
    }
}