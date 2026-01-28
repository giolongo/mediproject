import { inject, Injectable, signal } from '@angular/core';
import { ResourceModel } from '../app/models/resource.model';
import { ResourceRestService } from './resource.rest.service';
import { of, switchMap } from 'rxjs';

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

  public deleteResource(id: string) {
    this.resourceRestService.deleteResource(id).subscribe(() => {
      this.resources.update(resources => resources.filter(r => r.id !== id));
    });
  }

  public addResource(resource: ResourceModel, files: File[]) {
    this.resourceRestService.createResource(resource).pipe(switchMap((newResource) => {
      if (newResource?.id != undefined) {
        return this.resourceRestService.uploadFiles(files, newResource.id);
      }
      return of(newResource);
    })).subscribe(newResource => {
      this.resources.update(resources => [...resources, newResource]);
    });
  }

  public updateResource(resource: ResourceModel, id: string, files: File[]) {
    this.resourceRestService.updateResource(resource, id).pipe(switchMap(() => {
      return this.resourceRestService.uploadFiles(files, id);
    })).subscribe(updated => {
      this.resources.update(resources => resources.map(r => r.id === updated.id ? updated : r));
    });
  }
}
