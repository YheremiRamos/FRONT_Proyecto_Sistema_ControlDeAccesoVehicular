import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MenuComponent } from '../../menu/menu.component';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { Ubicacion } from '../../models/ubicacion.model';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { Parqueos } from '../../models/parqueos.model';
import { Usuario } from '../../models/usuario.model';
import { ParqueosService } from '../../services/parqueos.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-espacio-parqueo-update',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule],
  templateUrl: './crud-espacio-parqueo-update.component.html',
  styleUrl: './crud-espacio-parqueo-update.component.css'
})
export class CrudEspacioParqueoUpdateComponent implements OnInit {
  lstUbicaciones: Ubicacion[] = [];
  lstTipoParqueo: TipoParqueo[] = [];
  lstTipoVehiculo: TipoVehiculo[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];
  parqueos: Parqueos[] = [];
  //listado
 
  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {};
  

  objParqueo: Parqueos = {
    ubicacion: { idUbicacion: -1 },
    tipoParqueo: { idTipoParqueo: -1 },
    tipoVehiculo: { idTipoVehiculo: -1 },
    estadoEspacios: { idEstadoEspacios: -1 }

  };
  objUsuario: Usuario = {};

  formsActualiza = this.formBuilder.group({
    validaUbicacion: ['', Validators.min(1)],
    validaTipo: ['', Validators.min(1)],
    validaTipoVehiculo: ['', Validators.min(1)],
    validaEstadoEspacios: ['', Validators.min(1)]
  });

  constructor(
    private parqueosService: ParqueosService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private dialogRef: MatDialogRef<CrudEspacioParqueoUpdateComponent>,  // <-- Inyección de MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objParqueo = data; // Aquí recibes los datos del parqueo que se va a actualizar
    this.utilService.listaUbicacion().subscribe(x => this.lstUbicaciones = x);
    this.utilService.listaTipoParqueo().subscribe(x => this.lstTipoParqueo = x);
    this.utilService.listaTipoVehiculo().subscribe(x => this.lstTipoVehiculo = x);
    this.utilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);
    this.objUsuario.idUsuario = tokenService.getUserId();
  }
  

  ngOnInit(): void {
     //SACAR EL "DESHABILITADO" DEL CBO (ESTE ES PARA LA ELIMINAICON)
     this.utilService.listaEstadoEspacios().subscribe(x => {
      this.lstEstadoEspacios = x.filter(estado => estado.idEstadoEspacios !== 5);
    });
  }
  

  // Método de actualización
  actualizar() {
    this.objParqueo.usuarioActualiza = this.objUsuario;
    this.objParqueo.usuarioRegistro = this.objUsuario;
  
    this.parqueosService.actualizarParqueo(this.objParqueo).subscribe((response) => {
      Swal.fire({
        icon: "info",
        title: 'Resultado de la Actualización',
        text: response.mensaje,
      });
  
      // Refresca la lista de parqueos tras la actualización
      this.parqueosService.listarTodos().subscribe((nuevosParqueos) => {
        this.parqueos = nuevosParqueos; // Actualiza los datos en la lista local
      });
  
      // Reinicializa el objeto y el formulario después de la actualización
      this.objParqueo = {
        ubicacion: { idUbicacion: -1 },
        tipoParqueo: { idTipoParqueo: -1 },
        tipoVehiculo: { idTipoVehiculo: -1 },
        estadoEspacios: { idEstadoEspacios: -1 }
      };
      this.formsActualiza.reset();
    });
  }

  // Método de cancelación
  cancelar() {
    this.dialogRef.close();  // Esto cierra el modal
  }
  

}
