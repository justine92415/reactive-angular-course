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

## Angular view Layer Patterns - Smart vs Presentational Components

https://medium.com/front-end-weekly/smart-dumb-presentational-components-in-angular-bf01c5bf2d40

### 1. 筆記摘要
在這堂課中，學習者介紹了一些有用的設計模式，專注於智能組件和呈現組件，以更好地理解這些模式。透過重構，創建了一個名為"course card list"的呈現組件，用於顯示課程卡片的列表。這個組件僅負責接收輸入並顯示相應的數據，將呈現邏輯從主組件中提取出來，實現了代碼的重用性。

### 2. 關鍵詞
- 設計模式
- 智能組件
- 呈現組件
- 重構
- Angular CLI
- Ng4
- Mat card component
- Angular input decorator
- Presentational component
- Reactive style

### 3. 討論點
- 重構的優勢：將相似的呈現邏輯提取成單獨的呈現組件，提高代碼的可讀性和重用性。
- 智能組件 vs. 呈現組件：智能組件處理業務邏輯和數據交互，呈現組件僅處理數據的顯示。
- 使用Angular CLI生成組件：演示了如何使用Angular CLI生成新的組件並定義其公共API。
- Angular input decorator：用於標註組件的輸入屬性，指明其為輸入屬性。

### 4. 個人理解
這份學習筆記強調了組件的分離和重用性。通過將相似的呈現邏輯抽取到單獨的呈現組件中，可以更清晰地區分組件的職責，提高代碼的維護性。在智能組件中處理業務邏輯，並將顯示邏輯委託給呈現組件，有助於保持代碼的結構清晰。

### 5. 待深入學習
- 深入理解Angular CLI的使用和組件生成。
- 進一步瞭解Angular中的設計模式和最佳實踐。
- 學習更多有關Angular的呈現組件和智能組件的使用場景和設計原則。

### 6. 連結先前知識
這份學習筆記擴展了先前對Angular框架和組件的基本理解，特別是在組件分離和重構方面的應用。

### 7. 實際操作或練習
- 使用Angular CLI生成一個新的組件並實際進行重構，將相似的呈現邏輯提取到呈現組件中。
- 嘗試在自己的Angular應用程序中應用所學的設計模式和組件分離原則。
