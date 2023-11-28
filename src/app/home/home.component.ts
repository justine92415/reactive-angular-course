import {Component, OnInit, inject} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../services/loading.service';
import { MessagesService } from '../services/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  courseService = inject(CoursesService);

  loadService = inject(LoadingService);

  messagesService = inject(MessagesService);

  ngOnInit() {

    this.reloadCourses();

  }

  reloadCourses() {

    const course$ = this.courseService.loadAllCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = 'Could not load courses';
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      })
    );

    const loadCourse$ = this.loadService.showLoaderUntilCompleted(course$);

    this.beginnerCourses$ = loadCourse$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = loadCourse$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );
  }
}




