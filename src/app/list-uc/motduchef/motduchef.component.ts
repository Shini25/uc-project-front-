import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UcMotDuChefService } from '../../services/uc-motduchef.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-motduchef',
  templateUrl: './motduchef.component.html',
  styleUrls: ['./motduchef.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIcon
  ]
})
export class MotDuChefComponent implements OnInit {
  ucId!: string;
  ucNom!: string;
  ucPrenoms!: string;
  motDuChefs: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private ucMotDuChefService: UcMotDuChefService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.ucId = this.route.snapshot.paramMap.get('ucId')!;
    this.ucNom = this.route.snapshot.queryParamMap.get('nom')!;
    this.ucPrenoms = this.route.snapshot.queryParamMap.get('prenoms')!;
    this.ucMotDuChefService.getMotDuChefsByUc(this.ucId).subscribe(motDuChefs => {
      this.motDuChefs = motDuChefs;
    });
  }

  goBack(): void {
    this.location.back();
  }
}