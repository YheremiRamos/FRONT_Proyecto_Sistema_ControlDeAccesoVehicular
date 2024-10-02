import { Component, OnInit , ViewChild} from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../services/util.service';
import { Pais } from '../../models/pais.model';
import { EditorialService } from '../../services/editorial.service';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-editorial',
  templateUrl: './consulta-editorial.component.html',
  styleUrls: ['./consulta-editorial.component.css']
})
export class ConsultaEditorialComponent {

  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idEditorial","razonSocial","direccion","ruc","gerente","fechaCreacion","pais", "estado"];


  //para los combobox
  lstPais: Pais[] = [];

  //para los filtros
  varRazonSocial: string = "";
  varDireccion: string = "";
  varRuc: string = "";
  varGerente: string = "";
  varEstado: boolean = false;
  varFechaCreacionDesde: Date = new Date();
  varFechaCreacionHasta: Date = new Date();
  varIdPais: number = -1;
 

  constructor(private utilService:UtilService, private editorialService:EditorialService) { }

  ngOnInit() {
        this.utilService.listaPais().subscribe(
          x =>  this.lstPais = x
        ); 
  }

  filtrar(){
    console.log(">>> Filtrar [ini]");
    console.log(">>> varRazonSocial: "+this.varRazonSocial);
    console.log(">>> varDireccion: "+this.varDireccion);
    console.log(">>> varRuc: "+this.varRuc);
    console.log(">>> varGerente: "+this.varGerente);
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varFechaCreacionDesde: "+this.varFechaCreacionDesde.toISOString());
    console.log(">>> varFechaCreacionHasta: "+this.varFechaCreacionHasta.toISOString());
    console.log(">>> varIdPais: "+this.varIdPais);

    this.editorialService.consultarRevistaComplejo(
                this.varRazonSocial, 
                this.varDireccion, 
                this.varRuc, 
                this.varGerente,
                this.varFechaCreacionDesde.toISOString(), 
                this.varFechaCreacionHasta.toISOString(), 
                this.varEstado ? 1 : 0, 
                this.varIdPais).subscribe(
          x => {
                this.dataSource = x;
                this.dataSource.paginator = this.paginator;
          }
    );
    console.log(">>> Filtrar [fin]");
}

exportarPDF() {

this.editorialService.generateDocumentReport( 
                this.varRazonSocial, 
                this.varDireccion, 
                this.varRuc, 
                this.varGerente,
                this.varFechaCreacionDesde.toISOString(), 
                this.varFechaCreacionHasta.toISOString(), 
                this.varEstado ? 1 : 0, 
                this.varIdPais).subscribe(
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
    console.log(">>> varRazonSocial: "+this.varRazonSocial);
    console.log(">>> varDireccion: "+this.varDireccion);
    console.log(">>> varRuc: "+this.varRuc);
    console.log(">>> varGerente: "+this.varGerente);
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varFechaCreacionDesde: "+this.varFechaCreacionDesde.toISOString());
    console.log(">>> varFechaCreacionHasta: "+this.varFechaCreacionHasta.toISOString());
    console.log(">>> varIdPais: "+this.varIdPais);
    
this.editorialService.generateDocumentExcel( 
                this.varRazonSocial, 
                this.varDireccion, 
                this.varRuc, 
                this.varGerente,
                this.varFechaCreacionDesde.toISOString(), 
                this.varFechaCreacionHasta.toISOString(), 
                this.varEstado ? 1 : 0, 
                this.varIdPais).subscribe(
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
