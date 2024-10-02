import { Component } from '@angular/core';

import Swal from 'sweetalert2'


import { Editorial } from '../../models/editorial.model';
import { Pais } from '../../models/pais.model';
import { Usuario } from '../../models/usuario.model';
import { EditorialService } from '../../services/editorial.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-agregar-editorial',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  templateUrl: './agregar-editorial.component.html',
  styleUrls: ['./agregar-editorial.component.css']
})

export class AgregarEditorialComponent {

  lstPais : Pais[] = [];

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
      formsRegistra = this.formBuilder.group({ 
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

      constructor(private utilService : UtilService, 
                  private editorialService:EditorialService,
                  private formBuilder:FormBuilder,
                  private tokenService: TokenService){

              this.utilService.listaPais().subscribe(
                    x => this.lstPais = x
              )
              this.objUsuario.idUsuario = tokenService.getUserId();;
      }

      inserta(){
        if (this.formsRegistra.valid){
        this.objEditorial.usuarioActualiza = this.objUsuario;
        this.objEditorial.usuarioRegistro = this.objUsuario;

        this.editorialService.registrar(this.objEditorial).subscribe(
                x=>{
                  Swal.fire({
                    icon: 'info',
                    title: 'Resultado del Registro',
                    text: x.mensaje,
                  })

                  this.objEditorial ={
                    razonSocial  : "",
                    direccion : "",
                    ruc  : "",
                    gerente : "",
                    fechaCreacion : undefined,
                    pais : {
                        idPais : -1
                    }
                  }  
                },
                
              );
      }
                  this.formsRegistra.reset();
              
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
    }
