import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { Dispute } from 'app/modules/admin/models/dispute';
import { environment } from 'environments/environment';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'app-mediation-flow',
  templateUrl: './mediation-flow.component.html',
  styleUrls: ['./mediation-flow.component.scss']
})
export class MediationFlowComponent implements OnInit {
  private sub: any;
  breadCrumbItems!: Array<{}>;
  id : number;
  currentMediationRequest : any;
  title = 'Mediation Request';
  apiPath = environment.api;
  disputes : Dispute[] = [];
  disputeNames : string[] = [];

  constructor(private activatedRoute : ActivatedRoute, 
    private mediationService : MediationService, 
    public _authService : AuthenticationService,
    private router : Router){}

  ngOnInit() : void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, url : '/' },
      { label: 'Mediations', active: false, url : '/mediation/mediations' },
      
    ];
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.getMediationRequest();
    });
  }

  getDisputeList(data : any[])
  {
      this.disputeNames = [];
      this.mediationService.getDisputeList().subscribe(resp=>{
        if(resp.success)
        {
            this.disputes = resp.result;
          
          
            if(data)
               {
                  
                  this.disputes.forEach(d=>{
                    data.forEach(el=>{
                        if(d.id === el.id)
                        {
                            this.disputeNames.push(d.name);
                        }
                      });
                  });
                                    
               }
        }
      })
  }

  getMediationRequest()
  {
      this.mediationService.getMediationRequestById(this.id).subscribe(resp=>{
          if(resp.success)
          {
              if(resp.result)
              {
                  this.currentMediationRequest = resp.result;
                 
                  this.breadCrumbItems.push(
                    { label: this.currentMediationRequest?.caseNumber, active: true, url : '/' },
                   );
                  
                   this.getDisputeList(this.currentMediationRequest.disputeBackground);
                  //this.getDisputeList(this.currentMediationRequest?.disputeBackground);
                  //this.addOtherPartiesForEdit(this.currentMediationRequest?.parties);
              }
              else
              {
                 this.router.navigate(['/']);
              }
          }
      })
  }


}
