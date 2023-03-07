import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { PAYMENTMETHODS } from 'app/core/enums/core-enum';
import { MediationCaseStatusEnum } from 'app/modules/common/models/_enums';
import { SharedService } from 'app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AdminFeesPayment } from '../models/admin-fees-payment';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'app-administrative-fees',
  templateUrl: './administrative-fees.component.html',
  styleUrls: ['./administrative-fees.component.scss']
})
export class AdministrativeFeesComponent {
  @Input() request : any = null;
  @Output() reloadRequestEvent = new EventEmitter<boolean>();
  adminFeesForm : FormGroup;
  submitted : boolean = false;
  submitting : boolean = false;
  mediationCaseStatusEnum = MediationCaseStatusEnum;
  paymentMethodsEnum = PAYMENTMETHODS;
  currencies : any[] = [];
  paymentMethods : any[] = [];

  constructor(private sharedService : SharedService, private formBuilder : FormBuilder,
    private authService : AuthenticationService, private mediationService : MediationService,
    private toastrService : ToastrService){}

  ngOnInit()
  {
    this.adminFeesForm = this.formBuilder.group({
      paymentMethod : new FormControl<any>(null, [Validators.required]),
      bankName : new FormControl<string>(null, []),
      nameOfAccountHolder : new FormControl<string>(null, []),
      accountNumber : new FormControl<string>(null, []),
      paymentDate : new FormControl<Date>(null, []),
      paymentAmount : new FormControl<number>(null, []),
      paymentCurrency : new FormControl<any>(null, []),
    });

    
   
  

    this.getCurrencyList();
    this.getPaymentMethods();
  }

  getCurrencyList()
  {
      this.sharedService.getCurrwencyList().subscribe(resp=>{
         if(resp.success)
         {
            this.currencies = resp.result;
            //let currentCurrency =  this.currencies.find(x=>x.code == this.request?.currencyCode);
            
            //this.f.paymentCurrency.setValue(currentCurrency);
            
         }
      })
  }

  getPaymentMethods()
  {
      this.sharedService.getPaymentMethods().subscribe(resp=>{
         if(resp.success)
         {
            this.paymentMethods = resp.result;
            //let currentPaymentMode =  this.paymentMethods.find(x=>x.id == this.request?.regPaymentMode);
        
            //this.f.paymentMethod.setValue(currentPaymentMode);
         }
      })
  }

  get f(){

    return this.adminFeesForm.controls;
  }

  selectPaymentMethod(event : any)
  {
    this.submitted = false;
    this.adminFeesForm.markAsPristine();
    this.adminFeesForm.markAsUntouched();
    let paymentMethod = event.value;
    if(paymentMethod.type === this.paymentMethodsEnum.BANK)
    {
        //this.paymentForm.reset();
        this.f.bankName.setValidators(Validators.required);
        this.f.accountNumber.setValidators(Validators.required);
        this.f.nameOfAccountHolder.setValidators(Validators.required);
        this.f.paymentDate.setValidators(Validators.required);
        this.f.paymentAmount.setValidators(Validators.required);
        this.f.paymentCurrency.setValidators(Validators.required);

        
    }
    else
    {
        /*this.paymentForm.patchValue({
            bankName : null,
            accountNumber : null,
            nameOfAccountHolder : null,
            transferDate : null,
            paymentAmount : null,
            paymentCurrency : null
        });*/
        this.f.bankName.clearValidators();
        this.f.accountNumber.clearValidators();
        this.f.nameOfAccountHolder.clearValidators();
        this.f.paymentDate.clearValidators();
        this.f.paymentAmount.clearValidators();
        this.f.paymentCurrency.clearValidators();
    }

    this.f.bankName.updateValueAndValidity();
    this.f.accountNumber.updateValueAndValidity();
    this.f.nameOfAccountHolder.updateValueAndValidity();
    this.f.paymentDate.updateValueAndValidity();
    this.f.paymentAmount.updateValueAndValidity();
    this.f.paymentCurrency.updateValueAndValidity();
  }

  convertToUTC(date : Date) {
    let diff = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - diff);  
    return date;
  }

  submit(){
    this.submitted = true;
     
     if(this.adminFeesForm.invalid)
     {
        return;
     }

     this.submitting = true;
     this.adminFeesForm.disable();
     let body : AdminFeesPayment = new AdminFeesPayment();
     body.paymentModeId = this.f.paymentMethod.value.id;
     body.requestId = this.request?.id;
     body.entityId = this.authService.user$?.entityId;
     if(this.f.paymentMethod.value.type === this.paymentMethodsEnum.BANK)
     {
       let d = new Date(this.f.paymentDate.value);
      
    
        body.amount = this.f.paymentAmount.value;
        body.bankAccountNb = this.f.accountNumber.value;
        body.bankName = this.f.bankName.value;
        body.currency = this.f.paymentCurrency.value.code;
        body.paymentDate = this.convertToUTC(d);
        body.transferee = this.f.nameOfAccountHolder.value;
     }

     this.mediationService.submitAdminFeesPayment(body)
     .pipe(finalize(()=>{
        this.submitting = false;
        this.adminFeesForm.enable();
     }))
     .subscribe(resp=>{
        if(resp.success)
        {
            this.toastrService.success('Admin Fees Payment submitted successfully');
            this.reloadRequest(true);
        }
        else
        {
          this.toastrService.error(resp.message);
        }
     });

  }

  reloadRequest(value: boolean) {
    this.reloadRequestEvent.emit(value);
  }
}
