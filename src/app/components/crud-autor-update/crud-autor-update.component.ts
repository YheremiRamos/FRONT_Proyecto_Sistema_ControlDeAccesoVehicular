import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Autor } from '../../models/autor.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { AutorService } from '../../services/autor.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,  ReactiveFormsModule],
  selector: 'app-crud-autor-update',
  templateUrl: './crud-autor-update.component.html',
  styleUrls: ['./crud-autor-update.component.css']
})
export class CrudAutorUpdateComponent {

  lstPais: Pais[] = [];
  lstGrado: DataCatalogo[] = [];

  objAutor: Autor = {
    nombres: "",
    apellidos: "",
    fechaNacimiento: undefined,
    telefono: "",
    celular: "",
    orcid: "",
    pais: {
      idPais: -1
    },
    grado: {
      idDataCatalogo: -1
    }
  }
  
  objUsuario: Usuario = {}; //obj usuario
  //2.VALIDACIONES
  formsActualiza = this.formBuilder.group({
    //aqui se define lo que se va a validar
    validaNombres: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ]{1,}[a-zA-Zá-úÁ-ÚñÑ ]{2,38}[a-zA-Zá-úÁ-ÚñÑ]{1,}$')]],
    validaApellidos: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ]{1,}[a-zA-Zá-úÁ-ÚñÑ ]{2,38}[a-zA-Zá-úÁ-ÚñÑ]{1,}$')]],
    validaFecha: ['', [Validators.required, mayorDeEdad()]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^8[0-9]{8}$')]],

    validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaOrcid: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],


    validaPais: ['', Validators.min(1)],
    validaGrado: ['', Validators.min(1)]  

  });
  //


  constructor(private utilService: UtilService,
    private tokenService: TokenService,
    private autorService: AutorService,
    private formBuilder: FormBuilder, //validacion
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.objAutor = data; //est tiene la data de los componentes
    this.utilService.listaGradoAutor().subscribe(
      x => this.lstGrado = x
    );
    this.utilService.listaPais().subscribe(
      x => this.lstPais = x
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  

   //METODO
   actualizar() {
    this.objAutor.usuarioActualiza = this.objUsuario;
    this.objAutor.usuarioRegistro = this.objUsuario;
    this.autorService.actualizarCrud(this.objAutor).subscribe((x) => {
      Swal.fire({
        icon: "info",
        title: 'Resultado de la Actualización',
        text: x.mensaje,
      });
    });
  
    this.objAutor = {
      nombres: "",
      apellidos: "",
      fechaNacimiento: undefined,
      telefono: "",
      celular: "",
      orcid: "",
      pais: {
        idPais: -1
      },
      grado: {
        idDataCatalogo: -1
      }
    },
    this.formsActualiza.reset();
  }


ngOnInit(): void {
 
}
}
    // Validación personalizada para verificar que el autor sea mayor de edad
 
  export function mayorDeEdad(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      return edad >= 18 ? null : { mayorDeEdad: true };
    };
  }

      // Reinicializar el objeto y el formulario después de una actualización exitosa
     /* this.objAutor = {
        nombres: "",
        apellidos: "",
        fechaNacimiento: undefined,
        telefono: "",
        celular: "",
        orcid: "",
        pais: {
          idPais: -1
        },
        grado: {
          idDataCatalogo: -1
        }
      },
      this.formsActualiza.reset();
    }
  
  
  ngOnInit(): void {
   
  }
  
  //VALIDACION TELEFONO

  telefonoExistente(control: FormControl): Observable<ValidationErrors | null> {
    return this.autorService.validarTelefono(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { telefonoRepetido: true };
      })
    );
  }
}
//VALIDACION
  // Validación personalizada para verificar que el autor sea mayor de edad
 
  export function mayorDeEdad(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      return edad >= 18 ? null : { mayorDeEdad: true };
    };
  }*/
