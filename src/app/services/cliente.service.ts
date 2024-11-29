import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { Cliente } from "../models/cliente.model";

const baseUrCliente = AppSettings.API_ENDPOINT + '/cliente';


@Injectable({
    providedIn: 'root'
})
export class clienteService {
    constructor(private http: HttpClient){}




     // Método para obtener todos los clientes
  obtenerClientes(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${baseUrCliente}`);
  }

/*PDF Descarga incidencias*/

//Consultar
consultarClienteComplejo(nombres: string, apellidos: string, identificador:string): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nombres)
      .set("apellidos", apellidos)
      .set("identificador", identificador);
  
    return this.http.get(baseUrCliente + "/consultaClientePorParametros", { params });
  }
  
  

}