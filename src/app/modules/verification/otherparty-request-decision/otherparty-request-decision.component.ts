import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { VerificationService } from '../services/mediation.service';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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
            if(decision)
            {
              Swal.fire({
                icon: 'success',
                title : 'You accepted this mediation request',
                text: 'Sign-in using your credentials to proceed',
                confirmButtonColor: "#f59e0b"
              });
                this.router.navigate(['/mediation/mediation-flow', resp.result]);
            }
            else
            {
              Swal.fire({
                icon: 'error',
                title : 'You rejected this mediation request',
                text: 'You will be out of this case',
                confirmButtonColor: "#f59e0b"
              });
                this.router.navigate(['/']);
            }
           
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
