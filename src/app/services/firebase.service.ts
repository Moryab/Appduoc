import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { UsuarioLog, UsuarioRegister } from '../interfaces/usuario';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth)

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

}
