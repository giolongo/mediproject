import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../service/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../service/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {
    private fb = inject(NonNullableFormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    isLoggingIn = signal(false);

    login() {
        if (this.form.valid) {
            this.isLoggingIn.set(true);
            const { username, password } = this.form.getRawValue();
            this.authService.login(username, password)
                .pipe(finalize(() => this.isLoggingIn.set(false)))
                .subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                        this.toastService.success('Login effettuato con successo');
                    },
                    error: (err) => {
                        console.error(err);
                        this.toastService.error('Credenziali non valide o errore del server');
                    }
                });
        }
    }
}
