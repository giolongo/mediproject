import { inject, Injectable, signal } from '@angular/core';
import { ResourceModel } from '../app/models/resource.model';
import { ResourceRestService } from './resource.rest.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  private resourceRestService = inject(ResourceRestService)
  public resources = signal<ResourceModel[]>([]);

  constructor() { 
    this.resourceRestService.getResources().subscribe((resources) => {
      this.resources.set(resources)
    });
  }
}
