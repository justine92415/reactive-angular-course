import {Component, OnInit, inject} from '@angular/core';
import { LoadingService } from './services/loading.service';
import { MessagesService } from './services/messages.service';
import { AuthStoreService } from './services/auth-store.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements  OnInit {

    authStore = inject(AuthStoreService);

    constructor() {

    }

    ngOnInit() {


    }

  logout() {
    this.authStore.logout();
  }

}
