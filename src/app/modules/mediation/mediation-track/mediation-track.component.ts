import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mediation-track',
  templateUrl: './mediation-track.component.html',
  styleUrls: ['./mediation-track.component.scss']
})
export class MediationTrackComponent {
  isLoading : boolean = false;
  filteredMediators$ : Observable<any[]> | undefined;
  mediationTrackForm : FormGroup;

  constructor(private formBuilder : FormBuilder){}

  ngOnInit()
  {
    this.mediationTrackForm = this.formBuilder.group({
      mediator: new FormControl<any>(null, [])
    });
  }

  onMediatorsScroll(){}
}
