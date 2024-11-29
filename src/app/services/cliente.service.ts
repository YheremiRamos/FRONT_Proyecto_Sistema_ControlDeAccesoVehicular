import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient } from "@angular/common/http";
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


}