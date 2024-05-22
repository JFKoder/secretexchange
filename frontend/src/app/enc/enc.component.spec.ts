import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncComponent } from './enc.component';

describe('EncComponent', () => {
  let component: EncComponent;
  let fixture: ComponentFixture<EncComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncComponent]
    });
    fixture = TestBed.createComponent(EncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
