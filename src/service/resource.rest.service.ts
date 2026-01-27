import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceModel } from '../app/models/resource.model';
import { ResourceDetailModel } from '../app/models/resource-detail.model';
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

  public getResource(id: string) {
    return this.http.get<ResourceModel>(`${environment.api}/product/${id}`);
  }
}
