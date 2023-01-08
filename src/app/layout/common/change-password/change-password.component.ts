import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseValidators } from '@fuse/validators';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  securityForm: FormGroup;
  changing : boolean = false;

  passRequirement = {
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinUpperCase: 1,
    passwordMinCharacters: 8
  };

  passRequirementCheck = [
    {name : 'passwordMinUpperCase', valid : false, text : '1 upper case'},
    {name : 'passwordMinLowerCase', valid : false, text : '1 lower case'},
    {name : 'passwordMinNumber', valid : false, text : '1 number'},
    {name : 'passwordMinSymbol', valid : false, text : '1 symbol'},
    {name : 'length', valid : false, text : 'length 8'}
    
  ];

  pattern = [
    `(?=([^a-z]*[a-z])\{${this.passRequirement.passwordMinLowerCase},\})`,
    `(?=([^A-Z]*[A-Z])\{${this.passRequirement.passwordMinUpperCase},\})`,
    `(?=([^0-9]*[0-9])\{${this.passRequirement.passwordMinNumber},\})`,
    `(?=(\.\*[\$\@\$\!\%\#\_\*\?\&])\{${
      this.passRequirement.passwordMinSymbol
    },\})`,
    `[A-Za-z\\d\$\@\$\!\%\#\_\*\?\&\.]{${
      this.passRequirement.passwordMinCharacters
    },}`
  ]
    .map(item => item.toString())
    .join("");

  
  constructor(private commonService : CommonService, private authService : AuthenticationService,
     public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private toastr: ToastrService)
    {}

    /**
     * On init
     */
     ngOnInit(): void
     {
         // Create the form
         this.securityForm = this.formBuilder.group({
             currentPassword  : new FormControl<string>('', [Validators.required]),
             newPassword      : new FormControl<string>('', [Validators.required, Validators.pattern(this.pattern)]),
             confirmPassword  : new FormControl<string>('', [Validators.required])
        },
        {
          validators: FuseValidators.mustMatch('newPassword', 'confirmPassword')
        }
        );
     }

     onPasswordKeyUp(event : any)
     {
         let input = event.target as HTMLInputElement;
         this.passRequirementCheck[0].valid = this.containsUpper(input.value);
         this.passRequirementCheck[1].valid = this.containsLower(input.value);
         this.passRequirementCheck[2].valid = this.containsOneNumber(input.value);
         this.passRequirementCheck[3].valid = this.containsOneSymbol(input.value);
         this.passRequirementCheck[4].valid = this.containsMinLength(input.value);
   
     }
   
     containsUpper(str : string) {
       return (/[A-Z]/.test(str));
     }
   
     containsLower(str : string) {
       return (/[a-z]/.test(str));
     }
   
     containsOneNumber(str : string) {
       return (/[0-9]/.test(str));
     }
   
     containsOneSymbol(str : string) {
       return (/[\$\@\$\!\%\#\_\*\?\&]/.test(str));
     }
   
     containsMinLength(str : string) {
       return str.length >= 8;
     }
   
     isPasswordValid()
     {
         let valid = false;
         this.passRequirementCheck?.forEach(item=>{
           valid = item.valid;
         });
   
         return valid;
     }

     get f()
     {
       return this.securityForm?.controls;
     }

  closeDialog(){
    this.dialogRef.close(this.data);
  }

  submitForm()
  {
    
     if(this.securityForm?.invalid)
     {
        return;
     }

     this.changing = true;
     let credentials : any = {email : this.authService.user$.email, currentPassword : this.f.currentPassword.value, newPassword : this.f.newPassword.value};
     this.commonService.changePassword(credentials)
     .pipe(finalize(()=>{
      this.changing = false;
     }))
     .subscribe(resp=>{
        if(resp?.success)
        {
            this.dialogRef.close(this.data);
            this.toastr.success('Password changed');
        }
        else
        {
            this.toastr.error(resp?.message);
        }
     });
  }

}
