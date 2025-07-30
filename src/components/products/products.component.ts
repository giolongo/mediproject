import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, inject, OnInit } from '@angular/core';
import { ResourcesService } from '../../service/resources.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { animate, style, transition, trigger } from '@angular/animations';
import { ResourceModel } from '../../app/models/resource.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  animations: [
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit{
  ngOnInit(): void {
    this.titleService.setTitle('Prodotti - MediProject')
  }

  private resourcesService = inject(ResourcesService);
  private titleService = inject(Title);
  private router = inject(Router);
  resources = this.resourcesService.resources;

  public detailProduct(product: ResourceModel){
    console.log(product)
    this.router.navigate(['/products', product.id]);
  }

}
