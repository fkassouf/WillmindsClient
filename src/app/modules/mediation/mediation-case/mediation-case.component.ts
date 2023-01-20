import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mediation-case',
  templateUrl: './mediation-case.component.html',
  styleUrls: ['./mediation-case.component.scss']
})
export class MediationCaseComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  title : string;
  verticalStepperForm: FormGroup;
  mediationEvidenceFiles : File[] = [];
  /**
     * Constructor
     */
  constructor(){}

  ngOnInit() : void {
    this.breadCrumbItems = [
         { label: 'Home', active: true, url : '/' }
      ];

      this.title = 'New Mediation Request';
      
      
  }

  onMediationEvidencesSelect(event : any)
  {
    this.mediationEvidenceFiles.push(...event.addedFiles);
  }

  onMediationEvidencesRemove(event : any)
  {
    this.mediationEvidenceFiles.splice(this.mediationEvidenceFiles.indexOf(event), 1);
  }

}
