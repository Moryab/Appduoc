import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';
import * as moment from 'moment'; // Librería para manejar fechas
import { UsuarioRegister } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-curso-estud',
  templateUrl: './curso-estud.page.html',
  styleUrls: ['./curso-estud.page.scss'],
})
export class CursoEstudPage implements OnInit {
  user: UsuarioRegister = {
    nombre: '',
    email: '',
    password: '',
  };

  isSupported = false;
  barcodes: Barcode[] = [];
  alumnoId: string = ''; // ID del alumno actual
  cursos: any[] = []; // Lista de cursos registrados
  private cursoIds = new Set<string>(); // IDs únicos de cursos para evitar duplicados

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    // Verificar soporte para el escáner de código de barras
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    // Obtener ID del usuario autenticado
    const user = getAuth().currentUser;
    if (user) {
      this.alumnoId = user.uid;
    }

    // Cargar cursos guardados desde localStorage
    const cursosGuardados = localStorage.getItem('cursos');
    if (cursosGuardados) {
      this.cursos = JSON.parse(cursosGuardados);
      this.cursos.forEach((curso) => this.cursoIds.add(this.generateUniqueId(curso)));
    }
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Autoriza los permisos de cámara para escanear códigos QR.');
      return;
    }

    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    const scannedCode = this.barcodes[0]?.rawValue;
    if (scannedCode) {
      const cursoInfo = this.parseCursoInfo(scannedCode);
      if (cursoInfo) {
        const cursoId = this.generateUniqueId(cursoInfo);
        if (this.cursoIds.has(cursoId)) {
          this.presentAlert('Curso ya registrado', 'Este curso ya ha sido registrado.');
        } else {
          this.cursos.push(cursoInfo);
          this.cursoIds.add(cursoId);
          localStorage.setItem('cursos', JSON.stringify(this.cursos));
          await this.registrarCurso(cursoInfo);
        }
      } else {
        this.presentAlert('Código QR inválido', 'El código QR escaneado no es válido.');
      }
    }
  }

  parseCursoInfo(codigoQR: string): any {
    const partes = codigoQR.split(',');
    if (partes.length === 5) {
      const nombre = partes[0].split(':')[1].trim();
      const seccion = partes[1].split(':')[1].trim();
      const nombreProfesor = partes[2].split(':')[1].trim();
      const fechaHora = `${partes[3].split(':')[1].trim()} ${partes[4].split(':')[1].trim()}`;
      const fechaCreacion = moment(fechaHora, 'DD/MM/YYYY HH:mm').toISOString();

      if (fechaCreacion) {
        return { nombre, seccion, nombreProfesor, fechaCreacion };
      } else {
        console.error('Formato de fecha y hora inválido');
      }
    }
    return null;
  }

  async registrarCurso(cursoInfo: any): Promise<void> {
    try {
      await this.firebaseService.registrarAlumnoEnCurso(cursoInfo, this.alumnoId);
      this.presentAlert('¡Registro Exitoso!', 'Te has registrado en el curso.');
    } catch (error) {
      console.error('Error al registrar el curso:', error);
      this.presentAlert('Error', 'No se pudo registrar en el curso. Por favor, intenta nuevamente.');
    }
  }

  generateUniqueId(cursoInfo: any): string {
    return `${cursoInfo.nombre}-${cursoInfo.seccion}`;
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
