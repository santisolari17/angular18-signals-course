import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private _dialog = inject(MatDialog);
  private _coursesService = inject(CoursesService);
  private _messageService = inject(MessagesService);
  private _courses = signal<Course[]>([]);

  public beginnerCourses = computed(() => {
    const courses = this._courses(); // declares dependency
    return courses.filter((course) => course.category === 'BEGINNER');
  });
  public advancedCourses = computed(() => {
    const courses = this._courses(); // declares dependency
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    effect(() => {
      console.log(`Beginner courses: `, this.beginnerCourses());
      console.log(`Advanced courses: `, this.advancedCourses());
    });

    this.loadCourses().then(() =>
      console.log(`All courses loaded:`, this._courses())
    );
  }

  async loadCourses() {
    try {
      const courses = await this._coursesService.loadAllCourses();
      this._courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      this._messageService.showMessage(`Error loading courses!`, 'error');
      console.error(err);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this._courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );

    this._courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this._coursesService.deleteCourse(courseId);
      const courses = this._courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this._courses.set(newCourses);
    } catch (err) {
      console.error(err);
      alert(`Error deleting course.`);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this._dialog, {
      mode: 'create',
      title: 'Create New Course',
    });
    if (!newCourse) {
      return;
    }
    const newCourses = [...this._courses(), newCourse];
    this._courses.set(newCourses);
  }
}
