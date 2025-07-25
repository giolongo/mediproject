import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

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

  public currentImage: any;
  public index = 0;

  images = [
    { src: './slider/1.jpg', alt: 'Natura', title: 'Paesaggio Incredibile', description: 'Descrizione 1' },
    { src: './slider/2.jpg', alt: 'Città', title: 'Panorama Urbano', description: 'Descrizione 2' },
    { src: './slider/3.jpg', alt: 'Montagne', title: 'Vette Maestose', description: 'Descrizione 3' }
  ];

  ngOnInit(): void {
    this.currentImage = this.images[this.index];
    this.index++;

    setInterval(() => {
      this.currentImage = null;
      setTimeout(() => {
        this.currentImage = this.images[this.index];
        this.index++;
        if (this.index >= this.images.length) {
          this.index = 0;
        }
      }, 500);
    }, 5000);
  }
}