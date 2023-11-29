# Reactive Component Interaction

# 筆記：組件通訊和反應式設計

## 引言

在介紹應用程序中的任何狀態管理技術之前，讓我們先談談組件通訊。

到目前為止，在我們的應用程序中，我們通過 Angular 的輸入語法實現了多個組件之間的交互。例如，`courses card list` 組件是一個純粹的表示性組件，通過 Angular 的輸入成員變數接收需要顯示的課程。

現在，讓我們想象一下，如果我們有兩個完全位於 Angular 組件樹不同級別的組件，它們仍然需要相互交互，會發生什麼情況？

顯然，在這種情況下，我們不能使用標準的 Angular 輸入和輸出，因為這種機制僅在一個組件出現在另一個組件的模板上時才有用。如果兩個組件之間沒有直接的父子關係，那麼該怎麼辦？

你可能會認為這種情況相當罕見，但實際上，在你構建的幾乎每個 Angular 應用程序中，這種情況都會出現。

讓我們舉幾個在你自己的應用程序中肯定會需要的常見組件的例子。

## 例子 1：載入指示器（Loading Indicator）

當我們由於後端延遲而從應用程序中加載數據時，我們希望向用戶顯示一些視覺反饋，使用載入指示器顯示數據仍在加載的消息。尤其是在執行保存課程操作時，這需要幾秒鐘的時間，我們希望在編輯課程對話框屏幕的頂部顯示載入指示器，以向用戶提供保存正在進行的反饋。

在這種情況下，載入指示器將位於組件樹的完全不同級別，然後是主頁組件或編輯課程對話框。我們希望確保載入指示器（它將是一個獨立的 Angular 組件）和需要與其互動的不同組件（例如主頁組件或編輯課程對話框）之間沒有緊密耦合。我們希望確保這兩個組件可以以可維護的方式互動。

在接下來的幾課中，我們將學習通過採用反應式設計，即使這兩個組件位於組件樹的非常不同級別，也能夠以解耦的方式進行交互。

## 載入指示器示例

首先，我們將提供一個載入指示器的示例。為了構建我們的載入指示器，我們已經有了載入組件的骨架。讓我們看一下載入組件的初始版本。

```typescript
// loading.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-loading",
  template: '<div class="loading">Loading...</div>',
  styleUrls: ["./loading.component.css"],
})
export class LoadingComponent {}
```

上述代碼創建了一個名為`LoadingComponent`的 Angular 組件，它僅具有 HTML 模板和相應的 CSS 樣式。該組件當前沒有添加任何邏輯，僅用於演示目的。

現在，讓我們討論我們即將採用的解決方案的設計。讓我們學習如何通過使用反應式設計使應用程序的多個部分能夠以透明的方式與載入組件互動。

# Loading Indicator Implementation in Angular

## Introduction

- 本課程將實作一個載入指示器（Loading Indicator）解決方案，透過反應式設計實現不同層次的 Angular 組件樹能夠輕鬆與載入組件進行解耦的互動。

## Component HTML Structure

- 使用 Angular Material Spinner 組件實現載入指示器。
- 將 Spinner 組件包裹在自定義樣式的容器內，該容器具有 CSS 類別 "Spinner container"。

```html
<!-- Template -->
<div class="Spinner container">
  <mat-spinner></mat-spinner>
</div>
```

## Integration in Application

- 使用 `loading` 標籤作為選擇器(selector)，將載入指示器集成到應用程式中。
- 常常僅在應用程式根組件的層次上添加一個載入指示器實例，位於路由輸出（router outlet）的頂部。

```html
<!-- App Root Component -->
<app-root>
  <mat-top-menu></mat-top-menu>
  <router-outlet></router-outlet>
  <loading></loading>
  <!-- Loading Indicator Instance -->
</app-root>
```

## Communication via Shared Service

- 使用共享服務 "loading service" 實現載入指示器與應用程式其他部分的通信。
- 這個服務的實例只會在應用程式根組件及其子組件中可見。

### Loading Service Definition

```typescript
// loading.service.ts
import { Injectable } from "@angular/core";

@Injectable()
export class LoadingService {
  // Service implementation
}
```

### Service Configuration in App Component

```typescript
// app.component.ts
import { LoadingService } from "./loading/loading.service";

@Component({
  // Component metadata
  providers: [LoadingService], // Add LoadingService to providers
})
export class AppComponent {
  // Component implementation
}
```

### Injecting Loading Service in Components

- 在需要顯示載入指示器的組件中注入 `LoadingService`。

```typescript
// Any component that needs Loading Indicator
import { LoadingService } from "./loading/loading.service";

@Component({
  // Component metadata
})
export class HomeComponent {
  constructor(private loadingService: LoadingService) {
    // Constructor implementation
  }
}
```

## Reactive Design of Loading Service

- `LoadingService` 將採用反應式設計，使不同層次的組件能夠以解耦和可維護的方式進行互動。

### Example: Home Component

- 在 Home 組件中，當從後端獲取課程列表時，可以通過 `LoadingService` 顯示載入指示器。

```typescript
// home.component.ts
import { LoadingService } from "../loading/loading.service";

@Component({
  // Component metadata
})
export class HomeComponent {
  constructor(private loadingService: LoadingService) {
    // Constructor implementation
    this.loadingService.show(); // Show loading indicator
    // ... Perform asynchronous operation
    this.loadingService.hide(); // Hide loading indicator when operation is complete
  }
}
```

### Example: Edit Course Dialog Component

- 在編輯課程對話框組件中，也可以通過 `LoadingService` 顯示載入指示器。

```typescript
// edit-course-dialog.component.ts
import { LoadingService } from "../loading/loading.service";

@Component({
  // Component metadata
})
export class EditCourseDialogComponent {
  constructor(private loadingService: LoadingService) {
    // Constructor implementation
    this.loadingService.show(); // Show loading indicator
    // ... Perform asynchronous operation
    this.loadingService.hide(); // Hide loading indicator when operation is complete
  }
}
```

這樣，通過 `LoadingService` 的反應式設計，不同組件層次之間實現了解耦且易於維護的互動，確保了應用程式中的異步操作能夠有效顯示和隱藏載入指示器。

# Loading Service Reactive Design

## Introduction

- 本課程將探討我們載入服務（Loading Service）的反應式設計，並開始實作。
- 目標是透過這個共享服務，在應用程式的不同部分（例如 home component、course dialogue 等）需要顯示載入指示器時，提供一種方便的方式，而不需要這些部分直接知道載入組件的存在。

## Public API of Loading Service

- 最重要的公共 API 部分是一個我們將稱之為 `loading observable` 的 observable。
- 這個 observable 的類型是 `observable of boolean`，即發射的值只能是 `true` 或 `false`。
- 當我們想向使用者顯示載入指示器時，這個 observable 會發射 `true`，而在我們想要隱藏載入指示器時，則發射 `false`。

### Consuming Loading Observable in Loading Component Template

- 在載入組件中，通過使 `loadingService` 成為公共屬性，我們可以在模板中使用 async 管道來消耗 `loading observable`。
- 根據 observable 發射的值，決定是否顯示整個載入組件。

```html
<!-- Loading Component Template -->
<div *ngIf="loadingService.loading$ | async">
  <mat-spinner></mat-spinner>
</div>
```

### Advantages of the Design

- 這個簡單的設計有一些優勢：
  - 通過在模板中使用 observable，載入組件完全不知道 Angular 應用程式的其餘部分的結構，例如 home component、edit course component 等。
  - 載入組件只知道共享載入服務的 `loading observable`，這是它與應用程式的唯一互動方式。

## Additional Methods in Loading Service

- 在 `loading service` 中新增 `loading on` 和 `loading off` 兩個方法，以方便在應用程式的任何地方隨時打開或關閉載入指示器。

```typescript
// loading.service.ts

@Injectable()
export class LoadingService {
  loading$: Observable<boolean>;

  constructor() {
    // Implementation of loading observable assignment (not shown)
  }

  loadingOn(): void {
    // Turn on the loading indicator
  }

  loadingOff(): void {
    // Turn off the loading indicator
  }
}
```

## Show Loader Until Completed Method

- 新增一個名為 `showLoaderUntilCompleted` 的方法，以便在觀察特定 observable 的生命週期時，控制載入指示器的顯示和隱藏。
- 這個方法接收一個 observable 作為輸入參數，返回一個具有載入指示器功能的相同類型的 observable。

```typescript
// loading.service.ts

@Injectable()
export class LoadingService {
  loading$: Observable<boolean>;

  constructor() {
    // Implementation of loading observable assignment (not shown)
  }

  showLoaderUntilCompleted<T>(observable: Observable<T>): Observable<T> {
    // Implementation will be covered in a later lesson
    return undefined;
  }
}
```

這樣的設計讓我們能夠在應用程式的各個地方方便地打開或關閉載入指示器，同時與特定 observable 的生命週期相關聯，使得在處理非同步操作時更加方便和一致。在接下來的課程中，我們將進一步實作 `showLoaderUntilCompleted` 方法，以及分配 `loading observable` 的值的實現。

# Loading Service 完成及 Show Loader Until Completed 方法

## 簡介

在這個新的課程中，我們將完成載入服務的實作，提供一個稍微更方便的 API 來協助我們打開和關閉載入指示器。這裡我們要實作的是 `showLoaderUntilCompleted` 方法。

## 直接使用 Loading On 和 Loading Off 對比

在 Home Component 中，我們在重新載入課程時開啟載入指示器，並在這個 observable 完成或發生錯誤時關閉它。現在，讓我們看看如果我們不使用這個 API 會是什麼樣子。

首先，我們移除 `loadingOn` 以及使用 `finalize` 運算符的部分，回到原始的課程 observable 定義，沒有載入指示器功能。

現在，我們要使用 `showLoaderUntilCompleted` 方法來添加載入指示器功能。這個方法接受一個 observable 作為輸入，返回一個帶有載入指示器功能的相同類型的 observable。

```typescript
// home.component.ts

// 移除 loadingOn 和 finalize 的部分

// Load all courses observable
const loadAllCourses$ = this.apiService.loadAllCourses();

// 使用 showLoaderUntilCompleted 方法
const loadCourses$ = this.loadingService.showLoaderUntilCompleted(loadAllCourses$);

// 使用新的 observable 來定義 beginner 和 advanced courses
this.beginnerCourses$ = loadCourses$.pipe(map((courses) => courses.filter((course) => course.category === "BEGINNER")));
this.advancedCourses$ = loadCourses$.pipe(map((courses) => courses.filter((course) => course.category === "ADVANCED")));
```

這個 API 更方便，更少入侵，我們不需要在課程 observable 定義中添加新的運算符，比如 `finalize`。

現在，讓我們來看看如何實現 `showLoaderUntilCompleted` 方法。

## 實現 `showLoaderUntilCompleted` 方法

首先，我們需要在接收到輸入 observable 的生命週期開始之前，創建另一個初始 observable，該 observable 會發出一個值，這個值將觸發載入指示器。我們使用 RxJS 的工廠方法 `of` 來創建這個只發出一個值（null）然後立即完成的 observable。

```typescript
// loading.service.ts

import { of } from "rxjs";

@Injectable()
export class LoadingService {
  // ... (之前的部分)

  showLoaderUntilCompleted<T>(observable: Observable<T>): Observable<T> {
    const initialObservable = of(null).pipe(tap(() => this.loadingOn()));

    return initialObservable.pipe(
      concatMap(() => observable),
      finalize(() => this.loadingOff())
    );
  }
}
```

- 我們使用 `tap` 運算符來觸發副作用，即調用 `loadingOn()`，以顯示載入指示器。
- 使用 `concatMap` 運算符將初始 observable 的值轉換為輸入 observable，這意味著結果 observable 發出的值將與輸入 observable 發出的值相同，但載入指示器已經打開。
- 當輸入 observable 完成或發生錯誤時，我們使用 `finalize` 運算符來通知我們的 observable 鏈結結束，然後調用 `loadingOff()` 來關閉載入指示器。

這個方法的實現看起來比較複雜，讓我們快速回顧一下：

- 我們首先創建了一個初始 observable，只是為了能夠創建一個 observable 鏈。
- 當接收到這個初始值時，我們首先打開載入指示器，然後切換到發出由輸入 observable 發出的值。
- 我們使用 `concatMap` 運算符將來自源 observable（在這種情況下，這個 observable 只發出值 null，然後立即完成）的值轉換為新的 observable，即輸入 observable。
- 這意味著結果 observable 發出的值將與輸入 observable 發出的值相同，除了載入指示器已經打開。
- 當輸入 observable 完成或發生錯誤時，我們使用 `finalize` 運算符結束我們的 observable 鏈結，然後調用 `loadingOff()` 關閉載入指示器。

這個設計的主要優勢是，載入指示器只有在使用 `showLoaderUntilCompleted` 返回的 observable 訂閱時才會打開。這意味著載入指示器的顯示或隱藏完全與返回的 observable 的生命週期相關聯。只有當返回的 observable 被訂閱時，載入指示器才會打開，並且只有當返回的 observable 完成其生命週期時，載入指示器才會關閉。

這個方法接受一個泛型類型 `T`，但我們甚至不需要在調用 `showLoaderUntilCompleted` 時明確指定它。例如，在我們的 home component 中，我們只是傳入 `loadAllCourses$`，這是一

個 observable，它發出的值是課程數組。我們無需添加 `course array` 這個參數來告訴 `showLoaderUntilCompleted` 的實現我們的 observable 發出課程數組。相反，我們可以省略這個參數，`showLoaderUntilCompleted` 的實現將推斷出 `loadCourses$` 的類型。

這意味著我們的程序的其餘部分是類型安全的。

這個 `showLoaderUntilCompleted` 方法比之前的版本更方便使用。我們不需要到處添加 `finalize` 運算符來關閉載入指示器。這是一個更簡潔的選擇，為您的組件和服務添加載入指示器功能。

現在，讓我們看看 `showLoaderUntilCompleted` 功能是如何運作的，我們將重新載入應用程序，並保持關注。如您所見，載入指示器功能正在正確運作，如預期那樣。

現在，讓我們看看如何在應用程序的其他部分應用這個載入指示器功能。

# 筆記：Reactive Loading Indicator 實作

## 引言

這節課中，我們繼續實作我們的響應式載入指示器。迄今為止，我們僅在主頁面組件中使用載入服務和載入功能。

## 問題：載入服務在不同組件層次中的問題

現在，我們切換到編輯課程對話框（course dialogue component）上，這個對話框的構造函數中也接收到一個載入服務實例。載入服務是我們共享的響應式服務，用於使應用程序中的多個組件，例如課程對話框和主頁面組件，以鬆散耦合的方式與載入指示器組件交互。

然而，當我們嘗試打開編輯課程對話框時，應用程序崩潰。檢查控制台後，我們發現了一個依賴注入錯誤：`no provider for loading service`。這僅在嘗試打開對話框時發生。

## 原因：組件樹的層次結構

原因在於，由於 Angular Material 框架打開的對話框存在於完全不同的組件樹分支。在主頁面組件的模板中，我們可以訪問載入服務，但是在對話框組件中則無法訪問。

### 解決方案：為課程對話框提供不同實例的載入服務

為了解決這個問題，我們為課程對話框提供了一個不同的載入服務實例。我們在組件的 `providers` 屬性中添加了載入服務的構造函數，使 Angular 的依賴注入系統在該組件層次中創建一個新的載入服務實例。

這樣，我們在程序中有兩個載入服務實例，每個實例僅在其組件及其子組件層次中可訪問。

### 證實兩個載入服務實例

為了確認兩個載入服務實例的存在，我們在課程對話框的構造函數中添加了日誌記錄。在控制台中可以看到，兩個實例都被創建。這解決了依賴注入錯誤，並確保每個組件及其子組件層次中都有一個本地的載入服務實例。

## 問題：兩個實例的使用

然而，對話框中的載入服務實例並未連接到主應用程序組件層次中的載入指示器。為了解決這個問題，我們在課程對話框模板中添加了一個新的載入指示器。

這個第二個載入指示器在應用程序中可能有不同的載入指示器，用於向用戶顯示應用程序的不同等待狀態。該載入指示器將接收在課程對話框組件的 `providers` 屬性中定義的載入服務的實例。

現在，我們的程序中有兩個載入指示器，每個都可以通過與其自己的載入服務實例交互來單獨控制。

## 新功能：在保存操作中使用載入服務

我們現在可以使用課程對話框中的載入服務來創建新的“保存課程” observable。這個 observable 將包含從課程服務獲取的 observable，每當調用保存課程操作時都會發生。

通過訪問載入服務，我們使用之前在主頁面組件中看到的 `showLoaderUntilCompleted` 方法，將 `saveCourse$` observable 作為參數傳遞給它。這將返回一個具有載入指示器功能的新 observable。當這個 observable 被訂閱時，載入指示器將打開，並且當 observable 完成其生命週期時，載入指示器將被關閉。

現在，我們的應用程序中有兩個載入指示器，它們可以獨立控制。

## 結論

透過使用 Angular 提供的 `providers` 屬性，我們能夠在不同的組件層次中創建本地實例的服務，以實現服務的局部可訪問性。這解決了在不同組件樹中共享服務的問題。

現在，我們已經完成了載入指示器

功能的實現。接下來，我們將繼續學習有關響應式組件交互的內容，將討論錯誤處理，並展示如何構建一個在應用程序中顯示錯誤消息的面板。

# 筆記：響應式應用程序中的錯誤處理

## 引言

在接下來的幾節課中，我們將討論響應式應用程序中的錯誤處理。我們將實現一個常見的錯誤消息面板功能，將其添加到我們應用程序的頂部，就在頂部菜單欄的下方。這將是一個可關閉的錯誤消息面板，允許我們從應用程序的多個地方向用戶顯示錯誤消息。

與之前載入指示器的情況類似，錯誤消息在模態對話框的情況下稍有不同。在模態對話框中，我們希望將錯誤消息顯示給用戶，以便用戶在關閉對話框之前可以在此處修復可能存在的任何錯誤。

為了幫助我們實現這些消息組件，我們已經有了一個初始的功能框架。在`messages`文件夾中，我們有一個`messages`組件模板，目前是空的。我們還有一個`messages`組件，目前僅實現了`OnInit`方法和一個空的`OnClose`方法。還有一個`messages`組件的 CSS 文件，其中包含一些用於向用戶顯示錯誤消息的 CSS。

## Messages Component Template

`messages`組件的模板由包含一系列消息的容器組成。我們的容器將具有`messages container`的 CSS 類，並在其中循環遍歷一系列錯誤。每個錯誤都將具有`message`的 CSS 類。我們使用 Angular 的`NgFor`指令來循環遍歷錯誤列表。例如，我們假設有一個`errors`屬性，那麼我們使用`let error of errors`的語法來循環遍歷錯誤列表，然後使用 Angular 模板插值語法將每個錯誤（字符串）直接顯示在屏幕上。

我們的消息容器面板將是一個紅色背景的面板，將延伸到應用程序的整個長度。我們還將添加一個小的關閉按鈕。這將是一個材料圖標，圖標將是一個代表關閉的十字。我們將給這個圖標一個 CSS 類，即`close`。每當用戶點擊此圖標時，我們將調用`OnClose`函數，這個函數負責隱藏整個消息容器。

## Messages Component Implementation

初始情況下，我們的組件將根據我們在`messages`組件中設置的`show messages`標誌的值來顯示或隱藏消息。我們將這個標誌初始化為`false`，因為最初沒有錯誤要顯示給用戶。我們使用 Angular 的`ngIf`指令來根據`show messages`標誌的值來顯示或隱藏消息容器。

當用戶點擊`OnClose`時，我們希望隱藏消息容器，因此我們需要將`show messages`設置為`false`。

問題是，在什麼時候這個標誌會變為`true`呢？這個標誌會在我們應用程序的其他地方獲得一些錯誤並希望顯示給用戶時變為`true`。那麼，應用程序的其餘部分將如何以一種解耦的方式與我們的消息組件進行交互，正如我們之前所見？

## 解決方案：消息服務

與載入指示器的情況一樣，我們可以通過使用一個基於 observable 的 API 的共享服務來實現這種解耦的組件通信。因此，我們將構建一個名為`messaging service`的服務，該服務將允許我們以解耦的方式與消息組件進行交互。

在下一課中，我們將開始構建這個`messaging service`。

# 筆記：實現消息服務

## 引言

在這一課中，我們將開始實現我們的消息服務。這將是一個基於 observable 的服務，我們將用它來與 Angular 應用程序的多個部分進行交互，以顯示錯誤消息。

## Messages Service 實現

首先，我們需要在`messages`目錄下創建一個新的`messages.service.ts`文件，其中包含我們的 observable-based 服務。我們創建一個名為`MessagesService`的類，並將其標記為 Angular 的可注入服務。與載入指示器服務的情況一樣，我們不將其聲明為全局單例，而是將允許在應用程序的不同部分創建不同的`MessagesService`實例。

```typescript
// messages.service.ts

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  private errorMessagesSubject = new BehaviorSubject<string[]>([]);
  errorMessages$ = this.errorMessagesSubject.asObservable();

  constructor() {}

  showErrors(errors: string[]) {
    this.errorMessagesSubject.next(errors);
  }
}
```

上述代碼創建了一個名為`MessagesService`的 Angular 可注入服務。我們使用`BehaviorSubject`來維護一個錯誤消息的狀態，並且將其公開為`errorMessages$` observable，以便其他部分可以訂閱這些錯誤消息的變化。

`showErrors`方法用於將錯誤消息發送到`errorMessagesSubject`，這樣訂閱者就可以得知有新的錯誤消息。

## 使用 Messages Service

現在，我們需要在應用程序中的不同地方創建`MessagesService`的實例，並與`MessagesComponent`進行交互。我們首先在應用程序的根組件（`app.component.ts`）中創建一個實例。

```typescript
// app.component.ts

import { Component } from "@angular/core";
import { MessagesService } from "./messages/messages.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(private messagesService: MessagesService) {}
}
```

然後，我們在根組件的模板中添加了`MessagesComponent`的實例，以便能夠顯示全局錯誤消息。

```html
<!-- app.component.html -->

<app-messages></app-messages>

<!-- 其他組件的內容 -->
```

現在，根組件及其所有子組件都可以通過注入`MessagesService`來顯示錯誤消息。

在`home.component.ts`中的例子：

```typescript
// home.component.ts

import { Component, OnInit } from "@angular/core";
import { MessagesService } from "../messages/messages.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    // 在此處捕獲錯誤，然後顯示錯誤消息
    this.loadCourses().subscribe(
      () => {},
      (error) => {
        const errorMessage = "Could not load courses";
        this.messagesService.showErrors([errorMessage]);
        console.error(errorMessage, error);
      }
    );
  }

  loadCourses() {
    // 實際加載課程的邏輯
  }
}
```

這是一個簡單的例子，展示了如何使用`MessagesService`在錯誤情況下顯示消息。`loadCourses`方法是一個模擬的加載課程的邏輯，並在錯
