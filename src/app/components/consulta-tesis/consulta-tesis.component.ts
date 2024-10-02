import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';

import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Tesis } from '../../models/tesis.model';
import { TesisService } from '../../services/tesis.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Nueva importación

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-tesis',
  templateUrl: './consulta-tesis.component.html',
  styleUrls: ['./consulta-tesis.component.css']
})
export class ConsultaTesisComponent {

  filtro: string = "";
  // Grila
  dataSource = new MatTableDataSource<Tesis>([]);  // Inicializa correctamente el dataSource

  // Clase para la paginacion
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  // Añade la referencia a MatSort

  // Cabecera
  displayedColumns = ["idTesis","titulo","fechaCreacion","estado","tema","idioma","centroEstudios"];

  // Para los combobox
  lstTema: DataCatalogo[] = [];
  lstIdioma: DataCatalogo[] = [];
  lstCentroEstudios: DataCatalogo[] = [];

  // Para los filtros
  varTitulo: string = "";
  varFechaCreacionDesde: Date = new Date(1990,0,1);
  varFechaCreacionHasta: Date = new Date();
  varEstado: boolean = false;
  varIdTema: number = -1;
  varIdIdioma: number = -1;
  varIdCentroEstudios: number = -1;

  fechaCreacionDesdeError: string | null = null;
  fechaCreacionHastaError: string | null = null;
  minDate: Date = new Date(1975, 0, 1);
  hayActivos: boolean = false; // Bandera para indicar si hay registros activos después de filtrar

  constructor(private dialogService: MatDialog,
              private utilService: UtilService, 
              private tesisService: TesisService) { }

  ngOnInit() {
    this.utilService.listaTemaTesis().subscribe(
      x => this.lstTema = x
    );
    this.utilService.listaIdioma().subscribe(
      x => this.lstIdioma = x
    ); 
    this.utilService.listaCentroEstudios().subscribe(
      x => this.lstCentroEstudios = x
    ); 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Asocia el paginator
    this.dataSource.sort = this.sort;  // Asocia el sort
  }

  openAddDialog() {
    const dialogo = this.dialogService.open(ConsultaTesisComponent);
    dialogo.afterClosed().subscribe(
      x => {
        if (x === 1) {
          this.refreshTable();
        }
      }
    );
  }

  openUpdateDialog(obj: Tesis) {
    const dialogo = this.dialogService.open(ConsultaTesisComponent, { data: obj });
    dialogo.afterClosed().subscribe(
      x => {
        if (x === 1) {
          this.refreshTable();
        }
      }
    );
  }

  refreshTable() {
    this.tesisService.consultarCrud(this.filtro || "todos").subscribe(
      x => {
        this.dataSource.data = x;  // Asigna los datos a dataSource
        this.actualizarActivos(); // Actualiza la bandera de activos
        this.dataSource.paginator = this.paginator;  // Actualiza el paginator
        this.dataSource.sort = this.sort;  // Actualiza el sort
      }
    );
  }

  filtrar() {
    // Realizar validaciones antes de llamar al servicio

    if (!this.fechaCreacionDesdeError && !this.fechaCreacionHastaError) {
      this.tesisService.consultarTesisComplejo(
        this.varTitulo,
        this.varFechaCreacionDesde.toISOString(),
        this.varFechaCreacionHasta.toISOString(),
        this.varEstado ? 1 : 0,
        this.varIdTema,
        this.varIdIdioma,
        this.varIdCentroEstudios
      ).subscribe(x => {
        this.dataSource.data = x;
        this.actualizarActivos(); // Actualiza la bandera de activos
        this.dataSource.paginator = this.paginator;
      });
    } 
  }

  exportarPDF() {
    this.tesisService.generateDocumentReport( 
      this.varTitulo, 
      this.varFechaCreacionDesde.toISOString(), 
      this.varFechaCreacionHasta.toISOString(), 
      this.varEstado ? 1 : 0, 
      this.varIdTema,
      this.varIdIdioma,
      this.varIdCentroEstudios).subscribe(
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
    console.log(">>> varTitulo: "+this.varTitulo);
    console.log(">>> varFechaCreacionDesde: "+this.varFechaCreacionDesde.toISOString());
    console.log(">>> varFechaCreacionHasta: "+this.varFechaCreacionHasta.toISOString());
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varIdTema: "+this.varIdTema);
    console.log(">>> varIdIdioma: "+this.varIdIdioma);
    console.log(">>> varIdCentroEstudios: "+this.varIdCentroEstudios);

    this.tesisService.generateDocumentExcel( 
      this.varTitulo, 
      this.varFechaCreacionDesde.toISOString(), 
      this.varFechaCreacionHasta.toISOString(), 
      this.varEstado ? 1 : 0, 
      this.varIdTema, 
      this.varIdIdioma,
      this.varIdCentroEstudios
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

  actualizarActivos() {
    this.hayActivos = this.dataSource.data.some(x => x.estado === 1);
  }
}