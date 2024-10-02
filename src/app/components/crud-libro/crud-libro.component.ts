import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Editorial } from '../../models/editorial.model';
import { Usuario } from '../../models/usuario.model';
import { Libro } from '../../models/libro.model';
import { UtilService } from '../../services/util.service';
import { LibroService } from '../../services/libro.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CrudLibroAddComponent } from '../crud-libro-add/crud-libro-add.component';
import { CrudLibroUpdateComponent } from '../crud-libro-update/crud-libro-update.component';
import { MatTableDataSource } from '@angular/material/table';
@Component({  
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-libro',
  templateUrl: './crud-libro.component.html',
  styleUrls: ['./crud-libro.component.css']
})


export class CrudLibroComponent{
  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idLibro","titulo","anio","serie","categoriaLibro","tipoLibro", "editorial", "estado", "acciones"];

  //filtro de la consulta
  filtro: string = "";


  objUsuario: Usuario  = {};


constructor(private dialogService: MatDialog,
            private libroService: LibroService,
            private tokenService: TokenService
) { 

  this.objUsuario.idUsuario = this.tokenService.getUserId();
  this.refrescarTable();
}


//Abrir Modal de REGISTRO
openRegistroDialog(){
  console.log(">>> openAddDialog [ini]");
  const dialogo = this.dialogService.open(CrudLibroAddComponent);
  dialogo.afterClosed().subscribe(
    x => {
      console.log(">>> x >> "  +  x); 
      if (x === 1){
         this.refrescarTable();
      }
    }
      );
      console.log(">>> openAddDialog [fin]");
}

//Abrir Modal de ACTUALIZACIÓN
openActualizacionDialog(obj:Libro){
  console.log(">>> openUpdateDialog [ini]");
  const dialogo = this.dialogService.open(CrudLibroUpdateComponent, {data:obj});
  dialogo.afterClosed().subscribe(
    x => {
      console.log(">>> x >> "  +  x); 
      if (x === 1){
         this.refrescarTable();
      }
    }
      );
      console.log(">>> openAddDialog [fin]");
}

//Refrescar tabla
refrescarTable(){
  console.log(">>> refreshTable [ini]");
  var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
  this.libroService.consultarCrudLibro(msgFiltro).subscribe(
        x => {
          this.dataSource = new MatTableDataSource<Libro>(x);
          this.dataSource.paginator = this.paginator
        }
  );

  console.log(">>> refreshTable [fin]");
}

//Actualizar ESTADO
actualizaEstado(obj : Libro){
  console.log(">>> actualizaEstado [ ini ]");

    obj.estado =  obj.estado == 1 ? 0 : 1;
    obj.usuarioActualiza =  this.objUsuario;
    this.libroService.actualizarCrudLibro(obj).subscribe();

    console.log(">>> actualizaEstado [ fin ]");
}


//Eliminar
elimina(obj:Libro){
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
            this.libroService.eliminarCrudLibro(obj.idLibro || 0).subscribe(
                  x => {
                        this.refrescarTable();
                        Swal.fire('Mensaje', x.mensaje, 'info');
                  }
            );
        }
  })   
}

}
