import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ROLES } from 'app/core/enums/core-enum';
import { AdminService } from 'app/modules/admin/admin.service';
import { LanguageModel } from 'app/modules/admin/models/language-model';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable } from 'rxjs';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'app-mediation-track',
  templateUrl: './mediation-track.component.html',
  styleUrls: ['./mediation-track.component.scss']
})
export class MediationTrackComponent {
  @Input() trackMode : string;
  @Input() request : any = null;
  coMediation : boolean = false;
  isLoading : boolean = false;
  submitted : boolean = false;
  submitting : boolean = false;
  filteredMediators$ : Observable<any[]> | undefined;
  fastTrackForm : FormGroup;
  languages : LanguageModel[] = [];
  currentUser : any;
  roles = ROLES;


  constructor(private formBuilder : FormBuilder, 
    private adminService : AdminService, 
    private authService : AuthenticationService,
    private mediationService : MediationService,
    private toastrService : ToastrService){}

  ngOnInit()
  {
    this.currentUser = this.authService.user$;
    this.coMediation = this.request.coMediation;
    this.fastTrackForm = this.formBuilder.group({
      language : new FormControl<LanguageModel>(null, [Validators.required]),
      otherLanguage : new FormControl<string>(this.request.otherLanguageName, []),
    });

    this.getLanguages();
  }

  getLanguages()
  {
    this.adminService.getLanguagesList().subscribe(resp=>{
      if(resp?.success)
      {
          this.languages = resp.result;
          let currentLanguage = this.languages.find(x=>x.id === this.request.languageId);
          this.f.language.setValue(currentLanguage);
      }
    });
  }

  getLangName(id : any) : string
  {
     return this.languages.find(x=>x.id === id)?.name;
  }

  get f(){
    return this.fastTrackForm.controls;
  }

  submit()
  {
     this.submitted = true;
     if(this.fastTrackForm.invalid)
     {
       return;
     }

     this.submitting = true;
     this.fastTrackForm.disable();
     const body = {
      requestId : this.request?.id,
      userId : this.authService.user$.id,
      isFastTrack : true,
      languageId : this.f.language.value.id,
      otherLanguageName : this.f.otherLanguage.value
     };
     this.mediationService.submitMediationFastTrack(body)
     .pipe(finalize(()=>{
      this.submitting = false;
     this.fastTrackForm.enable();
     }))
     .subscribe(resp=>{
       if(resp.success)
       {
          this.toastrService.success('Mediation track mode submitted successfully');
       }
       else
       {
          this.toastrService.error(resp.message);
       }
     })
  }

  suggestCoMediation()
  {
     this.mediationService.suggestCoMediation(this.request.id, this.coMediation)
     .subscribe(resp=>{
        if(resp.success)
        {
          this.toastrService.success('Operation completed');
        }
        else
        {
          this.toastrService.error(resp.message);
          this.coMediation = !this.coMediation;
        }
     });
  }
}
