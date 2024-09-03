import { Component, input, model } from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  public label = input.required<string>();

  // Two way contract with parent
  public value = model.required<CourseCategory>();

  public onCategoryChanged(category: CourseCategory | string): void {
    this.value.set(category as CourseCategory);
  }
}
