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
import { ingresoVehicularService } from '../../services/ingresoVehicular.service';
import { Cliente } from '../../models/cliente.model';
import { Parqueo } from '../../models/parqueo.model';
import { AccesoVehicular } from '../../models/accesoVehicular.model';
import { UtilService } from '../../services/util.service';
import { forkJoin } from 'rxjs';

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

  objAccesoVehicular: AccesoVehicular = {
    cliente: {
      identificador: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      idCliente: 0 // Añadir idCliente para evitar el error en el acceso
    },
    placaVehiculo: "",
    parqueo: {
      idParqueo: 0 // Añadir idParqueo para evitar el error en el acceso
    },
    espacio: {
      numeroEspacio: 0,
      idEspacio: 0 // Añadir idEspacio para evitar el error en el acceso
    }
  };
  

  formRegistraUsuario = this.formBuilder.group({
    idCliente: [0], // Campo oculto que contiene el ID del cliente
    idUsuario: [0], // Campo oculto para el usuario autenticado
    idParqueo: [0], // Campo oculto para el parqueo
    idEspacio: [0], // Campo oculto para el espacio de parqueo
    tipoUsuario: ['', Validators.min(1)],
    dni: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[0-9]{8,12}$')]],
    nombres: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
    apellidos: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
    telefono: ['', [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]{7,9}$')]],
  });
  

  formRegistraVehiculo = this.formBuilder.group({
    tipoVehiculo: ['', Validators.min(1)],
    placa: ['', [Validators.required, Validators.pattern('^[A-Z]{2}-\\d{3,5}$')]],
    cantPersonas: ['', [Validators.required, Validators.pattern('^[1-9]$')]], 
    espacio: [{ value: '--', disabled: true }, []], 
  });

  objetosEspaciosPP: EspacioParqueo[] = [];
  objetosEspaciosPS: EspacioParqueo[] = [];
  objetosEspaciosPSS: EspacioParqueo[] = [];

  espaciosDiscapacitadoPP: string[] = [];
  espacioGerentePP: string[] = [];
  espaciosGeneralPP: string[] = [];

  espaciosDiscapacitadoPS: string[] = [];
  espacioGerentePS: string[] = [];
  espaciosGeneralPS: string[] = [];

  espaciosDiscapacitadoPSS: string[] = [];
  espacioGerentePSS: string[] = [];
  espaciosGeneralPSS: string[] = [];

  espacioSeleccionado: string = '--';
  dataSource: any;
  filtro: string = '';
  varDni: string = '';

  objCliente: Cliente = {};
  objUsuario: Usuario = {};
  objParqueo: Parqueo = {};
  objEspacio: EspacioParqueo = {};

  dni = '';
  varNombres = '';
  varApellidos = '';
  varTelefono: number = 0;
  varIdTipoUsuario: number = -1;
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
    private ingresoVehicularService: ingresoVehicularService,
    private formBuilder: FormBuilder,
    private espaciService: EspacioParqueoService,
    private utilService: UtilService
  ) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  ngOnInit(): void {
    // this.loadWatsonAssistant();
    this.cargarEspacios();
    // this.usuarioService.listaTipoUsuario().subscribe(x => this.lstTipoUsuario = x);


          // Asigna el idUsuario autenticado desde el tokenService.
      this.formRegistraUsuario.patchValue({
        idUsuario: this.tokenService.getUserId()
      });

  }

  obtenerClienteId(identificador: string) {
    this.utilService.obtenerIdCliente(identificador).subscribe(
      idCliente => {
        this.formRegistraUsuario.patchValue({ idCliente: idCliente ?? 0 });
      },
      error => console.error('Error al obtener idCliente:', error)
    );
  }
  
  obtenerParqueoId(tipoVehiculo: string) {
    this.utilService.obtenerIdParqueo(tipoVehiculo).subscribe(
      idParqueo => {
        this.formRegistraUsuario.patchValue({ idParqueo: idParqueo ?? 0 });
      },
      error => console.error('Error al obtener idParqueo:', error)
    );
  }
  
  
  obtenerEspacioId(numeroEspacio: number) {
    this.utilService.obtenerIdEspacio(numeroEspacio).subscribe(
      idEspacio => {
        this.formRegistraUsuario.patchValue({ idEspacio: idEspacio ?? 0 });
      },
      error => console.error('Error al obtener idEspacio:', error)
    );
  }
  
  guardarDatos() {
    // Asignar IDs directamente a los objetos de acceso vehicular
    this.objAccesoVehicular = {
      cliente: { idCliente: this.formRegistraUsuario.get('idCliente')?.value || 0 },
      usuario: { idUsuario: this.formRegistraUsuario.get('idUsuario')?.value || 0 },
      parqueo: { idParqueo: this.formRegistraUsuario.get('idParqueo')?.value || 0 },
      espacio: { idEspacio: this.formRegistraUsuario.get('idEspacio')?.value || 0 },
      placaVehiculo: this.formRegistraVehiculo.get('placa')?.value || ''
    };
  
    // Llamadas en paralelo usando forkJoin
    const dni = this.formRegistraUsuario.get('dni')?.value;
    const tipoVehiculo = this.formRegistraVehiculo.get('tipoVehiculo')?.value;
    const espacio = this.formRegistraVehiculo.get('espacio')?.value;
  
    // Verificar si es necesario hacer las solicitudes
    const requests = [];
   // Llama a los métodos para obtener y asignar IDs solo si no se han asignado aún
     if (this.objAccesoVehicular.cliente && !this.objAccesoVehicular.cliente.idCliente) {
       const dni = this.formRegistraUsuario.get('dni')?.value;
       if (dni) {
         this.obtenerClienteId(dni);
      }
     }

     if (this.objAccesoVehicular.parqueo && !this.objAccesoVehicular.parqueo.idParqueo) {
      const tipoVehiculo = this.formRegistraVehiculo.get('tipoVehiculo')?.value;
       if (tipoVehiculo) {
         this.obtenerParqueoId(tipoVehiculo);
     }
     }

    if (this.objAccesoVehicular.espacio && !this.objAccesoVehicular.espacio.idEspacio) {
     const espacio = this.formRegistraVehiculo.get('espacio')?.value;
      if (espacio) {
        this.obtenerEspacioId(Number(espacio));
}
  
    if (requests.length > 0) {
      forkJoin(requests).subscribe(
        (responses: any[]) => {
          // Asignar las respuestas de las peticiones a los IDs correspondientes
          if (responses[0]) {
            this.formRegistraUsuario.patchValue({ idCliente: responses[0] ?? 0 });
          }
          if (responses[1]) {
            this.formRegistraUsuario.patchValue({ idParqueo: responses[1] ?? 0 });
          }
          if (responses[2]) {
            this.formRegistraUsuario.patchValue({ idEspacio: responses[2] ?? 0 });
          }
  
          // Ahora que tenemos todos los IDs, procedemos a realizar el registro
          this.ingresoVehicularService.registrarAccesoVehicular(this.objAccesoVehicular).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'info',
                title: 'Resultado del Registro',
                text: response.mensaje,
              });
              console.log('Registro completado:', this.objAccesoVehicular);
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al registrar el acceso vehicular.',
              });
              console.error('Error en el registro:', error);
              console.log('Registro DATOS MAL:', this.objAccesoVehicular);
            },
            complete: () => {
              console.log('Proceso de registro completado.');
            }
          });
        },
        (error) => {
          console.error('Error en las solicitudes:', error);
          Swal.fire('Error', 'Ocurrió un error al obtener los datos necesarios.', 'error');
        }
      );
    } else {
      // Si los IDs ya están disponibles, simplemente registrar
      this.ingresoVehicularService.registrarAccesoVehicular(this.objAccesoVehicular).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'info',
            title: 'Resultado del Registro',
            text: response.mensaje,
          });
          console.log('Registro completado:', this.objAccesoVehicular);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al registrar el acceso vehicular.',
          });
          console.error('Error en el registro:', error);
          console.log('Registro DATOS MAL:', this.objAccesoVehicular);
        },
        complete: () => {
          console.log('Proceso de registro completado.');
        }
      });
    }
  }




//   guardarDatos() {
    
//     // Asignar solo IDs en lugar de objetos completos
//     this.objAccesoVehicular = {
//       cliente: { idCliente: this.formRegistraUsuario.get('idCliente')?.value || 0 },
//       usuario: { idUsuario: this.formRegistraUsuario.get('idUsuario')?.value || 0 },
//       parqueo: { idParqueo: this.formRegistraUsuario.get('idParqueo')?.value || 0 },
//       espacio: { idEspacio: this.formRegistraUsuario.get('idEspacio')?.value || 0 },
//       placaVehiculo: this.formRegistraVehiculo.get('placa')?.value || ''
//     };


//     // Llama a los métodos para obtener y asignar IDs solo si no se han asignado aún
//     if (this.objAccesoVehicular.cliente && !this.objAccesoVehicular.cliente.idCliente) {
//       const dni = this.formRegistraUsuario.get('dni')?.value;
//       if (dni) {
//         this.obtenerClienteId(dni);
//       }
//     }

//     if (this.objAccesoVehicular.parqueo && !this.objAccesoVehicular.parqueo.idParqueo) {
//       const tipoVehiculo = this.formRegistraVehiculo.get('tipoVehiculo')?.value;
//       if (tipoVehiculo) {
//         this.obtenerParqueoId(tipoVehiculo);
//       }
//     }

//     if (this.objAccesoVehicular.espacio && !this.objAccesoVehicular.espacio.idEspacio) {
//       const espacio = this.formRegistraVehiculo.get('espacio')?.value;
//       if (espacio) {
//         this.obtenerEspacioId(Number(espacio));
//       }
// }

//     this.ingresoVehicularService.registrarAccesoVehicular(this.objAccesoVehicular).subscribe({
//         next: (response) => {
//             Swal.fire({
//                 icon: 'info',
//                 title: 'Resultado del Registro',
//                 text: response.mensaje,
//             });
//             console.log('Registro completado:', this.objAccesoVehicular);
//         },
//         error: (error) => {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Ocurrió un error al registrar el acceso vehicular.',
//             });
//             console.error('Error en el registro:', error);
//             console.log('Registro DATOS MAL:', this.objAccesoVehicular);
//         },
//         complete: () => {
//             console.log('Proceso de registro completado.');
//         }
//     });
// }



//   guardarDatos() {
//     // Formatear las fechas antes de asignarlas
//     const currentDate = new Date();
//     this.objAccesoVehicular.fechaRegistro = this.formatDate(currentDate);
//     this.objAccesoVehicular.fechaActualizacion = this.formatDate(currentDate);

//     //CLIENTE
//     if (this.objAccesoVehicular.cliente ) {
//       this.objAccesoVehicular.cliente.identificador = this.formRegistraUsuario.get('dni')?.value || '';
//       this.objAccesoVehicular.cliente.nombres = this.formRegistraUsuario.get('nombres')?.value || '';
//       this.objAccesoVehicular.cliente.apellidos = this.formRegistraUsuario.get('apellidos')?.value || '';
//       this.objAccesoVehicular.cliente.telefono = this.formRegistraUsuario.get('telefono')?.value || '';
//   } else {
//       // Si cliente no existe, inicializarlo
//       this.objAccesoVehicular.cliente = {
//           identificador: this.formRegistraUsuario.get('dni')?.value || '',
//           nombres: this.formRegistraUsuario.get('nombres')?.value || '',
//           apellidos: this.formRegistraUsuario.get('apellidos')?.value || '',
//           telefono: this.formRegistraUsuario.get('telefono')?.value || '',
//       };
//   }

//     //VEHICULO
//     if (this.objAccesoVehicular.espacio) {
//       this.objAccesoVehicular.espacio.tipoEspacio = this.formRegistraUsuario.get('tipoUsuario')?.value || '';
//       this.objAccesoVehicular.espacio.numeroEspacio = Number(this.formRegistraUsuario.get('espacio')?.value || '')
//     }

//     this.objAccesoVehicular.placaVehiculo = this.formRegistraVehiculo.get('placa')?.value || '';


//     // Realizar el registro
//     this.ingresoVehicularService.registrarAccesoVehicular(this.objAccesoVehicular).subscribe({
//       next: (response) => {
//           Swal.fire({
//               icon: 'info',
//               title: 'Resultado del Registro',
//               text: response.mensaje,
//           });
//           console.log('Registro completado:', this.objAccesoVehicular);
//       },
//       error: (error) => {
//           Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: 'Ocurrió un error al registrar el acceso vehicular.',
//           });
//           console.error('Error en el registro:', error);
//           console.log('Registro DATOS MAL:', this.objAccesoVehicular);
//       },
//       complete: () => {
//           console.log('Proceso de registro completado.');
//       }
//   });
  
// }

// Método para formatear la fecha en "yyyy-MM-dd hh:mm:ss"
private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  

  buscarPorDni() {
    this.usuarioService.buscarCliente(this.varDni).subscribe(
      x => {
        this.dataSource = x;

        if (this.dataSource && this.dataSource.length > 0) {
          const usuario = this.dataSource[0];
          this.formRegistraUsuario.patchValue({ nombres: usuario.nombres, apellidos: usuario.apellidos });
          this.varNombres = usuario.nombres;
          this.varApellidos = usuario.apellidos;
        } else {
          Swal.fire('Por favor registrar los nuevos datos del propietario.');
          this.formRegistraUsuario.get('nombres')?.enable();
          this.formRegistraUsuario.get('apellidos')?.enable();
          this.formRegistraUsuario.patchValue({ nombres: '', apellidos: '' });
          this.varNombres = '';
          this.varApellidos = '';
        }
      },
      error => {
        console.error('Error al buscar por DNI: ', error);
        this.limpiarFormulario();
      }
    );
  }

  limpiarFormulario() {
    this.formRegistraUsuario.patchValue({ nombres: '', apellidos: '' });
    this.varNombres = '';
    this.varApellidos = '';
  }

  // loadWatsonAssistant(): void {
  //   (window as any).watsonAssistantChatOptions = {
  //     integrationID: "1d7eb15e-bcf5-4ddb-8486-f8c82f1d58de",
  //     region: "au-syd",
  //     serviceInstanceID: "138e5014-a8e7-4f39-a7eb-31c2ebd87e46",
  //     onLoad: (instance: any) => instance.render(),
  //   };

  //   setTimeout(() => {
  //     const script = document.createElement('script');
  //     script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
  //     document.head.appendChild(script);
  //   }, 0);
  // }

  seleccionarEspacio(espacio: string) {
    this.espacioSeleccionado = espacio;
    console.log('Espacio seleccionado:', espacio);
  }

  cargarEspacios() {
    this.traerEspaciosParqueoPrincipal();
    this.traerEspaciosParqueoSotano();
    this.traerEspaciosParqueoSemiSotano();
  }

  traerEspaciosParqueoPrincipal() {
    this.espaciService.listarEspaciosPorIdParqueo(1).subscribe(
      esp => {
        this.objetosEspaciosPP = esp;
        this.objetosEspaciosPP.forEach(espacio => {
          if (espacio.numeroEspacio !== undefined && espacio.estado === "disponible") {
            if (espacio.tipoEspacio === "general") {
              this.espaciosGeneralPP.push(espacio.numeroEspacio.toString());
            } else if (espacio.tipoEspacio === "discapacitado") {
              this.espaciosDiscapacitadoPP.push(espacio.numeroEspacio.toString());
            } else {
              this.espacioGerentePP.push(espacio.numeroEspacio.toString());
            }
          }
        });
      }
    );
  }

  traerEspaciosParqueoSotano() {
    this.espaciService.listarEspaciosPorIdParqueo(2).subscribe(
      esp => {
        this.objetosEspaciosPS = esp;
        this.objetosEspaciosPS.forEach(espacio => {
          if (espacio.numeroEspacio !== undefined && espacio.estado === "disponible") {
            if (espacio.tipoEspacio === "general") {
              this.espaciosGeneralPS.push(espacio.numeroEspacio.toString());
            } else if (espacio.tipoEspacio === "discapacitado") {
              this.espaciosDiscapacitadoPS.push(espacio.numeroEspacio.toString());
            } else {
              this.espacioGerentePS.push(espacio.numeroEspacio.toString());
            }
          }
        });
      }
    );
  }

  traerEspaciosParqueoSemiSotano() {
    this.espaciService.listarEspaciosPorIdParqueo(3).subscribe(
      esp => {
        this.objetosEspaciosPSS = esp;
        this.objetosEspaciosPSS.forEach(espacio => {
          if (espacio.numeroEspacio !== undefined && espacio.estado === "disponible") {
            if (espacio.tipoEspacio === "general") {
              this.espaciosGeneralPSS.push(espacio.numeroEspacio.toString());
            } else if (espacio.tipoEspacio === "discapacitado") {
              this.espaciosDiscapacitadoPSS.push(espacio.numeroEspacio.toString());
            } else {
              this.espacioGerentePSS.push(espacio.numeroEspacio.toString());
            }
          }
        });
      }
    );
  }

  guardarNombresApe() {
    const nombresBuscado = this.formRegistraUsuario.get('nombres')?.value ?? ''; 
    const apellidosBuscado = this.formRegistraUsuario.get('apellidos')?.value ?? '';

    this.varNombres= nombresBuscado;
    this.varApellidos = apellidosBuscado;
  
    console.log('Nombres guardados:', this.varNombres);
    console.log('Apellidos guardados:', this.varApellidos);   
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
    if (this.formRegistraVehiculo.invalid === true || this.espacioSeleccionado === "--") {
      //console.log("hay campos vacíos en vehículo");
      return true; 
    } else {
      return false; 
    }
  }
  


}
