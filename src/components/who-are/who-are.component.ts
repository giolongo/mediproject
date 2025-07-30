import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-who-are',
  imports: [],
  templateUrl: './who-are.component.html',
  styleUrl: './who-are.component.scss',
  animations: [
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class WhoAreComponent implements OnInit{
  ngOnInit(): void {
    this.titleService.setTitle('Chi Siamo - MediProject')
  }

  private titleService = inject(Title);

}
