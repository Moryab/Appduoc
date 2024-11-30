import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/interfaces/ialumnos';
import { DatosService } from 'src/app/services/datos.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';
import * as moment from 'moment'; // Importar la librería Moment.js para manejo de fechas

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

  constructor(
    private datosService: DatosService,
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    // Cargar historial de escaneos y alumnos
    this.loadHistorial();
    this.loadInitialAlumnos();

    // Verificar si el dispositivo soporta la funcionalidad de escaneo
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    // Obtener el ID del alumno logueado
    const user = getAuth().currentUser;
    if (user) {
      this.alumnoId = user.uid; // Obtener el ID del alumno logueado
    }
  }

  // Cargar los primeros 20 alumnos desde el servicio
  loadInitialAlumnos() {
    this.datosService.getAlumnos(20).subscribe(response => {
      this.items = response.results;
    });
  }

  // Cargar el historial de escaneos desde Firebase
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
    //const scannedCode = "Codigo escaneaado: curso:modelamiento base de datos, Seccion:Seccion0_1,Profesor:Mabel riquelme,fecha: 29/11/2024,Hora:12:31:36"
    if (scannedCode) {
      const cursoInfo = this.parseCursoInfo(scannedCode);


      // Verificar si el QR fue parseado correctamente
      if (cursoInfo) {
        console.log("Información del curso:", cursoInfo);

        // Registrar el escaneo en Firebase
        await this.registrarEscaneo(cursoInfo);
        // Marcar la asistencia del alumno
        await this.marcarAsistencia(cursoInfo);
      } else {
        console.log("QR no contiene la información del curso.");
      }
    }
  }

  // Método para parsear la información del QR usando .split()
  parseCursoInfo(codigoQR: string): any {
    // Dividir el código QR por comas
    const partes = codigoQR.split(',');

    if (partes.length === 5) {
      const nombre = partes[0].split(':')[1].trim();
      const seccion = partes[1].split(':')[1].trim();
      const nombreProfesor = partes[2].split(':')[1].trim();
      const fechaHora = partes[3].split(':')[1].trim() + ' ' + partes[4].split(':')[1].trim();

      // Utilizar Moment.js para un manejo más flexible de fechas
      const fechaCreacion = moment(fechaHora, 'DD/MM/YYYY HH:mm').toISOString(); // Ajustar el formato según tu necesidad

      if (fechaCreacion) {
        return {
          nombre,
          seccion,
          nombreProfesor,
          fechaCreacion
        };
      } else {
        console.error('Formato de fecha y hora inválido');
        return null;
      }
    }

    return null;
  }

  // Método para marcar la asistencia de un alumno en el curso
  async marcarAsistencia(cursoInfo: any): Promise<void> {
    await this.firebaseService.registrarAlumnoEnCurso(cursoInfo, this.alumnoId);
  }

  // Método para registrar el escaneo en Firebase
  async registrarEscaneo(cursoInfo: any): Promise<void> {
    try {
      const user = getAuth().currentUser; // Obtener el usuario actual

      if (user) {
        // Guardar los datos del escaneo en Firebase
        await this.firebaseService.guardarAsistencia(cursoInfo);  // Asegúrate de que `guardarAsistencia` se ejecute correctamente
        console.log('Escaneo registrado en Firebase');
      } else {
        console.error('No hay usuario logueado.');
      }
    } catch (error) {
      console.error('Error al registrar el escaneo:', error);
    }
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
      message: 'Para usar la aplicación autorizar los permisos de cámara.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
