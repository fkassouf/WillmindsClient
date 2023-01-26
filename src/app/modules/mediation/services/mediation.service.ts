import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { createMediationRequest } from "../models/create-mediation-request";

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

    getMediationRequestById(id : number)
    {
        return this._httpClient.get<any>(environment.api + '/Case/GetById?id=' + id);
    }

    createMediationRequest(mediationRequest : createMediationRequest, 
        natureofdispute : File | null, 
        writtencommunication : File | null,
        contractclause : File | null,
        agreementonmediation : File | null)
    {
        const formData = new FormData();
        formData.append('case', JSON.stringify(mediationRequest));
        if(natureofdispute != null)
        {
            formData.append("natureofdispute", natureofdispute || '');
        }
        if(writtencommunication != null)
        {
            formData.append("writtencommunication", writtencommunication || '');
        }
        if(contractclause != null)
        {
            formData.append("contractclause", contractclause || '');
        }
        if(agreementonmediation != null)
        {
            formData.append("agreementonmediation", agreementonmediation || '');
        }
        return this._httpClient.post<any>(environment.api + '/Case/Create', formData);
    }
}