import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './services/auth.guard';


const routes : Routes=[
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {
        path:'',
        // canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren:()=> import('./ingreso-egreso/ingreso-egreso.module')
                                .then(mod=>mod.IngresoEgresoModule)
    },
    // {
    //     path: '', 
    //     component: DashboardComponent,
    //     children: dashboardRoutes,
    //     canActivate:[AuthGuard]
    // },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule{

}