import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Usuario } from '../../models/usuario.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Sala } from '../../models/sala.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { SalaService } from '../../services/sala.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-sala-update',
  templateUrl: './crud-sala-update.component.html',
  styleUrls: ['./crud-sala-update.component.css']
  
})
export class CrudSalaUpdateComponent {

  lstTipo: DataCatalogo[] = [];
  lstSede: DataCatalogo[] = [];
  lstEstado: DataCatalogo[] = [];

  objSala: Sala ={
    numero: "",
    piso: 0,
    numAlumnos : 0,
    recursos: "",
    tipoSala:{
        idDataCatalogo:-1
    },
    sede:{
      idDataCatalogo:-1
    },
    estadoReserva:{
      idDataCatalogo:-1
  }
  };

  objUsuario: Usuario = {} ;

  formsActualiza = this.formBuilder.group({ 
    validaNumero: ['', [Validators.required, Validators.pattern('^[A-Z]\\d{3}$')],this.validarNumero.bind(this)], 
    validaPiso: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    validaNumAlumno: ['', [Validators.required, Validators.min(1), Validators.max(5)]], 
    validaRecursos: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s,]{3,60}$')]] , 
    validaTipoSala: ['', Validators.min(1)] , 
    validaSede: ['', Validators.min(1)] , 
    validaEstadoReserva: ['', Validators.min(1)] , 
  });

  constructor(private utilService: UtilService, 
    private tokenService: TokenService,
    private salaService: SalaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router) { 

      this.objSala = data; 
    console.log(">>>> [ini] >>> objSala");
    console.log(this.objSala);

    this.utilService.listaTipoSala().subscribe(
          x =>  this.lstTipo = x
    );
    this.utilService.listaSede().subscribe(
      x =>  this.lstSede = x
    );
    this.utilService.listaEstadoSala().subscribe(
      x =>  this.lstEstado = x
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  actualizar() {
    if (this.formsActualiza.valid){
    this.objSala.usuarioActualiza = this.objUsuario;
    this.objSala.usuarioRegistro = this.objUsuario;
    this.salaService.actualizarCrud(this.objSala).subscribe((x) => {
      Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      });
    });
  }
  }

  validarNumero(control: FormControl) {
    return this.salaService.validarNumero(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { numeroRepetido: true };
      })
    );
  }

  salir(){
    this.router.dispose; // Go back to the previous route
  }

}
