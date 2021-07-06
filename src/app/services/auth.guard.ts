import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService,
              private _router: Router) {
    
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
