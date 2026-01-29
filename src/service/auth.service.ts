import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { environment } from '../environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);

    private readonly tokenKey = 'token';
    // Signal to track login state for UI updates if needed, though simpler local storage check works for guards
    isLoggedIn = signal<boolean>(!!localStorage.getItem(this.tokenKey));

    constructor(private router: Router) { }

    login(username: string, password: string) {
        // Mock login - accept any credentials effectively, or checking specific ones if we wanted logic.
        // For this task, just return success.
        return this.http.post<{ access_token: string }>(`${environment.api}/auth/login`, { username, password }).pipe(
            tap((response) => {
                localStorage.setItem(this.tokenKey, response.access_token);
                this.isLoggedIn.set(true);
            })
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isLoggedIn.set(false);
        this.router.navigate(['/admin/login']);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
