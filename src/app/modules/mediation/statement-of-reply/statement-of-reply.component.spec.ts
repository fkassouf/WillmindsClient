import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfReplyComponent } from './statement-of-reply.component';

describe('StatementOfReplyComponent', () => {
  let component: StatementOfReplyComponent;
  let fixture: ComponentFixture<StatementOfReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementOfReplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementOfReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
