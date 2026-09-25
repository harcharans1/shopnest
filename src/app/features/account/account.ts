import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.scss'
})
export class Account implements OnInit {
  user: any = null;
  loading = true;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.authService.loadSession();
    this.user = this.authService.getCurrentUser();
    this.loading = false;
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}