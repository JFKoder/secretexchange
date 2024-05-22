import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecComponent } from './dec.component';

describe('DecComponent', () => {
  let component: DecComponent;
  let fixture: ComponentFixture<DecComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecComponent]
    });
    fixture = TestBed.createComponent(DecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
