import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ROLES } from 'app/core/enums/core-enum';
import { AdminAccount, Country } from 'app/modules/auth/models';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AdminService } from '../admin.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { LanguageModel } from '../models/language-model';
import { Dispute } from '../models/dispute';
import { MediationExpertise } from '../models/mediation-expertise';
import { MatSelect } from '@angular/material/select';
import { LanguageLevel } from '../models/language-level';
import { RegisterMediator } from '../models/register-mediator';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  @ViewChild('signUpNgAdminForm') signUpNgAdminForm: NgForm;
  @ViewChild('signUpNgMediatorForm') signUpNgMediatorForm: NgForm;
  signUpAdminForm: FormGroup;
  signUpMediatorForm : FormGroup;
  showAlert : boolean = false;
  roles : any[];
  @ViewChild('selectedRole') selectedRole : any;
  rolesEnum = ROLES;

  countries : Country[];
  filteredCountries : Country[];

  addedImages: File[] = [];
  languages : LanguageModel[] = [];
  languageLevels : any[]= [];
  disputes : Dispute[] = [];
  filteredDisputes : Dispute[] = [];
  mediationExpertises : MediationExpertise[] = [];
  filteredMediationExpertises : MediationExpertise[] = [];

  /**ngx phone number settings */
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Lebanon];
 

  constructor(private _formBuilder: FormBuilder, private _authService : AuthenticationService, 
    private toastr : ToastrService, private router : Router, private _translocoService : TranslocoService,
    private adminService : AdminService){}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Users-Management', url : '/admin/users-management' },
      { label: 'New-User', active: true, url : '/admin/new-user' }
    ];
    
    // Create the form
    this.signUpAdminForm = this._formBuilder.group({
      fullName : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
          }
      );

      this.signUpMediatorForm = this._formBuilder.group({
          title : [null, []],
          jobTitle : [null, Validators.required],
          fullName : [null, Validators.required],
          email : [null, [Validators.required, Validators.email]],
          firm : [null, []],
          address : [null, [Validators.required]],
          phone : [null, [Validators.required]],
          accrediation : [null, []],
          nationalityId : [null, [Validators.required]],
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

      this.getRoles();
      this.getCountries();
      this.getLanguageList();
      this.getDisputeList();
      this.getMediationList();
  }


  /*Get country list*/
  getCountries()
  {
      this._authService.getCountries().subscribe(resp=>{
          if(resp?.success)
          {
              this.countries = resp?.result;
              this.filteredCountries = resp?.result;
          }
      });
  }

  /*Get country list*/
  getLanguageList()
  {
      this.adminService.getLanguagesList().subscribe(resp=>{
          if(resp?.success)
          {
              this.languages = resp?.result;
              this.languages.forEach(lang=>{
                this.languageLevels.push({
                  languageId : lang.id,
                  languageName : lang.name,
                  rw : false,
                  spoken : ''
                })
              });
          }
      });
  }

   /*Get dispute list*/
   getDisputeList()
   {
       this.adminService.getDisputeList().subscribe(resp=>{
           if(resp?.success)
           {
               this.disputes = resp?.result;
               this.filteredDisputes = resp?.result;
           }
       });
   }

   /*Get mediation expertise list*/
   getMediationList()
   {
       this.adminService.getMediationList().subscribe(resp=>{
           if(resp?.success)
           {
               this.mediationExpertises = resp?.result;
               this.filteredMediationExpertises = resp?.result;
           }
       });
   }

   // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    createAdminUser(): void
     {
         // Do nothing if the form is invalid
         if ( this.signUpAdminForm.invalid )
         {
             return;
         }
 
         // Disable the form
         this.signUpAdminForm.disable();
 
         // Hide the alert
         this.showAlert = false;

         let adminAccount : AdminAccount = {
            email : this.signUpAdminForm.get('email').value,
            fullName : this.signUpAdminForm.get('fullName').value
         };
 
         // Sign up
         this.adminService.createAdminUser(adminAccount).subscribe(resp=>{
             if(resp.success)
             {
                 this.signUpAdminForm.enable();
 
                 // Reset the form
                 this.signUpNgAdminForm.resetForm();
 
                 // Set the toastr
                 this._translocoService.selectTranslate('User-Created-Successfully').pipe(take(1))
                 .subscribe((translation) => {
 
                     this.toastr.success(translation);
                  });

                  this.selectedRole.value = null;
                
             }
             else
             {
                 this.signUpAdminForm.enable();
 
                 // Reset the form
                 this.signUpNgAdminForm.resetForm();
 
                 // Set the alert
                 this.toastr.error(resp.message);
 
             }
         });
                 
     }

     get fMediator()
     {
       return this.signUpMediatorForm.controls;
     }

     createMediatorUser(){
      
       // Do nothing if the form is invalid
       if ( this.signUpMediatorForm.invalid )
       {
           return;
       }

       // Disable the form
       this.signUpAdminForm.disable();
 
       // Hide the alert
       this.showAlert = false;

       let lv : LanguageLevel[] = [];
       this.languageLevels.forEach(el=>{
          lv.push({
            languageId : el.languageId,
            mediatorId : null,
            readingWritten : el.rw,
            spoken : el.spoken
          })
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
          accrediation : this.fMediator.accrediation.value,
          address : this.fMediator.address.value,
          conductMediation : this.fMediator.conductMediation.value,
          disputes : disputes,
          email : this.fMediator.email.value,
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
          nationalityId : this.fMediator.nationalityId.value.id,
          otherDisputeAreas : this.fMediator.otherDisputeAreas.value,
          otherExperience :  this.fMediator.otherExperience.value,
          otherMatters : this.fMediator.otherMatters.value,
          otherMediationsAreas : this.fMediator.otherMediationsAreas.value,
          telephone : this.fMediator.phone.value?.e164Number,
          title : this.fMediator.title.value,
          trainingDev : this.fMediator.trainingDev.value

       };
       //console.log(mediator);
       let image = this.addedImages.length > 0 ? this.addedImages[0] : null
       this.adminService.createMediatorUser(mediator, image).subscribe(resp=>{
          if(resp.success)
          {
            this.signUpMediatorForm.enable();
 
                 // Reset the form
                 this.signUpNgMediatorForm.resetForm();
 
                 // Set the toastr
                 this._translocoService.selectTranslate('User-Created-Successfully').pipe(take(1))
                 .subscribe((translation) => {
 
                     this.toastr.success(translation);
                  });

                  this.selectedRole.value = null;
          }
       })



     }

     cancel()
     {
        this.router.navigate(['/admin/users-management']);
     }

     getRoles()
     {
       this.adminService.getRoles().subscribe(resp=>{
         if(resp.success)
         {
            this.roles = resp.result;
         }
       })
     }

     /*Selected role change event*/
     onRoleChanged()
     {
        //console.log(this.selectedRole.value);
     }

     onSelectProfileImage(event) {
      this.addedImages.push(...event.addedFiles);
      if(this.addedImages.length > 1){ // checking if files array has more than one content
        this.replaceFile(); // replace file
      }
    }

    /**Prevent adding more than 1 file */
    replaceFile(){
      this.addedImages.splice(0,1); // index =0 , remove_count = 1
    }      
  
    onRemoveProfileImage(event) {
      this.addedImages.splice(this.addedImages.indexOf(event), 1);
    }

}
