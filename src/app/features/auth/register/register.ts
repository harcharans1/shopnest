import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register(): Promise<void> {
    this.error = '';
    this.success = '';
    const email = this.email.trim().toLowerCase();
    if (!email || !this.password || !this.confirmPassword) { this.error = 'Please fill all fields.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { this.error = 'Please enter a valid email address.'; return; }
    if (this.password.length < 6) { this.error = 'Password must be at least 6 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match.'; return; }
    this.loading = true;
    try {
      const result = await this.authService.register(email, this.password);
      if (result.session) {
        this.success = 'Account created successfully.';
        await this.router.navigate(['/account']);
      } else {
        this.success = 'Account created. Please check your email to verify your account, then login.';
      }
    } catch (error: any) {
      this.error = error?.message || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}