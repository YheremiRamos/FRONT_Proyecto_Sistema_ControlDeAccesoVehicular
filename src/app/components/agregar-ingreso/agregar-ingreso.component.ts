import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import Swal from 'sweetalert2';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { MatStepperModule } from '@angular/material/stepper'; 
import { UsuarioService } from '../../services/usuario.service';
import { TipoUsuario } from '../../models/tipoUsuario.model';
import { EspacioParqueo } from '../../models/espacioParqueo';
import { EspacioParqueoService } from '../../services/espacioParqueo.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-agregar-ingreso',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule], 
  templateUrl: './agregar-ingreso.component.html',
  styleUrls: ['./agregar-ingreso.component.css']
})
export class AgregarIngresoComponent implements OnInit {
  espacioForm = this.formBuilder.group({
    espacio: ['', Validators.required],
  });

  formRegistraUsuario = this.formBuilder.group({
    validaDni: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[0-9]{8,12}$')]],
    nombres: [{ value: '', disabled: true, }, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
    apellidos: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
    validaTipoUsuario: ['', Validators.min(1)],
    validaTelefono: ['', [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]{7,9}$')]],
  });

  formRegistra = this.formBuilder.group({
    validaTipoVehiculo: ['', Validators.min(1)],
    validaPlaca: ['', [Validators.required, Validators.pattern('^[A-Z]{2}-\\d{3,5}$')]], // Formato: AA-1234 o AA-12345
    validaCantPersonas: ['', [Validators.required, Validators.pattern('^[1-9]$')]], 
    validaEspacio: [{ value: '--', disabled: true }, []], 
  });

 
  objetosEspaciosPP: EspacioParqueo[] = [];
  objetosEspaciosPS: EspacioParqueo[] = []
  objetosEspaciosPSS: EspacioParqueo[] = []

  // Datos relacionados con el estacionamiento
     espaciosDiscapacitadoPP: string[] = []
     espacioGerentePP: string[] = []
     espaciosGeneralPP: string[] = []

     espaciosDiscapacitadoPS: string[] = []
     espacioGerentePS: string[] = []
     espaciosGeneralPS: string[] = []

     espaciosDiscapacitadoPSS: string[] = []
     espacioGerentePSS: string[] = []
     espaciosGeneralPSS: string[] = []

  //espaciosPP: string[] = []
  //espaciosPS: string[] = []
  //espaciosPSS: string[] =  []

  

  espacioSeleccionado: string = '--';  // Almacenar el espacio seleccionado
  dataSource: any;
  filtro: string = '';
  varDni: string = '';
  objUsuario: Usuario = {};
  dni = '';
  nombres = '';
  apellidos = '';
  telefono : number = 0;

  varIdTipoUsuario : number = -1;
  lstTipoUsuario: TipoUsuario[] = [];

  horaIngreso: Date = new Date();
  formattedDate = this.horaIngreso.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private espaciService: EspacioParqueoService
  ) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log('constructor >> constructor >>> ' + this.tokenService.getToken());
  }

  ngOnInit(): void {
    this.loadWatsonAssistant();
    this.cargarEspacios();

    this.usuarioService.listaTipoUsuario().subscribe(
      x => this.lstTipoUsuario = x
    );

  }

  guardarDatos() {
    // Lógica para guardar los datos
    console.log('Datos guardados', this.formRegistra.value);
  }

  

  buscarPorDni() {
    console.log('>>> Filtrar DATOS [ini]');
    console.log('>>> varDni: ' + this.varDni);


    this.usuarioService.buscarUsuarioDni(this.varDni).subscribe(
      (x) => {
        this.dataSource = x;
  
        if (this.dataSource && this.dataSource.length > 0) {
          const usuario = this.dataSource[0];
  
          // Actualiza tanto el formulario como las variables locales
          this.formRegistraUsuario.patchValue({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
          });
  
          // Asigna los valores a las variables locales
          this.nombres = usuario.nombres;
          this.apellidos = usuario.apellidos;

          console.log('>>> Nombres1: ' + this.nombres);
          console.log('>>> Apellidos1: ' + this.apellidos);

        } else {
          // Mostrar alerta si no encuentra al usuario
          Swal.fire('Por favor registrar los nuevos datos del propietario.');
          this.formRegistraUsuario.get('nombres')?.enable();
          this.formRegistraUsuario.get('apellidos')?.enable();
          this.formRegistraUsuario.patchValue({
            nombres: '',
            apellidos: '',
          });
  
          // Limpia las variables locales también
          this.nombres = '';
          this.apellidos = '';
        }
      },
      (error) => {
        console.log('>>> Error al buscar por DNI: ', error);
        this.limpiarFormulario();
      }
    );
    console.log('>>> Nombres2: ' + this.nombres);
    console.log('>>> Apellidos2: ' + this.apellidos);
    console.log('>>> Filtrar [fin]');
  }
  


  limpiarFormulario() {
    this.formRegistraUsuario.patchValue({
      nombres: '',
      apellidos: '',
    });
  
    // Limpia las variables locales también (BUENA PRACTICA)
    this.nombres = '';
    this.apellidos = '';
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

  seleccionarEspacio(espacio: string) {
    this.espacioSeleccionado = espacio;  // Almacena el espacio seleccionado
    console.log('Espacio seleccionado:', espacio);
  }

  //Datos en consola
  consoleDates(){
    console.log(this.formRegistraUsuario.value.nombres);  
    console.log(this.formRegistraUsuario.value.apellidos);
  }




  guardarNombresApe() {
    const nombresBuscado = this.formRegistraUsuario.get('nombres')?.value ?? ''; 
    const apellidosBuscado = this.formRegistraUsuario.get('apellidos')?.value ?? '';

    this.nombres= nombresBuscado;
    this.apellidos = apellidosBuscado;
  
    console.log('Nombres guardados:', this.nombres);
    console.log('Apellidos guardados:', this.apellidos);   
  }
  
     
    //____________________ Mostrar espacios registrados según Parqueo ____________________
    traerEspaciosParqueoPrincipal(){
      var tipoEsp:String;
      this.espaciService.listarEspaciosPorIdParqueo(1).subscribe(
        esp => {this.objetosEspaciosPP = esp
                //Mostrar en consola apenas se traigan datos
                console.log('Objeto espacios parqueo 1', this.objetosEspaciosPP)
                // Acceder a cada objeto y a cada valor
                this.objetosEspaciosPP.forEach((espacio) => {
                      //Llenar el Arreglo
                      if (espacio.numeroEspacio !== undefined && espacio.estado === "disponible") {
                        //console.log('Espacios Parqueo Principal: ', this.espaciosPP)
                        if(espacio.tipoEspacio === "general") {
                          this.espaciosGeneralPP.push(espacio.numeroEspacio.toString())
                          tipoEsp = espacio.numeroEspacio.toString();
                          console.log(tipoEsp)
                        } else if(espacio.tipoEspacio === "discapacitado") {
                          tipoEsp = espacio.numeroEspacio.toString() + "♿";
                          this.espaciosDiscapacitadoPP.push(espacio.numeroEspacio.toString())
                        } else {
                          this.espacioGerentePP.push(espacio.numeroEspacio.toString())
                        }
                        //this.espaciosPP.push(tipoEsp.toString());
                      } else {
                          console.warn('numeroEspacio es undefined para este espacio:', espacio);
                      }
                });
              });
    }
    traerEspaciosParqueoSotano(){
      this.espaciService.listarEspaciosPorIdParqueo(2).subscribe(
        esp => {this.objetosEspaciosPS = esp
                this.objetosEspaciosPS.forEach((espacio) => {
                      if (espacio.numeroEspacio !== undefined && espacio.estado === "disponible") {
                        if(espacio.tipoEspacio === "general") {
                          this.espaciosGeneralPS.push(espacio.numeroEspacio.toString())
                        } else if(espacio.tipoEspacio === "discapacitado") {
                          this.espaciosDiscapacitadoPS.push(espacio.numeroEspacio.toString())
                        } else {
                          this.espacioGerentePS.push(espacio.numeroEspacio.toString())
                        }
                      } else {
                          console.warn('numeroEspacio es undefined para este espacio:', espacio);
                      }
                });
              });
    }
    traerEspaciosParqueoSemiSotano(){
      this.espaciService.listarEspaciosPorIdParqueo(3).subscribe(
        esp => {this.objetosEspaciosPSS = esp
                this.objetosEspaciosPSS.forEach((espacio) => {
                  //Llenar el Arreglo
                      if (espacio.numeroEspacio !== undefined && espacio.estado === "disponible") {
                        if(espacio.tipoEspacio === "general") {
                          this.espaciosGeneralPSS.push(espacio.numeroEspacio.toString())
                        } else if(espacio.tipoEspacio === "discapacitado") {
                          this.espaciosDiscapacitadoPSS.push(espacio.numeroEspacio.toString())
                        } else {
                          this.espacioGerentePSS.push(espacio.numeroEspacio.toString())
                        }
                      } else {
                          console.warn('numeroEspacio es undefined para este espacio:', espacio);
                      }
                      console.log("______________________________________")
                      console.log('Tipo Espacio:', espacio.tipoEspacio);
                      console.log('Número Espacio:', espacio.numeroEspacio);
                      console.log("______________________________________")
                });
              });
    }
    cargarEspacios(){
      this.traerEspaciosParqueoPrincipal();
      this.traerEspaciosParqueoSotano();
      this.traerEspaciosParqueoSemiSotano();
    }

    habilitarBtnSiguienteRegistroUsuario() {
      if (this.formRegistraUsuario.controls.nombres.value?.trim() === "" || this.formRegistraUsuario.controls.apellidos.value?.trim() === "" || this.formRegistraUsuario.invalid === true) {
        //console.log("hay campos vacíos en cliente");
        return true; 
      } else {
        return false; 
      }
    }

    habilitarBtnSiguienteRegistroVehiculo(){
      if (this.formRegistra.invalid === true || this.espacioSeleccionado === "--") {
        //console.log("hay campos vacíos en vehículo");
        return true; 
      } else {
        return false; 
      }
    }
    

    
}
