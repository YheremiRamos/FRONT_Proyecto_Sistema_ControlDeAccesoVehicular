import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Tesis } from '../../models/tesis.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TesisService } from '../../services/tesis.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-tesis-add',
  templateUrl: './crud-tesis-add.component.html',
  styleUrls: ['./crud-tesis-add.component.css'],
  providers: [provideNativeDateAdapter()]
})
export class CrudTesisAddComponent implements OnInit {
  lstTema: DataCatalogo[] = [];
  lstIdioma: DataCatalogo[] = [];
  lstCentroEstudios: DataCatalogo[] = [];
  minFechaCreacion: Date = new Date('1975-01-01');

  formsRegistra = this.formBuilder.group({
    validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ0-9 ]{5,45}')], this.validarTitulo.bind(this)],
    validafechaCreacion: ['', [Validators.required, this.validateFechaCreacion]],
    validaTema: ['', Validators.min(1)],
    validaIdioma: ['', Validators.min(1)],
    validaCentroEstudios: ['', Validators.min(1)],
  });

  objTesis: Tesis = {
    titulo: "",
    fechaCreacion: undefined,
    telefono: "",
    tema: { idDataCatalogo: -1 },
    idioma: { idDataCatalogo: -1 },
    centroEstudios: { idDataCatalogo: -1 }
  };

  objUsuario: Usuario = {};

  constructor(
    private utilService: UtilService,
    private tesisService: TesisService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<CrudTesisAddComponent>
  ) {
    // No data injection in add component, initialize default values
  }

  ngOnInit(): void {
    this.utilService.listaTemaTesis().subscribe(x => this.lstTema = x);
    this.utilService.listaIdioma().subscribe(y => this.lstIdioma = y);
    this.utilService.listaCentroEstudios().subscribe(p => this.lstCentroEstudios = p);

    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  validateFechaCreacion(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaCreacion = new Date(control.value);
    const fechaLimite = new Date('1975-01-01');

    if (control.value === '') {
      return { 'required': true };
    }

    if (fechaCreacion < fechaLimite) {
      return { 'fechaInvalida': true };
    }
    return null;
  }

  cerrarDialogo(): void {
    this.dialogRef.close();
  }

  registra(): void {
    if (this.formsRegistra.valid) {
      this.objTesis.usuarioActualiza = this.objUsuario;

      this.objTesis.usuarioRegistro = this.objUsuario;

      this.tesisService.registrar(this.objTesis).subscribe(
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
      this.objTesis = {
        titulo: "",
        fechaCreacion: undefined,
        telefono: "",
        tema: { idDataCatalogo: -1 },
        idioma: { idDataCatalogo: -1 },
        centroEstudios: { idDataCatalogo: -1 }
      };
      this.formsRegistra.reset();
    }
  }

  validarTitulo(control: FormControl) {
    return this.tesisService.validarTitulo(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { tituloRepetido: true };
      })
    );
  }
}