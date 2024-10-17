import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import Swal from 'sweetalert2';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { MatStepperModule } from '@angular/material/stepper'; // Importar MatStepperModule
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-agregar-ingreso',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule], // Añadir MatStepperModule aquí
  templateUrl: './agregar-ingreso.component.html',
  styleUrls: ['./agregar-ingreso.component.css']
})
export class AgregarIngresoComponent implements OnInit {
  espacioForm = this.formBuilder.group({
    espacio: ['', Validators.required],
  });
  
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

  
  ngOnInit(): void {

    this.loadWatsonAssistant();

  }

  guardarDatos() {
    // Lógica para guardar los datos
    console.log('Datos guardados', this.formRegistra.value);
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

  limpiarFormulario() {
    this.formRegistra.patchValue({
      nombres: '',
      apellidos: '',
      
    });
  }

  loadWatsonAssistant(): void {
    (window as any).watsonAssistantChatOptions = {
      integrationID: "1d7eb15e-bcf5-4ddb-8486-f8c82f1d58de",
      region: "au-syd",
      serviceInstanceID: "138e5014-a8e7-4f39-a7eb-31c2ebd87e46",
      onLoad: (instance: any) => {
        instance.render();
      }
    };
    

    setTimeout(() => {
      const script = document.createElement('script');
      script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
      document.head.appendChild(script);
    }, 0);
  }

}

