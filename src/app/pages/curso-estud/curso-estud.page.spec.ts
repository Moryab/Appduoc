import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CursoEstudPage } from './curso-estud.page';

describe('CursoEstudPage', () => {
  let component: CursoEstudPage;
  let fixture: ComponentFixture<CursoEstudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoEstudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
