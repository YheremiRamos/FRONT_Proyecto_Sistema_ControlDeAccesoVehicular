import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Autor } from '../../models/autor.model';
import { Pais } from '../../models/pais.model';
import { Usuario } from '../../models/usuario.model';
import { AutorService } from '../../services/autor.service';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import Swal from 'sweetalert2';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';

@Component({
  standalone: true,                                                     //validacion
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  selector: 'app-agregar-autor',
  templateUrl: './agregar-autor.component.html',
  styleUrls: ['./agregar-autor.component.css']
})
export class AgregarAutorComponent implements OnInit {
  lstPaises: Pais[] = []; // Se declara la propiedad lstPaises
  lstDataCatalogo: DataCatalogo[] = []; // Se declara la propiedad lstDataCtalogo


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

  
 
  objUsuario: Usuario = {};
  //2.VALIDACIONES
  formsRegistra = this.formBuilder.group({
    //aqui se define lo que se va a validar
    validaNombres: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellidos: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaFecha: ['', [Validators.required] ] ,
    validaTelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaOrcid: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],


    validaPais: ['', Validators.min(1)],
    validaGrado: ['', Validators.min(1)]  

  });
  //
  constructor(
    private tokenService: TokenService,
    private autorService: AutorService,
    private UtilService: UtilService,
    private formBuilder: FormBuilder
     //vldcn
  ) {
    this.UtilService.listaPais().subscribe(
      x => this.lstPaises = x
    );

    this.UtilService.listaGradoAutor().subscribe(
      x => this.lstDataCatalogo = x
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  //registro
  registra() {
    
    this.objAutor.usuarioActualiza = this.objUsuario;
    this.objAutor.usuarioRegistro = this.objUsuario;
    this.autorService.registraAutor(this.objAutor).subscribe(
      x => Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      })
    );

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

  ngOnInit(): void {
  }

  
}
