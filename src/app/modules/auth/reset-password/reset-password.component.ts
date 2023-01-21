import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/authentication.service';

@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    token : any;
    userId : any;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

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

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private activatedRoute: ActivatedRoute,
        private router : Router
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
        this.activatedRoute.queryParams.subscribe(params => {
          console.log(params);
                if(!params.userId || !params.token)
                {
                    this.router.navigate(['/']);
                }

                this.token = params.token;
                this.userId = params.userId;
            
            }
        );
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', Validators.required, , Validators.pattern(this.pattern)],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService.resetPassword(
            {
                newPassword : this.resetPasswordForm.get('password').value,
                token : this.token,
                userId : this.userId
            })
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(resp=>{
                if(resp?.success)
                {
                     // Set the alert
                     this.alert = {
                        type   : 'success',
                        message: 'Your password has been reset, please sign in using your new credentials'
                    };
                }
                else
                {
                     // Set the alert
                     this.alert = {
                        type   : 'error',
                        message: resp?.message
                    };
                }
            })
           
    }
}
