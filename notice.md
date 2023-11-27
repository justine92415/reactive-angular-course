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


## Data Modification Example in Reactive Style (Stateless Application)

### 筆記摘要:
在這一課中，學習者繼續將應用程式重構為反應式風格，專注於資料修改操作。目前應用程式仍然是完全無狀態的，沒有進行狀態管理。將來將介紹如何使用狀態管理技術來提升使用者體驗。本課程重點討論沒有狀態管理時的資料修改操作，並展示了一個編輯課程的對話框。

### 關鍵詞:
- 反應式風格
- 資料修改操作
- 狀態管理
- 對話框
- RxJS
- Observable

### 討論點:
1. **狀態管理介紹**: 課程提到應用程式目前是無狀態的，之後會介紹如何添加狀態管理技術。在這種情況下，什麼是狀態管理，以及它如何改善使用者體驗？

2. **資料修改操作**: 詳細討論了編輯課程的對話框組件，包括介面元素和邏輯。重點是尚未實現保存數據的邏輯，並將在接下來的課程中實現。

3. **資料修改到後端**: 介紹了保存數據變更到後端的邏輯，使用了Angular的HttpClient和HTTP PUT請求。講解了為什麼使用RxJS的`shareReplay`操作符來避免多次HTTP調用。

4. **對話框關閉處理**: 當對話框成功保存後，使用`afterClosed` observable來檢測對話框的關閉事件，並觸發相應的處理。介紹了在成功保存時使用RxJS的`tap`操作符來發送事件通知應用程序的其他部分。

5. **重新載入課程**: 當課程成功保存後，需要重新載入所有課程以反映最新的數據。介紹了在組件中定義一個`coursesChanged`事件，以及如何在成功保存時訂閱並觸發該事件。

6. **實時示例**: 透過示例演示了在編輯課程後，成功保存並重新載入所有課程的過程，並強調了HTTP請求的延遲。

### 個人理解:
在這篇學習筆記中，學習者正在學習如何實現反應式風格的資料修改操作。主要涉及到使用Angular的HttpClient進行HTTP PUT請求，以將數據變更保存到後端。同時，介紹了如何通過發送事件通知的方式來處理對話框的關閉和成功保存的情況，以及如何重新載入所有課程以反映最新的數據。

### 待深入學習:
1. **RxJS的進一步學習**: 了解更多RxJS操作符的使用和原理，特別是`shareReplay`和`tap`的詳細功能。

2. **Angular的HttpClient進一步研究**: 深入研究Angular的HttpClient，了解更多關於HTTP請求和響應的細節。

### 連結先前知識:
這篇學習筆記擴展了先前學習的Angular和RxJS相關知識，特別是在資料修改操作和狀態管理方面的應用。

### 實際操作或練習:
1. **實際應用**: 嘗試在自己的Angular應用程式中實現類似的資料修改操作，並使用RxJS進行異步處理。

2. **HTTP請求調試**: 使用開發者工具或類似的工具來調試HTTP請求，深入了解請求和響應的細節。

3. **狀態管理探索**: 了解更多關於Angular中狀態管理的技術和最佳實踐，並嘗試將其應用到自己的應用程式中。
