import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient } from "@angular/common/http";
import { AccesoVehicular } from "../models/accesoVehicular.model";
import { Observable } from "rxjs";

const baseUrlIngresoVehicular = AppSettings.API_ENDPOINT + '/accesoVehicular';


@Injectable({
    providedIn: 'root'
})
export class ingresoVehicularService {
    constructor(private http: HttpClient){}

    registrarAccesoVehicular(obj: AccesoVehicular): Observable<any> {
        return this.http.post(`${baseUrlIngresoVehicular}/registraAV`, obj);
    }

}