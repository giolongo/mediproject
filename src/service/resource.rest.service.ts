import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResourceModel } from '../app/models/resource.model';
import { environment } from '../environment';

const MOCK_PRODUCTS: ResourceModel[] = [
  {
    id: '1',
    name: 'Ecografo Portatile',
    priority: 1,
    description: 'Ecografo di ultima generazione per diagnosi rapide.',
    details: [
      { id: 1, label: 'Frequenza', description: '3.5 MHz' },
      { id: 2, label: 'Batteria', description: '4 ore' }
    ],
    files: [
      { id: 101, location: 'https://placehold.co/600x400', name: 'eco_cover.jpg' },
      { id: 102, location: 'https://pdfobject.com/pdf/sample.pdf', name: 'scheda_tecnica.pdf' }
    ]
  },
  {
    id: '2',
    name: 'Defibrillatore Automatico',
    priority: 2,
    description: 'DAE facile da usare per emergenze.',
    details: [
      { id: 1, label: 'Peso', description: '1.5 kg' }
    ],
    files: [
      { id: 201, location: 'https://placehold.co/600x400/orange/white', name: 'dae.jpg' }
    ]
  }
];

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

  public createResource(resource: ResourceModel): Observable<ResourceModel> {
    return this.http.post<ResourceModel>(`${environment.api}/product`, resource);
  }

  public updateResource(resource: ResourceModel, id: string): Observable<ResourceModel> {
    return this.http.patch<ResourceModel>(`${environment.api}/product/${id}`, resource);
  }

  public deleteResource(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.api}/product/${id}`);
  }

  public uploadFiles(files: File[], id: string): Observable<ResourceModel> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image');
    })
    return this.http.post<ResourceModel>(`${environment.api}/product/${id}/files`, formData);
  }
}
