import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

import { Account, Country } from '../models';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    submitted : boolean = false;
    showAlert: boolean = false;
    countries : Country[] = [];
    filteredCountries : Country[] = [];

    countries2 : Country[] = [];
    filteredCountries2 : Country[] = [];
    filter : string = '';

    separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Lebanon];

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                entityName : ['', []],
                fullName : ['', Validators.required],
                email : ['', [Validators.required, Validators.email]],
                nationality : [null, [Validators.required]],
                profession : [null, [Validators.required]],
                dob : [null, [Validators.required]],
                phone : [null, [Validators.required]],
                country : [null, [Validators.required]],
                address : [null, [Validators.required]]
               

            }
        );
        
        this.getCountries();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        this.submitted = true;
        
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;
        let dob = new Date(this.signUpForm.get('dob').value._d).toUTCString();
        /**Convert to UTC date */
        var utcDate = this.removeTime(new Date(dob));
        let nationalityName = this.signUpForm.get('nationality').value;
        let nationality = this.countries.filter(x=>x.name.toUpperCase() === nationalityName.toUpperCase())[0];
        let countryName = this.signUpForm.get('country').value;
        let country = this.countries.filter(x=>x.name.toUpperCase() === countryName.toUpperCase())[0];
        let body : Account = {
            email : this.signUpForm.get('email').value,
            entityName : this.signUpForm.get('entityName').value,
            fullName : this.signUpForm.get('fullName').value,
            nationalityId : nationality?.id,
            profession : this.signUpForm.get('profession').value,
            dob : utcDate,
            telephone : this.signUpForm.get('phone').value.e164Number,
            countryId : country?.id,
            address : this.signUpForm.get('address').value
        };

       
        // Sign up
        this._authService.signUpAsAccount(body).subscribe(resp=>{
            if(resp.success)
            {
                this.signUpForm.enable();

                // Reset the form
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type   : 'success',
                    message: 'Account created successfully, a password has been sent to your inbox'
                };

                // Show the alert
                this.showAlert = true;
            }
            else
            {
                this.signUpForm.enable();

                // Reset the form
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type   : 'error',
                    message: resp.message
                };

                // Show the alert
                this.showAlert = true;
            }
        });
                
    }

    removeTime(date : Date) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }

    getCountries()
    {
        this._authService.getCountries().subscribe(resp=>{
            if(resp?.success)
            {
                this.countries = resp?.result;
                this.filteredCountries = resp?.result;
                this.countries2 = resp?.result;
                this.filteredCountries2 = resp?.result;
            }
        });
    }

    filterMyCountries(event : any)
    {
        this.filter += event.key;
        this.filteredCountries = this.countries.filter(c => c.name.indexOf(this.filter.toUpperCase()) != -1);

    }

    clearCountriesFilter()
    {
        this.filter = '';
        this.filteredCountries = this.countries;
    }

    backToSignin()
    {
        this._router.navigate(['/sign-in']);
    }
}
