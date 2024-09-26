import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistenciaEstudPage } from './asistencia-estud.page';

describe('AsistenciaEstudPage', () => {
  let component: AsistenciaEstudPage;
  let fixture: ComponentFixture<AsistenciaEstudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaEstudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
