import { Component, inject, signal } from '@angular/core';
import { ResourcesService } from '../../service/resources.service';
import { ResourceModel } from '../../app/models/resource.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceDialogComponent } from './resource-dialog/resource-dialog.component';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { concat, finalize, Observable, toArray } from 'rxjs';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, DragDropModule],
    templateUrl: './admin.html',
    styleUrl: './admin.scss',
})
export class AdminComponent {
    private resourcesService = inject(ResourcesService);
    private dialog = inject(MatDialog);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    resources = this.resourcesService.resources;
    displayedColumns: string[] = ['position', 'name', 'priority', 'actions'];
    deletingId = signal<number | null>(null);

    drop(event: CdkDragDrop<ResourceModel[]>) {
        const previousResources = [...this.resources()];
        const prevIndex = this.resources().findIndex((d) => d === event.item.data);
        moveItemInArray(this.resources(), prevIndex, event.currentIndex);

        const updates: Observable<any>[] = [];

        this.resources().forEach((resource, index) => {
            const newPriority = index + 1;
            if (resource.priority !== newPriority) {
                resource.priority = newPriority;
                updates.push(this.updateResourcePriority({
                    name: resource.name,
                    description: resource.description,
                    priority: newPriority,
                    details: resource.details?.map(d => ({
                        label: d.label,
                        description: d.description
                    }))
                }, resource.id!));
            }
        });

        if (updates.length > 0) {
            concat(...updates).pipe(toArray()).subscribe({
                next: () => {
                    this.resourcesService.loadResources();
                    this.toastService.success('Ordine aggiornato con successo');
                },
                error: (err) => {
                    console.error(err);
                    this.resourcesService.resources.set(previousResources);
                    this.toastService.error('Errore durante l\'aggiornamento dell\'ordine');
                }
            });
        }
    }

    updateResourcePriority(resource: ResourceModel, id: number) {
        return this.resourcesService.updateResource(resource, id, [], true);
    }


    deleteResource(id: number) {
        if (confirm('Sicuro di vole eliminare il prodotto?')) {
            this.deletingId.set(id);
            this.resourcesService.deleteResource(id)
                .pipe(finalize(() => this.deletingId.set(null)))
                .subscribe({
                    next: () => {
                        this.toastService.success('Prodotto eliminato con successo');
                    },
                    error: (err) => {
                        console.error(err);
                        this.toastService.error('Errore durante l\'eliminazione');
                    }
                });
        }
    }

    logout() {
        this.authService.logout();
    }

    openDialog(resource?: ResourceModel) {
        this.dialog.open(ResourceDialogComponent, {
            data: resource,
            width: '800px',
            disableClose: true
        });
    }
}
