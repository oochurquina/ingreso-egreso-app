import { Injectable } from '@angular/core';
import {  CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate , CanLoad{
  constructor(private _authService: AuthService,
              private _router: Router) {}


  canLoad(): Observable<boolean>{
    return this._authService.isAuth()
           .pipe(
             tap( estado => {
               if (!estado) { this._router.navigate(['/login'])}
             }),
             take(1)
           )
            
  }
  canActivate(): Observable<boolean>{
    return this._authService.isAuth()
           .pipe(
             tap( estado => {
               if (!estado) { this._router.navigate(['/login'])}
             })
           )
            
  }
  
}
