import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[]= [];
  ingEgrSubs : Subscription;

  constructor(private _store: Store<AppStateWithIngreso>,
              private _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {

    this.ingEgrSubs = this._store.select('ingresosEgresos')
      .subscribe(({items}) =>{
        this.ingresosEgresos = items;
      })
  }



  borrar(uid: string){
      this._ingresoEgresoService.borrarIngresoEgreso(uid)
          .then(()=> Swal.fire('Borrado', 'Itemm Borrado', 'success'))
          .catch(err=> Swal.fire('Error',err.message,'error'))
  }
  ngOnDestroy(){
    this.ingEgrSubs.unsubscribe();
  }
}
