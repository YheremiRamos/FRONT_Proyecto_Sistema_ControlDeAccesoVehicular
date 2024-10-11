import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';
import { TokenService } from '../../security/token.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-agregar-alumno',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-alumno.component.html',
  styleUrls: ['./agregar-alumno.component.css']
})
export class AgregarAlumnoComponent implements OnInit {
  
  dataSource: any;
  filtro: string = '';
  varDni: string = '';
  objUsuario: Usuario = {};
  dni = '';
  nombres = '';
  apellidos = '';
  habilitarRegistrar: boolean = false;

  formRegistra = this.formBuilder.group({
    validaDni: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[0-9]+$')]],
    validaTipoVehiculo: ['', Validators.min(1)],
    validaPlaca: ['', [Validators.required, Validators.pattern('^[A-Z]{2}-\\d{3,5}$')]], // Formato: AA-1234 o AA-12345
    nombres: [{ value: '', disabled: true }],
    apellidos: [{ value: '', disabled: true }],
  });

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log('constructor >> constructor >>> ' + this.tokenService.getToken());
  }

  buscarPorDni() {
    console.log('>>> Filtrar EXCEL [ini]');
    console.log('>>> varDni: ' + this.varDni);

    this.usuarioService.buscarUsuarioDni(this.varDni).subscribe(
      (x) => {
        this.dataSource = x;

        if (this.dataSource && this.dataSource.length > 0) {
          const usuario = this.dataSource[0];
          this.formRegistra.patchValue({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
          });
          this.habilitarRegistrar = false;
        } else {
          // Mostrar alerta si no encuentra al usuario
          Swal.fire('Por favor registrar los nuevos datos del propietario.');
          this.habilitarRegistrar = true;
          this.formRegistra.get('nombres')?.enable();
          this.formRegistra.get('apellidos')?.enable();
          this.formRegistra.patchValue({
            nombres: '',
            apellidos: '',
          });
        }
      },
      (error) => {
        console.log('>>> Error al buscar por DNI: ', error);
        this.limpiarFormulario();
        this.habilitarRegistrar = true;
      }
    );

    console.log('>>> Filtrar [fin]');
}

registrarDatos() {
    const datos = this.formRegistra.value;
    Swal.fire({
      title: 'Confirmación de Registro',
      text: `DNI: ${this.varDni}, Nombres: ${datos.nombres}, Apellidos: ${datos.apellidos}, Placa: ${datos.validaPlaca}, Tipo: ${datos.validaTipoVehiculo}`,
      icon: 'info',
    });

    console.log('>>> Filtrar [fin]');
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.formRegistra.patchValue({
      nombres: '',
      apellidos: '',
      
    });
  }

  registra() {
    // Lógica para registrar al usuario/vehículo
    console.log('Registro exitoso.');
    this.limpiarFormulario();
  }

  ngOnInit(): void {
    // Implementación si es necesaria durante la inicialización del componente
  }
}
