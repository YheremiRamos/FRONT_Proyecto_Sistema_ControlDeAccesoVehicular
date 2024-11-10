import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { EspacioParqueoService } from '../../services/espacioParqueo.service';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { EspacioParqueo } from '../../models/espacioParqueo';
import Swal from 'sweetalert2';
import { Parqueo } from '../../models/parqueo.model';
import { AppMaterialModule } from '../../app.material.module';


import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatStepperModule } from '@angular/material/stepper';





@Component({
  imports: [MatSelectModule,MatFormFieldModule,AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule], 

  standalone: true,
  selector: 'app-crud-espacio-parqueo-add',
  templateUrl: './crud-espacioParqueo-add.component.html',
  styleUrls: ['./crud-espacioParqueo-add.component.css']
})
export class CrudEspacioParqueoAddComponent implements OnInit {
  // Lista de tipos de espacio
  lstTiposEspacio = [
    { id: 'Discapacitado', tipoEspacio: 'Discapacitado' },
    { id: 'General', tipoEspacio: 'General' },
    { id: 'Gerencia', tipoEspacio: 'Gerencia' }
  ];


  lstParqueo = [
    { idParqueo: '1', nombre: 'Primer Nivel' },
    { idParqueo: '2', nombre: 'Semi-Sótano' },
    { idParqueo: '3', nombre: 'Sótano' }
  ];

  // Formulario de registro
  formsRegistra: FormGroup;

  // Objeto para almacenar los datos del espacio de parqueo
  objEspacioParqueo: EspacioParqueo = {
    idEspacio: 0,
    tipoEspacio: '',
    numeroEspacio: 0
  };

  objUsuario: Usuario = {};

  constructor(
    private espacioService: EspacioParqueoService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<CrudEspacioParqueoAddComponent>
  ) {
    // Inicializamos el formulario
    this.formsRegistra = this.formBuilder.group({
      tipoEspacio: ['', Validators.required], // Tipo de espacio es requerido
      numeroEspacio: ['', [Validators.required, Validators.min(1)]] // Número de espacio es requerido
    });
  }

  ngOnInit(): void {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  // Método para cerrar el diálogo
  cerrarDialogo(): void {
    this.dialogRef.close();
  }

  // Método para registrar el espacio de parqueo
  registra(): void {
    if (this.formsRegistra.valid) {
      this.objEspacioParqueo = {
        ...this.objEspacioParqueo,
        tipoEspacio: this.formsRegistra.value.tipoEspacio,
        numeroEspacio: this.formsRegistra.value.numeroEspacio
      };

      this.espacioService.registrarEspacioParqueo(this.objEspacioParqueo).subscribe(
        (response) => {
          if (response.mensaje.includes("existe")) {
            Swal.fire({
              icon: 'error',
              title: 'Resultado del Registro',
              text: response.mensaje
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Resultado del Registro',
              text: response.mensaje
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el espacio de parqueo.'
          });
        }
      );

      // Restablecer el formulario
      this.objEspacioParqueo = {
        idEspacio: 0,
        tipoEspacio: '',
        numeroEspacio: 0
      };
      this.formsRegistra.reset();
    }
  }
}