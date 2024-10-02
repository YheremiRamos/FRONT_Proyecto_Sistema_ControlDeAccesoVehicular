
import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Libro } from '../../models/libro.model';
import { UtilService } from '../../services/util.service';
import { Editorial } from '../../models/editorial.model';
import { Usuario } from '../../models/usuario.model';
import { LibroService } from '../../services/libro.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-agregar-libro',
  templateUrl: './agregar-libro.component.html',
  styleUrls: ['./agregar-libro.component.css']
})
export class AgregarLibroComponent implements OnInit {

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
      validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
      validaAnio: ['', [Validators.required, Validators.pattern('[0-9]{4}')]], 
      validaSerie: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{12}')]],
      validaCategoriaLibro: ['', [Validators.min(1)]],
      validaTipoLibro: ['', [Validators.min(1)]],
      validaEditorial:['', [Validators.min(1)]]
    });
  
    //validaciones - sesión 5
  constructor(private UtilService : UtilService,
              private libroService: LibroService,
              private tokenService: TokenService,
              private formBuilder : FormBuilder
  ) { 
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

    this.libroService.registrarLibro(this.objLibro).subscribe(
      x =>
        Swal.fire({
          icon: 'info',
          title: 'Resultado del registro',
          text: x.mensaje,
        })
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
  }

  ngOnInit(): void {
  }


}
