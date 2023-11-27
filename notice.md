#Stateless Observables Services

宣告式編程

```typescript
@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];

  advancedCourses: Course[];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.http.get("/api/courses").subscribe((res) => {
      const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

      this.beginnerCourses = courses.filter((course) => course.category == "BEGINNER");

      this.advancedCourses = courses.filter((course) => course.category == "ADVANCED");
    });
  }
}
```

響應式編程

```HTML
<div class="courses-panel">
    <h3>All Courses</h3>
    <mat-tab-group>
        <mat-tab label="Beginners">
          <mat-card *ngFor="let course of beginnerCourses$ | async" class="course-card mat-elevation-z10">
           ...略
          </mat-card>
        </mat-tab>
        <mat-tab label="Advanced">
          <mat-card *ngFor="let course of advancedCourses$ | async" class="course-card mat-elevation-z10">
            ...略
          </mat-card>
        </mat-tab>
    </mat-tab-group>
</div>
```

```typescript
export class CoursesService {
  httpClient = inject(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
    );
  }
}
```

```typescript
@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  courseService = inject(CoursesService);

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    const course$ = this.courseService.loadAllCourses().pipe(map((courses) => courses.sort(sortCoursesBySeqNo)));

    this.beginnerCourses$ = course$.pipe(map((courses) => courses.filter((course) => course.category === "BEGINNER")));

    this.advancedCourses$ = course$.pipe(map((courses) => courses.filter((course) => course.category === "ADVANCED")));
  }
}
```
## Consuming Observable-based services using the Angular async Pipe
**筆記摘要：**

1. **Service 可重複使用：** 重構後，引入了一個獨立的Service，使得loadAllCourses邏輯在應用中其他地方可以輕鬆重複使用。

2. **消除回調地獄：** 透過觀察者定義，消除了潛在的回調地獄，使程式碼更具可讀性和可維護性。

3. **數據管理改進：** 數據現在透過觀察者管理，不再依賴可變狀態，有助於保持程式碼的清晰度。

4. **異步管道的使用：** 使用異步管道（async pipe）訂閱觀察者，使數據對視圖可訪問，同時避免了手動訂閱可能導致的內存泄漏。

5. **狀態管理的提及：** 強調目前解決方案是完全無狀態的，但在後續課程中將介紹如何使用 Rxjs 實現輕量級的狀態管理。

**關鍵詞：** 重構、觀察者、異步管道、狀態管理、可重複使用。

**討論點：**

- 如何在其他部分輕鬆重複使用新服務？
- 如何避免回調地獄對程式碼可讀性的影響？
- 為何數據管理的改進對程式碼清晰度有幫助？
- async pipe 如何確保不會發生內存泄漏？
- 後續課程中，什麼是輕量級狀態管理的核心概念？

**個人理解：**

- 觀察者模式的應用使得程式碼更易於理解。
- 數據的無狀態管理有助於減少錯誤和提高可維護性。
- async pipe 的使用使得訂閱和取消訂閱更為簡單。

**待深入學習：**

- 如何在 Rxjs 中實現輕量級的狀態管理？
- 如何進一步提高觀察者模式的應用？

## Avoiding Angular duplicate HTTP requests with the RxJs shareReplay operator

```typescript
export class CoursesService {
  httpClient = inject(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }
}
```

### 1. 筆記摘要:
本課程內容主要討論在Angular應用程式中避免發出意外的HTTP請求的常見反模式。作者在這堂課中指出一個問題，即當訂閱Angular Http服務返回的可觀察對象時，每個訂閱都會導致一個HTTP請求，這可能不符合預期行為。課程的解決方案是使用RxJS操作符`shareReplay`，以確保僅在第一次訂閱時發出HTTP請求，並在記憶中保留結果，以供後續訂閱使用。

### 2. 關鍵詞:
- Angular
- HTTP服務
- 反模式
- 可觀察對象
- RxJS
- `shareReplay`操作符

### 3. 討論點:
- HTTP服務返回的可觀察對象導致每個訂閱都發出一個HTTP請求。
- 使用`shareReplay`操作符確保僅在第一次訂閱時發出HTTP請求，以後的訂閱都使用已存儲的結果，避免重複請求。

### 4. 個人理解:
- Angular中的HTTP服務返回的可觀察對象在預設情況下導致每個訂閱都發出一個HTTP請求，這可能導致性能問題。
- 使用`shareReplay`操作符是一種有效的方式，可以確保僅在需要時發出一次HTTP請求，避免重複的請求對後端造成不必要的壓力。

### 5. 待深入學習:
- 了解RxJS中其他常用的操作符，以擴大對可觀察對象的處理能力。
- 深入理解Angular中的HTTP服務和相關的最佳實踐。

### 6. 連結先前知識:
- 涉及Angular框架的使用，了解Angular中的服務和可觀察對象的基本概念。
- 使用RxJS的操作符，特別是`map`和`shareReplay`。

### 7. 實際操作或練習:
- 在現有的Angular應用程式中實施`shareReplay`以優化HTTP請求的處理。
- 剖析其他RxJS操作符的使用場景，並在實際應用中進行練習。
