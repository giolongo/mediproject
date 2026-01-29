import { Component, inject, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { ResourcesService } from '../../service/resources.service';
import { Title } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ResourceModel } from '../../app/models/resource.model';
import { FileByTypePipe } from "../../pipes/file-by-type-pipe";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, FileByTypePipe],
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
  private resourcesService = inject(ResourcesService);
  private titleService = inject(Title);
  private fileByTypePipe = inject(FileByTypePipe);
  resources = this.resourcesService.resources;

  public currentImage: any;
  public index = 0;

  constructor() {
    effect(() => {
      this.index++;
      if (this.index >= this.resources().length) {
        this.index = 0;
      }
      this.setImage(this.resources()[this.index]);
    })
  }


  ngOnInit(): void {
    this.titleService.setTitle('Home - MediProject')

    setInterval(() => {
      this.currentImage = null;
      setTimeout(() => {
        this.setImage(this.resources()[this.index]);
        this.index++;
        if (this.index >= this.resources().length) {
          this.index = 0;
        }
      }, 500);
    }, 5000);
  }

  @HostListener('window:resize')
  onResize() {
    // Riapplica l’immagine con orientamento corretto se serve
    if (this.currentImage?.original) {
      this.setImage(this.currentImage.original);
    }
  }

  private setImage(product: ResourceModel): void {
    this.currentImage = {
      ...product,
      src: this.fileByTypePipe.transform(product?.files ?? [], 'image')?.location,
      original: product // salva l'originale per eventuale resize
    };
  }
}
