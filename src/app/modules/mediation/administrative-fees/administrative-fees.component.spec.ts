import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeFeesComponent } from './administrative-fees.component';

describe('AdministrativeFeesComponent', () => {
  let component: AdministrativeFeesComponent;
  let fixture: ComponentFixture<AdministrativeFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrativeFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrativeFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
