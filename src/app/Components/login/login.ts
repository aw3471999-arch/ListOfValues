import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimengModule } from '../../Module/primeng.module';
import { LoV } from '../../Services/ListOfView/lo-v';

@Component({
  selector: 'app-login',
  imports: [PrimengModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor() {
    let a = 10;
  let b = 20;
  [a, b] = [b, a];
  console.log(a,b);
  }


  private fb = inject(FormBuilder);
  private lovService = inject(LoV);
  private router = inject(Router);

  loading = signal(false);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    staySignedIn: [false]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.lovService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Login failed', err);
        }
      });
    }
  }

}
