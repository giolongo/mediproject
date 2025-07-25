import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceModel } from '../app/models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceRestService {

  private http = inject(HttpClient);


  constructor() { }

  public getResource() {
    return this.http.get<ResourceModel[]>('./products.json');
  }
}
