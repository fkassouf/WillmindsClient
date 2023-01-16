import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ROLES } from 'app/core/enums/core-enum';
import { Country } from 'app/modules/auth/models';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit
{
    @ViewChild('updateEntityProfileNgForm') updateEntityProfileNgForm: NgForm;

    updateEntityProfileForm: FormGroup;
    countries : Country[] = [];
    filteredCountries : Country[] = [];
    filter : string = '';
    submitted : boolean = false;
    updating : boolean = false;

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
        private _formBuilder: FormBuilder, private _router : Router,
         private _translocoService : TranslocoService, private toastr : ToastrService)
    {
           
    }

    ngOnInit(): void {
        this.updateEntityProfileForm = this._formBuilder.group({
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
                
                this.updateEntityProfileForm.controls.fullName.setValue(this.currentAccount.fullName);
                this.getCountries(this.currentAccount.nationalityId);
                this.updateEntityProfileForm.controls.profession.setValue(this.currentAccount.profession);
                this.updateEntityProfileForm.controls.dob.setValue(this.currentAccount.dob);
                this.updateEntityProfileForm.controls.phone.setValue(this.currentAccount.telephone);
                this.updateEntityProfileForm.controls.address.setValue(this.currentAccount.address);
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
                let country = this.countries.filter(x=>x.id == id)[0];
                this.updateEntityProfileForm.controls.nationality.setValue(country);
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

    get entityF()
    {
        return this.updateEntityProfileForm.controls;
    }

    /*submit form*/
    submitEntityProfile()
    {
        this.submitted = true;
        if(this.updateEntityProfileForm.invalid)
        {
            return;
        }

        // Disable the form
        this.updateEntityProfileForm.disable();
        this.updating = true;
        let entity : any = {
            id : this.currentAccount.id,
            userId : this.authService.user$.id,
            nationalityId : this.entityF.nationality.value.id,
            fullName : this.entityF.fullName.value,
            profession : this.entityF.profession.value,
            dob : this.entityF.dob.value,
            telephone : this.entityF.phone.value.e164Number,
            email : this.currentAccount.email,
            address : this.entityF.address.value,
            isActive : true,
        };
        this.adminService.updateEntityProfile(entity)
        .pipe(finalize(()=>{
            this.updateEntityProfileForm.enable();
            this.updating = false;
        }))
        .subscribe(resp=>{
            if(resp.success)
            {
                this._translocoService.selectTranslate('Operation-Completed-Sucessfully').pipe(take(1))
                 .subscribe((translation) => {
 
                     this.toastr.success(translation);
                  });

                  this.getEntityAccount(this.authService.user$.id);

            }
            else
            {
                this.toastr.error(resp.message);
            }
        })
    }
}
