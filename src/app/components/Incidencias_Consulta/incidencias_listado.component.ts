// crud-EspacioParqueo.component.ts
import { Component, OnInit,ViewChild  } from '@angular/core';
import { incidenciasService } from '../../services/incidencias.service'; 
import { clienteService } from '../../services/cliente.service'; 

import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule], 
  templateUrl: './incidencias_listado.component.html',
  styleUrls: ['./incidencias_listado.component.css']
})

export class incidenciasComponent implements OnInit {
  
  espacioParqueoForm!: FormGroup;

  showForm: boolean = false;  // Variable para mostrar/ocultar el formulario
  filtro: string = ''; // Para el filtro de búsqueda
  displayedColumns: string[] = ['idCliente', 'nombres', 'apellidos', 'identificador', 'telefono', 'numIncidencias', 'exportar'];
  dataSource = new MatTableDataSource<any>([]);



    

  constructor(
    private fb: FormBuilder,
    private dialogService: MatDialog,
    private incidenciasService: incidenciasService,
    private clienteService: clienteService

  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarTodosClientes();
  }

  // Inicializa el formulario para registrar o editar los espacios de parqueo
  inicializarFormulario(): void {
    this.espacioParqueoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      estado: [true] // Por defecto, activo
    });
  }

  
  // Función para cerrar el formulario
  closeForm(): void {
    this.showForm = false; // Oculta el formulario
  }



  // Función para cargar los espacios de parqueo
  cargarTodosClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los espacios de parqueo.', 'error');
      }
    });
  }

 

  // Función para filtrar la tabla
  refreshTable(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}



// Para los filtros - Inicializar los campos con valores por defecto
varNombres: string = "";
varApellidos: string = "";
VarIdentificador: string = ""

// Método para filtrar
filtrar() {
  console.log(">>> Filtrar [inicio]"); 
  console.log(">>> varNombre: "+this.varNombres );
  console.log(">>> varApellidos: "+this.varApellidos);
  console.log(">>> varIdentificador: "+this.VarIdentificador); 


  this.clienteService.consultarClienteComplejo(
    this.varNombres,
    this.varApellidos,
    this.VarIdentificador
 
  ).subscribe(
    x => {
          this.dataSource = x;
          this.dataSource.paginator = this.paginator;
    }
);
console.log(">>> Filtrar [fin]"); 

}

/*
// Exportar PDF
exportarPDF() {
 
  this.autorService.generateAutorReportPDF(
    this.varNombres,
    this.varApellidos,
    this.varFecNacDesde.toISOString(),
    this.varFecNacHasta.toISOString(),
    this.varTelefono,
    this.varCelular,
    this.varOrcid,
    this.varEstado ? 1 : 0,
    this.varIdPais,
    this.varGrado
  ).subscribe(
    response => {
      console.log(response);
      var url = window.URL.createObjectURL(response.data);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.setAttribute('target', 'blank');
      a.href = url;
      a.download = response.filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
  }); 
}*/
}