import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  public dialog = inject(MatDialog);

  public courses = input.required<Course[]>({ alias: 'coursesList' });

  public courseUpdated = output<Course>();
  public courseDeleted = output<string>();

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update Existing Course',
      course,
    });
    if (!newCourse) {
      return;
    }
    console.log(`Course edited:`, newCourse);
    this.courseUpdated.emit(newCourse);
  }

  onCourseDeleted(course: Course) {
    this.courseDeleted.emit(course.id);
  }
}
