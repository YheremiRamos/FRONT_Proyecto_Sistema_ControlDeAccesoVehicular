import { EstadoEspacios } from "./estadoEspacios.model";
import { TipoUbicacion } from "./tipoUbicacion.model";

export class Ubicacion {
    idUbicacion?: number; // ID único de la ubicación

    nombreUbicacion?: string; // Ejemplo: "Sótano A", "Piso 1"

    tipoUbicacion?: TipoUbicacion; // Referencia al tipo de ubicación asociada

    estadoEspacios?: EstadoEspacios; // Referencia al estado de los espacios asociados

    limiteParqueos?: number; // Máximo número de parqueos en esta ubicación
}
