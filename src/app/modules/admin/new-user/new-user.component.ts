import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;
  signUpForm: FormGroup;
  showAlert : boolean = false;

  constructor(private _formBuilder: FormBuilder, private _authService : AuthenticationService, 
    private toastr : ToastrService, private router : Router, private _translocoService : TranslocoService){}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Users-Management', url : '/admin/users-management' },
      { label: 'New-User', active: true, url : '/admin/new-user' }
    ];

    // Create the form
    this.signUpForm = this._formBuilder.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      email     : ['', [Validators.required, Validators.email]],
  }
);
  }

   // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
     signUp(): void
     {
         // Do nothing if the form is invalid
         if ( this.signUpForm.invalid )
         {
             return;
         }
 
         // Disable the form
         this.signUpForm.disable();
 
         // Hide the alert
         this.showAlert = false;
 
         // Sign up
         this._authService.signUp(this.signUpForm.value).subscribe(resp=>{
             if(resp.success)
             {
                 this.signUpForm.enable();
 
                 // Reset the form
                 this.signUpNgForm.resetForm();
 
                 // Set the toastr
                 this._translocoService.selectTranslate('User-Created-Successfully').pipe(take(1))
                 .subscribe((translation) => {
 
                     this.toastr.success(translation);
                  });
                
             }
             else
             {
                 this.signUpForm.enable();
 
                 // Reset the form
                 this.signUpNgForm.resetForm();
 
                 // Set the alert
                 this.toastr.error(resp.message);
 
             }
         });
                 
     }

     cancel()
     {
        this.router.navigate(['/admin/users-management']);
     }

}
