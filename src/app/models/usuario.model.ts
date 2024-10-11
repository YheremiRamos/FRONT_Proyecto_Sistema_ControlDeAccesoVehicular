import { DataCatalogo } from "./dataCatalogo.model";
import { Pais } from "./pais.model";

export class Usuario {

    idUsuario?: number;
    nombres?: string;
    apellidos?: string;
    telefono?: number;
    dni?: string;
    login?: string;
    password?: string;
    correo?: string;
    fechaRegistro?: Date;
    fechaNacimiento?: Date;
    direccion?: string;
   
}
