import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm : FormGroup;
  cargando : boolean = false;
  uiSubscription : Subscription;

  constructor( private _fb         : FormBuilder,
               private _authService: AuthService,
               public router       : Router,
               private _store      : Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      correo: ['oochurquina@yahoo.com.ar',[Validators.required, Validators.email]],
      password: ['12345678',Validators.required]
    });
  
    this.uiSubscription = this._store.select('ui').subscribe(ui =>{
      this.cargando= ui.isLoading;
      console.log('cargando subs');
    });
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();

  }

  login(){

    if (this.loginForm.invalid) { return; }
    this._store.dispatch(ui.isLoading())


    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () =>{
    //     Swal.showLoading()
    //   }
    // });
    const {correo, password} = this.loginForm.value;
    this._authService.loginUser(correo, password)
        .then(credential =>{
          // console.log(credential);
          this._store.dispatch(ui.stopLoading());
          // Swal.close();
          this.router.navigate(['/'])
        })
        .catch(error =>{ 
          this._store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
        });
    // console.log(this.loginForm.value)
  }

}
