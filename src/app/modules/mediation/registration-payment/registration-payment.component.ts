import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PAYMENTMETHODS } from 'app/core/enums/core-enum';
import { MediationCaseStatusEnum } from 'app/modules/common/models/_enums';
import { SharedService } from 'app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { MediationRegistrationPayment } from '../models/mediation-registration-payment';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'mediation-registration-payment',
  templateUrl: './registration-payment.component.html',
  styleUrls: ['./registration-payment.component.scss']
})
export class RegistrationPaymentComponent {
  @Input() request : any = null;
  @Output() reloadRequestEvent = new EventEmitter<boolean>();

  paymentForm : FormGroup;
  paymentMethodsEnum = PAYMENTMETHODS;
  mediationCaseStatusEnum = MediationCaseStatusEnum;
  submitted : boolean = false;
  submitting : boolean = false;
  currencies : any[] = [];
  paymentMethods : any[] = [];

  constructor(private formBuilder : FormBuilder, 
    private sharedService : SharedService, 
    private mediationService : MediationService,
    private toastrService : ToastrService){}

  ngOnInit()
  {
    this.paymentForm = this.formBuilder.group({
      paymentMethod : new FormControl<any>(null, [Validators.required]),
      bankName : new FormControl<string>(this.request?.regBankName, []),
      nameOfAccountHolder : new FormControl<string>(this.request?.regTransferee, []),
      accountNumber : new FormControl<string>(this.request?.regBankAccountNb, []),
      transferDate : new FormControl<Date>(this.request?.regTransferDate, []),
      paymentAmount : new FormControl<number>(this.request?.regPaymentAmount, []),
      paymentCurrency : new FormControl<any>(null, []),
    });

    
   
  

    this.getCurrencyList();
    this.getPaymentMethods();
  }

  ngOnChanges(changes: SimpleChanges) {
    let previousRequest = changes.request.previousValue;
    let currentRequest = changes.request.currentValue;
  
    let currentPaymentMode =  this.paymentMethods.find(x=>x.id == currentRequest.regPaymentMode);
    let currentCurrency =  this.currencies.find(x=>x.code == currentRequest?.currencyCode);
    this.paymentForm?.patchValue({
      paymentMethod : currentPaymentMode,
      bankName : currentRequest?.regBankName,
      nameOfAccountHolder : currentRequest?.regTransferee,
      accountNumber : currentRequest?.regBankAccountNb,
      transferDate : currentRequest?.regTransferDate,
      paymentAmount : currentRequest?.regPaymentAmount,
      paymentCurrency : currentCurrency
    });
    this.paymentForm?.markAsPristine();
    this.paymentForm?.markAsUntouched();
    this.submitted = false;
    /*if(currentRequest?.statusName === this.mediationCaseStatusEnum.REGISTRATION_PAID)
    {
      this.paymentForm?.disable();
    }*/
  }

  getCurrencyList()
  {
      this.sharedService.getCurrwencyList().subscribe(resp=>{
         if(resp.success)
         {
            this.currencies = resp.result;
            let currentCurrency =  this.currencies.find(x=>x.code == this.request?.currencyCode);
            
            this.f.paymentCurrency.setValue(currentCurrency);
            
         }
      })
  }

  getPaymentMethods()
  {
      this.sharedService.getPaymentMethods().subscribe(resp=>{
         if(resp.success)
         {
            this.paymentMethods = resp.result;
            let currentPaymentMode =  this.paymentMethods.find(x=>x.id == this.request?.regPaymentMode);
        
            this.f.paymentMethod.setValue(currentPaymentMode);
         }
      })
  }

  get f(){

    return this.paymentForm.controls;
  }

  selectPaymentMethod(event : any)
  {
    this.submitted = false;
    this.paymentForm.markAsPristine();
    this.paymentForm.markAsUntouched();
    let paymentMethod = event.value;
    if(paymentMethod.type === this.paymentMethodsEnum.BANK)
    {
        //this.paymentForm.reset();
        this.f.bankName.setValidators(Validators.required);
        this.f.accountNumber.setValidators(Validators.required);
        this.f.nameOfAccountHolder.setValidators(Validators.required);
        this.f.transferDate.setValidators(Validators.required);
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
        this.f.transferDate.clearValidators();
        this.f.paymentAmount.clearValidators();
        this.f.paymentCurrency.clearValidators();
    }

    this.f.bankName.updateValueAndValidity();
    this.f.accountNumber.updateValueAndValidity();
    this.f.nameOfAccountHolder.updateValueAndValidity();
    this.f.transferDate.updateValueAndValidity();
    this.f.paymentAmount.updateValueAndValidity();
    this.f.paymentCurrency.updateValueAndValidity();
  }

  convertToUTC(date : Date) {
    let diff = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - diff);  
    return date;
  }


  submit()
  {
     this.submitted = true;
     
     if(this.paymentForm.invalid)
     {
        return;
     }

     this.submitting = true;
     this.paymentForm.disable();
     let body : MediationRegistrationPayment = new MediationRegistrationPayment();
    
     body.paymentModeId = this.f.paymentMethod.value.id;
     body.requestId = this.request?.id;
     if(this.f.paymentMethod.value.type === this.paymentMethodsEnum.BANK)
     {
       let d = new Date(this.f.transferDate.value);
      
    
        body.amount = this.f.paymentAmount.value;
        body.bankAccountNb = this.f.accountNumber.value;
        body.bankName = this.f.bankName.value;
        body.currency = this.f.paymentCurrency.value.code;
        body.transferDate = this.convertToUTC(d);
        body.transferee = this.f.nameOfAccountHolder.value;
     }
     
     this.mediationService.submitRegistrationPayment(body)
     .pipe(finalize(()=>{
        this.submitting = false;
        this.paymentForm.enable();
     }))
     .subscribe(resp=>{
        if(resp.success)
        {
            this.toastrService.success('Payment submitted successfully');
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
