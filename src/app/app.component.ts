import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlowbiteService } from './services/flowbite.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontBankLoan';
  pendingLoansCount: number = 0;
  user: any;
  numero: string | null = null;
  isLivretOpen = false;
  finaluser: any;

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private flowbiteService: FlowbiteService) {}

  ngOnInit() {
    this.flowbiteService.loadFlowbite(flowbite => {
      console.log('Flowbite loaded:', flowbite);
    });
    this.numero = this.userService.getNumero();
    console.log('Numero in AppComponent:', this.numero); // Log the numero in AppComponent
    if (this.numero) {
      this.userService.getUserByNumero(this.numero).subscribe(user => {
        this.user = user;
        console.log('User retrieved:', this.user); // Log the retrieved user
      });
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.userService.getUserInfo().subscribe(
        data => {
          this.user = data;
          console.log('User info:', this.user.username);
          this.userService.getUserByNumero(this.user.username).subscribe(user => {
            this.finaluser = user;
            console.log('fanandramana:', this.finaluser.numero);
          });
        },
        err => {
          console.error('Error fetching user info', err);
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      );
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleLivret() {
    this.isLivretOpen = !this.isLivretOpen;
  }

  isDarkMode = false;

  toggleDarkMode(): void {

    const isDarkMode = document.documentElement.classList.contains('dark');
        this.isDarkMode = !this.isDarkMode;

    if (isDarkMode) {
      document.documentElement.classList.remove('dark'); 
    } else {
      document.documentElement.classList.add('dark'); 
    }
  }

}