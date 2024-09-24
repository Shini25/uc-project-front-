import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FlowbiteService } from '../services/flowbite.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {  
    isvisible: boolean = false
    isvisiblemenu: boolean = false
    user: any;
    finaluser: any;

    constructor(
        private flowbiteService: FlowbiteService, 
        private userService: UserService, 
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
      this.flowbiteService.loadFlowbite(flowbite => {
        console.log('Flowbite loaded:', flowbite);
      });
    }

    onMouseOver(event: Event) {
      this.isvisible = true;
      console.log('Mouse over:', event);
    }

    onMouseOut(event: Event) {
      this.isvisible = false;
      console.log('Mouse out:', event);
    }

    onMouseOverMenu() {
      this.isvisiblemenu = true
    }

    logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}