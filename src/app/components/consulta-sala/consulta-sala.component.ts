import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { SalaService } from '../../services/sala.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-sala',
  templateUrl: './consulta-sala.component.html',
  styleUrls: ['./consulta-sala.component.css']
})
export class ConsultaSalaComponent {

  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idSala","numero","piso","numAlumnos","recursos","estado","tipoSala","sede","estadoReserva"];

  //para los combobox
  lstTipo: DataCatalogo[] = [];
  lstSede: DataCatalogo[] = [];
  lstEstado: DataCatalogo[] = [];

  //para los filtros
  varNumero: string = "";
  varPiso: number = 0;
  varNumAlumnos: number = 0;
  varRecursos: string = "";
  varEstado: boolean = false;
  varIdTipoSala: number = -1;
  varIdSede: number = -1;
  varIdEstadoSala: number = -1;

  varPisoInput: string = ""; 
  varNumAlumnosInput: string = "";

  constructor(private utilService:UtilService, private salaService:SalaService) { }

  ngOnInit() {
    this.utilService.listaTipoSala().subscribe(
      x =>  this.lstTipo = x
    );
    this.utilService.listaSede().subscribe(
      x =>  this.lstSede = x
    ); 
    this.utilService.listaEstadoSala().subscribe(
      x =>  this.lstEstado = x
    ); 
  }

  filtrar(){
    console.log(">>> Filtrar [ini]");
    console.log(">>> varNumero: "+this.varNumero);
    console.log(">>> varPiso: "+this.varPiso);
    console.log(">>> varNumAlumnos: "+this.varNumAlumnos);
    console.log(">>> varRecursos: "+this.varRecursos);
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varIdTipoSala: "+this.varIdTipoSala);
    console.log(">>> varIdSede: "+this.varIdSede);
    console.log(">>> varIdEstadoSala: "+this.varIdEstadoSala);

    this.varPiso = this.varPisoInput === "" ? -1 : parseInt(this.varPisoInput, 10);
    this.varNumAlumnos = this.varNumAlumnosInput === "" ? -1 : parseInt(this.varNumAlumnosInput, 10);

    this.salaService.consultarSalaComplejo(
                this.varNumero, 
                this.varPiso, 
                this.varNumAlumnos, 
                this.varRecursos, 
                this.varEstado ? 1 : 0, 
                this.varIdTipoSala, 
                this.varIdSede,
                this.varIdEstadoSala).subscribe(
          x => {
                this.dataSource = x;
                this.dataSource.paginator = this.paginator;
          }
    );
    console.log(">>> Filtrar [fin]");
}

  exportarPDF() {
    this.salaService.generateDocumentReport( 
          this.varNumero, 
          this.varPiso, 
          this.varNumAlumnos, 
          this.varRecursos, 
          this.varEstado ? 1 : 0, 
          this.varIdTipoSala, 
          this.varIdSede,
          this.varIdEstadoSala).subscribe(
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

  exportarExcel() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varNumero: "+this.varNumero);
    console.log(">>> varPiso: "+this.varPiso);
    console.log(">>> varNumAlumnos: "+this.varNumAlumnos);
    console.log(">>> varRecursos: "+this.varRecursos);
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varIdTipoSala: "+this.varIdTipoSala);
    console.log(">>> varIdSede: "+this.varIdSede);
    console.log(">>> varIdEstadoSala: "+this.varIdEstadoSala);
    
  this.salaService.generateDocumentExcel( 
    this.varNumero, 
    this.varPiso, 
    this.varNumAlumnos, 
    this.varRecursos, 
    this.varEstado ? 1 : 0, 
    this.varIdTipoSala, 
    this.varIdSede,
    this.varIdEstadoSala).subscribe(
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
