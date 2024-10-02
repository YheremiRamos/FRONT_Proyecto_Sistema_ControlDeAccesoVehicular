import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { AppMaterialModule } from '../../app.material.module';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Alumno } from '../../models/alumno.model';
import { AlumnoService } from '../../services/alumno.service';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Observable, map, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  standalone: true,
  imports: [AppMaterialModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-alumno-add',
  templateUrl: './crud-alumno-add.component.html',
  styleUrls: ['./crud-alumno-add.component.css']
})
export class CrudAlumnoAddComponent implements OnInit {
  
  ltsPais: Pais[] = [];
  ltsModalidad: DataCatalogo[] = [];
  minFechaNacimiento: Date = new Date('1975-01-01');


  formsRegistraCrud = this.formBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^[9][0-9]{8}$')],this.telefonoExistente.bind(this)],  
    validaCelular: ['', [Validators.required, Validators.pattern('^[9][0-9]{8}$')]],  
    validaDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')],this.dniExistente.bind(this)],
    validaCorreo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail|outlook|cibertec\.edu\.pe)\\.com$')]],
    validaTipoSangre: ['', Validators.required],
    validaFecha: ['', [Validators.required, this.mayorDeEdadValidator()]], // Validación para fecha de nacimiento y mayor de edad
    validaPais: ['', Validators.min(1)],
    validaModalidad: ['', Validators.min(1)],
  });


  //VALIDACION TELEFONO

  telefonoExistente(control: FormControl): Observable<ValidationErrors | null> {
    return this.alumnoService.validarTelefono(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { telefonoRepetido: true };
      })
    );
  }

 dniExistente(control: FormControl): Observable<ValidationErrors | null> {
    return this.alumnoService.validarDni(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { dniRepetido: true };
      })
    );
  }
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
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrudAlumnoAddComponent>
  ) {

  }
  ngOnInit(): void {
    this.utilService.listaPais().subscribe(x => this.ltsPais = x);
    this.utilService.listaModalidadAlumno().subscribe(x => this.ltsModalidad = x);
    this.objUsuario.idUsuario = this.tokenService.getUserId();
   }


  mayorDeEdadValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = moment(control.value);
      const hoy = moment();
      const edad = hoy.diff(fechaNacimiento, 'years');
      return edad >= 18 ? null : { mayorDeEdad: true };
    };
  }

  
  cerrarDialogo(): void {
    this.dialogRef.close();
  }

  NombreExistente: boolean = false;
  TelefonoExistente: boolean = false;
  DniExistente: boolean = false;

  registra(){
    if (this.formsRegistraCrud.valid) {
      this.objAlumno.usuarioActualiza = this.objUsuario;

      this.objAlumno.usuarioRegistro = this.objUsuario;

      this.alumnoService.registrarCrud(this.objAlumno).subscribe(
        x => {
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
        }
      );

      // Restablece el formulario
      this.objAlumno = {
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
      this.formsRegistraCrud.reset();
    }
  }


}

