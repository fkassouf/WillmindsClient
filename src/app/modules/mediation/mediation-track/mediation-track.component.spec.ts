import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediationTrackComponent } from './mediation-track.component';

describe('MediationTrackComponent', () => {
  let component: MediationTrackComponent;
  let fixture: ComponentFixture<MediationTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediationTrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediationTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
