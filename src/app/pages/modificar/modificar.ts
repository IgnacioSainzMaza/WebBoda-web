import { Component, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvitadoService } from '../../core/services/invitado';
import { TipoAutobusVuelta } from '../../core/models/invitado.model';

@Component({
  selector: 'app-modificar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './modificar.html',
  styleUrl: './modificar.scss'
})
export class Modificar implements OnInit {

  readonly TipoAutobusVuelta = TipoAutobusVuelta;

  // --- SIGNALS DE ESTADO ---
  // Este componente tiene un estado adicional respecto al formulario:
  // la carga inicial de los datos existentes del invitado.
  cargando = signal(true);        // Mientras carga los datos del backend
  errorCarga = signal<string | null>(null);  // Si falla la carga inicial
  enviando  = signal(false);
  enviado   = signal(false);
  errorEnvio = signal<string | null>(null);

  // El token se obtiene de la URL (ej: /modificar/abc123)
  // y se usará para llamar al GET y al PUT del backend.
  private token!: string;

  formulario: FormGroup;

  // ActivatedRoute es el servicio de Angular que permite leer
  // los parámetros de la URL actual. Lo usamos para extraer el token.
  constructor(
    private fb: FormBuilder,
    private invitadoService: InvitadoService,
    private route: ActivatedRoute
  ) {
    this.formulario = this.fb.group({
      nombre:                  ['', Validators.required],
      apellidos:               ['', Validators.required],
      // El email NO es editable en la modificación (decisión de negocio).
      // Lo mostramos deshabilitado para que el invitado vea cuál es,
      // pero no pueda cambiarlo.
      email:                   [{ value: '', disabled: true }],
      asistencia:              [null, Validators.required],
      condicionesAlimentarias: [''],
      cancion:                 [''],
      autobusIda:              [false],
      autobusVuelta:           [TipoAutobusVuelta.NoCogeAutobus]
    });
  }

  ngOnInit(): void {
    // snapshot.params lee los parámetros de la URL en el momento de cargar.
    // Para rutas que no cambian mientras el componente está activo (como esta),
    // snapshot es suficiente y más sencillo que suscribirse al Observable de params.
    this.token = this.route.snapshot.params['token'];

    if (!this.token) {
      this.errorCarga.set('El enlace de modificación no es válido.');
      this.cargando.set(false);
      return;
    }

    // Llamamos al GET para obtener los datos existentes del invitado
    // y precargar el formulario con ellos.
    this.invitadoService.obtenerInvitado(this.token).subscribe({
      next: (invitado) => {
        // patchValue rellena el formulario con los datos recibidos.
        // A diferencia de setValue, patchValue permite rellenar solo
        // algunos campos sin necesidad de especificar todos.
        this.formulario.patchValue({
          nombre:                  invitado.nombre,
          apellidos:               invitado.apellidos,
          email:                   invitado.email,
          asistencia:              invitado.asistencia,
          condicionesAlimentarias: invitado.condicionesAlimentarias ?? '',
          cancion:                 invitado.cancion ?? '',
          autobusIda:              invitado.autobusIda,
          autobusVuelta:           invitado.autobusVuelta
        });
        this.cargando.set(false);
      },
      error: (err) => {
        this.errorCarga.set(
          err?.status === 404
            ? 'No hemos encontrado tu confirmación. Comprueba que el enlace es correcto.'
            : 'Ha ocurrido un error al cargar tus datos. Por favor, inténtalo de nuevo.'
        );
        this.cargando.set(false);
      }
    });
  }

  get f() { return this.formulario.controls; }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set(null);

    // getRawValue() en lugar de .value porque necesitamos incluir
    // todos los campos aunque el email esté disabled.
    // Con .value, los campos disabled se omiten; con getRawValue() se incluyen todos.
    const datos = this.formulario.getRawValue();

    this.invitadoService.modificarFormulario(this.token, {
      nombre:                  datos.nombre,
      apellidos:               datos.apellidos,
      asistencia:              datos.asistencia,
      condicionesAlimentarias: datos.condicionesAlimentarias || null,
      cancion:                 datos.cancion || null,
      autobusIda:              datos.autobusIda,
      autobusVuelta:           datos.autobusVuelta
    }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: (err) => {
        this.enviando.set(false);
        this.errorEnvio.set(
          err?.error?.message ?? 'Ha ocurrido un error al guardar los cambios. Por favor, inténtalo de nuevo.'
        );
      }
    });
  }
}