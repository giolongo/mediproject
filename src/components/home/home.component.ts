import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { ResourcesService } from '../../service/resources.service';
import { Title } from '@angular/platform-browser';

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
  private resourcesService = inject(ResourcesService);
  private titleService = inject(Title);
  resources = this.resourcesService.resources;

  public currentImage: any;
  public index = 0;

  ngOnInit(): void {
    this.titleService.setTitle('Home - MediProject')
    this.setImage(this.resources()[this.index]);
    this.index++;

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

  private isMobilePortrait(): boolean {
    return window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
  }

  private getImageVariant(src: string): string {
    const ext = src.split('.').pop();
    const base = src.replace(/\.\w+$/, '');
    if (this.isMobilePortrait()) {
      return `${base}_v.${ext}`;
    }
    return `${base}.${ext}`;
  }

  private setImage(image: any): void {
    const newSrc = this.getImageVariant(image.src);
    this.currentImage = {
      ...image,
      src: newSrc,
      original: image // salva l'originale per eventuale resize
    };
  }
}
