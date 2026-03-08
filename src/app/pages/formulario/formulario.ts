import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InvitadoService } from '../../core/services/invitado';
import { TipoAutobusVuelta } from '../../core/models/invitado.model';

@Component({
  selector: 'app-formulario',
  standalone: true,
  // ReactiveFormsModule es imprescindible para usar FormGroup y formControlName en el HTML.
  // Router lo necesitamos para poder redirigir si fuera necesario en el futuro.
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.html',
  styleUrl: './formulario.scss'
})
export class Formulario {

  // Exponemos el enum al template para poder usarlo en el HTML.
  // Sin esto, el HTML no podría referenciar TipoAutobusVuelta.PrimerServicio, etc.
  readonly TipoAutobusVuelta = TipoAutobusVuelta;

  // --- SIGNALS DE ESTADO ---
  // Estos signals controlan el estado visual del formulario.
  // Cuando cambia cualquiera de ellos, Angular actualiza automáticamente
  // solo las partes del HTML que los usan, sin re-renderizar todo.

  /** Indica si el formulario está siendo enviado (para deshabilitar el botón y mostrar spinner) */
  enviando = signal(false);

  /** Indica si el envío fue exitoso (para mostrar el mensaje de confirmación) */
  enviado = signal(false);

  /** Almacena el mensaje de error si el envío falla, o null si no hay error */
  errorEnvio = signal<string | null>(null);

  // --- FORMULARIO REACTIVO ---
  // FormBuilder es un servicio de Angular que simplifica la creación de FormGroups.
  // Lo inyectamos en el constructor junto con el servicio de invitados y el router.
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invitadoService: InvitadoService,
    private router: Router
  ) {
    // Definimos el modelo del formulario con sus validaciones.
    // Validators.required hace que el campo sea obligatorio.
    // Validators.email valida que el formato del email sea correcto.
    // El segundo elemento del array es el valor inicial del campo.
    this.formulario = this.fb.group({
      nombre:                  ['', Validators.required],
      apellidos:               ['', Validators.required],
      email:                   ['', [Validators.required, Validators.email]],
      asistencia:              [null, Validators.required],
      condicionesAlimentarias: [''],
      autobusIda:              [false],
      autobusVuelta:           [TipoAutobusVuelta.NoCogeAutobus]
    });
  }

  // Getter de conveniencia para acceder a los controles del formulario
  // desde el HTML sin tener que escribir formulario.controls.nombre cada vez.
  get f() { return this.formulario.controls; }

  /** Devuelve true si el campo fue tocado por el usuario y tiene errores.
   *  Esto nos permite mostrar mensajes de validación solo después de que
   *  el usuario haya interactuado con el campo, no desde el principio. */
  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /** Maneja el envío del formulario */
  onSubmit(): void {
    // Si el formulario tiene errores de validación, marcamos todos los campos
    // como "tocados" para que se muestren los mensajes de error, y salimos.
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // Activamos el estado de carga y limpiamos cualquier error previo
    this.enviando.set(true);
    this.errorEnvio.set(null);

    // Llamamos al servicio. El método subscribe() es cómo Angular
    // "escucha" el resultado de una petición HTTP asíncrona.
    // next: se ejecuta si la petición tiene éxito (código 2xx del backend)
    // error: se ejecuta si la petición falla (código 4xx, 5xx o error de red)
    this.invitadoService.enviarFormulario(this.formulario.value).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true); // Muestra el mensaje de éxito
      },
      error: (err) => {
        this.enviando.set(false);
        // Intentamos mostrar el mensaje de error del backend si existe,
        // o un mensaje genérico si no podemos leerlo.
        this.errorEnvio.set(
          err?.error?.message ?? 'Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo.'
        );
      }
    });
  }
}