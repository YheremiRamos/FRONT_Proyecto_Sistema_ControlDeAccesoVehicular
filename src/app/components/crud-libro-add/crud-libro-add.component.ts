import { Component, Inject, OnInit } from '@angular/core';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Editorial } from '../../models/editorial.model';
import { Usuario } from '../../models/usuario.model';
import { Libro } from '../../models/libro.model';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { LibroService } from '../../services/libro.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';

import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs';



@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-libro-add',
  templateUrl: './crud-libro-add.component.html',
  styleUrls: ['./crud-libro-add.component.css']
})

export class CrudLibroAddComponent {

  lstCategoria : DataCatalogo[] = [];
  lstTipo: DataCatalogo[] = [];
  lstEditorial : Editorial[] = [];

  objUsuario: Usuario  = {};

  objLibro : Libro ={
    titulo : "",
    anio : new Date().getFullYear(),  //undefined - fecha no definida (por defecto)
    serie : "",
    categoriaLibro : {
      idDataCatalogo: -1
    },
    estadoPrestamo : {
      idDataCatalogo: 26
    },
    tipoLibro: {
      idDataCatalogo: -1
    },
    editorial: {
      idEditorial: -1
    }
  }

  //Validators - 
  formRegistra = this.formBuilder.group
  ({
    validaTitulo: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ0-9\\s]{3,50}$')],
      this.validarTituloExistente.bind(this)
    ],
    validaAnio: ['', [Validators.required, Validators.pattern('[0-9]{4,4}'), yearRangeValidator()]], 
    validaSerie: ['', [Validators.required, Validators.pattern('[A-ZÑ]{3}[0-9]{7}'), Validators.max(10)]],
    validaCategoriaLibro: ['', [Validators.min(1)]],
    validaTipoLibro: ['', [Validators.min(1)]],
    validaEditorial:['', [Validators.min(1)]]
  });

  //validaciones - sesión 5
constructor(private UtilService : UtilService,
            private libroService: LibroService,
            private tokenService: TokenService,
            private formBuilder : FormBuilder,
            private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CrudLibroAddComponent>) 
    { 
        this.UtilService.listaCategoriaDeLibro().subscribe(
          x => this.lstCategoria = x
        );

        this.UtilService.listaTipoLibroRevista().subscribe(
          x => this.lstTipo = x
        );
        
        this.UtilService.listaEditorial().subscribe(
          x => this.lstEditorial = x
        );
        this.objUsuario.idUsuario = this.tokenService.getUserId();
}

registrar(){
  this.objLibro.usuarioRegistro = this.objUsuario;
  this.objLibro.usuarioActualiza = this.objUsuario;

  this.libroService.registrarCrudLibro(this.objLibro).subscribe(
    x =>
      {
        if(x.mensaje.includes("existe")){
          Swal.fire({
            icon: 'error',
            title: 'Resultado del registro',
            text: x.mensaje,
          })
        }else{
          Swal.fire({
            icon: 'success',
            title: 'Resultado del registro',
            text: x.mensaje,
          })
        }
      }

      
  );

  this.objLibro ={
    titulo : "",
    anio : new Date().getFullYear(),
    serie : "",
    categoriaLibro : {
      idDataCatalogo: -1
    },
    estadoPrestamo : {
      idDataCatalogo: 26
    },
    tipoLibro: {
      idDataCatalogo: -1
    },
    editorial: {
      idEditorial: -1
    }
  },
  this.formRegistra.reset();

  
  this.dialogRef.close();
}


//Validar Título
validarTituloExistente(control: FormControl) {
  return this.libroService.validarTituloIgual(control.value).pipe(
    map((response: any) => {
      return response.valid ? null : { tituloRepetido: true };
    })
  );
}

    //Cerrar modal
    salir(): void {
      this.dialogRef.close();
    }


}

export function yearRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const currentYear = new Date().getFullYear();
    if (value && (isNaN(value) || value < 1800 || value > currentYear)) {
      return { 'yearRange': true };
    }
    return null;
  };
}