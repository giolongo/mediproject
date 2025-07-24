import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar color="primary" class="footer">
      © MediProject
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
    }
  `]
})
export class FooterComponent {

}
