import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ROLES } from 'app/core/enums/core-enum';
import { Country } from 'app/modules/auth/models';
import { environment } from 'environments/environment';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs';
import { AdminService } from '../admin.service';
import { Dispute } from '../models/dispute';
import { LanguageLevel } from '../models/language-level';
import { LanguageModel } from '../models/language-model';
import { MediationExpertise } from '../models/mediation-expertise';
import { MediatorModel } from '../models/mediator-model';
import { RegisterMediator } from '../models/register-mediator';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit
{
    @ViewChild('updateEntityProfileNgForm') updateEntityProfileNgForm: NgForm;
    @ViewChild('profileImage') profileImage : ElementRef;
    updateEntityProfileForm: FormGroup;
    updateMediatorProfileForm : FormGroup;
    countries : Country[] = [];
    filteredCountries : Country[] = [];
    disputes : Dispute[] = [];
    filteredDisputes : Dispute[] = [];
    mediationExpertises : MediationExpertise[] = [];
    filteredMediationExpertises : MediationExpertise[] = [];
    updatedImage : File | null;

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
    currentMediatorAccount : MediatorModel;
    languages : LanguageModel[] = [];
    languageLevels : any[]= [];
    environment = environment;
    /**
     * Constructor
     */
    constructor(public authService : AuthenticationService, private adminService : AdminService,
        private _formBuilder: FormBuilder, private _router : Router, private cdRef: ChangeDetectorRef,
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

        this.updateMediatorProfileForm = this._formBuilder.group({
            title : [null, []],
            jobTitle : [null, Validators.required],
            fullName : [null, Validators.required],
            //email : [null, [Validators.required, Validators.email]],
            firm : [null, []],
            address : [null, [Validators.required]],
            phone : [null, [Validators.required]],
            accrediation : [null, []],
            nationality : [null, [Validators.required]],
            jurisdiction : [null, []],
            linkedInUrl : [null, []],
            conductMediation : [false, []],
            experienceYears : [null, [Validators.required]],
            mediationNumber : [null, [Validators.required]],
            mediationHours : [null, [Validators.required]],
            mediationMembership : [null, [Validators.required]],
            otherExperience : [null, []],
            trainingDev : [null, []],
            otherMatters : [null, []],
            otherMediationsAreas : [null, []],
            otherDisputeAreas : [null, []],
            disputes : [null, []],
            expertise : [null, []]
          }
        );
        
         // Create the form
        if(this.authService.user$.roles[0] === ROLES.USER)
        {
            this.getEntityAccount(this.authService.user$.id)
        }
        else if(this.authService.user$.roles[0] === ROLES.MEDIATOR)
        {
            this.getMediatorAccount();
            
            
        }
    }

     /*Get language list*/
  getLanguageList(levels : any[])
  {
    this.adminService.getLanguagesList().subscribe(resp=>{
          if(resp?.success)
          {
              this.languages = resp?.result;
              this.languageLevels = [];
              this.languages.forEach(lang=>{
                this.languageLevels.push({
                  languageId : lang.id,
                  languageName : lang.name,
                  rw : levels.filter(x=>x.languageId == lang.id)[0].readingWritten,
                  spoken : levels.filter(x=>x.languageId == lang.id).length > 0 ? levels.filter(x=>x.languageId == lang.id)[0].spoken : '',
                })
              });
          }
      });
  }

    /*get entity account details*/

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

    /*get mediator account details*/
    
    getMediatorAccount()
    {
        this.updateMediatorProfileForm.disable();
        this.adminService.getMediatorById(this.authService.user$.id)
        .pipe(finalize(()=>{
            this.updateMediatorProfileForm.enable();
        }))
        .subscribe(resp=>{
            if(resp.success)
            {
                
                this.currentMediatorAccount = resp.result;
                
                this.updateMediatorProfileForm.controls.fullName.setValue(this.currentMediatorAccount.fullName);
                this.updateMediatorProfileForm.controls.title.setValue(this.currentMediatorAccount.title);
                this.updateMediatorProfileForm.controls.jobTitle.setValue(this.currentMediatorAccount.jobTitle);
                this.updateMediatorProfileForm.controls.firm.setValue(this.currentMediatorAccount.firm);
                this.updateMediatorProfileForm.controls.address.setValue(this.currentMediatorAccount.address);
                this.updateMediatorProfileForm.controls.phone.setValue(this.currentMediatorAccount.telephone);
                this.getCountries(this.currentMediatorAccount.nationalityId);
                this.updateMediatorProfileForm.controls.accrediation.setValue(this.currentMediatorAccount.accrediation);
                this.updateMediatorProfileForm.controls.jurisdiction.setValue(this.currentMediatorAccount.jurisdiction);
                this.updateMediatorProfileForm.controls.linkedInUrl.setValue(this.currentMediatorAccount.linkedInUrl);
                this.updateMediatorProfileForm.controls.conductMediation.setValue(this.currentMediatorAccount.conductMediation);
                this.updateMediatorProfileForm.controls.experienceYears.setValue(this.currentMediatorAccount.experienceYears);
                this.updateMediatorProfileForm.controls.mediationNumber.setValue(this.currentMediatorAccount.mediationNumber);
                this.updateMediatorProfileForm.controls.mediationHours.setValue(this.currentMediatorAccount.mediationHours);
                this.updateMediatorProfileForm.controls.mediationMembership.setValue(this.currentMediatorAccount.mediationMembership);
                this.updateMediatorProfileForm.controls.otherExperience.setValue(this.currentMediatorAccount.otherExperience);
                this.updateMediatorProfileForm.controls.trainingDev.setValue(this.currentMediatorAccount.trainingDev);
                this.updateMediatorProfileForm.controls.otherMatters.setValue(this.currentMediatorAccount.otherMatters);
                this.updateMediatorProfileForm.controls.otherDisputeAreas.setValue(this.currentMediatorAccount.otherDisputeAreas);
                this.updateMediatorProfileForm.controls.otherMediationsAreas.setValue(this.currentMediatorAccount.otherMediationsAreas);
                this.getDisputeList(this.currentMediatorAccount.disputeBackground);
                this.getMediationList(this.currentMediatorAccount.disputeExpertise);
                //console.log(this.currentMediatorAccount);
                this.getLanguageList(this.currentMediatorAccount.languageLevel);
                this.cdRef.detectChanges();
                   
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
                this.updateMediatorProfileForm.controls.nationality.setValue(country);
            }
        });
    }

    /*Get dispute list*/
   getDisputeList(data : any[])
   {
       this.adminService.getDisputeList().subscribe(resp=>{
           if(resp?.success)
           {
               this.disputes = resp?.result;
               this.filteredDisputes = resp?.result;
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
                  this.updateMediatorProfileForm.controls.disputes.setValue(arr);
                  
               }
              
           }
       });
   }

   /*Get mediation expertise list*/
   getMediationList(data : any[])
   {
       this.adminService.getMediationList().subscribe(resp=>{
           if(resp?.success)
           {
               this.mediationExpertises = resp?.result;
               this.filteredMediationExpertises = resp?.result;
               if(data)
               {
                  let arr : MediationExpertise[] = [];
                  this.mediationExpertises.forEach(exp=>{
                    data.forEach(el=>{
                        if(exp.id === el.id)
                        {
                            arr.push(exp);
                        }
                      });
                  });
                  this.updateMediatorProfileForm.controls.expertise.setValue(arr);
                  
               }

               
               
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
        });
    }

    get fMediator()
    {
        return this.updateMediatorProfileForm.controls;
    }

    /* submit mediator profile */
    submitMediatorProfile()
    {
        if(this.updateMediatorProfileForm.invalid)
        {
            return;
        }

        let lv : LanguageLevel[] = [];
        this.languageLevels.forEach(el=>{
            lv.push({
                languageId : el.languageId,
                mediatorId : this.currentMediatorAccount?.id,
                readingWritten : el.rw,
                spoken : el.spoken
            });
        });


        let disputes : number[]= [];
        this.fMediator.disputes.value?.forEach(el=>{
            disputes.push(el.id);
        });

        let expertises : number[] = [];
        this.fMediator.expertise.value?.forEach(el=>{
            expertises.push(el.id);
        });

        let mediator : RegisterMediator = {
            id : this.currentMediatorAccount?.id,
            userId : this.currentMediatorAccount?.userId,
            accrediation : this.fMediator.accrediation.value,
            address : this.fMediator.address.value,
            conductMediation : this.fMediator.conductMediation.value,
            disputes : disputes,
            email : this.currentMediatorAccount?.email,
            experienceYears : this.fMediator.experienceYears.value,
            expertise : expertises,
            firm : this.fMediator.firm.value,
            fullName : this.fMediator.fullName.value,
            jobTitle : this.fMediator.jobTitle.value,
            jurisdiction : this.fMediator.jurisdiction.value,
            languageLevels : lv,
            linkedInUrl : this.fMediator.linkedInUrl.value,
            mediationHours : this.fMediator.mediationHours.value,
            mediationMembership : this.fMediator.mediationMembership.value,
            mediationNumber : this.fMediator.mediationNumber.value,
            nationalityId : this.fMediator.nationality.value.id,
            otherDisputeAreas : this.fMediator.otherDisputeAreas.value,
            otherExperience :  this.fMediator.otherExperience.value,
            otherMatters : this.fMediator.otherMatters.value,
            otherMediationsAreas : this.fMediator.otherMediationsAreas.value,
            telephone : this.fMediator.phone.value?.e164Number,
            title : this.fMediator.title.value,
            trainingDev : this.fMediator.trainingDev.value
  
         };

         //console.log(mediator);
        this.updateMediatorProfileForm.disable();
        this.adminService.updateMediatorProfile(mediator, this.updatedImage)
        .pipe(finalize(()=>{
            this.updateMediatorProfileForm.enable();
        }))
        .subscribe(resp=>{
          if(resp.success)
          {
            
                 // Set the toastr
                 this._translocoService.selectTranslate('Profile-Update-Successfully').pipe(take(1))
                 .subscribe((translation) => {
 
                     this.toastr.success(translation);
                  });

                  this.updatedImage = null;
                  this.getMediatorAccount();
          }
          else
          {
              this.toastr.error(resp.message);
          }
       })
    }

    openBrowseFile()
    {
        document.getElementById("file1").click();
    }

    browseImage(event : any)
    {
        if(event.target.files.length > 0)
        {
            console.log(event.target.files[0]);
            this.profileImage.nativeElement.src= URL.createObjectURL(event.target.files[0]);
            this.updatedImage = event.target.files[0];
            this.profileImage.nativeElement.onload = function() {
                URL.revokeObjectURL(this.profileImage?.nativeElement.src) // free memory
                this.updatedImage = event.target.files[0];
            }
        }
        else
        {
            this.updatedImage = null;
            this.profileImage.nativeElement.src= environment.serverPath + 'images/' + this.currentMediatorAccount?.image;
        }
        this.cdRef.detectChanges();
    }

    undoImage()
    {
        this.updatedImage = null;
        this.profileImage.nativeElement.src = environment.serverPath + 'images/' + this.currentMediatorAccount?.image;
        this.cdRef.detectChanges();
    }

    cancel()
    {
        this._router.navigate(['/']);
    }
}
