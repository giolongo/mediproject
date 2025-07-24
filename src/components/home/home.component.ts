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
    // Initialize currentImage immediately
    this.currentImage = this.images[this.index];
    this.index++;

    setInterval(() => {
      // Set currentImage to null briefly to trigger :leave, then update it to trigger :enter
      this.currentImage = null; // This will trigger the :leave animation
      setTimeout(() => {
        this.currentImage = this.images[this.index]; // This will trigger the :enter animation
        this.index++;
        if (this.index >= this.images.length) { // Use >= for correct boundary check
          this.index = 0;
        }
      }, 500); // This timeout should be slightly longer than your :leave animation duration
    }, 5000);
  }
}