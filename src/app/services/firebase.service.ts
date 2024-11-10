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

  
}
