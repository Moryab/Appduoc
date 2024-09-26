import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAlumPage } from './add-alum.page';

describe('AddAlumPage', () => {
  let component: AddAlumPage;
  let fixture: ComponentFixture<AddAlumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
