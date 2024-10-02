import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { AlumnoService } from '../../services/alumno.service';
import { CrudAlumnoAddComponent } from '../crud-alumno-add/crud-alumno-add.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Alumno } from '../../models/alumno.model';
import { Usuario } from '../../models/usuario.model';
import moment from 'moment';
import { AppMaterialModule } from '../../app.material.module';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [AppMaterialModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-alumno-update',
  templateUrl: './crud-alumno-update.component.html',
  styleUrls: ['./crud-alumno-update.component.css']
})
export class CrudAlumnoUpdateComponent {

  ltsPais: Pais[] = [];
  ltsModalidad: DataCatalogo[] = [];

  formsActualizaCrud = this.formBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^[9][0-9]{8}$')]],  
    validaCelular: ['', [Validators.required, Validators.pattern('^[9][0-9]{8}$')]],  
    validaDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    validaCorreo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail|outlook|cibertec\.edu\.pe)\\.com$')]],
    validaTipoSangre: ['', Validators.required],
    validaFecha: ['', [Validators.required, this.mayorDeEdadValidator()]],
    validaPais: ['', Validators.min(1)],
    validaModalidad: ['', Validators.min(1)],
  });



  objAlumno: Alumno = {
    nombres: "",
    apellidos: "",
    telefono: 0,
    celular: 0,
    dni: 0,
    correo: "",
    tipoSangre: "",
    fechaNacimiento: undefined,
    pais: { idPais: -1 },
    modalidad: { idDataCatalogo: -1 }
  };

  objUsuario: Usuario = {};

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private alumnoService: AlumnoService,
  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrudAlumnoAddComponent>,
  ) {
    data.fechaNacimiento = new Date( new Date(data.fechaNacimiento).getTime() + (1000 * 60 * 60 * 24));
    this.utilService.listaPais().subscribe(x => this.ltsPais = x);
    this.utilService.listaModalidadAlumno().subscribe(x => this.ltsModalidad = x);
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    this.objAlumno = data; 

  }

  
  private mayorDeEdadValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = moment(control.value);
      const hoy = moment();
      const edad = hoy.diff(fechaNacimiento, 'years');
      return edad >= 18 ? null : { mayorDeEdad: true };
    };
  }

  NombreExistente: boolean = false;
  TelefonoExistente: boolean = false;
  DniExistente: boolean = false;


  
  actualizar() {
    if (this.formsActualizaCrud.valid){
    this.objAlumno.usuarioActualiza = this.objUsuario;
    this.objAlumno.usuarioRegistro = this.objUsuario;
    this.alumnoService.actualizarCrud(this.objAlumno).subscribe((x) => {
      if (x.mensaje.includes("existe")) {
        Swal.fire({
          icon: 'error',
          title: 'Resultado del Registro',
          text: x.mensaje,

        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Resultado del Registro',
          text: x.mensaje,
          
        });
      }
    });
  }
  }

  hasChanges(): boolean {
    return this.formsActualizaCrud.dirty;
  }

  cerrarDialogo(): void {
    this.dialogRef.close();
  }

}
