import { Component, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { Supabase } from '../services/supabase';
import { Auth } from '../services/auth';

interface RecentStudent {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface RecentCertificate {
  id: string;
  student_id: string;
  course_name: string;
  status: string;
  created_at: string;
}

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  // =========================================
  // ADMIN
  // =========================================

  adminName = 'SkillKamao Admin';


  // =========================================
  // LIVE STATS
  // =========================================

  totalStudents = signal(0);
  totalCourses = signal(0);
  totalLessons = signal(0);
  pendingCertificates = signal(0);
  completedCertificates = signal(0);


  // =========================================
  // RECENT DATABASE RECORDS
  // =========================================

  recentStudents =
    signal<RecentStudent[]>([]);

  recentCertificates =
    signal<RecentCertificate[]>([]);


  // =========================================
  // LOADING
  // =========================================

  loading = signal(true);

  studentsLoading = signal(true);

  certificatesLoading = signal(true);


  // =========================================
  // DATABASE STATUS
  // =========================================

  databaseStatus =
    signal<'loading' | 'connected' | 'error'>('loading');


  // =========================================
  // CURRENT DATE
  // =========================================

  todayLabel = signal('');


  constructor(
    private router: Router,
    private supabaseService: Supabase,
    private auth: Auth
  ) {

    this.loadAdmin();

    this.setCurrentDate();

    this.loadDashboard();

  }


  // =========================================
  // ADMIN DATA
  // =========================================

  loadAdmin() {

    if (
      typeof localStorage === 'undefined'
    ) {
      return;
    }


    const adminData =
      localStorage.getItem(
        'skillkamao-admin'
      );


    if (!adminData) {
      return;
    }


    try {

      const admin =
        JSON.parse(adminData);


      if (admin?.full_name) {

        this.adminName =
          admin.full_name;

      }

      else if (admin?.email) {

        this.adminName =
          admin.email;

      }

    } catch (error) {

      console.error(
        'Admin data error:',
        error
      );

    }

  }


  // =========================================
  // CURRENT DATE
  // =========================================

  setCurrentDate() {

    if (
      typeof window === 'undefined'
    ) {
      return;
    }


    const now = new Date();


    this.todayLabel.set(
      now.toLocaleDateString(
        'en-IN',
        {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )
    );

  }


  // =========================================
  // LOAD DASHBOARD
  // =========================================

  async loadDashboard() {

    this.loading.set(true);

    this.databaseStatus.set('loading');


    const results =
      await Promise.allSettled([
        this.loadStats(),
        this.loadRecentStudents(),
        this.loadRecentCertificates()
      ]);


    const hasError =
      results.some(
        result =>
          result.status === 'rejected'
      );


    this.databaseStatus.set(
      hasError
        ? 'error'
        : 'connected'
    );


    this.loading.set(false);

  }


  // =========================================
  // LIVE STATS
  // =========================================

  async loadStats() {

    const client =
      this.supabaseService.getClient();


    // ---------------------------------------
    // STUDENTS
    // ---------------------------------------

    const studentsResult =
      await client
        .from('students')
        .select(
          'id',
          {
            count: 'exact',
            head: true
          }
        )
        .eq(
          'role',
          'student'
        );


    if (
      studentsResult.error
    ) {

      console.error(
        'Students count error:',
        studentsResult.error
      );

      throw studentsResult.error;

    }


    this.totalStudents.set(
      studentsResult.count ?? 0
    );


    // ---------------------------------------
    // COURSES
    // ---------------------------------------

    const coursesResult =
      await client
        .from('courses')
        .select(
          'id',
          {
            count: 'exact',
            head: true
          }
        );


    if (
      coursesResult.error
    ) {

      console.error(
        'Courses count error:',
        coursesResult.error
      );

      throw coursesResult.error;

    }


    this.totalCourses.set(
      coursesResult.count ?? 0
    );


    // ---------------------------------------
    // LESSONS
    // ---------------------------------------

    const lessonsResult =
      await client
        .from('lessons')
        .select(
          'id',
          {
            count: 'exact',
            head: true
          }
        );


    if (
      lessonsResult.error
    ) {

      console.error(
        'Lessons count error:',
        lessonsResult.error
      );

      throw lessonsResult.error;

    }


    this.totalLessons.set(
      lessonsResult.count ?? 0
    );


    // ---------------------------------------
    // PENDING CERTIFICATES
    // ---------------------------------------

    const pendingResult =
      await client
        .from('certificates')
        .select(
          'id',
          {
            count: 'exact',
            head: true
          }
        )
        .eq(
          'status',
          'pending'
        );


    if (
      pendingResult.error
    ) {

      console.error(
        'Pending certificate error:',
        pendingResult.error
      );

      throw pendingResult.error;

    }


    this.pendingCertificates.set(
      pendingResult.count ?? 0
    );


    // ---------------------------------------
    // APPROVED CERTIFICATES
    // ---------------------------------------

    const approvedResult =
      await client
        .from('certificates')
        .select(
          'id',
          {
            count: 'exact',
            head: true
          }
        )
        .eq(
          'status',
          'approved'
        );


    if (
      approvedResult.error
    ) {

      console.error(
        'Approved certificate error:',
        approvedResult.error
      );

      throw approvedResult.error;

    }


    this.completedCertificates.set(
      approvedResult.count ?? 0
    );

  }


  // =========================================
  // RECENT STUDENTS
  // =========================================

  async loadRecentStudents() {

    this.studentsLoading.set(true);


    const client =
      this.supabaseService.getClient();


    try {

      const {
        data,
        error
      } = await client
        .from('students')
        .select(
          'id, full_name, email, created_at'
        )
        .eq(
          'role',
          'student'
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )
        .limit(5);


      if (error) {

        console.error(
          'Recent students error:',
          error
        );

        throw error;

      }


      this.recentStudents.set(
        (data ?? []) as RecentStudent[]
      );

    }

    finally {

      this.studentsLoading.set(false);

    }

  }


  // =========================================
  // RECENT CERTIFICATES
  // =========================================

  async loadRecentCertificates() {

    this.certificatesLoading.set(true);


    const client =
      this.supabaseService.getClient();


    try {

      const {
        data,
        error
      } = await client
        .from('certificates')
        .select(
          'id, student_id, course_name, status, created_at'
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )
        .limit(5);


      if (error) {

        console.error(
          'Recent certificates error:',
          error
        );

        throw error;

      }


      this.recentCertificates.set(
        (data ?? []) as RecentCertificate[]
      );

    }

    finally {

      this.certificatesLoading.set(false);

    }

  }


  // =========================================
  // DATE FORMAT
  // =========================================

  formatDate(
    date: string | null | undefined
  ): string {

    if (!date) {
      return '—';
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return '—';

    }


    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =========================================
  // CERTIFICATE STATUS
  // =========================================

  getCertificateStatus(
    status: string
  ): string {

    switch (status) {

      case 'approved':
        return 'Approved';

      case 'pending':
        return 'Pending';

      case 'rejected':
        return 'Rejected';

      default:
        return status || 'Unknown';

    }

  }


  // =========================================
  // CERTIFICATE STATUS CLASS
  // =========================================

  getCertificateStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'approved':
        return 'status-approved';

      case 'pending':
        return 'status-pending';

      case 'rejected':
        return 'status-rejected';

      default:
        return 'status-neutral';

    }

  }


  // =========================================
  // LOGOUT
  // =========================================

  async logout() {

    try {

      await this.auth.signOut();

    } catch (error) {

      console.error(
        'Supabase logout error:',
        error
      );

    }


    if (
      typeof localStorage !== 'undefined'
    ) {

      localStorage.removeItem(
        'skillkamao-admin-logged-in'
      );

      localStorage.removeItem(
        'skillkamao-admin'
      );

    }


    await this.router.navigate([
      '/admin-login'
    ]);

  }

}