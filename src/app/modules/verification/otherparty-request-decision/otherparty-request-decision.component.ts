import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { VerificationService } from '../services/mediation.service';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
  selector: 'app-otherparty-request-decision',
  templateUrl: './otherparty-request-decision.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class OtherpartyRequestDecisionComponent implements OnInit, OnDestroy {
  token : string = '';
  accepting : boolean = false;
  rejecting : boolean = false;
  showAlert : boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
};
  private sub: any;
  constructor(private verificationService : VerificationService,
     private router : Router, private activatedRoute : ActivatedRoute){}

  ngOnInit() : void {
    
    this.sub = this.activatedRoute.params.subscribe(params => {
        this.token = params['token'];
        if(!this.token)
        {
           this.router.navigate(['/auth/sign-in']);
        }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  accept(decision : boolean)
  {
    this.showAlert = false;
    
    if(!decision)
    {
      this.rejecting = true;
      this.rejecting = false;
    }
    else
    {
      this.rejecting = false;
      this.accepting = true;
    }
     this.verificationService.mediationRequestAccept(this.token, decision)
     .pipe(finalize(()=>{
      this.rejecting = false;
      this.accepting = false;
     }))
     .subscribe(resp=>{
        if(resp.success)
        {
           
           this.router.navigate(['/mediation/mediation-flow', resp.result]);
        }
        else
        {
          this.alert = {
            type   : 'error',
            message: resp.message
          };
          this.showAlert = true;
        }
     })
  }
}
