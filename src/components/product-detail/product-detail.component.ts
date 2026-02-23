import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceRestService } from '../../service/resource.rest.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { ResourceModel, ResourceFileModel } from '../../app/models/resource.model';
import { FileByTypePipe } from "../../pipes/file-by-type-pipe";

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FileByTypePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  animations: [
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ProductDetailComponent implements OnInit {

  private resourceRestService = inject(ResourceRestService);
  private router = inject(Router);
  private titleService = inject(Title);

  public product?: ResourceModel;
  public selectedFile?: ResourceFileModel;

  get galleryFiles(): ResourceFileModel[] {
    if (!this.product?.files) return [];
    return this.product.files.filter(f =>
      f.name.toLowerCase() === 'image' || f.name.toLowerCase() === 'video'
    );
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/home']);
      throw new Error("Id not valid");
    }
    this.resourceRestService.getResource(+id).pipe(take(1)).subscribe((product) => {
      this.product = product;
      const gallery = this.galleryFiles;
      if (gallery.length > 0) {
        // Prefer image as default view
        const image = gallery.find(f => f.name.toLowerCase() === 'image');
        this.selectedFile = image || gallery[0];
      }
      this.titleService.setTitle(`${product.name} - MediProject`)
    })
  }

  selectFile(file: ResourceFileModel): void {
    this.selectedFile = file;
  }
}
