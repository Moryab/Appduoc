import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';
import * as moment from 'moment';
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
  alumnoId: string = '';
  cursos: any[] = []; // Lista de cursos registrados
  cursoId: string = ''; // Inicializa la variable con un valor vacío o un curso por defecto.
  todayDate: string = new Date().toISOString().split('T')[0]; // Esto obtiene la fecha en formato YYYY-MM-DD

  private cursoIds = new Set<string>();

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  
    const user = getAuth().currentUser;
    if (user) {
      this.alumnoId = user.uid;
    }
  
    const cursosGuardados = localStorage.getItem('cursos');
    if (cursosGuardados) {
      this.cursos = JSON.parse(cursosGuardados).map((curso) => ({
        ...curso,
        fechas: curso.fechas || [], // Inicializa `fechas` si no existe
        showDates: false,
      }));
      this.cursos.forEach((curso) => this.cursoIds.add(this.generateUniqueId(curso)));
    }
    
  }
  

  parseCursoInfo(codigoQR: string): any {
    try {
      const partes = codigoQR.split(',');
      if (partes.length === 5) {
        const nombre = partes[0].split(':')[1]?.trim();
        const seccion = partes[1].split(':')[1]?.trim();
        const nombreProfesor = partes[2].split(':')[1]?.trim();
        const fechaHora = `${partes[3].split(':')[1]?.trim()} ${partes[4].split(':')[1]?.trim()}`;
  
        const fecha = moment(fechaHora, 'DD/MM/YYYY HH:mm');
        if (fecha.isValid()) {
          return {
            nombre,
            seccion,
            nombreProfesor,
            fecha: fecha.format('DD/MM/YYYY'),
            hora: fecha.format('HH:mm'),
          };
        }
      }
    } catch (error) {
      console.error('Error al analizar el código QR:', error);
    }
    return null;
  }
  

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Autoriza los permisos de cámara para escanear códigos QR.');
      return;
    }
  
    const { barcodes } = await BarcodeScanner.scan();
    if (!barcodes || barcodes.length === 0) {
      console.warn('No se detectó ningún código QR.');
      return;
    }
  
    const scannedCode = barcodes[0]?.rawValue;
    console.log('Código QR escaneado:', scannedCode);
  
    if (scannedCode) {
      const cursoInfo = this.parseCursoInfo(scannedCode);
      if (cursoInfo) {
        const cursoId = this.generateUniqueId(cursoInfo);
  
        if (!this.cursoIds.has(cursoId)) {
          console.log('Registrando nuevo curso:', cursoInfo);
          this.cursos.push({
            ...cursoInfo,
            fechas: [],
            showDates: false,
          });
          this.cursoIds.add(cursoId);
          localStorage.setItem('cursos', JSON.stringify(this.cursos));
        } else {
          console.log('Curso ya registrado:', cursoInfo);
        }
  
        if (cursoInfo.hora) {
          await this.firebaseService.registrarAsistenciaCurso(
            cursoInfo,
            this.alumnoId,
            cursoInfo.fecha,
            cursoInfo.hora
          );
        } else {
          console.error('Hora no disponible para el curso', cursoInfo);
          this.presentAlert('Error', 'No se pudo obtener la hora del curso.');
        }
      } else {
        this.presentAlert('Código QR inválido', 'El código QR escaneado no es válido.');
      }
    }
  }
  

  async getFechasAsistencia(cursoId: string, fecha: string): Promise<void> {
    if (!cursoId || cursoId.trim() === '') {
      console.error('Error: cursoId está vacío o no válido.');
      await this.presentAlert('Error', 'No se puede obtener las fechas de asistencia sin un curso válido.');
      return;
    }
  
    if (!fecha || fecha.trim() === '') {
      console.error('Error: fecha está vacía o no válida.');
      await this.presentAlert('Error', 'No se puede obtener las fechas de asistencia sin una fecha válida.');
      return;
    }
  
    try {
      const fechas = await this.firebaseService.obtenerCursoYAsistencia(cursoId, fecha);
      console.log('Fechas obtenidas:', fechas);
  
      const curso = this.cursos.find((c) => this.generateUniqueId(c) === cursoId);
      if (curso) {
        curso.fechas = fechas; // Actualiza las fechas en el curso
      }
    } catch (error) {
      console.error('Error al obtener las fechas de asistencia:', error);
      await this.presentAlert('Error', 'Ocurrió un problema al obtener las fechas de asistencia.');
    }
  }
  
  


// async toggleFechas(curso: any): Promise<void> {
//   curso.showDates = !curso.showDates;

//   if (curso.showDates && (!curso.fechas || curso.fechas.length === 0)) {
//     const cursoId = this.generateUniqueId(curso);
//     await this.getFechasAsistencia(cursoId);
//   }
// }

  

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
