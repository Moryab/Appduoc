import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarCursoPage } from './agregar-curso.page';

describe('AgregarCursoPage', () => {
  let component: AgregarCursoPage;
  let fixture: ComponentFixture<AgregarCursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
