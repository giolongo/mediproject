import { inject, Injectable, signal } from '@angular/core';
import { ResourceModel } from '../app/models/resource.model';
import { ResourceRestService } from './resource.rest.service';
import { of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  private resourceRestService = inject(ResourceRestService)
  public resources = signal<ResourceModel[]>([]);

  constructor() {
    this.loadResources();
  }

  public loadResources() {
    this.resourceRestService.getResources().subscribe((resources) => {
      this.resources.set(resources.sort((a, b) => a.priority - b.priority));
    });
  }

  public deleteResource(id: number) {
    return this.resourceRestService.deleteResource(id).pipe(
      tap(() => {
        this.loadResources();
      })
    );
  }

  public addResource(resource: ResourceModel, files: File[]) {
    return this.resourceRestService.createResource(resource).pipe(switchMap((newResource) => {
      if (newResource?.id != undefined && files && files.length > 0) {
        return this.resourceRestService.uploadFiles(files, newResource.id);
      }
      return of(newResource);
    }), tap(() => {
      this.loadResources();
    }));
  }

  public updateResource(resource: ResourceModel, id: number, files: File[], skipReload: boolean = false) {
    return this.resourceRestService.updateResource(resource, id).pipe(switchMap((res) => {
      if (files && files.length > 0) {
        return this.resourceRestService.uploadFiles(files, id);
      }
      return of(res);
    }), tap(() => {
      if (!skipReload) {
        this.loadResources();
      }
    }));
  }
}
