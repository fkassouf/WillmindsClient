import { Component, Inject, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'app-confirm-submission',
  templateUrl: './confirm-submission.component.html',
  styleUrls: ['./confirm-submission.component.scss']
})
export class ConfirmSubmissionComponent {
  @ViewChild('confirmSubmission') confirmSubmission : MatCheckbox;
  submitting : boolean = false;
    constructor(private dialogRef: MatDialogRef<ConfirmSubmissionComponent>,
      private mediationService : MediationService,
      private toastr : ToastrService,
      @Inject(MAT_DIALOG_DATA) private data){
        
      }

      close() {
        this.dialogRef.close();
        
    }

    submitForm()
    {
      this.submitting = true;
      this.mediationService.updateMediationRequest(this.data.body, this.data.natureOfDisputeFile, 
        this.data.emailWrittenCommFile, this.data.contractClauseFile, this.data.mediationSubmissionAgreementFile)
        .pipe(finalize(()=>{
         
          this.submitting = false;
        }))
        .subscribe(resp=>{
        if(resp.success)
        {
          this.dialogRef.close('success');
        }
        else
        {
          this.dialogRef.close(resp.message);
        }
      })
    }
}
