import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { salidaVehicularService } from '../../services/salidaVehicular.service';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MenuComponent } from '../../menu/menu.component';
import { MatCommonModule } from '@angular/material/core';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AccesoVehicular } from '../../models/accesoVehicular.model';

@Component({
  selector: 'app-add-salida-vehicular',
  templateUrl: './add-salida-vehicular.component.html',
  standalone: true,
  imports: [AppMaterialModule,
    CommonModule, FormsModule, MatCommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule], 
  styleUrls: ['./add-salida-vehicular.component.css'],
})
export class AddSalidaVehicularComponent {

  displayedColumns: string[] = [
    'idAccesoVehicular',
    'nombreCompleto',
    'tipoVehiculoPermitido',
    'placaVehiculo',
    'fechaRegistro',
    'fechaActualizacion',
    'numIncidencias',
    'accionIncidencia',
  ];

  dataSource = new MatTableDataSource<any>(); // Cambiado para recibir cualquier objeto

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  objUsuario: Usuario = {};


  constructor(
    private salidaVehicularService: salidaVehicularService,
    private tokenService: TokenService,
  ) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  ngOnInit(): void {
    // this.loadWatsonAssistant();
    this.cargarDatos();

  }

  registrarIncidencia(idAccesoVehicular: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas registrar la incidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salidaVehicularService.registrarIncidencia(idAccesoVehicular).subscribe({
          next: (response) => {

          




            console.log('Incidencia registrada con éxito:', response);
            this.cargarDatos(); // Recarga los datos de la tabla para actualizar la vista
            Swal.fire('Registrado!', 'La incidencia ha sido registrada.', 'success');
          },
          error: (err) => {
            console.error('Error al registrar la incidencia:', err);
            Swal.fire('Error', 'Hubo un problema al registrar la incidencia', 'error');
          },
        });
      }
    });
  }
  

  registrarSalida(idAccesoVehicular: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas registrar la salida?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salidaVehicularService.registrarSalida(idAccesoVehicular).subscribe({
          next: (response) => {
            console.log('Salida registrada con éxito:', response);
            this.cargarDatos();
            Swal.fire('Registrado!', 'La salida ha sido registrada.', 'success');
          },
          error: (err) => {
            console.error('Error al registrar la salida:', err);
            Swal.fire('Error', 'Hubo un problema al registrar la salida', 'error');
          },
        });
      }
    });
  }
  
  


  cargarDatos() {
    this.salidaVehicularService.listarSalidaVehicular().subscribe({
      next: (data) => {
        const formattedData = data.map((item) => ({
          idAccesoVehicular: item[0],
          nombreCompleto: item[1],
          tipoVehiculoPermitido: item[2],
          placaVehiculo: item[3],
          fechaRegistro: new Date(item[4]),
          fechaActualizacion: item[5] ? new Date(item[5]) : null,
          numIncidencias: item[6],
        }));
  
        // Ordena los datos por ID
        formattedData.sort((a, b) => a.idAccesoVehicular - b.idAccesoVehicular);
  
        this.dataSource.data = formattedData;

        console.log(this.dataSource);


      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}