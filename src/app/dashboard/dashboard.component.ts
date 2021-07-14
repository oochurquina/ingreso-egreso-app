import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingEgrSubs: Subscription

  constructor(private _store: Store<AppState>,
              private _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubs = this._store.select('user')
        .pipe(
          filter(auth => auth.user !=null)
        )
        .subscribe(({user})=> {
          // console.log(user);
          this.ingEgrSubs = this._ingresoEgresoService.initIngresosEgresos(user.uid)
            .subscribe( ingresosEgresosFB =>{
              // console.log(ingresosEgresosFB);
              this._store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB}))
            })
        });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ingEgrSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }

}
