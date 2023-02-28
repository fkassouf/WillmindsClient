import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { ROLES } from 'app/core/enums/core-enum';
import { AdminService } from 'app/modules/admin/admin.service';
import { LanguageModel } from 'app/modules/admin/models/language-model';
import { MediationCaseStatusEnum } from 'app/modules/common/models/_enums';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable } from 'rxjs';
import { MediationService } from '../services/mediation.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mediation-track',
  templateUrl: './mediation-track.component.html',
  styleUrls: ['./mediation-track.component.scss']
})
export class MediationTrackComponent {
  @Input() trackMode : string;
  @Input() request : any = null;
  @Output() reloadRequestEvent = new EventEmitter<boolean>();
  environment = environment;
  coMediation : boolean = false;
  isLoading : boolean = false;
  submitted : boolean = false;
  submitting : boolean = false;
  filteredMediators$ : Observable<any[]> | undefined;
  fastTrackForm : FormGroup;
  fastTrackMediatorForm : FormGroup;
  languages : LanguageModel[] = [];
  mediators : any[] = [];
  coMediators : any[] = [];
  currentUser : any;
  roles = ROLES;
  mediationCaseStatusEnum = MediationCaseStatusEnum;

  acceptingCoMediation : boolean = false;
  rejectingCoMediation : boolean = false;


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

    this.fastTrackMediatorForm = this.formBuilder.group({
      mediator : new FormControl<any>(null, [Validators.required]),
      coMediator : new FormControl<any>(null, [Validators.required]),
    });
    
    this.getLanguages();

    if(this.request?.statusName === this.mediationCaseStatusEnum.CO_MEDIATOR_SELECTION_PENDING)
    {
       this.getMediators();
    }
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

  getMediators()
  {
     this.mediationService.getMediatorList().subscribe(resp=>{
        if(resp.success)
        {
            this.mediators = resp.result;
        }
     });
  }

  getCoMediators()
  {
    console.log('wwd');
    this.mediationService.getMediatorListException(this.fFastTrackMediatorForm.mediator.value?.id).subscribe(resp=>{
        if(resp.success)
        {
            this.coMediators = resp.result;
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

  get fFastTrackMediatorForm()
  {
    return this.fastTrackMediatorForm.controls;
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
          this.reloadRequest(true);
        }
        else
        {
          this.toastrService.error(resp.message);
          this.coMediation = !this.coMediation;
        }
     });
  }

  reloadRequest(value: boolean) {
    this.reloadRequestEvent.emit(value);
  }

  acceptCoMediation(decision : boolean)
  {
     if(decision)
     {
        this.acceptingCoMediation = true;
     }
     else
     {
        this.rejectingCoMediation = true;
     }

     this.mediationService.approveMediationStyle(this.request.id, this.currentUser.entityId, decision)
     .pipe(finalize(()=>{
      this.acceptingCoMediation = false;
      this.rejectingCoMediation = false;
     }))
     .subscribe(resp=>{
        if(resp.success)
        {
            this.toastrService.success('Operation completed successfully');
            this.reloadRequest(true);
        }
        else
        {
          this.toastrService.error(resp.message);
        }
     })
  }

  get isAcceptCoMediationVisible() : boolean
  {
     return (this.request.ownerId == this.currentUser.entityId && this.request.acceptCoMediationSelection == null)
     || (this.request.parties.find(x=>x.entityId == this.currentUser.entityId && x.requestId == this.request.Id));
  }

  clearMediator()
  {
    this.fFastTrackMediatorForm.mediator.setValue(null);
    this.fFastTrackMediatorForm.coMediator.setValue(null);
    this.coMediators = [];
  }
}
