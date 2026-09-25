import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../services/supabase';

interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: string;
  duration: string;
  rating: number;
  published: boolean;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  duration: string;
  lesson_number: number;
}

interface Review {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  /* =====================================================
     SUPABASE DATA
  ===================================================== */

  courses = signal<Course[]>([]);
  lessons = signal<Lesson[]>([]);

  totalCourses = signal(0);
  totalLessons = signal(0);
  averageRating = signal(0);

  loading = signal(true);
  errorMessage = signal('');

  /* =====================================================
     STUDENT REVIEWS
  ===================================================== */

  reviews: Review[] = [
    {
      name: 'SkillKamao Learner',
      role: 'Video Editing Student',
      image: '/images/home/student-1.jpg',
      rating: 5,
      text:
        'SkillKamao makes learning practical and easy to understand. The lessons helped me build real skills.'
    },
    {
      name: 'SkillKamao Learner',
      role: 'Canva Design Student',
      image: '/images/home/student-2.jpg',
      rating: 5,
      text:
        'I really like the simple learning approach. It is easy to follow and practice along with the lessons.'
    },
    {
      name: 'SkillKamao Learner',
      role: 'Web Development Student',
      image: '/images/home/student-3.jpg',
      rating: 5,
      text:
        'The practical approach makes it easier to understand concepts and turn them into useful projects.'
    }
  ];

  /* =====================================================
     CONSTRUCTOR
  ===================================================== */

  constructor(
    private supabaseService: Supabase
  ) {
    this.loadHomeData();
  }

  /* =====================================================
     LOAD HOME DATA
  ===================================================== */

  async loadHomeData(): Promise<void> {

    this.loading.set(true);
    this.errorMessage.set('');

    const client =
      this.supabaseService.getClient();

    try {

      /* ================================================
         COURSES
      ================================================ */

      const coursesResult = await client
        .from('courses')
        .select(`
          id,
          name,
          description,
          icon,
          level,
          duration,
          rating,
          published
        `)
        .eq('published', true)
        .order('created_at', {
          ascending: false
        });

      if (coursesResult.error) {
        throw coursesResult.error;
      }

      const courseData =
        (coursesResult.data ?? []) as Course[];


      /* ================================================
         LESSONS
      ================================================ */

      const lessonsResult = await client
        .from('lessons')
        .select(`
          id,
          course_id,
          title,
          duration,
          lesson_number
        `)
        .order('lesson_number', {
          ascending: true
        });

      if (lessonsResult.error) {
        throw lessonsResult.error;
      }

      const lessonData =
        (lessonsResult.data ?? []) as Lesson[];


      /* ================================================
         SET DATA
      ================================================ */

      this.courses.set(courseData);
      this.lessons.set(lessonData);

      this.totalCourses.set(
        courseData.length
      );

      this.totalLessons.set(
        lessonData.length
      );


      /* ================================================
         AVERAGE RATING
      ================================================ */

      if (courseData.length > 0) {

        const totalRating =
          courseData.reduce(
            (sum, course) =>
              sum + Number(course.rating || 0),
            0
          );

        this.averageRating.set(
          Number(
            (
              totalRating /
              courseData.length
            ).toFixed(1)
          )
        );

      } else {

        this.averageRating.set(0);

      }

    } catch (error) {

      console.error(
        'SkillKamao Home Error:',
        error
      );

      this.errorMessage.set(
        'Courses could not be loaded. Please try again.'
      );

    } finally {

      this.loading.set(false);

    }
  }


  /* =====================================================
     SHOW FIRST 4 COURSES
  ===================================================== */

  getVisibleCourses(): Course[] {

    return this.courses()
      .slice(0, 4);

  }


  /* =====================================================
     COURSE IMAGE
  ===================================================== */

  getCourseImage(course: Course): string {

    const name =
      course.name.toLowerCase();

    if (
      name.includes('video') ||
      name.includes('editing')
    ) {
      return '/images/home/course-video-editing.jpg';
    }

    if (
      name.includes('canva') ||
      name.includes('design')
    ) {
      return '/images/home/course-canva.jpg';
    }

    if (
      name.includes('web') ||
      name.includes('development')
    ) {
      return '/images/home/course-web-development.jpg';
    }

    if (
      name.includes('marketing') ||
      name.includes('digital')
    ) {
      return '/images/home/course-digital-marketing.jpg';
    }

    return '/images/home/course-web-development.jpg';
  }


  /* =====================================================
     COURSE LESSON COUNT
  ===================================================== */

  getCourseLessons(
    courseId: string
  ): number {

    return this.lessons()
      .filter(
        lesson =>
          lesson.course_id === courseId
      )
      .length;

  }


  /* =====================================================
     RATING
  ===================================================== */

  formatRating(
    rating: number
  ): string {

    return Number(
      rating || 0
    ).toFixed(1);

  }


  /* =====================================================
     REVIEW STARS
  ===================================================== */

  getStars(
    rating: number
  ): string {

    return '★'.repeat(
      Math.max(
        0,
        Math.min(5, rating)
      )
    );

  }


  /* =====================================================
     RETRY
  ===================================================== */

  retry(): void {

    this.loadHomeData();

  }

}