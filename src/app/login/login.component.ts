import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Subject, catchError, finalize, of, switchMap } from 'rxjs';
import { InputComponent } from '../../custom-components/input/input.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../custom-components/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { ignoreErrors } from '../../utils/utils';
import { AppFullRoutes } from '../../constants/app-full-routes';
import { LoginDataContract } from '../../contracts/login-data-contract';
import { LoadingService } from '../../services/loading.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    MatIconModule,
    ButtonComponent,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  router = inject(Router);
  loadingService = inject(LoadingService);
  tokenService = inject(TokenService);

  eyeIcons: Record<
    'eye' | 'eye-off',
    {
      icon: 'eye' | 'eye-off';
      inputType: 'password' | 'text';
    }
  > = {
    eye: {
      icon: 'eye-off',
      inputType: 'text',
    },
    'eye-off': {
      icon: 'eye',
      inputType: 'password',
    },
  };
  selectedPasswordOptions = this.eyeIcons['eye-off'];

  form: UntypedFormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    server: ['', Validators.required],
  });

  login$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.listenToLogin();
  }

  listenToLogin(): void {
    this.login$
      .pipe(
        switchMap(() => {
          this.loadingService.show(); // Show loader before login attempt
          return this.authService
            .login(
              this.form.value
              // {
              //   email: 'werad.saoud@gmail.com',
              //   password: '$Coi54d_',
              //   server: 'OSP-DEMO',
              // }
            )
            .pipe(
              catchError((error) => {
                console.error('Login error:', error);
                // Handle login error (optional)
                return of(null); // Emit null to continue the observable chain
              })
            );
        })
      )
      .subscribe((loginData: LoginDataContract | null) => {
        if (loginData) {
          localStorage.setItem('user', this.form.get('email')?.value);
          this.tokenService.setAccessToken(loginData.accessToken);
          this.tokenService.setRefreshToken(loginData.refreshToken);
          this.tokenService.setExpiryDate(loginData.expireDate);
          this.authService.authenticated = true;
          this.toast.success('logged in successfully!');
          this.loadingService.hide();
          this.router.navigate([AppFullRoutes.HOME]).then();
        } else {
          this.form.markAllAsTouched();
          this.toast.error('Login failed!');
          this.loadingService.hide();
        }
      });
  }

  toggleEye() {
    this.selectedPasswordOptions =
      this.eyeIcons[this.selectedPasswordOptions.icon];
  }
}
