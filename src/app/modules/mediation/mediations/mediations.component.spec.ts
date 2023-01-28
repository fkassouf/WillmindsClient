import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediationsComponent } from './mediations.component';

describe('MediationsComponent', () => {
  let component: MediationsComponent;
  let fixture: ComponentFixture<MediationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
