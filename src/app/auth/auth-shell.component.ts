import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="auth-wrap">
      <section class="brand"><div class="logo">BT</div><div><strong>BRAIN TECHNO</strong><span>Digital Promotional & Customer Engagement Platform</span></div></section>
      <section class="auth-card"><router-outlet /></section>
    </main>
  `,
  styles: [`
    .auth-wrap{min-height:100vh;display:grid;grid-template-columns:minmax(320px,1fr) minmax(360px,520px);gap:40px;align-items:center;padding:48px;max-width:1260px;margin:auto}.brand{display:flex;align-items:center;gap:18px}.logo{width:68px;height:68px;border-radius:20px;background:#111827;color:#fff;display:grid;place-items:center;font-size:24px;font-weight:900;letter-spacing:-1px}.brand strong{font-size:34px;display:block}.brand span{display:block;margin-top:8px;color:#667085}.auth-card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:32px;box-shadow:0 20px 60px rgba(16,24,40,.1)}@media(max-width:820px){.auth-wrap{grid-template-columns:1fr;padding:20px}.brand strong{font-size:26px}.auth-card{padding:24px}}
  `]
})
export class AuthShellComponent {}
