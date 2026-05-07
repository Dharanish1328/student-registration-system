import { Routes } from '@angular/router';
import { RegisterStudentComponent } from './components/register-student/register-student.component';
import { StudentListComponent } from './components/student-list/student-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register-student',
    pathMatch: 'full'
  },
  {
    path: 'register-student',
    component: RegisterStudentComponent
  },
  {
    path: 'student-list',
    component: StudentListComponent
  }
];