import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TipoUsuario } from '../models/tipoUsuario.model';

const baseUrlConsultaUsuario = AppSettings.API_ENDPOINT + '/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlConsultaUsuario + "/buscarUsuarioPorDni" + filtro);
  }

  //Buscar Usuario por Dni
  buscarUsuarioDni(dni: string): Observable<any> {
    const params = new HttpParams()
      .set("dni", dni)

    return this.http.get(baseUrlConsultaUsuario + "/buscarUsuarioPorDni", { params });
  }

    //Buscar Cliente por Identificador
    buscarCliente(identificador: string): Observable<any> {
      const params = new HttpParams()
        .set("identificador", identificador)
  
      return this.http.get(baseUrlConsultaUsuario + "/buscarClientePorDni", { params });
    } 

  listaTipoUsuario():Observable<TipoUsuario[]>{
    return this.http.get<TipoUsuario[]>(baseUrlConsultaUsuario+"/listarTipoUsuario");
  }

}
