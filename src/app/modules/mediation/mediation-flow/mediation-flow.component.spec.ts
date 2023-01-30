import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediationFlowComponent } from './mediation-flow.component';

describe('MediationFlowComponent', () => {
  let component: MediationFlowComponent;
  let fixture: ComponentFixture<MediationFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediationFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediationFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
