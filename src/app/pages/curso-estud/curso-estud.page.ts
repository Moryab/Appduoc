import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';
import * as moment from 'moment'; // Importar la librería Moment.js para manejo de fechas
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
  cursos: any[] = []; // Array para almacenar los cursos

  constructor(private alertController: AlertController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    // Verificar si el dispositivo soporta la funcionalidad de escaneo
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    // Obtener el ID del alumno logueado
    const user = getAuth().currentUser;
    if (user) {
      this.alumnoId = user.uid; // Obtener el ID del alumno logueado
    }

    // Cargar los cursos desde localStorage al iniciar la aplicación
    const cursosGuardados = localStorage.getItem('cursos');
    if (cursosGuardados) {
      this.cursos = JSON.parse(cursosGuardados);
    }
  }

  // Método para escanear el QR
  //comentar esta parte de codigo para probar boton
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }

    // Realizar el escaneo
    //comentar esta parte de codigo para probar boton
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    const scannedCode = this.barcodes[0]?.rawValue;
    //const scannedCode = "Codigo escaneaado: curso:modelamiento base de datos, Seccion:Seccion0_1,Profesor:Mabel riquelme,fecha: 29/11/2024,Hora:12:31:36"
    if (scannedCode) {
      const cursoInfo = this.parseCursoInfo(scannedCode);

      if (cursoInfo) {
        // Registrar el escaneo en Firebase y mostrar alertas (código existente)

        // Agregar el curso a la lista de cursos
        this.cursos.push(cursoInfo);
        // Guardar los cursos en localStorage
        localStorage.setItem('cursos', JSON.stringify(this.cursos));

        console.log("Información del curso:", cursoInfo);

        // Registrar el escaneo en Firebase
        try {
          // Marcar la asistencia del alumno
          await this.guardarAsistencia(cursoInfo);

          // Mostrar alerta de registro exitoso
          const alert = await this.alertController.create({
            header: '¡Registro Exitoso!',
            message: 'Te has registrado en el curso.',
            buttons: ['OK']
          });
          await alert.present();
        } catch (error) {
          console.error('Error al registrar el escaneo:', error);

          // Mostrar alerta de error
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No se pudo registrar en el curso. Por favor, intenta nuevamente.',
            buttons: ['OK']
          });
          await alert.present();
        }
      } else {
        // Mostrar alerta de QR inválido
        const alert = await this.alertController.create({
          header: 'Código QR Inválido',
          message: 'El código QR escaneado no es válido.',
          buttons: ['OK']
        });
        await alert.present();
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

  // Método para guardarla asistencia de un alumno en firebase
  async guardarAsistencia(cursoInfo: any): Promise<void> {
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
      message: 'Para usar la aplicación autorizar los permisos de cámara.',
      buttons: ['OK']
    });
    await alert.present();
  }

}