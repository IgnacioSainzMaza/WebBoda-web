import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Formulario } from './pages/formulario/formulario';
import { Modificar } from './pages/modificar/modificar';

export const routes: Routes = [
  // La ruta raíz muestra la página de inicio
  { path: '', component: Inicio },

  // La ruta del formulario de primer envío
  { path: 'formulario', component: Formulario },

  // La ruta de modificación incluye el token como parámetro dinámico.
  // El ':token' significa "cualquier valor en esta posición de la URL".
  // Por ejemplo, '/modificar/abc123xyz' cargará ModificarComponent
  // y el componente podrá leer el valor 'abc123xyz' como parámetro.
  { path: 'modificar/:token', component: Modificar },

  // Cualquier URL que no coincida con las anteriores redirige al inicio.
  // Es como el 404 de Angular: en lugar de una página de error,
  // lleva al usuario a un lugar conocido.
  { path: '**', redirectTo: '' }
];