import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragOneComponent } from './drag-one.component';

describe('DragOneComponent', () => {
  let component: DragOneComponent;
  let fixture: ComponentFixture<DragOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
