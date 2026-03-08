// Este enum es el espejo exacto del TipoAutobusVuelta del backend.
// TypeScript necesita saber los valores posibles para que el compilador
// pueda avisarte si cometes un error al asignar un valor incorrecto.
export enum TipoAutobusVuelta {
  NoCogeAutobus = 0,
  PrimerServicio = 1,
  SegundoServicio = 2
}

// Esta interfaz representa los datos que el backend devuelve en el GET
// (cuando el invitado accede al enlace de modificación).
// Nótese que coincide exactamente con InvitadoDto.cs del backend.
export interface InvitadoDto {
  nombre: string;
  apellidos: string;
  email: string;
  asistencia: boolean;
  condicionesAlimentarias: string | null;
  autobusIda: boolean;
  autobusVuelta: TipoAutobusVuelta;
  cancion: string | null;
}

// Esta interfaz representa los datos que el frontend envía al backend
// en el POST (primer envío) y en el PUT (modificación).
// Coincide con EnviarFormularioCommand.cs del backend.
export interface EnviarFormularioRequest {
  nombre: string;
  apellidos: string;
  email: string;
  asistencia: boolean;
  condicionesAlimentarias: string | null;
  autobusIda: boolean;
  autobusVuelta: TipoAutobusVuelta;
  cancion: string | null;
}

// Para la modificación los campos son los mismos excepto el email,
// que no se puede cambiar. Usamos Omit para reutilizar la interfaz
// anterior sin repetir código: le decimos "todo lo de EnviarFormularioRequest
// excepto el campo email".
export type ModificarFormularioRequest = Omit<EnviarFormularioRequest, 'email'>;