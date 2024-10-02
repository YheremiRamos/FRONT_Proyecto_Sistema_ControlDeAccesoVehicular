import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { Alumno } from '../../models/alumno.model';
import { Usuario } from '../../models/usuario.model';
import { AlumnoService } from '../../services/alumno.service';
import { UtilService } from '../../services/util.service';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import Swal from 'sweetalert2';
import { TokenService } from '../../security/token.service';

@Component({
  selector: 'app-agregar-alumno',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-alumno.component.html',
  styleUrls: ['./agregar-alumno.component.css']
})
export class AgregarAlumnoComponent implements OnInit{

  lstPais: Pais[] = [];
  lstModalidad: DataCatalogo[] = [];

  alumno: Alumno ={
      nombres: "",
      apellidos: "",
      telefono: undefined,
      celular: undefined,
      dni: undefined,
      correo: "",
      tipoSangre: "",
      fechaNacimiento: undefined,
      pais:{
        idPais:-1
      },
      modalidad:{
        idDataCatalogo: -1
      }
}
  objUsuario: Usuario = {} ;

  formsRegistra = this.formBuilder.group({ 
    validaNombres: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] , 
    validaApellidos: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] , 
    validaTelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')] ] , 
    validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')] ] , 
    validaDni: ['', [Validators.required, Validators.pattern('[0-8]{8}')] ] , 
    validaCorreo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
    validaTipoSangre: ['', [Validators.required, Validators.pattern(/^[A-Z][\+\-]$/)]],
    validaFechaNacimiento: ['', [Validators.required] ] , 
    validaPais: ['', Validators.min(1)] , 
    validaModalidad: ['', Validators.min(1)] ,
  });

  constructor(
    private alumnoService:AlumnoService, 
    private utilService:UtilService, 
    private tokensito:TokenService, 
    private formBuilder: FormBuilder) 
  { 
    utilService.listaPais().subscribe(
      x   =>   this.lstPais=x
    )

    utilService.listaModalidadAlumno().subscribe(
      x   =>   this.lstModalidad=x
    )

    this.objUsuario.idUsuario = tokensito.getUserId();

  }

  registra(){

    this.alumno.usuarioActualiza = this.objUsuario;
    this.alumno.usuarioRegistro = this.objUsuario;
    this.alumnoService.registrar(this.alumno).subscribe(
      x=> Swal.fire({
          icon: 'info',
          title: 'Alumno registrado exitosamente: ',

          text: x.mensaje,
        })
    );

    this.alumno={
      nombres: "",
      apellidos: "",
      telefono: undefined,
      celular: undefined,
      dni: undefined,
      correo: "",
      tipoSangre: "",
      fechaNacimiento: undefined,
      pais:{
        idPais:-1
      },
      modalidad:{
        idDataCatalogo: -1
      }
    },
      this.formsRegistra.reset();

  }

  ngOnInit(): void {
    
  }

}
