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
      const cursoId = `Curso: ${cursoInfo.nombre}, Sección: ${cursoInfo.seccion}, Profesor: ${cursoInfo.nombreProfesor}`;

      const cursoRef = this.firestore.collection('asistencias').doc(cursoId).collection('alumnos').doc(alumnoId);

      const doc = await cursoRef.get().toPromise();
      if (doc.exists) {
        console.log('El alumno ya está registrado en este curso.');
        return;
      }

      const alumnoData = {
        alumnoId,
        nombre: "Nombre del Alumno",  // Reemplaza con el nombre real del alumno desde el perfil
        fechaScan: new Date().toISOString()
      };

      await cursoRef.set(alumnoData);
      console.log('Alumno registrado en el curso con éxito');
    } catch (error) {
      console.error('Error al registrar el alumno:', error);
    }
  }

  obtenerAlumnosDelCurso(cursoId: string): Observable<any[]> {
    return this.firestore.collection('cursos')
      .doc(cursoId)
      .collection('alumnos')
      .valueChanges();
  }
}
