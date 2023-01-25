import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { Dispute } from 'app/modules/admin/models/dispute';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { createMediationRequest } from '../models/create-mediation-request';
import { OtherParty } from '../models/other-party';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'app-mediation-case',
  templateUrl: './mediation-case.component.html',
  styleUrls: ['./mediation-case.component.scss']
})
export class MediationCaseComponent implements OnInit {
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

  /**
     * Constructor
     */
  constructor(public _authService : AuthenticationService, 
    private _formBuilder : FormBuilder, private mediationService : MediationService,  private toastr: ToastrService){}

  ngOnInit() : void {
    this.breadCrumbItems = [
         { label: 'Home', active: true, url : '/' }
      ];
      
      this.title = 'New Mediation Request';
      this.otherParties.push(new OtherParty());
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
      this.addOtherParty();
      this.getDisputeList();
  }

  get f()
  {
     return this.mediationRequestForm.controls;
  }

  get partyList() {
    return this.f.partyList as FormArray;
  }

  getDisputeList()
  {
      this.mediationService.getDisputeList().subscribe(resp=>{
        if(resp.success)
        {
            this.disputes = resp.result;
            this.filteredDisputes = resp.result;
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
     let body : createMediationRequest = new createMediationRequest();
     body.requesterSecondaryEmail = this.f.requesterSecondaryEmail.value;
     body.requesterSecondaryEmail = this.f.requesterSecondaryEmail.value;
     body.legalRFirmName = this.f.legalRFirmName.value;
     body.legalRLawyerName = this.f.legalRLawyerName.value;
     body.legalREmail = this.f.legalREmail.value;
     body.legalRTelephone = this.f.legalRTelephone.value;
     body.legalRAddress = this.f.legalRAddress.value;
     body.stageClaims = this.f.processStageReached.value;

     
     this.partyList.controls.forEach((f:FormGroup)=>{
          let party : OtherParty = new OtherParty();
          party.entityName = f.controls.entityName.value;
          party.email = f.controls.email.value;
          party.telephone = f.controls.phone.value;
          party.address = f.controls.address.value;
          party.fullName = f.controls.email.value;
          party.lawyerName = f.controls.lawyerName.value;
          party.lawyerAddress = f.controls.lawyerAddress.value;
          party.lawyerTelephone = f.controls.lawyerPhone.value;
          party.lawyerEmail = f.controls.lawyerEmail.value;
          body.partyList.push(party);
     });

        this.mediationService.createMediationRequest(body, null, null, null, null).subscribe(resp=>{
        if(resp.success)
        {
          this.toastr.success('Mediation request created successfully');
        }
     })

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
  }

}
