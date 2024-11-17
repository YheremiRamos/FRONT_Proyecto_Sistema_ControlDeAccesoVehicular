import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MenuComponent } from "../../menu/menu.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

export interface AccesoVehicularData {
  idAccesoVehicular: string;
  nombreCompleto: string;
  tipoVehiculoPermitido: string;
  placaVehiculo: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  numIncidencias: number;
  fechaSalida: string | null;
}

@Component({
  selector: 'app-add-salida-vehicular',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MenuComponent],
  templateUrl: './add-salida-vehicular.component.html',
  styleUrls: ['./add-salida-vehicular.component.css']
})
export class AddSalidaVehicularComponent implements AfterViewInit {
  // Definir las columnas que se van a mostrar en la tabla
  displayedColumns: string[] = [
    'idAccesoVehicular',
    'nombreCompleto',
    'tipoVehiculoPermitido',
    'placaVehiculo',
    'fechaRegistro',
    'fechaActualizacion',
    'numIncidencias',
    'accionSalida'
  ];

  // Datos para la tabla
  dataSource: MatTableDataSource<AccesoVehicularData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Crear datos de ejemplo para la tabla
    const accesosVehiculares = Array.from({ length: 10 }, (_, k) => createNewAccesoVehicular(k + 1));

    // Asignar los datos a la fuente de datos para la tabla
    this.dataSource = new MatTableDataSource(accesosVehiculares);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Construye y devuelve un nuevo AccesoVehicular. */
function createNewAccesoVehicular(id: number): AccesoVehicularData {
  return {
    idAccesoVehicular: id.toString(),
    nombreCompleto: `Juan Pérez ${id}`,
    tipoVehiculoPermitido: id % 2 === 0 ? 'Sedan' : 'SUV',
    placaVehiculo: `ABC${1000 + id}`,
    fechaRegistro: `15/11/2024`,
    fechaActualizacion: `15/11/2024`,
    numIncidencias: id % 2 === 0 ? 3 : 1,
    fechaSalida: id % 2 === 0 ? null : `15/11/2024`,  // Simulando que algunos accesos ya tienen salida
  };
}
