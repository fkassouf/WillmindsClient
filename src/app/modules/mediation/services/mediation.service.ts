import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MediationService
{
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        
    }

    getDisputeList()
    {
        return this._httpClient.get<any>(environment.api + '/Case/GetDisputeList');
    }
}