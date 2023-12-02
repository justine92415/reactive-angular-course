import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { AuthStoreService } from "../services/auth-store.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  authStore = inject(AuthStoreService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = fb.group({
      email: ["test@angular-university.io", [Validators.required]],
      password: ["test", [Validators.required]],
    });
  }

  ngOnInit() {}

  login() {
    const val = this.form.value;

    this.authStore.login(val.email, val.password).subscribe(
      () => {
        this.router.navigateByUrl("/courses");
      },
      (error) => {
        alert("Login Failed");
      }
    );
  }
}
