// app.material.module.ts
import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AppMaterialModule {}






// crud-EspacioParqueo.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspacioParqueoService } from '../../services/espacioParqueo.service'; 
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { EspacioParqueo } from '../../models/espacioParqueo';

@Component({
  selector: 'app-crud-espacio-parqueo',
  templateUrl: './crud-EspacioParqueo.component.html',
  styleUrls: ['./crud-EspacioParqueo.component.css']
})
export class CrudEspacioParqueoComponent implements OnInit {
  espacioParqueoForm!: FormGroup;
  showForm: boolean = false;  // Variable para mostrar/ocultar el formulario
  filtro: string = ''; // Para el filtro de búsqueda
  displayedColumns: string[] = ['idEspacio', 'nombre', 'descripcion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private fb: FormBuilder,
    private espacioParqueoService: EspacioParqueoService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEspaciosParqueo();
  }

  // Inicializa el formulario para registrar o editar los espacios de parqueo
  inicializarFormulario(): void {
    this.espacioParqueoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      estado: [true] // Por defecto, activo
    });
  }

  // Función para abrir el formulario de registro
  openAddDialog(): void {
    this.showForm = true; // Muestra el formulario
  }

  // Función para cerrar el formulario
  closeForm(): void {
    this.showForm = false; // Oculta el formulario
  }

  // Función para enviar el formulario
  onSubmit(): void {
    if (this.espacioParqueoForm.valid) {
      const nuevoEspacio = this.espacioParqueoForm.value;
      console.log('Formulario enviado', nuevoEspacio);
      this.closeForm(); // Cierra el formulario después de enviarlo
    }
  }

  // Función para cargar los espacios de parqueo
  cargarEspaciosParqueo(): void {
    this.espacioParqueoService.obtenerEspaciosParqueo(1).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los espacios de parqueo.', 'error');
      }
    });
  }

  // Función para eliminar un espacio de parqueo
  eliminarEspacioParqueo(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.espacioParqueoService.eliminarEspacioParqueo(id).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Espacio de parqueo eliminado correctamente.', 'success');
            this.cargarEspaciosParqueo(); // Recarga los espacios de parqueo
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el espacio de parqueo.', 'error')
        });
      }
    });
  }

  // Función para filtrar la tabla
  refreshTable(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }
}