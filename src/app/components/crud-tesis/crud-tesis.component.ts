import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Tesis } from '../../models/tesis.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrudTesisUpdateComponent } from '../crud-tesis-update/crud-tesis-update.component';
import Swal from 'sweetalert2';
import { CrudTesisAddComponent } from '../crud-tesis-add/crud-tesis-add.component';

import { Usuario } from '../../models/usuario.model';


import { TokenService } from '../../security/token.service';

import { TesisService } from '../../services/tesis.service';



@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-tesis',
  templateUrl: './crud-tesis.component.html',
  styleUrls: ['./crud-tesis.component.css']
})

export class CrudTesisComponent {

    //Grila
    dataSource:any;

    //Clase para la paginacion
    @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

    //Cabecera
    displayedColumns = ["idTesis","titulo","fechaCreacion","tema", "idioma", "centroEstudios","estado","acciones"];

    //filtro de la consulta
    filtro: string = "";

    objUsuario: Usuario = {} ;
    
    constructor(private dialogService: MatDialog, 
                private tesisService: TesisService,
                private tokenService: TokenService ){
      this.objUsuario.idUsuario = tokenService.getUserId();
    }

    openAddDialog(){
      console.log(">>> openAddDialog [ini]");
      const dialogo = this.dialogService.open(CrudTesisAddComponent);
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

  openUpdateDialog(obj:Tesis){
      console.log(">>> openUpdateDialog [ini]");
      const dialogo = this.dialogService.open(CrudTesisUpdateComponent, {data:obj});
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
      this.tesisService.consultarCrud(msgFiltro).subscribe(
            x => {
              this.dataSource = new MatTableDataSource<Tesis>(x);
              this.dataSource.paginator = this.paginator
            }
      );

      console.log(">>> refreshTable [fin]");
  }


  limitarTexto(event: any) {
    const limite = 90; // Límite de letras permitidas
    const valor = event.target.value;
    
    if (valor.length > limite) {
        // Si la longitud del texto supera el límite, lo cortamos
        const textoLimitado = valor.slice(0, limite);
        event.target.value = textoLimitado;
        this.filtro = textoLimitado;
    }
}


    actualizaEstado(obj : Tesis){
      console.log(">>> actualizaEstado [ ini ]");
  
      obj.estado =  obj.estado == 1 ? 0 : 1;
      obj.usuarioActualiza =  this.objUsuario;
      this.tesisService.actualizarCrud(obj).subscribe();
  
      console.log(">>> actualizaEstado [ fin ]");
    }

    elimina(obj:Tesis){
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
                this.tesisService.eliminarCrud(obj.idTesis || 0).subscribe(
                      x => {
                            this.refreshTable();
                            Swal.fire('Mensaje', x.mensaje, 'info');
                      }
                );
            }
      })   
}

}
