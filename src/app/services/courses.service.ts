import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  httpClient = inject(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.httpClient
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }
}
