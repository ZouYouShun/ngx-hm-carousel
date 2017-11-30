import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragManyComponent } from './drag-many.component';

describe('DragManyComponent', () => {
  let component: DragManyComponent;
  let fixture: ComponentFixture<DragManyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragManyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragManyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
