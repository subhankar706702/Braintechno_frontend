import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="auth-wrap">
      <section class="auth-card"><router-outlet /></section>
    </main>
  `,
  styles: []
})
export class AuthShellComponent {}
