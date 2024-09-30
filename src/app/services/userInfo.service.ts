import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  user: any;
  finaluser: any;

  constructor(private userService: UserService, private router: Router) {}

  fetchUserInfo() {
    this.userService.getUserInfo().subscribe(
      data => {
        this.user = data;
        console.log('User info:', this.user.username);
        this.userService.getUserByNumero(this.user.username).subscribe(user => {
          this.finaluser = user;
          console.log('User info userinfoservice:', this.finaluser.numero);
        });
      },
      err => {
        console.error('Error fetching user info', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
