import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { UtilService } from '../../services/util.service';
import { Editorial } from '../../models/editorial.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { EditorialService } from '../../services/editorial.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-editorial-update',
  templateUrl: './crud-editorial-update.component.html',
  styleUrls: ['./crud-editorial-update.component.css'],
  providers: [provideNativeDateAdapter()],
})

export class CrudEditorialUpdateComponent {
  lstPais: Pais[] = [];
  fecha = new FormControl(new Date());

    formsActualiza = this.formBuilder.group({ 
      validaRazonSocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')],this.razonSocialExistente.bind(this)] , 
      validaDireccion: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ 0-9 ]{4,40}')]] , 
      validaRuc:  ['', [Validators.required, Validators.pattern('^10\\d{9}$')], this.rucExistente.bind(this)],
      validaGerente: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,100}')]] , 
      validaFechaCreacion: ['', [Validators.required, this.fechaCreacionValidator.bind(this)]],
      validaPais: ['', Validators.min(1)] , 
      });
  
      fechaCreacionValidator(control: AbstractControl): ValidationErrors | null {
        const date = new Date(control.value);
        const minDate = new Date(1980, 0, 1); // 1st January 1980
        return date >= minDate ? null : { minDate: 'La fecha de creación debe ser a partir del año 1980' };
      }

    objEditorial : Editorial  ={
      razonSocial  : "",
      direccion : "",
      ruc  : "",
      gerente : "",
      fechaCreacion : undefined,
      pais : {
          idPais : -1
      }
    }
      objUsuario: Usuario = {} ;




  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private editorialService: EditorialService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder : FormBuilder,
              private router: Router){
            
            data.fechaCreacion = new Date( new Date(data.fechaCreacion).getTime() + (1000 * 60 * 60 * 24));
            this.objEditorial = data; 

            console.log(">>>> [ini] >>> objRevista");
            console.log(this.objEditorial);
            this.utilService.listaPais().subscribe(
              x =>  this.lstPais = x
            );
        this.objUsuario.idUsuario = tokenService.getUserId();
        
  }
  
  actualizar() {
    if (this.formsActualiza.valid){
    this.objEditorial.usuarioActualiza = this.objUsuario;
    this.objEditorial.usuarioRegistro = this.objUsuario;
    this.editorialService.actualizarCrud(this.objEditorial).subscribe((x) => {
      Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      });
    });
  }
  }

razonSocialExistente(control: FormControl): Observable<ValidationErrors | null> {
    const valorControl = control.value.toLowerCase(); // Convertir a minúsculas
  
    return this.editorialService.validarRazonSocial(valorControl).pipe(
      map((response: any) => {
        const respuestaValidada = response.valid ? null : { razonSocialRepetido: true };
        return respuestaValidada;
      })
    );
  }
  
  rucExistente(control: FormControl): Observable<ValidationErrors | null> {
    return this.editorialService.validarRuc(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { rucRepetido: true };
      })
    );
  }
  salir(){
    this.router.dispose; 
}
}
