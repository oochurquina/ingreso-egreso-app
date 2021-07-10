import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  formRegister: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription
  constructor(private _fb: FormBuilder,
              private _authService: AuthService,
              private _router: Router,
              private _store: Store<AppState>) { }

  ngOnInit(): void {
    this.formRegister = this._fb.group({
        nombre  :['', Validators.required],
        correo  :['', [Validators.required, Validators.email]],
        password:['', Validators.required],
    });
    this.uiSubscription = this._store.select('ui')
        .subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    
    if ( this.formRegister.invalid ) { return;}

    // Swal.fire({
    //   title: 'Espere por favor.',
    //   didOpen: ()=>{
    //     Swal.showLoading()
    //   }
    // });
    this._store.dispatch(ui.isLoading())
    const { nombre, correo, password } = this.formRegister.value;
    this._authService.createUser(nombre,correo,password)
      .then(credenciales =>{
        console.log(credenciales);
        // Swal.close();
        this._store.dispatch(ui.stopLoading());
        this._router.navigate(['/'])
      })
      .catch(error => {
        this._store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
    // console.log(this.formRegister.value);
  }

}
