import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
  modalCuentaVisible = false;
  ibanCopiado = false;

  abrirModalCuenta(): void {
    this.modalCuentaVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalCuenta(): void {
    this.modalCuentaVisible = false;
    document.body.style.overflow = '';
    this.ibanCopiado = false;
  }

  copiarIban(): void {
    navigator.clipboard.writeText('ES00 0000 0000 0000 0000 0000').then(() => {
      this.ibanCopiado = true;
      setTimeout(() => this.ibanCopiado = false, 2500);
    });
  }
}