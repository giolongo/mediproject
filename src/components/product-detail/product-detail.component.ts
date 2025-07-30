import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceRestService } from '../../service/resource.rest.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ResourceDetailModel } from '../../app/models/resource-detail.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
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
export class ProductDetailComponent implements OnInit{

  private resourceRestService = inject(ResourceRestService);
  private router = inject(Router);

  public product?: ResourceDetailModel;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id){
      this.router.navigate(['/home']);
      throw new Error("Id not valid");
    }
    this.resourceRestService.getResource(id).pipe(take(1)).subscribe((product) => {
      this.product = product;
    })
  }
}
