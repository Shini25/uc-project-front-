import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FlowbiteService } from '../services/flowbite.service';
declare const AOS: any;

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
    // angular tester
    isvisible: boolean = false
    isvisiblemenu: boolean = false

    // array
    valeurs = [
      { value: 'item 1'},
      { value: 'item 2'},
      { value: 'item 3'},
      { value: 'item 4'},
      { value: 'item 5'},
      { value: 'item 6'},
    ]
    constructor(private flowbiteService: FlowbiteService) {}

    ngOnInit(): void {
      this.flowbiteService.loadFlowbite(flowbite => {
        console.log('Flowbite loaded:', flowbite);
        // Any additional Flowbite initialization if needed
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

  }