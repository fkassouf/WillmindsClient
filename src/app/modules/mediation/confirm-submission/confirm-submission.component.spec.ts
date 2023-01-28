import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSubmissionComponent } from './confirm-submission.component';

describe('ConfirmSubmissionComponent', () => {
  let component: ConfirmSubmissionComponent;
  let fixture: ComponentFixture<ConfirmSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
