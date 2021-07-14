import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from '../shared/ui.actions';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(private _fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private _store: Store<AppState>) { }

  ngOnInit(): void {
    this.loadingSubs = this._store.select('ui').subscribe(({isLoading}) => this.cargando = isLoading)

    this.ingresoForm = this._fb.group({
      descripcion: ['Comer', Validators.required],
      monto      : [0, Validators.required],

    })
  }
  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }
  guardar(){
    
    if (this.ingresoForm.invalid){ return;}
    this._store.dispatch(ui.isLoading());
    // console.log('guardar', this.ingresoForm.value);
    // console.log(this.tipo);
    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(()=>{
        this.ingresoForm.reset();
        this._store.dispatch(ui.stopLoading());
        Swal.fire('Registro creado',descripcion, 'success' );
      })
      .catch(err=> { 
        this._store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message,'error')
      })
  }

}
