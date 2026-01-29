import { Component, Inject, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
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
import { ToastService } from '../../../service/toast.service';

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
    private toastService = inject(ToastService);

    constructor(@Inject(MAT_DIALOG_DATA) public data: ResourceModel | undefined) {
        if (data) {
            this.form.patchValue({
                name: data.name,
                description: data.description || '',
                priority: data.priority
            });
            data.details.forEach(detail => this.addDetail(detail));
        }
    }

    form = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        priority: [0, Validators.required],
        details: this.fb.array<{ label: string, description: string }>([]),
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

    addDetail(detail?: { id?: number, label: string, description: string }) {
        this.details.push(this.fb.group({
            id: [detail?.id],
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

    isSaving = signal(false);

    save() {
        console.log('Save called');
        console.log('Form valid:', this.form.valid);
        console.log('Form value:', this.form.getRawValue());

        if (this.form.valid) {
            this.isSaving.set(true);
            const raw = this.form.getRawValue();
            const files: any[] = [];
            if (raw.image) files.push(raw.image);
            if (raw.pdf) files.push(raw.pdf);

            console.log('Files to upload:', files);

            const result: ResourceModel = {
                name: raw.name,
                description: raw.description,
                priority: Number(raw.priority),
                details: raw.details.map((detail: any) => ({
                    label: detail.label,
                    description: detail.description
                })),
            };

            console.log('Resource to save:', result);
            console.log('ID:', this.data?.id);

            const operation = this.data?.id != null
                ? this.resourcesService.updateResource(result, this.data.id, files)
                : this.resourcesService.addResource(result, files);

            console.log('Subscribing to operation...');
            operation.pipe(finalize(() => {
                console.log('Finalize called');
                this.isSaving.set(false);
            })).subscribe({
                next: (res) => {
                    console.log('Operation successful', res);
                    this.toastService.success('Operazione completata con successo');
                    this.dialogRef.close();
                },
                error: (err) => {
                    console.error('Operation failed', err);
                    this.toastService.error('Errore durante il salvataggio');
                }
            });
        } else {
            console.warn('Form is invalid', this.form.errors);
        }
    }
}
