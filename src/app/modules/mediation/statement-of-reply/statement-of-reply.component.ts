import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'app-statement-of-reply',
  templateUrl: './statement-of-reply.component.html',
  styleUrls: ['./statement-of-reply.component.scss']
})
export class StatementOfReplyComponent {
  @Input() request : any;
  @Output() reloadRequestEvent = new EventEmitter<boolean>();

  subs : any;
  stOfReplyForm : FormGroup;
  submitting : boolean = false;
  constructor(private formBuilder : FormBuilder, 
    private _translocoService : TranslocoService,
    private mediationService : MediationService,
    private authService : AuthenticationService,
    private toastrService : ToastrService){}

  ngOnInit() : void {
    this.stOfReplyForm = this.formBuilder.group({
      statOfReply : new FormControl<string>(null, [Validators.required]),
      statOfReplyFile : new FormControl<File>(null, [])
    });
  }

  ngOnDestroy()
  {
    this.subs?.unsubscribe();
  }

  get f()
  {
    return this.stOfReplyForm.controls;
  }

  submitForm(){
     if(this.stOfReplyForm.invalid)
     {
      this.toastrService.error('Some fields are invalid');
       return;
     }

     this.submitting = true;
     let user = this.authService.user$;
     this.stOfReplyForm.disable();
     let body : any = {
       entityId : user?.entityId,
       requestId : this.request?.id,
       statOfReply : this.f.statOfReply.value
     };

     let file = this.f.statOfReplyFile.value;
     this.subs = this.mediationService.submitStatementOfReply(body, file?.files[0])
     .pipe(finalize(()=>{
        this.submitting = false;
        this.stOfReplyForm.enable();
     }))
     .subscribe(resp=>{
        if(resp.success)
        {
          this.toastrService.success('Statement of reply submitted successfully');
          this.reloadRequest(true);
        }
        else
        {
          this.toastrService.error(resp.message);
          this.reloadRequest(false);
        }
     })
     
  }

  reloadRequest(value: boolean) {
    this.reloadRequestEvent.emit(value);
  }
}
