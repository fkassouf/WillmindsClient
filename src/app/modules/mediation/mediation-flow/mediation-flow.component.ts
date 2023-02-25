import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { Dispute } from 'app/modules/admin/models/dispute';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MediationService } from '../services/mediation.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MediationCaseStatusEnum } from 'app/modules/common/models/_enums';
import { ROLES } from 'app/core/enums/core-enum';
import { User } from 'app/core/user/user.types';
import { elementAt, finalize } from 'rxjs';
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
  mediationCaseStatusEnum = MediationCaseStatusEnum;
  roles = ROLES;
  currentUser : User;
  sendingRegistrationInvoice : boolean = false;
  approvingRegFeesPay : boolean = false;
  mediationTrack : string | null = null;
  
  constructor(private activatedRoute : ActivatedRoute, 
    private mediationService : MediationService, 
    public _authService : AuthenticationService,
    private router : Router,
    private toastrService : ToastrService){}

  ngOnInit() : void {
    this.currentUser = this._authService.user$;
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
                
                  /*this.breadCrumbItems.push(
                    { label: this.currentMediationRequest?.caseNumber, active: true, url : '/' },
                   );*/
                  
                   this.getDisputeList(this.currentMediationRequest.disputeBackground);
                  //this.getDisputeList(this.currentMediationRequest?.disputeBackground);
                  //this.addOtherPartiesForEdit(this.currentMediationRequest?.parties);
                  
                  if(this.currentMediationRequest.isFastTrack != null)
                  {
                      this.mediationTrack = this.currentMediationRequest.isFastTrack == true? 'fast' : 'normal';
                      
                  }
              }
              else
              {
                 this.router.navigate(['/']);
              }
          }
      })
  }

  adminApprove(caseId : number, approve : boolean)
  {
    let approveTxt = '<span class="text-red-500">reject</span>';
    let approvedText = 'rejected'
    if(approve)
    {
      approveTxt = '<span class="text-green-500">approve</span>';
      approvedText = 'approved'
    }
    Swal.fire({
      html: 'Are you sure you want to ' + approveTxt + ' this mediation request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#f59e0b'
      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.mediationService.adminApprove(caseId, approve).subscribe(resp=>{
          if(resp.success)
          {
            this.toastrService.success('Request ' + approvedText + ' successfully');
            this.getMediationRequest();
          }
          else
          {
            this.toastrService.error(resp.message);
          }
        })
        
      } 
    });
  }

  isSecondParty(entityId : number) : boolean
  {
      let exists : boolean = false;
      let parties : any[] = this.currentMediationRequest?.parties || [];
      let filtered = parties?.find(x=>x.entityId == entityId) || null;

      return filtered !== null;
    }

  isStOfReplySubmitted(entityId : number) : boolean
  {
    let submitted : boolean = false;
    let parties : any[] = this.currentMediationRequest?.parties || [];
    let filtered = parties?.find(x=>x.entityId == entityId) || null;
    
    return (filtered?.stOfReply === null || filtered?.stOfReply === '');
  }

  reloadRequest(event : boolean)
  {
      if(event)
      {
          this.getMediationRequest();
      }
  }

  sendRegistrationInvoice(requestId : number)
  {
      this.sendingRegistrationInvoice = true;
      this.mediationService.sendRegistrationInvoice(requestId)
      .pipe(finalize(()=>{
        this.sendingRegistrationInvoice = false;
      }))
      .subscribe(resp=>{
          if(resp.success)
          {
              this.toastrService.success('Registration fees invoice sent successfully');
              this.getMediationRequest();
          }
          else
          {
            this.toastrService.error(resp.message);
          }
      });
  }

  approveRegistrationFeesPay()
  {
      this.approvingRegFeesPay = true;
      this.mediationService.approveRegistrationPayment(this.currentMediationRequest?.id, true)
      .pipe(finalize(()=>{
        this.approvingRegFeesPay = false;
      }))
      .subscribe(resp=>{
        if(resp.success)
        {
           this.toastrService.success('Registration fees payment approved successfully');
           this.getMediationRequest();
        }
        else
        {
          this.toastrService.error(resp.message);
        }
      })
  }

  showRegistrationFeesTab() : boolean
  {
      /*return (this.currentUser?.roles[0] === this.roles.PARTY || 
        this.currentUser?.roles[0] === this.roles.SUPERADMIN || this.currentUser?.roles[0] === this.roles.ADMIN)
        || (this.currentMediationRequest?.ownerId === this.currentUser?.entityId) && 
        (this.currentMediationRequest?.registrationInvoiceSent) && 
        (this.currentMediationRequest?.statusName === this.mediationCaseStatusEnum.REGISTRATION_PENDING || this.currentMediationRequest?.statusName === this.mediationCaseStatusEnum.REGISTRATION_PAID)*/

        return ((this.currentMediationRequest?.registrationInvoiceSent) &&
        (this.currentUser?.roles[0] === this.roles.SUPERADMIN || this.currentUser?.roles[0] === this.roles.ADMIN ||
          this.currentMediationRequest?.ownerId === this.currentUser?.entityId)
        );
  }


}
