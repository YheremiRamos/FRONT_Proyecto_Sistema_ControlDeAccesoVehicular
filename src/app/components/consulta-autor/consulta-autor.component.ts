import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { AutorService } from '../../services/autor.service';
import { Usuario } from '../../models/usuario.model';
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-autor',
  templateUrl: './consulta-autor.component.html',
  styleUrls: ['./consulta-autor.component.css']
})
export class ConsultaAutorComponent implements OnInit {

  // Grilla
  dataSource: any;

  // Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Cabecera
  displayedColumns = ["idAutor", "nombres", "apellidos", "fechaNacimiento","estado", "telefono", "celular", "orcid", "pais", "grado"];

  // ArrayList para País y Tipo-  para los combobox
  lstPais: Pais[] = [];
  lstGrado: DataCatalogo[] = []; // Cambiado a lstGrado para los grados académicos
  objUsuario : Usuario = {};
  // Para los filtros - Inicializar los campos con valores por defecto
  varNombres: string = "";
  varApellidos: string = "";

  varFecNacDesde: Date = new Date(1900, 0, 1); // 1 de enero de 1900
  varFecNacHasta: Date = new Date();
  varTelefono: string = "";
  varCelular: string = "";
  varOrcid: string = "";
  varEstado: boolean = true;
  varIdPais: number = -1;
  varGrado: number = -1; // Cambiado a varGrado para el id del grado académico

  // Constructor
  constructor(
    private utilService: UtilService,
    private autorService: AutorService // Cambiado a servicio de autor
  ) { }

  // Método que se ejecuta después de ejecutarse el Constructor
  ngOnInit() {
    this.utilService.listaGradoAutor().subscribe( // Cambiado a listaGradosAcademicos
      x => this.lstGrado = x
    );
    this.utilService.listaPais().subscribe(
      x => this.lstPais = x
    );
  }

  //--------
 
  //------

  // Método para filtrar
  filtrar() {
    console.log(">>> Filtrar [inicio]"); 
    console.log(">>> varNombres: "+this.varNombres); 
    console.log(">>> varApellidos: "+this.varApellidos); 
    console.log(">>> varFecNacDesde: "+this.varFecNacDesde.toISOString()); 
    console.log(">>> varFecNacHasta: "+this.varFecNacHasta.toISOString());
    console.log(">>> varTelefono: "+this.varTelefono); 
    console.log(">>> varCelular: "+this.varCelular);
    console.log(">>> varOrcid: "+this.varOrcid); 
    console.log(">>> varEstado: "+this.varEstado); 
    console.log(">>> varIdPais: "+this.varIdPais); 
    console.log(">>> varGrado: "+this.varGrado);
    
  
    this.autorService.consultarAutorComplejo(
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
      x => {
            this.dataSource = x;
            this.dataSource.paginator = this.paginator;
      }
);
console.log(">>> Filtrar [fin]"); 

  }
  

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
}

  // Exportar Excel
  exportarExcel() {
    console.log(">>> Filtrar [inicio]"); 
    console.log(">>> varNombres: "+this.varNombres); 
    console.log(">>> varApellidos: "+this.varApellidos); 
    console.log(">>> varFecNacDesde: "+this.varFecNacDesde.toISOString()); 
    console.log(">>> varFecNacHasta: "+this.varFecNacHasta.toISOString());
    console.log(">>> varTelefono: "+this.varTelefono); 
    console.log(">>> varCelular: "+this.varCelular);
    console.log(">>> varOrcid: "+this.varOrcid); 
    console.log(">>> varEstado: "+this.varEstado ); 
    console.log(">>> varIdPais: "+this.varIdPais); 
    console.log(">>> varGrado: "+this.varGrado);

    this.autorService.generateAutorReportExcel(
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
      }
    );
  }

}
