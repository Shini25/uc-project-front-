import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../services/user.service';
import { User_account } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;

  numero: string = '';
  password: string = '';
  errorMessage: string = '';

  user: User_account = new User_account('', '', '', '', 'ONLINE', 'SIMPLE', 'ACTIVE');
  accountStatuses = ['ONLINE', 'OFFLINE'];
  accountTypes = ['ADMIN', 'SIMPLE', 'OTHER'];
  accountStates = ['ACTIVE', 'INACTIVE'];

  showLoginForm = true;

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private location: Location) {
    this.loginForm = new FormGroup({
      numero: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {}

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { numero, password } = this.loginForm.value;

    this.loading = true;
    this.authService.login({ numero, password }).subscribe(
      data => {
        this.authService.saveToken(data.jwt);
        this.userService.setNumero(numero); // Store the numero
        console.log('Numero set in login:', numero); // Log the numero set in login
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/home']);
        }, 2000);
      },
      err => {
        console.error('Login error:', err); // Log the error details for debugging
        if (err.status === 404) {
          this.errorMessage = 'User not found';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid credentials';
        } else if (err.status === 403) {
          this.errorMessage = 'Access denied';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login error';
        }
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}