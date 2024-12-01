import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Curso, UsuarioLog, UsuarioRegister } from '../interfaces/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  router = inject(Router);

  //=================AUTENTIFICACION===============

  //=====================Login===================
  signIn(user: UsuarioLog) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=====================Registrar===================
  async signUp(user: UsuarioRegister) {
    try {
      const userCredential = await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
      const tipo = this.getUserType(user.email);

      const userData = {
        nombre: user.nombre,
        correo: user.email,
        tipo: tipo,
        fechaRegistro: new Date().toISOString(),
      };

      await this.firestore.collection('usuarios').doc(userCredential.user.uid).set(userData);
      await updateProfile(getAuth().currentUser!, {
        displayName: user.nombre,
      });

      return userCredential;
    } catch (error) {
      console.error("Error en el registro de usuario: ", error);
      throw error;
    }
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser!, { displayName });
  }

  private getUserType(correo: string): 'alumno' | 'profesor' {
    if (correo.endsWith('@duocuc.cl')) {
      return 'alumno';
    } else if (correo.endsWith('@profesor.duoc.cl')) {
      return 'profesor';
    } else {
      throw new Error('Correo no válido para registro');
    }
  }

  //====================CURSOS======================

  async addCourse(courseData: { seccion: string; sigla: string; nombre: string; nombreProfesor: string; }) {
    try {
      const courseId = this.firestore.createId();
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error("No hay usuario logueado.");
      }

      await this.firestore.collection('cursos').doc(courseId).set({
        seccion: courseData.seccion,
        sigla: courseData.sigla,
        nombre: courseData.nombre,
        correo: user.email,
        nombreProfesor: courseData.nombreProfesor,
        fechaCreacion: new Date().toISOString()
      });

      console.log("Curso guardado con éxito.");
    } catch (error) {
      console.error("Error al guardar el curso: ", error);
      throw error;
    }
  }

  getCourses(): Observable<Curso[]> {
    const user = getAuth().currentUser;

    if (!user) {
      throw new Error("No hay usuario logueado.");
    }

    const cursosRef = this.firestore.collection<Curso>('cursos', ref => ref.where("correo", "==", user.email));

    return cursosRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Curso;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


  //====================HISTORIAL DE ESCANEOS======================
  //Metodo usado en QRCODE
  async guardarAsistencia(asistencia: any) {
    try {
      const asistenciaData = {
        cursoId: asistencia.curso,
        seccion: asistencia.seccion,
        profesor: asistencia.profesor,
        fecha: asistencia.fecha,
        hora: asistencia.hora,
        claseId: asistencia.claseId,
      };

      await this.firestore.collection('asistencias').add(asistenciaData);
      console.log("Asistencia registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar asistencia: ", error);
      throw error;
    }
  }
  //====================REGISTRO DE ALUMNOS EN CURSOS======================

  async registrarAlumnoEnCurso(cursoInfo: any, alumnoId: string): Promise<void> {
    try {
      const cursoId = `${cursoInfo.nombre}-${cursoInfo.seccion}`; // ID único basado en curso y sección
      const fecha = cursoInfo.fecha;  // Usamos la fecha extraída del QR
      const hora = cursoInfo.hora;    // Usamos la hora extraída del QR
  
      const cursoRef = this.firestore.collection('asistencias').doc(fecha); // Fecha como documento
      const alumnosRef = cursoRef.collection('alumnos');
  
      // Guardar al alumno con los detalles, usando la fecha extraída del QR
      await alumnosRef.doc(alumnoId).set({
        alumnoId,
        curso: cursoId,
        hora,
        registradoEn: fecha // Aquí usamos la fecha del QR
      });
  
      console.log('Alumno registrado con éxito.');
    } catch (error) {
      console.error('Error al registrar al alumno en curso:', error);
      throw error;
    }
  }
  
  

  obtenerAlumnosDelCurso(cursoId: string): Observable<any[]> {
    return this.firestore.collection('cursos')
      .doc(cursoId)
      .collection('alumnos')
      .valueChanges();
  }

  async registrarAsistenciaCurso(cursoInfo: any, alumnoId: string, fecha: string, hora: string): Promise<void> {
    try {
      const cursoId = `${cursoInfo.nombre}-${cursoInfo.seccion}`; // Identificador único para el curso y sección
  
      // Convertir la fecha al formato ISO 8601
      const fechaISO = new Date(fecha).toISOString().split('T')[0]; // Obtener solo la fecha
  
      // Asegurarnos de que el documento del curso existe o se crea
      const cursoRef = this.firestore.collection('asistencias').doc(cursoId);
  
      // Este set crea el documento si no existe, o lo sobrescribe si ya existe
      await cursoRef.set({}, { merge: true }); // Si el documento no existe, se crea vacío
  
      // Asegurarnos de que el documento para la fecha existe o se crea
      const fechaRef = cursoRef.collection('fechas').doc(fechaISO);
  
      // Este set crea el documento de la fecha si no existe, o lo sobrescribe si ya existe
      await fechaRef.set({}, { merge: true }); // Si el documento no existe, se crea vacío
  
      // Agregamos el alumno a la lista de alumnos presentes
      const alumnosRef = fechaRef.collection('alumnos');
      await alumnosRef.doc(alumnoId).set({
        alumnoId,
        fechaScan: new Date().toISOString(), // Almacenamos la fecha y hora del escaneo
        horaScan: hora // Guardamos la hora también
      });
  
      console.log('Asistencia registrada con éxito.');
    } catch (error) {
      console.error('Error al registrar asistencia: ', error);
      throw error;
    }
  }
  



}
