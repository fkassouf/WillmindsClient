import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediationsFilterComponent } from './mediations-filter.component';

describe('MediationsFilterComponent', () => {
  let component: MediationsFilterComponent;
  let fixture: ComponentFixture<MediationsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediationsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
