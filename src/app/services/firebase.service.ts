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
  auth = inject(AngularFireAuth)
  firestore = inject(AngularFirestore)

  //=================AUTENTIFICACION===============



  //=====================Login===================
  signIn(user: UsuarioLog) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  //=====================Registrar===================
  signUp(user: UsuarioRegister) {
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password)
  }
  //=====================Actualizar usuarios===================
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser,{ displayName })
  }
  //=====================Base De Datos===================

}
