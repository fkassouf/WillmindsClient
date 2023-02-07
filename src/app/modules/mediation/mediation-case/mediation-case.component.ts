import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { Dispute } from 'app/modules/admin/models/dispute';
import { environment } from 'environments/environment';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { createMediationRequest } from '../models/create-mediation-request';
import { OtherParty } from '../models/other-party';
import { UpdateMediationRequest } from '../models/update-mediation-request';
import { MediationService } from '../services/mediation.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmSubmissionComponent } from '../confirm-submission/confirm-submission.component';

@Component({
  selector: 'app-mediation-case',
  templateUrl: './mediation-case.component.html',
  styleUrls: ['./mediation-case.component.scss']
})
export class MediationCaseComponent implements OnInit {
  private sub: any;
  id : number;
  mode : string = 'add';
  breadCrumbItems!: Array<{}>;
  title : string;
  mediationRequestForm : FormGroup;
  addedContractClause : File = null;
  addedWrittenCommunication : File = null;
  addedAgreementOnMediation : File = null;
  addedNatureOfDispute : File = null;

  otherParties : OtherParty[] = [];
  otherPartiesLimit : number = 10;
  datesToAvoid : any[] = [];
  submitted : boolean = false;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Lebanon];
  disputes : Dispute[] = [];
  filteredDisputes : Dispute[] = [];
  saving : boolean = false;

  currentMediationRequest : any;

  apiPath = environment.api;

  @ViewChild('confirmSubmission') confirmSubmission : MatCheckbox;

  /**
     * Constructor
     */
  constructor(public _authService : AuthenticationService, private activatedRoute: ActivatedRoute,
    private _formBuilder : FormBuilder, private mediationService : MediationService,  
    private toastr: ToastrService, private router : Router, private dialog: MatDialog){}

  ngOnInit() : void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, url : '/' },
      { label: 'Mediations', active: false, url : '/mediation/mediations' },
      
    ];
    this.sub = this.activatedRoute.params.subscribe(params => {

      this.mediationRequestForm = this._formBuilder.group({
        requesterSecondaryEmail : new FormControl<string>(null, [Validators.email]),
        requesterSecondaryTelephone : new FormControl<any>(null, []),
        legalRFirmName : new FormControl<string>(null, []),
        legalRLawyerName : new FormControl<string>(null, []),
        legalREmail : new FormControl<string>(null, [Validators.email]),
        legalRTelephone : new FormControl<any>(null, []),
        legalRAddress : new FormControl<string>(null, []),
        partyList : this._formBuilder.array([]),
        processStageReached : new FormControl<string>(null, []),
        hearingDates : new FormControl<string>(null, []),
        allPartyAggreedToMediate : new FormControl<boolean>(false, []),
        emailWrittenComm : new FormControl<File>(null, []),
        mediationSubmissionAgreement : new FormControl<File>(null, []),
        contractClause : new FormControl<File>(null, []),
        sendNoticeToOtherParties : new FormControl<boolean>(false, []),
        relevantInformation : new FormControl<string>(null, []),
        disputeCategory : new FormControl<any>(null, []),
        natureOfDispute : new FormControl<File>(null, []),
        disputeDetails : new FormControl<string>(null, []),
        monetaryValue : new FormControl<number>(null, []),
        requestedRelief : new FormControl<string>(null, []),
        otherInfo : new FormControl<string>(null, [])
      });
      this.id = +params['id'];
      if(this.id === -1)
      {
         this.title = 'New Mediation Request';
         this.breadCrumbItems.push(
          { label: 'Add', active: true, url : '/' },
         );
         this.otherParties.push(new OtherParty());
         this.addOtherParty();
         this.getDisputeList(null);
      }
      else
      {
        this.mode = 'edit';
        this.title = 'Edit Mediation Request';
        this.getMediationRequest();
      }
      
   });
    
      
      
      
  }

  getMediationRequest()
  {
      this.mediationService.getMediationRequestById(this.id).subscribe(resp=>{
          if(resp.success)
          {
              if(resp.result)
              {
                  this.currentMediationRequest = resp.result;
                 
                  /* this.breadCrumbItems.push(
                    { label: this.currentMediationRequest?.caseNumber, active: true, url : '/' },
                   );*/
                  
                  this.mediationRequestForm.patchValue({
                    requesterSecondaryEmail : this.currentMediationRequest?.requesterSecondaryEmail,
                    requesterSecondaryTelephone : this.currentMediationRequest?.requesterSecondaryTelephone,
                    legalRFirmName : this.currentMediationRequest?.legalRFirmName,
                    legalRLawyerName : this.currentMediationRequest?.legalRLawyerName,
                    legalREmail : this.currentMediationRequest?.legalREmail,
                    legalRTelephone : this.currentMediationRequest?.legalRTelephone,
                    legalRAddress : this.currentMediationRequest?.legalRAddress,
                    processStageReached : this.currentMediationRequest?.stageClaims,
                    hearingDates : this.currentMediationRequest?.hearingDetails,
                    allPartyAggreedToMediate : this.currentMediationRequest?.partiesAgreed,
                    sendNoticeToOtherParties : this.currentMediationRequest?.notifyParties,
                    relevantInformation : this.currentMediationRequest?.relevantInfo,
                    monetaryValue : this.currentMediationRequest?.monetaryValue,
                    disputeDetails : this.currentMediationRequest?.disputeDetails,
                    requestedRelief : this.currentMediationRequest?.requestedRelief,
                    otherInfo : this.currentMediationRequest?.otherInfo,
                    
                  });
                  this.getDisputeList(this.currentMediationRequest?.disputeBackground);
                  this.addOtherPartiesForEdit(this.currentMediationRequest?.parties);
              }
              else
              {
                 this.router.navigate(['/']);
              }
          }
      })
  }

  get f()
  {
     return this.mediationRequestForm.controls;
  }

  get partyList() {
    return this.f.partyList as FormArray;
  }

  getDisputeList(data : any[])
  {
      this.mediationService.getDisputeList().subscribe(resp=>{
        if(resp.success)
        {
            this.disputes = resp.result;
            this.filteredDisputes = resp.result;
            console.log(data);
            if(data)
               {
                  let arr : Dispute[] = [];
                  this.disputes.forEach(d=>{
                    data.forEach(el=>{
                        if(d.id === el.id)
                        {
                            arr.push(d);
                        }
                      });
                  });
                  if(arr.length == 0){
                    arr = null;
                  }
                  this.f.disputeCategory.patchValue(arr);
                  
               }
        }
      })
  }

  anyLegalRChanged(event : any)
  {
    this.clearLegalRFields(event.checked);
  }

  allPartyAggreedToMediateChanged(event : any)
  {
      this.clearAllPartyAggreedToMediateFields(event.checked);
  }


  clearLegalRFields(checked : boolean)
  {
      if(checked)
      {
         this.f.legalRLawyerName.addValidators(Validators.required);
         this.f.legalREmail.addValidators([Validators.required, Validators.email]);
         this.f.legalRTelephone.addValidators(Validators.required);
      }
      else
      {
        this.f.legalRLawyerName.clearValidators();
        this.f.legalREmail.clearValidators();
        this.f.legalRTelephone.clearValidators();

        this.f.legalRFirmName.setValue(null);
        this.f.legalRLawyerName.setValue(null);
        this.f.legalREmail.setValue(null);
        this.f.legalRTelephone.setValue(null);
        this.f.legalRAddress.setValue(null);
      }

      /**Update value and validity */
      this.f.legalRLawyerName.updateValueAndValidity();
      this.f.legalREmail.updateValueAndValidity();
      this.f.legalRTelephone.updateValueAndValidity();
  }

  clearAllPartyAggreedToMediateFields(checked : boolean)
  {
    if(checked)
    {
       this.f.contractClause.addValidators(Validators.required);
       this.f.mediationSubmissionAgreement.addValidators(Validators.required);
       this.f.emailWrittenComm.addValidators(Validators.required);
    }
    else
    {
        this.f.contractClause.clearValidators();
        this.f.mediationSubmissionAgreement.clearValidators();
        this.f.emailWrittenComm.clearValidators();

        this.f.contractClause.setValue(null);
        this.f.mediationSubmissionAgreement.setValue(null);
        this.f.emailWrittenComm.setValue(null);
    }

    /**Update value and validity */
    this.f.contractClause.updateValueAndValidity();
    this.f.mediationSubmissionAgreement.updateValueAndValidity();
    this.f.emailWrittenComm.updateValueAndValidity();
  }

  /**Add parties for Edit */
  addOtherPartiesForEdit(parties : OtherParty[])
  {
    parties.forEach(party=>{
      const partyForm = this._formBuilder.group({
        entityName : new FormControl<string>(party.entityName, []),
        fullName: new FormControl<string>(party.fullName, [Validators.required]),
        email : new FormControl<string>(party.email, [Validators.required, Validators.email]),
        phone: new FormControl<string>(party.telephone, [Validators.required]),
        address: new FormControl<string>(party.address, []),
        firmName : new FormControl<string>(party.lawyerFirmName, []),
        lawyerName : new FormControl<string>(party.lawyerName, []),
        lawyerPhone : new FormControl<string>(party.lawyerTelephone, []),
        lawyerEmail : new FormControl<string>(party.lawyerEmail, []),
        lawyerAddress : new FormControl<string>(party.lawyerAddress, []),
      });
      this.partyList.push(partyForm);
    });
    
  }
  

  /**Add more parties */
  addOtherParty()
  {
    const partyForm = this._formBuilder.group({
      entityName : new FormControl<string>(null, []),
      fullName: new FormControl<string>(null, [Validators.required]),
      email : new FormControl<string>(null, [Validators.required, Validators.email]),
      phone: new FormControl<string>(null, [Validators.required]),
      address: new FormControl<string>(null, [Validators.required]),
      firmName : new FormControl<string>(null, []),
      lawyerName : new FormControl<string>(null, []),
      lawyerPhone : new FormControl<string>(null, []),
      lawyerEmail : new FormControl<string>(null, [Validators.email]),
      lawyerAddress : new FormControl<string>(null, []),
    });
    this.partyList.push(partyForm);
  }

  /**remove other party */
  removeOtherParty(index : any)
  {
    this.partyList.removeAt(index);
  }

  /*add Date to avoid*/
  addDateToAvoid()
  {
     this.datesToAvoid.push('');
  }

  saveForm()
  {
     this.mediationRequestForm.disable();
     this.saving = true;
     if(this.mode == 'add')
     {
     let body : createMediationRequest = new createMediationRequest();
     body.requesterSecondaryEmail = this.f.requesterSecondaryEmail.value;
     body.requesterSecondaryTelephone = this.f.requesterSecondaryTelephone.value?.e164Number;
     body.legalRFirmName = this.f.legalRFirmName.value;
     body.legalRLawyerName = this.f.legalRLawyerName.value;
     body.legalREmail = this.f.legalREmail.value;
     body.legalRTelephone = this.f.legalRTelephone.value?.e164Number;
     body.legalRAddress = this.f.legalRAddress.value;
     body.stageClaims = this.f.processStageReached.value;
     body.hearingDetails = this.f.hearingDates.value;
     body.partiesAgreed = this.f.allPartyAggreedToMediate.value;
     /*If all parties aggreed then attach files*/
     let contractClauseFile = this.f.contractClause.value;
     let mediationSubmissionAgreementFile = this.f.mediationSubmissionAgreement.value;
     let emailWrittenCommFile = this.f.emailWrittenComm.value;

     body.notifyParties = this.f.sendNoticeToOtherParties.value;
     body.relevantInfo = this.f.relevantInformation.value;

     let disputesCatNumbers : number[] = [];
     let disputeCategories : Dispute[] = this.f.disputeCategory.value;
     disputeCategories?.forEach(f=>{
        disputesCatNumbers.push(f.id);
     });
     body.disputeList = disputesCatNumbers;
     body.monetaryValue = this.f.monetaryValue.value;
     body.disputeDetails = this.f.disputeDetails.value;
     
     /*Nature of disputes file*/
     let natureOfDisputeFile = this.f.natureOfDispute.value;

     body.requestedRelief = this.f.requestedRelief.value;
     body.otherInfo = this.f.otherInfo.value;
    
     let otherPartiesValid : boolean = true;

     this.partyList.controls.forEach((f:FormGroup)=>{

          /**Prevent the user to save the form without adding at least one other party email */
          if(!f.controls.email.value)
          {
            this.toastr.error('Other parties missing emails');
            this.mediationRequestForm.enable();
            f.controls.email.markAsTouched();
            f.controls.email.updateValueAndValidity();
            this.saving = false;
            otherPartiesValid = false;
            return;
          }
          
          let party : OtherParty = new OtherParty();
          party.entityName = f.controls.entityName.value;
          party.email = f.controls.email.value;
          party.telephone = f.controls.phone.value?.e164Number;
          party.address = f.controls.address.value;
          party.fullName = f.controls.fullName.value;
          party.lawyerName = f.controls.lawyerName.value;
          party.lawyerAddress = f.controls.lawyerAddress.value;
          party.lawyerTelephone = f.controls.lawyerPhone.value?.e164Number;
          party.lawyerEmail = f.controls.lawyerEmail.value;
          body.partyList.push(party);
     });
      
     
        if(otherPartiesValid)
        {
            this.mediationService.createMediationRequest(body, natureOfDisputeFile?.files[0], 
              emailWrittenCommFile?.files[0], 
              contractClauseFile?.files[0], mediationSubmissionAgreementFile?.files[0])
              .pipe(finalize(()=>{
                this.mediationRequestForm.enable();
                this.saving = false;
              }))
              .subscribe(resp=>{
            if(resp.success)
            {
              this.toastr.success('Mediation request created successfully');
              this.router.navigate(['/mediation/mediations']);
            }
            else
            {
              this.toastr.error(resp.message);
            }
        });
      }
    }
    else if(this.mode == 'edit')
    {
      let body : UpdateMediationRequest = new UpdateMediationRequest();
      body.id = this.currentMediationRequest.id;
      body.ownerId = this.currentMediationRequest.ownerId;
      body.requesterSecondaryEmail = this.f.requesterSecondaryEmail.value;
      body.requesterSecondaryTelephone = this.f.requesterSecondaryTelephone.value?.e164Number;
      body.legalRFirmName = this.f.legalRFirmName.value;
      body.legalRLawyerName = this.f.legalRLawyerName.value;
      body.legalREmail = this.f.legalREmail.value;
      body.legalRTelephone = this.f.legalRTelephone.value?.e164Number;
      body.legalRAddress = this.f.legalRAddress.value;
      body.stageClaims = this.f.processStageReached.value;
      body.hearingDetails = this.f.hearingDates.value;
      body.partiesAgreed = this.f.allPartyAggreedToMediate.value;
      /*If all parties aggreed then attach files*/
      let contractClauseFile = this.f.contractClause.value;
      let mediationSubmissionAgreementFile = this.f.mediationSubmissionAgreement.value;
      let emailWrittenCommFile = this.f.emailWrittenComm.value;
 
      body.notifyParties = this.f.sendNoticeToOtherParties.value;
      body.relevantInfo = this.f.relevantInformation.value;
 
      let disputesCatNumbers : number[] = [];
      let disputeCategories : Dispute[] = this.f.disputeCategory.value;
      disputeCategories?.forEach(f=>{
         disputesCatNumbers.push(f.id);
      });
      body.disputeList = disputesCatNumbers;
      body.monetaryValue = this.f.monetaryValue.value;
      body.disputeDetails = this.f.disputeDetails.value;
      
      /*Nature of disputes file*/
      let natureOfDisputeFile = this.f.natureOfDispute.value;
 
      body.requestedRelief = this.f.requestedRelief.value;
      body.otherInfo = this.f.otherInfo.value;
 
      let otherPartiesValid : boolean = true;
      this.partyList.controls.forEach((f:FormGroup)=>{
        /**Prevent the user to save the form without adding at least one other party email */
        if(!f.controls.email.value)
        {
          this.toastr.error('Other parties missing emails');
          this.mediationRequestForm.enable();
          f.controls.email.markAsTouched();
          f.controls.email.updateValueAndValidity();
          this.saving = false;
          otherPartiesValid = false;
          return;
        }
           let party : OtherParty = new OtherParty();
           party.entityName = f.controls.entityName.value;
           party.email = f.controls.email.value;
           party.telephone = f.controls.phone.value?.e164Number;
           party.address = f.controls.address.value;
           party.fullName = f.controls.fullName.value;
           party.lawyerName = f.controls.lawyerName.value;
           party.lawyerAddress = f.controls.lawyerAddress.value;
           party.lawyerTelephone = f.controls.lawyerPhone.value?.e164Number;
           party.lawyerEmail = f.controls.lawyerEmail.value;
           body.partyList.push(party);
      });

      if(otherPartiesValid)
      {
        this.mediationService.updateMediationRequest(body, natureOfDisputeFile?.files[0], 
          emailWrittenCommFile?.files[0], 
          contractClauseFile?.files[0], mediationSubmissionAgreementFile?.files[0])
          .pipe(finalize(()=>{
            this.mediationRequestForm.enable();
            this.saving = false;
          }))
          .subscribe(resp=>{
          if(resp.success)
          {
            this.toastr.success('Mediation request updated successfully');
            this.router.navigate(['/mediation/mediations']);
          }
          else
          {
            this.toastr.error(resp.message);
          }
        });
      }
    }

  }

  cancel()
  {
    this.router.navigate(['/mediation/mediations']);
  }

  submitForm()
  {
    
    this.submitted = true;
    this.mediationRequestForm.markAllAsTouched();
     if(this.mediationRequestForm.invalid)
     {
      this.toastr.error('Some fields are invalid');
       return;
     }


     /*body*/
     let body : UpdateMediationRequest = new UpdateMediationRequest();
     body.id = this.currentMediationRequest.id;
     body.ownerId = this.currentMediationRequest.ownerId;
     body.requesterSecondaryEmail = this.f.requesterSecondaryEmail.value;
     body.requesterSecondaryTelephone = this.f.requesterSecondaryTelephone.value?.e164Number;
     body.legalRFirmName = this.f.legalRFirmName.value;
     body.legalRLawyerName = this.f.legalRLawyerName.value;
     body.legalREmail = this.f.legalREmail.value;
     body.legalRTelephone = this.f.legalRTelephone.value?.e164Number;
     body.legalRAddress = this.f.legalRAddress.value;
     body.stageClaims = this.f.processStageReached.value;
     body.hearingDetails = this.f.hearingDates.value;
     body.partiesAgreed = this.f.allPartyAggreedToMediate.value;
     /*If all parties aggreed then attach files*/
     let contractClauseFile = this.f.contractClause.value;
     let mediationSubmissionAgreementFile = this.f.mediationSubmissionAgreement.value;
     let emailWrittenCommFile = this.f.emailWrittenComm.value;

     body.notifyParties = this.f.sendNoticeToOtherParties.value;
     body.relevantInfo = this.f.relevantInformation.value;

     let disputesCatNumbers : number[] = [];
     let disputeCategories : Dispute[] = this.f.disputeCategory.value;
     disputeCategories?.forEach(f=>{
        disputesCatNumbers.push(f.id);
     });
     body.disputeList = disputesCatNumbers;
     body.monetaryValue = this.f.monetaryValue.value;
     body.disputeDetails = this.f.disputeDetails.value;
     
     /*Nature of disputes file*/
     let natureOfDisputeFile = this.f.natureOfDispute.value;

     body.requestedRelief = this.f.requestedRelief.value;
     body.otherInfo = this.f.otherInfo.value;
     body.isSubmitted = true;

     let otherPartiesValid : boolean = true;
     this.partyList.controls.forEach((f:FormGroup)=>{
       /**Prevent the user to save the form without adding at least one other party email */
       if(!f.controls.email.value)
       {
         this.toastr.error('Other parties missing emails');
         this.mediationRequestForm.enable();
         f.controls.email.markAsTouched();
         f.controls.email.updateValueAndValidity();
         this.saving = false;
         otherPartiesValid = false;
         return;
       }
          let party : OtherParty = new OtherParty();
          party.entityName = f.controls.entityName.value;
          party.email = f.controls.email.value;
          party.telephone = f.controls.phone.value?.e164Number;
          party.address = f.controls.address.value;
          party.fullName = f.controls.fullName.value;
          party.lawyerName = f.controls.lawyerName.value;
          party.lawyerAddress = f.controls.lawyerAddress.value;
          party.lawyerTelephone = f.controls.lawyerPhone.value?.e164Number;
          party.lawyerEmail = f.controls.lawyerEmail.value;
          body.partyList.push(party);
     });

     if(otherPartiesValid)
     {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        body : body,
        natureOfDisputeFile : natureOfDisputeFile?.files[0],
        emailWrittenCommFile : emailWrittenCommFile?.files[0],
        contractClauseFile : contractClauseFile?.files[0],
        mediationSubmissionAgreementFile : mediationSubmissionAgreementFile?.files[0],
        success : false
      };

      const dialogR = this.dialog.open(ConfirmSubmissionComponent, dialogConfig);
       
       dialogR.afterClosed().subscribe(data => {
          if(data == 'success')
          {
              this.toastr.success('Mediation Request submitted successfully');
              this.router.navigate(['/mediation/mediations']);
          }
          else
          {
            if(data != null)
              this.toastr.error(data);
          }
       }
      );
     }
     
  }

}
