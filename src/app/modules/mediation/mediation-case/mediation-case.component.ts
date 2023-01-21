import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/authentication.service';
import { OtherParty } from '../models/other-party';

@Component({
  selector: 'app-mediation-case',
  templateUrl: './mediation-case.component.html',
  styleUrls: ['./mediation-case.component.scss']
})
export class MediationCaseComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  title : string;
  mediationRequestForm : FormGroup;
  mediationEvidenceFiles : File[] = [];
  otherParties : OtherParty[] = [];
  otherPartiesLimit : number = 10;
  /**
     * Constructor
     */
  constructor(public _authService : AuthenticationService, private _formBuilder : FormBuilder){}

  ngOnInit() : void {
    this.breadCrumbItems = [
         { label: 'Home', active: true, url : '/' }
      ];

      this.title = 'New Mediation Request';
      this.otherParties.push(new OtherParty());
      this.mediationRequestForm = this._formBuilder.group({
        secondaryEmail : new FormControl<string>(null, []),
        secondaryPhone : new FormControl<any>(null, []),
        lrFirmName : new FormControl<string>(null, []),
        lrLawyerName : new FormControl<string>(null, []),
        lrEmail : new FormControl<string>(null, []),
        lrTelephone : new FormControl<any>(null, []),
        lrAddress : new FormControl<string>(null, []),
        partyList : new FormControl<any>([], []),
        processStageReached : new FormControl<string>(null, []),
        hearingDates : new FormControl<string>(null, []),
        allPartyAggreedToMediate : new FormControl<boolean>(false, []),
        sendNoticeToOtherParties : new FormControl<boolean>(false, []),
        relevantInformation : new FormControl<string>(null, []),
      });
      
  }

  onMediationEvidencesSelect(event : any)
  {
    this.mediationEvidenceFiles.push(...event.addedFiles);
  }

  onMediationEvidencesRemove(event : any)
  {
    this.mediationEvidenceFiles.splice(this.mediationEvidenceFiles.indexOf(event), 1);
  }

  /**Add more parties */
  addOtherParty()
  {
      this.otherParties.push(new OtherParty());
  }

  /**Delete party */
  deleteOtherParty(index : any)
  {
      this.otherParties.splice(index, 1);
  }

}
