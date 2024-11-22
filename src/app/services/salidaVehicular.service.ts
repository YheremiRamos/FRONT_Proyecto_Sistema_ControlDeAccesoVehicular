import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const baseUrlSalidaVehicular = AppSettings.API_ENDPOINT + '/accesoVehicular';


@Injectable({
    providedIn: 'root'
})
export class salidaVehicularService {
    constructor(private http: HttpClient){}


    listarSalidaVehicular(): Observable<any[]> {
        return this.http.get<any[]>(`${baseUrlSalidaVehicular}/listarSalidaVehicular`);
    }

    registrarIncidencia(idCliente: number): Observable<any> {
        const url = `${baseUrlSalidaVehicular}/registrarIncidencia/${idCliente}`;
        return this.http.post(url, null, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text'  // Especifica que esperas una respuesta de tipo texto
        });
    }

    registrarSalida(idAccesoVehicula: number): Observable<any> {
        const url = `${baseUrlSalidaVehicular}/registrarSalida/${idAccesoVehicula}`;
        return this.http.post(url, null, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text'  
        });
    }

    
    
}