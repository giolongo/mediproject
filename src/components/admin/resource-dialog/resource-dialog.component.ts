import { Component, Inject, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ResourceModel } from '../../../app/models/resource.model';
import { ResourceRestService } from '../../../service/resource.rest.service';
import { FileByTypePipe } from "../../../pipes/file-by-type-pipe";
import { ResourcesService } from '../../../service/resources.service';

@Component({
    selector: 'app-resource-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FileByTypePipe
    ],
    templateUrl: './resource-dialog.component.html',
    styleUrl: './resource-dialog.component.scss'
})
export class ResourceDialogComponent {
    private fb = inject(NonNullableFormBuilder);
    private dialogRef = inject(MatDialogRef<ResourceDialogComponent>);
    private resourcesService = inject(ResourcesService);

    constructor(@Inject(MAT_DIALOG_DATA) public data: ResourceModel | undefined) {
        if (data) {
            this.form.patchValue({
                id: data.id,
                name: data.name,
                description: data.description || '',
                priority: data.priority
            });
            data.details.forEach(detail => this.addDetail(detail));
        }
    }

    form = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        description: ['', Validators.required],
        priority: [0, Validators.required],
        details: this.fb.array<{ id: number, label: string, description: string }>([]),
        image: this.fb.control<File | null>(null),
        pdf: this.fb.control<File | null>(null)
    });

    get details() {
        return this.form.get('details') as FormArray;
    }

    get imageFile() {
        return this.form.get('image');
    }

    get pdfFile() {
        return this.form.get('pdf');
    }

    addDetail(detail?: { label: string, description: string }) {
        this.details.push(this.fb.group({
            label: [detail?.label || '', Validators.required],
            description: [detail?.description || '', Validators.required]
        }));
    }

    removeDetail(index: number) {
        console.log(index);
        this.details.removeAt(index);
    }

    onFileSelected(event: any, type: 'image' | 'pdf') {
        const file: File = event.target.files[0];
        if (file) {
            if (type === 'image' && !file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (type === 'pdf' && file.type !== 'application/pdf') {
                alert('Please select a PDF file');
                return;
            }

            if (type === 'image') {
                this.imageFile?.setValue(file);
            } else {
                this.pdfFile?.setValue(file);
            }
        }
    }

    save() {
        if (this.form.valid) {
            const raw = this.form.getRawValue();
            const files: any[] = [];
            if (raw.image) files.push(raw.image);
            if (raw.pdf) files.push(raw.pdf);

            const result: ResourceModel = {
                name: raw.name,
                description: raw.description,
                priority: Number(raw.priority),
                details: raw.details.map((detail) => ({
                    label: detail.label,
                    description: detail.description
                })),
            };

            if (raw.id?.trim() != '') {
                this.resourcesService.updateResource(result, raw.id, files);
            } else {
                this.resourcesService.addResource(result, files);
            }

        }
    }
}
