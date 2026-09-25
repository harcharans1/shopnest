import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | null = null;
  session: Session | null = null;

  constructor(
    private supabase: SupabaseService
  ) {

    this.loadSession();

    this.supabase.auth.onAuthStateChange(
      (event, session) => {

        this.session = session;
        this.user = session?.user ?? null;

      }
    );
  }

  /**
   * Current session
   */
  async loadSession(): Promise<void> {

    const {
      data,
      error
    } = await this.supabase.auth.getSession();

    if (error) {
      console.error(
        'Session error:',
        error
      );

      return;
    }

    this.session = data.session;
    this.user = data.session?.user ?? null;
  }

  /**
   * Register
   */
  async register(
    email: string,
    password: string
  ) {

    const {
      data,
      error
    } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    this.session = data.session;
    this.user = data.user;

    return data;
  }

  /**
   * Login
   */
  async login(
    email: string,
    password: string
  ) {

    const {
      data,
      error
    } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    this.session = data.session;
    this.user = data.user;

    return data;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {

    const {
      error
    } = await this.supabase.auth.signOut();

    if (error) {
      throw error;
    }

    this.user = null;
    this.session = null;
  }

  /**
   * Check login
   */
  isLoggedIn(): boolean {
    return !!this.user;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.session;
  }

  /**
   * Forgot password
   */
  async forgotPassword(
    email: string
  ) {

    const {
      data,
      error
    } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/reset-password`
      }
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update password
   */
  async updatePassword(
    password: string
  ) {

    const {
      data,
      error
    } = await this.supabase.auth.updateUser({
      password
    });

    if (error) {
      throw error;
    }

    return data;
  }
}