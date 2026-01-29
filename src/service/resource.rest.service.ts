import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResourceModel } from '../app/models/resource.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceRestService {

  private http = inject(HttpClient);


  constructor() { }

  public getResources() {
    return this.http.get<ResourceModel[]>(`${environment.api}/product`);
  }

  public getResource(id: number) {
    return this.http.get<ResourceModel>(`${environment.api}/product/${id}`);
  }

  public createResource(resource: ResourceModel): Observable<ResourceModel> {
    return this.http.post<ResourceModel>(`${environment.api}/product`, resource);
  }

  public updateResource(resource: ResourceModel, id: number): Observable<ResourceModel> {
    return this.http.patch<ResourceModel>(`${environment.api}/product/${id}`, resource);
  }

  public deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.api}/product/${id}`);
  }

  public uploadFiles(files: File[], id: number): Observable<ResourceModel | null> {
    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file, file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image');
      })
      return this.http.post<ResourceModel>(`${environment.api}/product/${id}/files`, formData);
    }
    return of(null)
  }
}
