import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ROLES } from 'app/core/enums/core-enum';
import { Country } from 'app/modules/auth/models';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { AdminService } from '../admin.service';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent
{
    @ViewChild('updateProfileNgForm') updateProfileNgForm: NgForm;

    updateProfileForm: FormGroup;
    countries : Country[] = [];
    filteredCountries : Country[] = [];
    filter : string = '';
    submitted : boolean = false;

    separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Lebanon];
    roles = ROLES;
    /**
     * Constructor
     */
    constructor(public authService : AuthenticationService, private adminService : AdminService,
        private _formBuilder: FormBuilder, private _router : Router)
    {
         // Create the form
         this.updateProfileForm = this._formBuilder.group({
            fullName : ['', Validators.required],
            nationality : [null, [Validators.required]],
            profession : [null, [Validators.required]],
            dob : [null, [Validators.required]],
            phone : [null, [Validators.required]],
            address : [null, [Validators.required]]
        }
      );

      this.getCountries();
    }

    getEntityAccount(id : any)
    {
        
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
        this.authService.getCountries().subscribe(resp=>{
            if(resp?.success)
            {
                this.countries = resp?.result;
                this.filteredCountries = resp?.result;
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

    backToLanding()
    {
        this._router.navigate(['/']);
    }

    /*submit form*/
    submitProfile()
    {
        this.submitted = true;
        if(this.updateProfileForm.invalid)
        {
            return;
        }
    }
}
