import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import {map} from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubscription: Subscription;

  constructor( public auth: AngularFireAuth,
                public firestore: AngularFirestore,
                private _store: Store<AppState>) { }
  
  initAuthListener(){
    this.auth.authState.subscribe(fuser =>{

      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (firestoreUser: any)=>{
            console.log(firestoreUser);
            const user = Usuario.fromFirebase(firestoreUser);
            this._store.dispatch(authActions.setUser({user}));
          });
      } else {
        console.log('llamar unset del user');
        this.userSubscription.unsubscribe();
        this._store.dispatch(authActions.unSetUser())
      }
      // console.log(fuser);
      // console.log('---------uid, email-------------');
      // console.log(fuser?.uid);
      // console.log(fuser?.email);

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
