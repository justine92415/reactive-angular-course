import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private subject = new Subject<string[]>();
  errors$: Observable<string[]> = this.subject
    .asObservable()
    .pipe(filter((messages) => {
      console.log(messages);
      return messages && messages.length > 0
    }));

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }
}
