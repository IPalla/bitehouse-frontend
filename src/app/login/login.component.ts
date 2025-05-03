import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthAPIService } from '../services/delivery-manager';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthAPIService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invalidCredentials: boolean;
  submitted: boolean;
  constructor(
    private fb: FormBuilder,
    private loginService: AuthAPIService,
  ) {
    this.invalidCredentials = false;
    this.submitted = false;
    this.loginForm = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      console.log(this.loginForm.controls['username'].errors);
      return;
    }
    this.loginService
      .authPost({
        name: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value,
      })
      .subscribe((login: boolean) => {
        if (login) window.location.href = '?screen=riders';
        else this.invalidCredentials = true;
      });
  }
}
