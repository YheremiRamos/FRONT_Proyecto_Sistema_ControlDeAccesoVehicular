import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Ubicacion } from '../../models/ubicacion.model';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { Parqueos } from '../../models/parqueos.model';
import { Usuario } from '../../models/usuario.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-modal-lista-espacios',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule, MatDialogModule],
  templateUrl: './modal-lista-espacios.component.html',
  styleUrls: ['./modal-lista-espacios.component.css']
})
export class ModalListaEspaciosComponent implements OnInit {
  lstUbicaciones: Ubicacion[] = [];
  lstTipoParqueo: TipoParqueo[] = [];
  lstTipoVehiculo: TipoVehiculo[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];

  objParqueo: Parqueos = {
    ubicacion: { idUbicacion: -1 },
    tipoParqueo: { idTipoParqueo: -1 },
    tipoVehiculo: { idTipoVehiculo: -1 },
    estadoEspacios: { idEstadoEspacios: -1 }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalListaEspaciosComponent>
  ) {
    this.objParqueo = data; // Aquí recibes los datos del parqueo que se va a mostrar
  }

  ngOnInit(): void {
    console.log("Datos recibidos del modal:", this.data); // Para verificar los datos
    this.lstUbicaciones = this.data.lstUbicaciones || [];
    this.lstTipoParqueo = this.data.lstTipoParqueo || [];
    this.lstTipoVehiculo = this.data.lstTipoVehiculo || [];
    this.lstEstadoEspacios = this.data.lstEstadoEspacios || [];
  
    // Asegúrate de que las listas tengan datos
    console.log("Ubicaciones:", this.lstUbicaciones);
    console.log("Tipo Parqueo:", this.lstTipoParqueo);
    console.log("Estado Espacios:", this.lstEstadoEspacios);
  }
  

  // Método de cancelación
  cancelar() {
    this.dialogRef.close(); // Esto cierra el modal
  }
}
