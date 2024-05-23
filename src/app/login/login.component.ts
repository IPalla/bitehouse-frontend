import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [OrdersService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidCredentials: boolean;
  submitted: boolean;
  constructor(private fb: FormBuilder, private ordersService: OrdersService) {
    this.invalidCredentials = false;
    this.submitted = false;
    this.loginForm = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      console.log(this.loginForm.controls['username'].errors);
      return;
    }
    this.ordersService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe(
      data => {
        window.location.href = '?screen=riders';
      }
    );
  }
}