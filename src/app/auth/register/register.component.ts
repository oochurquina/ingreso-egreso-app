import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup;
  constructor(private _fb: FormBuilder,
              private _authService: AuthService,
              private _router: Router) { }

  ngOnInit(): void {
    this.formRegister = this._fb.group({
        nombre  :['', Validators.required],
        correo  :['', [Validators.required, Validators.email]],
        password:['', Validators.required],
    })
  }

  crearUsuario(){
    
    if ( this.formRegister.invalid ) { return;}

    Swal.fire({
      title: 'Espere por favor.',
      didOpen: ()=>{
        Swal.showLoading()
      }
    })
    const { nombre, correo, password } = this.formRegister.value;
    this._authService.createUser(nombre,correo,password)
      .then(credenciales =>{
        console.log(credenciales);
        Swal.close();
        this._router.navigate(['/'])
      })
      .catch(error => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
    }));
    // console.log(this.formRegister.value);
  }

}
