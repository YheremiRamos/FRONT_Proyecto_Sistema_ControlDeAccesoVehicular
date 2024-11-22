import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { IndexComponent } from './index/index.component';
// import { AgregarSalidaComponent } from './components/agregarar-salida/agregar-salida.component';
import { AgregarIngresoComponent } from './components/agregar-ingreso/agregar-ingreso.component';
//import { CrudEspacioParqueoComponent } from './components/crud-EspacioParqueo/crud-EspacioParqueo.component';
import { AgregarParqueosComponent } from './components/crud-EspacioParqueo/crud-EspacioParqueo.component';
import { InfoProblemasIngresoComponent } from './components/info-problemas-ingreso/info-problemas-ingreso.component';
import { CrudUbicacionesComponent } from './components/crud-ubicaciones/crud-ubicaciones.component';


export const routes: Routes = [
    {path:"verRegistraIngreso", component:AgregarIngresoComponent },
    {path:"verEspacioParqueo", component:AgregarParqueosComponent },
    {path:"verCrudUbicacion", component:CrudUbicacionesComponent },

    // {path:"verRegistraSalida", component:AgregarSalidaComponent },

    {path:"verInfoProblemasIngreso", component:InfoProblemasIngresoComponent},
  
    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];
  
