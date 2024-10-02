import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { TesisService } from '../../services/tesis.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { Tesis } from '../../models/tesis.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-crud-tesis-update',
  templateUrl: './crud-tesis-update.component.html',
  styleUrls: ['./crud-tesis-update.component.css'],
  providers: [provideNativeDateAdapter()]

})
export class CrudTesisUpdateComponent   implements OnInit{

  
  lstTema:DataCatalogo[]=[];
  lstIdioma:DataCatalogo[]=[];
  lstCentroEstudios:DataCatalogo[]=[];
  minFechaCreacion: Date = new Date('1975-01-01');

  formsActualiza = this.formBuilder.group({ 
    validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ0-9 ]{5,45}')]],
    validafechaCreacion: ['', [Validators.required , this.validateFechaCreacion] ] , 
    validaTema: ['', Validators.min(1)] , 
    validaIdioma: ['', Validators.min(1)] , 
    validaCentroEstudios: ['', Validators.min(1)] , 
  });


  objTesis: Tesis ={
    titulo:"",
    fechaCreacion: undefined,
    telefono:"",
    tema:{
      idDataCatalogo : -1
    },
    idioma:{
      idDataCatalogo : -1
    },
    centroEstudios:{
      idDataCatalogo : -1
    }
      };
    
    

      objUsuario: Usuario={};


      isButtonDisabled$: Observable<boolean>;

//Ejempo
     
constructor(private UtilService :UtilService, 
  private utilService: UtilService,
  private tesisService: TesisService,
  private tokenService: TokenService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: FormBuilder,
  public dialogRef: MatDialogRef<CrudTesisUpdateComponent>
) {





data.fechaCreacion = new Date( new Date(data.fechaCreacion).getTime() + (1000 * 60 * 60 * 24));
this.objTesis = data; 

console.log(">>>> [ini] >>> objTesis");
console.log(this.objTesis);

this.UtilService.listaTemaTesis().subscribe(

  x=> this.lstTema =x
);

this.UtilService.listaIdioma().subscribe(
  y=> this.lstIdioma=y
)

this.UtilService.listaCentroEstudios().subscribe(

  p=> this.lstCentroEstudios =p
);

this.objUsuario.idUsuario= this.tokenService.getUserId();
  // Observable to track form state and enable/disable button
  this.isButtonDisabled$ = this.formsActualiza.valueChanges.pipe(
    map(() => this.formsActualiza.invalid || !this.formsActualiza.dirty)
  );
}

ngOnInit(): void {}

// Función de validación personalizada para validar que la fecha sea posterior al 1 de enero de 1975
validateFechaCreacion(control: AbstractControl): { [key: string]: boolean } | null {
  const fechaCreacion = new Date(control.value);
  const fechaLimite = new Date('1975-01-01');

  if (control.value === '') {
      return { 'required': true }; // Devuelve 'required' si la fecha es requerida
  }

  if (fechaCreacion < fechaLimite) {
      return { 'fechaInvalida': true }; // Devuelve 'fechaInvalida' si la fecha no es posterior a 1975
  }
  return null;
}

/*Verifica si un campo ha sido modificado*/ 


hasChanges(): boolean {
  return this.formsActualiza.dirty;
}
/*penas carga va a labase de datos y trae todos los paises*/ 
/*CERRAR MODAL*/ 
cerrarDialogo(): void {
  this.dialogRef.close();
}

actualizar() {
  if (this.formsActualiza.valid && this.formsActualiza.dirty) {
      this.objTesis.usuarioActualiza = this.objUsuario;
  this.objTesis.usuarioRegistro = this.objUsuario;
  this.tesisService.actualizarCrud(this.objTesis).subscribe((x) => {
    Swal.fire({
      icon: 'info',
      title: 'Resultado de la actualización',
      text: x.mensaje,
    });
  });
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