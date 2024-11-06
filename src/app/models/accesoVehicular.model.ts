import { Cliente } from "./cliente.model";
import { EspacioParqueo } from "./espacioParqueo";
import { Parqueo } from "./parqueo.model";

import { Usuario } from "./usuario.model";

export class AccesoVehicular {

    idAccesoVehicular?: number;
    cliente?: Cliente;
    usuario?: Usuario;
    parqueo?: Parqueo;
    espacio?: EspacioParqueo;

    placaVehiculo?: string;
    estado?: string;
    
    fechaRegistro?: Date | string;
    fechaActualizacion?: Date | string;

}
