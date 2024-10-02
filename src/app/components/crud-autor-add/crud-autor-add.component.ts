import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module'; 
import { Pais } from '../../models/pais.model';
import { Grado } from '../../models/grado.model';
import { Autor } from '../../models/autor.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { AutorService } from '../../services/autor.service';
import Swal from 'sweetalert2';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-autor-add',
  templateUrl: './crud-autor-add.component.html',
  styleUrls: ['./crud-autor-add.component.css']
})
export class CrudAutorAddComponent {

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
  formsRegistra = this.formBuilder.group({
    //aqui se define lo que se va a validar
    validaNombres: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ]{1,}[a-zA-Zá-úÁ-ÚñÑ ]{2,38}[a-zA-Zá-úÁ-ÚñÑ]{1,}$')]],
    validaApellidos: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ]{1,}[a-zA-Zá-úÁ-ÚñÑ ]{2,38}[a-zA-Zá-úÁ-ÚñÑ]{1,}$')]],
    validaFecha: ['', [Validators.required, mayorDeEdad()]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^8[0-9]{8}$')],this.telefonoExistente.bind(this)],
    validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaOrcid: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],
  


    validaPais: ['', Validators.min(1)],
    validaGrado: ['', Validators.min(1)]  

  });
  //

  constructor(
    private utilService: UtilService, // Servicio de utilidad
    private tokenService: TokenService, // Servicio de token
    private autorService: AutorService, // Servicio de autor
    private formBuilder: FormBuilder, //validacion
    private dialogRef: MatDialogRef<CrudAutorAddComponent>
  ) {
    // Al iniciar el componente, se carga la lista de países y grados
    this.utilService.listaPais().subscribe(
      x => this.lstPais = x
    );
    this.utilService.listaGradoAutor().subscribe(
      x => this.lstGrado = x
    );
    // Se obtiene el ID de usuario del token y se asigna al objeto usuario
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  registra() {
    
    this.objAutor.usuarioActualiza = this.objUsuario;
    this.objAutor.usuarioRegistro = this.objUsuario;
  
    this.autorService.registrarCrud(this.objAutor).subscribe(
      (x) => {
        Swal.fire({
          icon: "info",
          title: 'Resultado del Registro',
          text: x.mensaje,
        });
     
      }
    );
    //validacion
    this.objAutor ={
      nombres: "",
      apellidos: "",
      fechaNacimiento : undefined,
      telefono: "",
      celular:"",
      orcid:"",
      pais:{
        idPais:-1
      },
      grado:{
          idDataCatalogo:-1
      }
      
  }
  ,
  this.formsRegistra.reset();
  }
  //--
 /* cerrarModal(): void {
    // Cierra el modal
    this.dialogRef.close();
  }*/
  
//--
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
}
