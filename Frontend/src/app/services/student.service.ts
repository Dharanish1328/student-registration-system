import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  apiUrl = 'http://localhost:5072/api/students';

  constructor(private http: HttpClient) { }

  addStudent(student: Student): Observable<any> {
    return this.http.post(this.apiUrl, student);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

}