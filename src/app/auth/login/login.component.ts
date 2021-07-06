import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  constructor( private _fb: FormBuilder,
               private _authService: AuthService,
               public router: Router) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      correo: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required]
    })
  }

  login(){

    if (this.loginForm.invalid) { return; }
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () =>{
        Swal.showLoading()
      }
    });
    const {correo, password} = this.loginForm.value;
    this._authService.loginUser(correo, password)
        .then(credential =>{
          console.log(credential)
          Swal.close();
          this.router.navigate(['/'])
        })
        .catch(error => Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        }));
    // console.log(this.loginForm.value)
  }

}
