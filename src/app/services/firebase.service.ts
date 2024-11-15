import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Curso, cursoEscaneado, UsuarioLog, UsuarioRegister } from '../interfaces/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  router = inject(Router); // Inyecta el servicio de Router

  //=================AUTENTIFICACION===============

  //=====================Login===================
  signIn(user: UsuarioLog) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=====================Registrar===================
  async signUp(user: UsuarioRegister) {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(getAuth(), user.email, user.password);

      // Determinar el tipo de usuario en función del correo
      const tipo = this.getUserType(user.email);

      // Guardar la información del usuario en Firestore
      const userData = {
        nombre: user.nombre,
        correo: user.email,
        tipo: tipo,
        fechaRegistro: new Date().toISOString(),
      };

      await this.firestore.collection('usuarios').doc(userCredential.user.uid).set(userData);

      // Actualizar el perfil del usuario con el nombre (opcional)
      await updateProfile(getAuth().currentUser!, {
        displayName: user.nombre,
      });

      return userCredential; // Devuelve la respuesta de Firebase Auth si es necesario
    } catch (error) {
      console.error("Error en el registro de usuario: ", error);
      throw error;
    }
  }

  //=====================Actualizar usuarios===================
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser!, { displayName });
  }

  // Función para determinar el tipo de usuario según el correo
  private getUserType(correo: string): 'alumno' | 'profesor' {
    if (correo.endsWith('@duocuc.cl')) {
      return 'alumno';
    } else if (correo.endsWith('@profesor.duoc.cl')) {
      return 'profesor';
    } else {
      throw new Error('Correo no válido para registro');
    }
  }

  // Método para agregar un curso a Firestore
  async addCourse(courseData: { seccion: string; sigla: string; nombre: string; nombreProfesor: string; }) {
    try {
      const courseId = this.firestore.createId(); // Obtener un ID único para el curso
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error("No hay usuario logueado.");
      }

      // Guardar la información del curso en Firestore usando AngularFirestore
      await this.firestore.collection('cursos').doc(courseId).set({
        seccion: courseData.seccion,
        sigla: courseData.sigla,
        nombre: courseData.nombre,
        correo: user.email, // Correo del usuario logueado como identificador del profesor
        nombreProfesor: courseData.nombreProfesor, // Nombre visible del profesor
        fechaCreacion: new Date().toISOString()
      });

      console.log("Curso guardado con éxito.");
    } catch (error) {
      console.error("Error al guardar el curso: ", error);
      throw error;
    }
  }

  // Método para obtener los cursos del profesor logueado en tiempo real
  getCourses(): Observable<Curso[]> { // Cambié la firma para retornar un Observable
    const user = getAuth().currentUser;

    if (!user) {
      throw new Error("No hay usuario logueado.");
    }

    // Crear la referencia a la colección y la consulta
    const cursosRef = this.firestore.collection<Curso>('cursos', ref => ref.where("correo", "==", user.email));

    // Usamos onSnapshot para obtener los cursos en tiempo real
    return cursosRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Curso;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Método para guardar la asistencia
  guardarAsistencia(asistencia: any) {
    return this.firestore.collection('asistencias').add(asistencia);
  }

  // Método para guardar la asistencia en Firestore
  async registrarAsistencia(cursoId: string, alumnoId: string) {
    try {
      const asistenciaData = {
        cursoId,
        alumnoId,
        fecha: new Date().toISOString(), // Fecha y hora de la asistencia
      };

      await this.firestore.collection('asistencias').add(asistenciaData);
      console.log("Asistencia registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar asistencia: ", error);
      throw error;
    }
  }

  // Método para obtener los registros de asistencia de un curso específico
  getAsistencia(cursoId: string): Observable<any[]> {
    return this.firestore.collection('asistencias', ref => ref.where("cursoId", "==", cursoId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  //_____________________________
  // Método para guardar el historial de escaneos de QR de un alumno
  // En el servicio Firebase (por ejemplo, firebase.service.ts)
  async guardarHistorialScan(cursoId: string, alumnoId: string) {
    try {
      const historialData = {
        alumnoId,
        cursoId,
        fechaScan: new Date().toISOString(),
      };

      // Guardar en la colección 'historial_scans'
      await this.firestore.collection('historial_scans').add(historialData);
      console.log("Historial de escaneo guardado con éxito.");
    } catch (error) {
      console.error("Error al guardar el historial de escaneo:", error);
      throw error;
    }
  }


  // Método para obtener el historial de escaneos de un alumno
  getHistorialScan(alumnoId: string): Observable<any[]> {
    return this.firestore.collection('historial_scans', ref => ref.where("alumnoId", "==", alumnoId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }


  // Método para obtener los detalles de un curso usando su ID
  getCursoById(cursoId: string): Observable<any> {
    return this.firestore.collection('cursos').doc(cursoId).valueChanges();
  }

  // Método para registrar un alumno en la subcolección 'alumnos' de un curso
  async registrarAlumnoEnCurso(cursoInfo: any, alumnoId: string): Promise<void> {
    try {
      // Crear un identificador único para el curso basado en la información escaneada
      const cursoId = `Curso: ${cursoInfo.nombre}, Sección: ${cursoInfo.seccion}, Profesor: ${cursoInfo.nombreProfesor}`;

      // Referencia a la subcolección 'alumnos' dentro del curso específico
      const cursoRef = this.firestore.collection('cursos').doc(cursoId).collection('alumnos').doc(alumnoId);

      // Verificar si el alumno ya está registrado en la subcolección
      const doc = await cursoRef.get().toPromise();
      if (doc.exists) {
        console.log('El alumno ya está registrado en este curso.');
        return;
      }

      // Datos del alumno que se añadirán a la subcolección
      const alumnoData = {
        alumnoId,
        nombre: "Nombre del Alumno",  // Puedes pasar el nombre real del alumno desde el perfil o información de usuario
        fechaScan: new Date().toISOString()
      };

      // Añadir el alumno a la subcolección 'alumnos' en el curso
      await cursoRef.set(alumnoData);
      console.log('Alumno registrado en el curso con éxito');
    } catch (error) {
      console.error('Error al registrar el alumno:', error);
    }
  }


  // Método para obtener los alumnos registrados en un curso
  obtenerAlumnosDelCurso(cursoId: string): Observable<any[]> {
    return this.firestore.collection('cursos')
      .doc(cursoId)
      .collection('alumnos')
      .valueChanges(); // Para obtener los datos en tiempo real
  }


}
