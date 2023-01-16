import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
export class ProfileComponent implements OnInit
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
    currentAccount : any;
    /**
     * Constructor
     */
    constructor(public authService : AuthenticationService, private adminService : AdminService,
        private _formBuilder: FormBuilder, private _router : Router)
    {
           
    }

    ngOnInit(): void {
        this.updateProfileForm = this._formBuilder.group({
            fullName : [null, Validators.required],
            nationality : [null, [Validators.required]],
            profession : [null, [Validators.required]],
            dob : [null, [Validators.required]],
            phone : [null, [Validators.required]],
            address : [null, [Validators.required]]
            }
        );
        
         // Create the form
        this.authService.user$.roles[0] === ROLES.USER
        {
            this.getEntityAccount( this.authService.user$.id)
        }
    }

    getEntityAccount(id : any)
    {
        this.adminService.getEntityById(this.authService.user$.id)
        .subscribe(resp=>{
            if(resp.success)
            {
                this.currentAccount = resp.result;
                this.updateProfileForm.controls.fullName.setValue(this.currentAccount.fullName);
                this.getCountries(this.currentAccount.nationalityId);
                this.updateProfileForm.controls.profession.setValue(this.currentAccount.profession);
                this.updateProfileForm.controls.dob.setValue(this.currentAccount.dob);
                this.updateProfileForm.controls.phone.setValue(this.currentAccount.telephone);
                this.updateProfileForm.controls.address.setValue(this.currentAccount.address);
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

    getCountries(id)
    {
        this.authService.getCountries().subscribe(resp=>{
            if(resp?.success)
            {
                this.countries = resp?.result;
                this.filteredCountries = resp?.result;
                this.updateProfileForm.controls.nationality.setValue(id);
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
