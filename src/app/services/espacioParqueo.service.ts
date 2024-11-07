import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EspacioParqueo } from "../models/espacioParqueo";

const baseUrlEspacioParqueo = AppSettings.API_ENDPOINT + '/espacioParqueo';


@Injectable({
    providedIn: 'root'
})
export class EspacioParqueoService {
    constructor(private http: HttpClient){}

   listarEspaciosPorIdParqueo(idParqueo: number): Observable<EspacioParqueo[]>{
        return this.http.get<EspacioParqueo[]>(`${baseUrlEspacioParqueo}/listarEspaciosIdParqueo/${idParqueo}`);
    }



 // Método para eliminar un espacio de parqueo
 eliminarEspacioParqueo(id: number): Observable<any> {
    return this.http.delete(`/api/espacios-parqueo/${id}`);
  }

  // Método para obtener los espacios de parqueo
  obtenerEspaciosParqueo(idParqueo: number): Observable<EspacioParqueo[]>{
    return this.http.get<EspacioParqueo[]>(`${baseUrlEspacioParqueo}/listarEspaciosIdParqueo/${idParqueo}`);
  }

  // Otros métodos relacionados con los espacios de parqueo



}