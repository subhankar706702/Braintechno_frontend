import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
  })
export class AdminShellComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout(): void { this.auth.logout(); void this.router.navigateByUrl('/auth/login'); }
}
