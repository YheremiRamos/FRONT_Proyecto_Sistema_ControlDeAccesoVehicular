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
}