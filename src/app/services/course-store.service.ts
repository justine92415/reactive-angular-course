import { catchError, filter, map, shareReplay, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";

@Injectable({
  providedIn: "root",
})
export class CourseStoreService {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const course = this.subject.getValue();

    const index = course.findIndex((course) => course.id == courseId);

    const newCourse: Course = {
      ...course[index],
      ...changes,
    };

    const newCourses: Course[] = course.slice(0);

    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
