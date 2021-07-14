import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  usuarioActivo: Usuario ;
  userSubs : Subscription;

 
  constructor(private _authService: AuthService,
              private _router: Router,
              private _store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubs =this._store.select('user')
        .pipe(
          filter(({user})=> user!=null)
        )
        .subscribe( ({user}) =>{
          this.usuarioActivo = user
        })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSubs.unsubscribe();
  }
  logout(){
    this._authService.logout()
      .then( () =>{
         this._router.navigate(['/login']);
      })
      
  }

}
