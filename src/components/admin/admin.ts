import { Component, inject, signal } from '@angular/core';
import { ResourcesService } from '../../service/resources.service';
import { ResourceModel } from '../../app/models/resource.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceDialogComponent } from './resource-dialog/resource-dialog.component';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './admin.html',
    styleUrl: './admin.scss',
})
export class AdminComponent {
    private resourcesService = inject(ResourcesService);
    private dialog = inject(MatDialog);
    private authService = inject(AuthService);

    resources = this.resourcesService.resources;
    displayedColumns: string[] = ['name', 'priority', 'actions'];

    deleteResource(id: string) {
        if (confirm('Sicuro di vole eliminare il prodotto?')) {
            this.resourcesService.deleteResource(id);
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
