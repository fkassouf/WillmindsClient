import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherpartyRequestDecisionComponent } from './otherparty-request-decision.component';

describe('OtherpartyRequestDecisionComponent', () => {
  let component: OtherpartyRequestDecisionComponent;
  let fixture: ComponentFixture<OtherpartyRequestDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherpartyRequestDecisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherpartyRequestDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
