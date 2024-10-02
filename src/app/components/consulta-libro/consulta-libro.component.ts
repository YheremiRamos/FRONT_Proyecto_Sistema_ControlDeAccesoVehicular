import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../services/util.service';

import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Editorial } from '../../models/editorial.model';
import { Usuario } from '../../models/usuario.model';
import { LibroService } from '../../services/libro.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-libro',
  templateUrl: './consulta-libro.component.html',
  styleUrls: ['./consulta-libro.component.css']
})
export class ConsultaLibroComponent {

  //Grila 
  dataSource:any; 

  //Clase para la paginacion 
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator; 

  //Cabecera 
  displayedColumns = ["idLibro","titulo","anio","serie","categoriaLibro","tipoLibro", "editorial", "estadoPrestamo", "estado"];

  //Listas para llenar los comboBox
  listaCategoria : DataCatalogo[] = [];
  listaEstadoPrestamo : DataCatalogo[] = [];
  listaTipo : DataCatalogo[] = [];
  listaEditorial : Editorial[] = [];
  objUsuario : Usuario = {};
  
  
  //Para los filtros - Inicializar los campos con valores por defecto 
  varTitulo : string = "";
  varAnio : number = -1;
  varSerie : string = "";
  varFechaRegDesde : Date = new Date(1990, 0, 1);
  varFechaRegHasta : Date = new Date();
  varEstado : boolean = true;
  varIdCategoria : number = -1;
  varIdEstadoPrestamo : number = -1;
  varIdTipo : number = -1;
  varIdEditorial : number = -1;

  //Constructor
  constructor(private utilService : UtilService,
              private libroService : LibroService
  ) { }

  //Método que se ejecuta después de ejecutarse el Constructor - Llenar comboBox
  ngOnInit() {
    this.utilService.listaCategoriaDeLibro().subscribe(x =>  this.listaCategoria = x ); 
    this.utilService.listaEstadoLibro().subscribe(x => this.listaEstadoPrestamo = x);
    this.utilService.listaTipoLibroRevista().subscribe(x => this.listaTipo = x);
    this.utilService.listaEditorial().subscribe(x => this.listaEditorial = x);
  }

  //Consulta
  filtrar(){
      console.log(">>> Filtrar [inicio]"); 
      console.log(">>> varTitulo: "+this.varTitulo); 
      console.log(">>> varAnio: "+this.varAnio); 
      console.log(">>> varSerie: "+this.varSerie); 
      console.log(">>> varFechaRegDesde: "+this.varFechaRegDesde.toISOString()); //toISOString Traduce el formato de la fecha al formato yyyy-MM-dd 
      console.log(">>> varFechaRegHasta: "+this.varFechaRegHasta.toISOString());
      console.log(">>> varEstado: "+this.varEstado); 
      console.log(">>> varIdCategoria: "+this.varIdCategoria);
      console.log(">>> varIdEstadoPrestamo: "+this.varIdEstadoPrestamo);
      console.log(">>> varIdTipo: "+this.varIdTipo);
      console.log(">>> varIdEditorial: "+this.varIdEditorial);

        this.libroService.consultaComplejaLibroParametros( 
          this.varTitulo,  
          this.varAnio,  
          this.varSerie,  
          this.varFechaRegDesde.toISOString(),  
          this.varFechaRegHasta.toISOString(),  
          this.varEstado ? 1 : 0,  
          this.varIdCategoria,
          this.varIdEstadoPrestamo,
          this.varIdTipo,
          this.varIdEditorial
            ).subscribe( x => { 
                  this.dataSource = x; 
                  this.dataSource.paginator = this.paginator; 
              }); 

      console.log(">>> Filtrar [fin]"); 
  }

  //Reporte EXCEL
    exportarExcel() {
      console.log(">>> Filtrar [inicio]"); 
        console.log(">>> varTitulo: "+this.varTitulo); 
        console.log(">>> varAnio: "+this.varAnio); 
        console.log(">>> varSerie: "+this.varSerie); 
        console.log(">>> varFechaRegDesde: "+this.varFechaRegDesde.toISOString()); //toISOString Traduce el formato de la fecha al formato yyyy-MM-dd 
        console.log(">>> varFechaRegHasta: "+this.varFechaRegHasta.toISOString());
        console.log(">>> varEstado: "+this.varEstado); 
        console.log(">>> varIdCategoria: "+this.varIdCategoria);
        console.log(">>> varIdEstadoPrestamo: "+this.varIdEstadoPrestamo);
        console.log(">>> varIdTipo: "+this.varIdTipo);
        console.log(">>> varIdEditorial: "+this.varIdEditorial);
  
      this.libroService.reporteComplejoLibroExcel( 
                    this.varTitulo,  
                    this.varAnio,  
                    this.varSerie,  
                    this.varFechaRegDesde.toISOString(),  
                    this.varFechaRegHasta.toISOString(),  
                    this.varEstado ? 1 : 0,  
                    this.varIdCategoria,
                    this.varIdEstadoPrestamo,
                    this.varIdTipo,
                    this.varIdEditorial).subscribe(
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
    }

    //Reporte PDF
    exportarPDF() {
      console.log(">>> Filtrar [inicio]"); 
        console.log(">>> varTitulo: "+this.varTitulo); 
        console.log(">>> varAnio: "+this.varAnio); 
        console.log(">>> varSerie: "+this.varSerie); 
        console.log(">>> varFechaRegDesde: "+this.varFechaRegDesde.toISOString()); //toISOString Traduce el formato de la fecha al formato yyyy-MM-dd 
        console.log(">>> varFechaRegHasta: "+this.varFechaRegHasta.toISOString());
        console.log(">>> varEstado: "+this.varEstado); 
        console.log(">>> varIdCategoria: "+this.varIdCategoria);
        console.log(">>> varIdEstadoPrestamo: "+this.varIdEstadoPrestamo);
        console.log(">>> varIdTipo: "+this.varIdTipo);
        console.log(">>> varIdEditorial: "+this.varIdEditorial);
  
      this.libroService.reporteComplejoLibroPDF( 
                    this.varTitulo,  
                    this.varAnio,  
                    this.varSerie,  
                    this.varFechaRegDesde.toISOString(),  
                    this.varFechaRegHasta.toISOString(),  
                    this.varEstado ? 1 : 0,  
                    this.varIdCategoria,
                    this.varIdEstadoPrestamo,
                    this.varIdTipo,
                    this.varIdEditorial).subscribe(
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
    }

    
}
