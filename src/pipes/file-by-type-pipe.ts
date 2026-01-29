import { Pipe, PipeTransform } from '@angular/core';
import { ResourceFileModel } from '../app/models/resource.model';

@Pipe({
  name: 'fileByType',
})
export class FileByTypePipe implements PipeTransform {

  transform(value?: ResourceFileModel[], type?: 'image' | 'pdf'): ResourceFileModel | undefined {
    if (!value || !type) return undefined;
    return value.find(file => file.name.toLowerCase() === type);
  }
}
