import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediationCaseComponent } from './mediation-case.component';

describe('MediationCaseComponent', () => {
  let component: MediationCaseComponent;
  let fixture: ComponentFixture<MediationCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediationCaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediationCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
