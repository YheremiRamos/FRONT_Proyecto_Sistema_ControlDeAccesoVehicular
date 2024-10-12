import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { IndexComponent } from './index/index.component';

import { AgregarIngresoComponent } from './components/agregar-ingreso/agregar-ingreso.component';
import { InfoProblemasIngresoComponent } from './components/info-problemas-ingreso/info-problemas-ingreso.component';


export const routes: Routes = [
    {path:"verRegistroIngreso", component:AgregarIngresoComponent },
    {path:"verInfoProblemasIngreso", component:InfoProblemasIngresoComponent},
  
    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];
  
