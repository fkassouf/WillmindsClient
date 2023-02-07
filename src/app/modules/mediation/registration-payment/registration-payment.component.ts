import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PAYMENTMETHODS } from 'app/core/enums/core-enum';

@Component({
  selector: 'mediation-registration-payment',
  templateUrl: './registration-payment.component.html',
  styleUrls: ['./registration-payment.component.scss']
})
export class RegistrationPaymentComponent {
  paymentForm : FormGroup;
  paymentMethodsEnum = PAYMENTMETHODS;
  submitted : boolean = false;
  submitting : boolean = false;
  paymentMethods : any[] = [
    {id : 1, type : 'Cash'},
    {id : 2, type : 'Bank'}
  ];

  constructor(private formBuilder : FormBuilder){}

  ngOnInit()
  {
    this.paymentForm = this.formBuilder.group({
      paymentMethod : new FormControl<any>(null, [Validators.required]),
      bankName : new FormControl<string>(null, []),
      nameOfAccountHolder : new FormControl<string>(null, []),
      accountNumber : new FormControl<string>(null, []),
      paymentDate : new FormControl<Date>(null, []),
      paymentAmmount : new FormControl<number>(null, []),
      paymentCurrency : new FormControl<string>(null, []),
    });
  }

  get f(){

    return this.paymentForm.controls;
  }


  submit()
  {
     this.submitted = true;
     if(this.paymentForm.invalid)
     {}
  }
}
