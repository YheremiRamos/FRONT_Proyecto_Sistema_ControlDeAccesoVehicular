import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Alumno } from '../models/alumno.model';
import { Pais } from '../models/pais.model';
import { DataCatalogo } from '../models/dataCatalogo.model';
import { Editorial } from '../models/editorial.model';
import { Ubicacion } from '../models/ubicacion.model';
import { TipoParqueo } from '../models/tipoParqueo.model';
import { TipoVehiculo } from '../models/tipoVehiculo.model';
import { EstadoEspacios } from '../models/estadoEspacios.model';
import { TipoUbicacion } from '../models/tipoUbicacion.model';

const baseUrlUtil = AppSettings.API_ENDPOINT+ '/util';

const baseUrl = AppSettings.API_ENDPOINT+ '/accesoVehicular';

const baseUrlCBOS = AppSettings.API_ENDPOINT+ '/utilCBO';



@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http:HttpClient) { }

  listaPais():Observable<Pais[]>{
    return this.http.get<Pais[]>(baseUrlUtil+"/listaPais");
  }

  listaAlumno():Observable<Alumno[]>{
    return this.http.get<Alumno[]>(baseUrlUtil+"/listaAlumno");
  }

  listaCategoriaDeLibro():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaCategoriaDeLibro");
  }

  listaTipoProveedor():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaTipoProveedor");
  }

  listaModalidadAlumno():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaModalidadAlumno");
  }

  listaGradoAutor():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaGradoAutor");
  }

  listaTipoLibroRevista():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaTipoLibroRevista");
  }

  listaTipoSala():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaTipoSala");
  }

  listaSede():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaSede");
  }

  listaEstadoLibro():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaEstadoLibro");
  }

  listaEstadoSala():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaEstadoSala");
  }

  listaCentroEstudios():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaCentroEstudios");
  }

  listaIdioma():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaIdioma");
  }

  listaTemaTesis():Observable<DataCatalogo[]>{
    return this.http.get<DataCatalogo[]>(baseUrlUtil+"/listaTemaTesis");
  }

  listaEditorial():Observable<Editorial[]>{
    return this.http.get<Editorial[]>(baseUrlUtil+"/listaEditorial");
  }

  /*------------------------------CRUD PARQUEO--------------------------------------------*/
  listaUbicacion():Observable<Ubicacion[]>{
    return this.http.get<Ubicacion[]>(baseUrlCBOS+"/listaUbicacion");
  }

  listaTipoUbicacion():Observable<TipoUbicacion[]>{
    return this.http.get<TipoUbicacion[]>(baseUrlCBOS+"/listaTipoUbicacion");
  }

  listaTipoParqueo():Observable<TipoParqueo[]>{
    return this.http.get<TipoParqueo[]>(baseUrlCBOS+"/listaTipoParqueo");
  }

  listaTipoVehiculo():Observable<TipoVehiculo[]>{
    return this.http.get<TipoVehiculo[]>(baseUrlCBOS+"/listaTipoVehiculo");
  }

  listaEstadoEspacios():Observable<EstadoEspacios[]>{
    return this.http.get<EstadoEspacios[]>(baseUrlCBOS+"/listaEstadoEspacios");
  }

  /*------------------------------CRUD PARQUEO--------------------------------------------*/
  // Método para obtener el ID de un Cliente por DNI
  obtenerIdCliente(dni: string): Observable<number> {
    return this.http.get<number>(`${baseUrl}/cliente/id/${dni}`);
  }

  // Método para obtener el ID de un Parqueo por nombre
  obtenerIdParqueo(nombre: string): Observable<number> {
    return this.http.get<number>(`${baseUrl}/parqueo/id/${nombre}`);
  }

  // Método para obtener el ID de un Espacio de Parqueo por número
  obtenerIdEspacio(numeroEspacio: number): Observable<number> {
    return this.http.get<number>(`${baseUrl}/espacio/id/${numeroEspacio}`);

  }

}


