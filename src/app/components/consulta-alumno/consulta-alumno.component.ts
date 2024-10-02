import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],

  
  selector: 'app-consulta-alumno',
  templateUrl: './consulta-alumno.component.html',
  styleUrls: ['./consulta-alumno.component.css']
})
export class ConsultaAlumnoComponent {


  filtro: string = "";


    //Grilla 
    dataSource:any; 

    //Clase para la paginacion 
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    //Cabecera
    displayColumns = ["idAlumno","nombres","apellidos","telefono","celular","dni","correo","tipoSangre","fechaNacimiento","pais","modalidad","estado"];

    //para los combobox
    lstPais: Pais[] = [];
    lstModalidad: DataCatalogo[] = [];

    //Para los filtros 
    varNombres : string = "";
    varApellidos : string = "";
    varTelefono : string = "";
    varCelular : string = "";
    varDni : string = "";
    varCorreo : string = "";
    varTipoSangre : string = "";
    varEstado: boolean = true;
    varFecNacimientoDesde : Date = new Date("01/01/1990");
    varFecNacimientoHasta : Date = new Date();
    varIdPais : number = -1;
    varIdModalidad : number = -1;



  constructor(private utilService:UtilService, private alumnoService:AlumnoService) { }

  ngOnInit(): void {
      this.utilService.listaModalidadAlumno().subscribe(
        x =>  this.lstModalidad = x
      );

      this.utilService.listaPais().subscribe(
        x =>  this.lstPais = x
      ); 
  }


  filtrar(){
    console.log(">>> Filtrar EXCEL [ini]");
    console.log(">>> varNombres: "+this.varNombres);
    console.log(">>> varApellidos: "+this.varApellidos);
    console.log(">>> varTelefono: "+this.varTelefono);
    console.log(">>> varCelular: "+this.varCelular);
    console.log(">>> varDni: "+this.varDni);
    console.log(">>> varCorreo: "+this.varCorreo);
    console.log(">>> varTipoDeSangre: "+this.varTipoSangre);
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varFechaNacimientoDesde: "+this.varFecNacimientoDesde.toISOString());
    console.log(">>> varFechaNacimientoHasta: "+this.varFecNacimientoHasta.toISOString());
    console.log(">>> varIdPais: "+this.varIdPais);
    console.log(">>> varIdModalidad: "+this.varIdModalidad);

    this.alumnoService.consultaAlumnoCompleja(
      this.varNombres,
      this.varApellidos,
      this.varTelefono,
      this.varCelular,
      this.varDni,
      this.varCorreo,
      this.varTipoSangre,
      this.varEstado ? 1 : 0, 
      this.varFecNacimientoDesde.toISOString(),
      this.varFecNacimientoHasta.toISOString(),
      this.varIdPais,
      this.varIdModalidad
      ).subscribe(
        x => {
          this.dataSource = x;
          this.dataSource.paginator = this.paginator;
    }
      );
      console.log(">>> Filtrar [fin]");

  }

  
  exportarPDF() {
      console.log(">>> Filtrar PDF [ini]");
      console.log(">>> varNombres: "+this.varNombres);
      console.log(">>> varApellidos: "+this.varApellidos);
      console.log(">>> varTelefono: "+this.varTelefono);
      console.log(">>> varCelular: "+this.varCelular);
      console.log(">>> varDni: "+this.varDni);
      console.log(">>> varCorreo: "+this.varCorreo);
      console.log(">>> varTipoDeSangre: "+this.varTipoSangre);
      console.log(">>> varEstado: "+this.varEstado);
      console.log(">>> varFechaNacimientoDesde: "+this.varFecNacimientoDesde.toISOString());
      console.log(">>> varFechaNacimientoHasta: "+this.varFecNacimientoHasta.toISOString());
      console.log(">>> varIdPais: "+this.varIdPais);
      console.log(">>> varIdModalidad: "+this.varIdModalidad);
      this.alumnoService.generateDocumentReport(
        this.varNombres,
        this.varApellidos,
        this.varTelefono,
        this.varCelular,
        this.varDni,
        this.varCorreo,
        this.varTipoSangre,
        this.varEstado ? 1 : 0, 
        this.varFecNacimientoDesde.toISOString(),
        this.varFecNacimientoHasta.toISOString(),
        this.varIdPais,
        this.varIdModalidad
        ).subscribe(
          response =>  {
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


    exportarExcel(){
      console.log(">>> Filtrar [ini]");
      console.log(">>> varNombres: "+this.varNombres);
      console.log(">>> varApellidos: "+this.varApellidos);
      console.log(">>> varTelefono: "+this.varTelefono);
      console.log(">>> varCelular: "+this.varCelular);
      console.log(">>> varDni: "+this.varDni);
      console.log(">>> varCorreo: "+this.varCorreo);
      console.log(">>> varTipoDeSangre: "+this.varTipoSangre);
      console.log(">>> varEstado: "+this.varEstado);
      console.log(">>> varFechaNacimientoDesde: "+this.varFecNacimientoDesde.toISOString());
      console.log(">>> varFechaNacimientoHasta: "+this.varFecNacimientoHasta.toISOString());
      console.log(">>> varIdPais: "+this.varIdPais);
      console.log(">>> varIdModalidad: "+this.varIdModalidad);
      this.alumnoService.generarDocumentoExcel(
        this.varNombres,
        this.varApellidos,
        this.varTelefono,
        this.varCelular,
        this.varDni,
        this.varCorreo,
        this.varTipoSangre,
        this.varEstado ? 1 : 0, 
        this.varFecNacimientoDesde.toISOString(),
        this.varFecNacimientoHasta.toISOString(),
        this.varIdPais,
        this.varIdModalidad
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
          } );

    }


}
