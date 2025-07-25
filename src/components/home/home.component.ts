import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { ResourcesService } from '../../service/resources.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  private resourcesService = inject(ResourcesService)
  resources = this.resourcesService.resources;

  public currentImage: any;
  public index = 0;


  ngOnInit(): void {
    this.currentImage = this.resources()[this.index];
    this.index++;

    setInterval(() => {
      this.currentImage = null;
      setTimeout(() => {
        this.currentImage = this.resources()[this.index];
        this.index++;
        if (this.index >= this.resources().length) {
          this.index = 0;
        }
      }, 500);
    }, 5000);
  }
}