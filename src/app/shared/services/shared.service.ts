import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SharedService
{
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        
    }

    getCurrwencyList()
    {
        return this._httpClient.get<any>(environment.api + '/Case/GetCurrencyList');
    }

    getPaymentMethods()
    {
        return this._httpClient.get<any>(environment.api + '/Case/GetPaymentMethods');
    }
}