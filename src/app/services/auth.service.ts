import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import {map} from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
                public firestore: AngularFirestore) { }
  
  initAuthListener(){
    this.auth.authState.subscribe(fuser =>{
      console.log(fuser);
      console.log('---------uid, email-------------');
      console.log(fuser?.uid);
      console.log(fuser?.email);

    })
  }

  createUser(nombre: string, correo: string, password: string){

    const data = {nombre, correo, password};

    return this.auth.createUserWithEmailAndPassword(data.correo,data.password)
      .then(({user}) =>{
        const newUser = new Usuario(user.uid,nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`)
            .set({...newUser});

      })

    // console.log(data)

  }

  loginUser(correo: string, password: string){
    return this.auth.signInWithEmailAndPassword(correo, password);
  }
  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser!=null )
      )
  }

}
