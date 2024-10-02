import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoService } from '../../services/alumno.service';
import { TokenService } from '../../security/token.service';
import { Alumno } from '../../models/alumno.model';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CrudAlumnoAddComponent } from '../crud-alumno-add/crud-alumno-add.component';
import { CrudAlumnoUpdateComponent } from '../crud-alumno-update/crud-alumno-update.component';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-alumno',
  templateUrl: './crud-alumno.component.html',
  styleUrls: ['./crud-alumno.component.css']
})

export class CrudAlumnoComponent {
  //Grila
  dataSource: any;

  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ['idAlumno', 'nombresApellidos', 'telefono', 'celular', 'dni', 'correo', 'tipoSangre', 'fechaNacimiento', 'pais', 'modalidad', 'estado', 'acciones'];

    //filtro de la consulta
    filtro: string = "";

    objUsuario: Usuario = {} ;

  constructor(private dialogService: MatDialog,
    private alumnoService: AlumnoService,
    private tokenservice: TokenService
  ){
      this.objUsuario.idUsuario=tokenservice.getUserId();
   }

  ngOnInit(): void {
  }

  actualizaEstado(obj : Alumno){
    console.log(">>> actualizaEstado [ ini ]");

    obj.estado =  obj.estado == 1 ? 0 : 1;
    obj.usuarioActualiza =  this.objUsuario;
    this.alumnoService.actualizarCrud(obj).subscribe();

    console.log(">>> actualizaEstado [ fin ]");
  }
  
  refreshTable() {
    console.log(">>> refreshTable [ini]");
    var msgFiltro = this.filtro == "" ? "todos" : this.filtro;
    this.alumnoService.consultarCrud(msgFiltro).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<Alumno>(x);
        this.dataSource.paginator = this.paginator
      }
    );

    console.log(">>> refreshTable [fin]");
  }

  openDialog() {
    console.log(">>> openDialog  [ini]");
    const dialog = this.dialogService.open(CrudAlumnoAddComponent);
    dialog.afterClosed().subscribe(
      x => {
        if (x == 1) {
          this.refreshTable();
        }
      }
    );

    console.log(">>> openDialog  [fin]");
  }

  openUpdateDialog(obj:Alumno){
    console.log(">>> openUpdateDialog [ini]");
    const dialogo = this.dialogService.open(CrudAlumnoUpdateComponent, {data:obj});
    dialogo.afterClosed().subscribe(
          x => {
              console.log(">>> x >> "  +  x); 
              if (x === 1){
                  this.refreshTable();
              }
          }
    );
    console.log(">>> openUpdateDialog [fin]");
}

elimina(obj: Alumno) {
  Swal.fire({
    title: '¿Desea eliminar?',
    text: "Los cambios no se van a revertir",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, elimina',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.alumnoService.eliminarCrud(obj.idAlumno || 0).subscribe(
        x => {
          this.refreshTable();
          Swal.fire('Mensaje', x.mensaje, 'info');
        },
        error => {
          console.error('Error eliminando alumno:', error);
          Swal.fire('Error', 'No se pudo eliminar el alumno', 'error');
        }
      );
    }
  });
}

}
