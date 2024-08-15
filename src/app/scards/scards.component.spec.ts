import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScardsComponent } from './scards.component';

describe('ScardsComponent', () => {
  let component: ScardsComponent;
  let fixture: ComponentFixture<ScardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
