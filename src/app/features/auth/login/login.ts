import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit(): Promise<void> {
    this.error = '';
    if (!this.email.trim() || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }
    this.loading = true;
    try {
      await this.auth.login(this.email.trim(), this.password);
      await this.router.navigate(['/account']);
    } catch (error: any) {
      this.error = error?.message || 'Login failed. Please check your details.';
    } finally {
      this.loading = false;
    }
  }
}