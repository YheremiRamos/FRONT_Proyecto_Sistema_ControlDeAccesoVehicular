import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatDialog } from '@angular/material/dialog';
import { CrudEditorialAddComponent } from '../crud-editorial-add/crud-editorial-add.component';
import { EditorialService } from '../../services/editorial.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Editorial } from '../../models/editorial.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrudEditorialUpdateComponent } from '../crud-editorial-update/crud-editorial-update.component';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-editorial',
  templateUrl: './crud-editorial.component.html',
  styleUrls: ['./crud-editorial.component.css']
})
export class CrudEditorialComponent {
  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idEditorial","razonSocial","direccion","ruc","gerente","fechaCreacion","pais","estado", "acciones"];

  //filtro de la consulta
  filtro: string = "";

  objUsuario: Usuario = {} ;
  
  constructor(private dialogService: MatDialog, 
              private editorialService: EditorialService,
              private tokenService: TokenService ){
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  openAddDialog(){
        console.log(">>> openAddDialog [ini]");
        const dialogo = this.dialogService.open(CrudEditorialAddComponent);
        dialogo.afterClosed().subscribe(
              x => {
                   console.log(">>> x >> "  +  x); 
                   if (x === 1){
                      this.refreshTable();
                   }
              }
        );
        console.log(">>> openAddDialog [fin]");
    }

  openUpdateDialog(obj:Editorial){
      console.log(">>> openUpdateDialog [ini]");
      const dialogo = this.dialogService.open(CrudEditorialUpdateComponent, {data:obj});
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


  refreshTable(){
      console.log(">>> refreshTable [ini]");
      var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
      this.editorialService.consultarCrud(msgFiltro).subscribe(
            x => {
              this.dataSource = new MatTableDataSource<Editorial>(x);
              this.dataSource.paginator = this.paginator
            }
      );

      console.log(">>> refreshTable [fin]");
  }


  actualizaEstado(obj : Editorial){
    console.log(">>> actualizaEstado [ ini ]");

    obj.estado =  obj.estado == 1 ? 0 : 1;
    obj.usuarioActualiza =  this.objUsuario;
    this.editorialService.actualizarCrud(obj).subscribe();

    console.log(">>> actualizaEstado [ fin ]");
  }

  elimina(obj:Editorial){
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
              this.editorialService.eliminarCrud(obj.idEditorial || 0).subscribe(
                    x => {
                          this.refreshTable();
                          Swal.fire('Mensaje', x.mensaje, 'info');
                    }
              );
          }
    })   
  }
}
