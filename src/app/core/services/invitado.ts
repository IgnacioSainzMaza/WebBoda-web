import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnviarFormularioRequest, InvitadoDto, ModificarFormularioRequest } from '../models/invitado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  // 'root' significa que Angular crea una única instancia de este servicio
  // para toda la aplicación y la reutiliza en todos los componentes que lo pidan.
  // Es el equivalente a AddScoped en .NET, pero a nivel de toda la app.
  providedIn: 'root'
})
export class InvitadoService {

  // La URL base de la API se lee del archivo environment.ts,
  // que permite tener valores diferentes para desarrollo y producción
  // sin tocar el código del servicio.
  private readonly apiUrl = `${environment.apiUrl}/api/invitados`;

  // Angular inyecta HttpClient automáticamente gracias al decorador @Injectable.
  // HttpClient es el equivalente al HttpClient de .NET: sabe hacer peticiones
  // GET, POST, PUT, etc. y devuelve Observables (el sistema de asincronía de Angular).
  constructor(private http: HttpClient) {}

  // GET /api/invitados/{token}
  // Obtiene las respuestas previas del invitado para precargar el formulario.
  // Devuelve un Observable<InvitadoDto>: cuando el componente se suscriba,
  // recibirá los datos o un error.
  obtenerInvitado(token: string): Observable<InvitadoDto> {
    return this.http.get<InvitadoDto>(`${this.apiUrl}/${token}`);
  }

  // POST /api/invitados
  // Primer envío del formulario. No requiere token.
  enviarFormulario(datos: EnviarFormularioRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, datos);
  }

  // PUT /api/invitados/{token}
  // Modificación de un formulario ya enviado.
  modificarFormulario(token: string, datos: ModificarFormularioRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${token}`, datos);
  }
}