import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';

import {ChartType} from 'chart.js';
import {MultiDataSet, Label} from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {
  ingresos : number = 0;
  egresos : number = 0;

  totalEgresos: number = 0;
  totalIngresos : number = 0;

  public doughnutChartLabels: Label[] = ['Egresos', 'Ingresos'];
  public doughnutChartData: MultiDataSet = [
    [],
  ];
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private _store: Store<AppState>) { }

  ngOnInit(): void {

    this._store.select('ingresosEgresos')
        .subscribe(({items})=> this.generarEstadistica(items))
  }
  generarEstadistica(items: IngresoEgreso[]){
    this.ingresos  = 0;
    this.egresos  = 0;
  
    this.totalEgresos = 0;
    this.totalIngresos = 0;
   
    items.map(item=>{
      if (item.tipo==='ingreso'){
        this.totalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    });
     this.doughnutChartData = [[this.totalEgresos, this.totalIngresos]];

  }
}


