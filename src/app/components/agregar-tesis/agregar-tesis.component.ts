import { Component, OnInit } from '@angular/core';

import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { TesisService } from '../../services/tesis.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { Tesis } from '../../models/tesis.model';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-agregar-tesis',
  templateUrl: './agregar-tesis.component.html',
  styleUrls: ['./agregar-tesis.component.css']
})
export class AgregarTesisComponent  {
  filtro: string = "";

  
  lstTema:DataCatalogo[]=[];
  lstIdioma:DataCatalogo[]=[];
  lstCentroEstudios:DataCatalogo[]=[];
  minDate: Date = new Date(1975, 0, 1);



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
      }
    
    

      objUsuario: Usuario={};

//Ejempo
      formsRegistra = this.formBuilder.group({ 
        validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{5,45}')]] , 
        validafechaCreacion: ['', [Validators.required] ] , 
        validaTema: ['', Validators.min(1)] , 
        validaIdioma: ['', Validators.min(1)] , 
        validaCentroEstudios: ['', Validators.min(1)] , 

       
    
      });






/*penas carga va a labase de datos y trae todos los paises*/ 
constructor(private UtilService :UtilService, 
  private tesisService: TesisService,
private tokenService: TokenService,
private formBuilder: FormBuilder
){

/*Apenas lo trae*/ 
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



}


/**/
registra(){
  if (this.formsRegistra.valid){
    this.objTesis.usuarioActualiza = this.objUsuario;
    this.objTesis.usuarioRegistro = this.objUsuario;
    
    this.tesisService.registrar(this.objTesis).subscribe(
      x => {
        if (x.mensaje.includes("existe")) { // Verifica si el mensaje incluye la palabra "existe"
          Swal.fire({
            icon: 'error', // Cambia el icono a 'error'
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
    this.objTesis={
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
    this.formsRegistra.reset();
  }      
}
ngOnInit(): void {
}
}