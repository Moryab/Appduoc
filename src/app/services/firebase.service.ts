import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { UsuarioLog, UsuarioRegister } from '../interfaces/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

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

      await setDoc(doc(getFirestore(), 'usuarios', userCredential.user.uid), userData);

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
}
