import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/interfaces/ialumnos';
import { DatosService } from 'src/app/services/datos.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-asistencia-estud',
  templateUrl: './asistencia-estud.page.html',
  styleUrls: ['./asistencia-estud.page.scss'],
})
export class AsistenciaEstudPage implements OnInit {


  isSupported = false;
  barcodes: Barcode[] = [];
  items: Alumno[] = [];
  asistencia: any[] = [];
  historialScans: any[] = [];  // Almacena los escaneos
  alumnoId: string = ''; // ID del alumno actual
  curso: any;

  constructor(private datosService: DatosService,
    private alertController: AlertController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadHistorial();
    this.loadInitialAlumnos();
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    const user = getAuth().currentUser;
    if (user) {
      this.alumnoId = user.uid; // Obtener el ID del alumno logueado
    }


  }


  loadInitialAlumnos() {
    this.datosService.getAlumnos(20).subscribe(response => {
      this.items = response.results;
    });
  }

  // Método para cargar el historial de escaneos desde Firebase
  loadHistorial() {
    this.firebaseService.getHistorialScan(this.alumnoId).subscribe(historial => {
      console.log("Historial de escaneos:", historial);  // Verifica la estructura de los datos
      this.historialScans = historial;  // Asigna los datos al array 'historialScans'
    });
  }

  // Método para escanear el QR
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }

    // Realizar el escaneo
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    const scannedCode = this.barcodes[0]?.rawValue;
    if (scannedCode) {
      const cursoInfo = this.parseCursoInfo(scannedCode);

      // Verificar si el QR fue parseado correctamente
      if (cursoInfo) {
        console.log("Información del curso:", cursoInfo);
        await this.marcarAsistencia(cursoInfo);
      } else {
        console.log("QR no contiene la información del curso.");
      }
    }
  }

  // Método para parsear la información del QR
  parseCursoInfo(codigoQR: string): any {
    const regex = /Curso: ([^,]+), Sección: ([^,]+), Profesor: ([^,]+), Fecha: ([^,]+), Hora: ([^,]+)/;
    const matches = codigoQR.match(regex);

    if (matches) {
      return {
        nombre: matches[1],
        seccion: matches[2],
        nombreProfesor: matches[3],
        fechaCreacion: new Date(`${matches[4]} ${matches[5]}`).toISOString()
      };
    }

    return null;
  }


  // Método para marcar la asistencia de un alumno en el curso
  async marcarAsistencia(cursoInfo: any): Promise<void> {
    await this.firebaseService.registrarAlumnoEnCurso(cursoInfo, this.alumnoId);
  }

  // Solicitar permisos para usar la cámara
  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  // Mostrar alerta si los permisos no fueron concedidos
  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Para usar la aplicación autorizar los permisos de cámara',
      buttons: ['OK'],
    });
    await alert.present();
  }
  //_________________

}
