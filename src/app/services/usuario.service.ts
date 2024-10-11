import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const baseUrlConsultaUsuario = AppSettings.API_ENDPOINT + '/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }


  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlConsultaUsuario + "/buscarUsuarioPorDni" + filtro);
  }

  //Buscar
  buscarUsuarioDni(dni: string): Observable<any> {
    const params = new HttpParams()
      .set("dni", dni)

    return this.http.get(baseUrlConsultaUsuario + "/buscarUsuarioPorDni", { params });
  }


}
