import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataTableRequest } from "app/modules/common/models";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { createMediationRequest } from "../models/create-mediation-request";
import { MediationRegistrationPayment } from "../models/mediation-registration-payment";
import { UpdateMediationRequest } from "../models/update-mediation-request";

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

    getMediationStatusList()
    {
        return this._httpClient.get<any>(environment.api + '/Case/GetMediationStatusList');
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

    updateMediationRequest(mediationRequest : UpdateMediationRequest, 
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
        return this._httpClient.post<any>(environment.api + '/Case/Update', formData);
    }

    getMediations(dataTableRequest : DataTableRequest) : Observable<any>
    {
        const headers = {'content-type' : 'application/json'};
        let body = JSON.stringify(dataTableRequest);
        let url = environment.api + '/Case/GetMediations';
        return this._httpClient.post<any>(url, body, {headers : headers});
    }

    adminApprove(caseId : number, approve : boolean)
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/Admin/AdminApprove?caseId=' + caseId + '&status=' + approve;
        return this._httpClient.post<any>(url, null, {headers : headers});
    }

    submitStatementOfReply(body : any, file : File | null)
    {
        const formData = new FormData();
        formData.append('stOfReply', JSON.stringify(body));
        formData.append("stOfReplyFile", file || '');
        return this._httpClient.post<any>(environment.api + '/Party/SubmitStatementOfReply', formData);

    }

    sendRegistrationInvoice(requestId : number)
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/Case/SendRegistrationFeesInvoice?requestId=' + requestId;
        return this._httpClient.post<any>(url, null, {headers : headers});
    }


    submitRegistrationPayment(body : MediationRegistrationPayment)
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/Case/SubmitRegistrationPayment';
        return this._httpClient.post<any>(url, body, {headers : headers});
    }

    approveRegistrationPayment(requestId : number, accept : boolean)
    {
        const headers = {'content-type' : 'application/json'};
        let url = environment.api + '/Case/ApproveRegistrationPayment?requestId=' + requestId + '&accept=' + accept;
        return this._httpClient.post<any>(url, null, {headers : headers});
    }


}