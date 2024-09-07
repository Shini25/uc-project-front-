import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { UserService } from '../services/user.service';
import { User_account } from '../models/user.model';
import { AccountCreatedDialogComponent } from './account-created-dialog/account-created-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    AccountCreatedDialogComponent,
    RouterLink
  ]
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  accountStatuses = ['ONLINE', 'OFFLINE'];
  accountTypes = ['ADMIN', 'SIMPLE', 'OTHER'];
  accountStates = ['ACTIVE', 'INACTIVE'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.createAccountForm = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      accountType: ['', Validators.required],
      accountStatus: ['OFFLINE'],
      accountState: ['INACTIVE']
    });
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      const numeroControl = this.createAccountForm.get('numero');
      if (numeroControl) {
        const numero = numeroControl.value;
        this.userService.checkUsernameExists(numero).subscribe(
          exists => {
            if (exists) {
              console.error('Username already exists');
            } else {
              const user: User_account = this.createAccountForm.value;
              console.log('Form Values:', this.createAccountForm.value); // Log form values for debugging
              this.userService.addUser(user).subscribe(
                response => {
                  console.log('User created successfully', response);
                  const dialogRef = this.dialog.open(AccountCreatedDialogComponent); // Open the dialog

                  dialogRef.afterClosed().subscribe(() => {
                    this.createAccountForm.reset(); // Reset the form
                    this.createAccountForm.patchValue({
                      accountStatus: 'OFFLINE',
                      accountState: 'INACTIVE'
                    });
                  });
                },
                error => {
                  console.error('Error creating user', error.message);
                }
              );
            }
          },
          error => {
            console.error('Error checking numero', error.message);
          }
        );
      }
    } else {
      console.log('Form Invalid:', this.createAccountForm); // Log invalid form state for debugging
    }
  }
}