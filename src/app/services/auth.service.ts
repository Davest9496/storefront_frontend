import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Initialize with stored user data if available
    this.loadStoredUserData();
  }

  private loadStoredUserData(): void {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      this.tokenSubject.next(storedToken);
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Get current authentication status as an Observable
  isLoggedIn(): Observable<boolean> {
    return this.currentUserSubject.pipe(map((user) => user !== null));
  }

  // Get current authentication status synchronously
  isLoggedInSync(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Get current user as an Observable
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Get current user synchronously
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current token
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Login user
  login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        map((response) => response.data.user),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          // If server sent a direct error message, use it
          if (error.error && typeof error.error === 'string') {
            return throwError(() => new Error(error.error));
          }
          // If server sent a structured error response
          else if (error.error && error.error.message) {
            return throwError(() => new Error(error.error.message));
          }
          // Otherwise use the status text
          else {
            return throwError(
              () =>
                new Error(
                  `Login failed: ${error.statusText || 'Please try again'}`,
                ),
            );
          }
        }),
      );
  }

  // Register new user
  signup(userData: SignupData): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap((response) => this.handleAuthResponse(response)),
      map((response) => response.data.user),
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(
          () =>
            new Error(
              error.error?.message || 'Registration failed. Please try again.',
            ),
        );
      }),
    );
  }

  // Get current user profile from API
  refreshUserProfile(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        const user = response.data.user;
        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      map((response) => response.data.user),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => new Error('Failed to load user profile'));
      }),
    );
  }

  // Logout user
  logout(): void {
    // Call the backend logout endpoint
    this.http.post<any>(`${this.apiUrl}/logout`, {}).subscribe({
      // Whether it succeeds or fails, clear the local state
      complete: () => this.clearAuthData(),
    });
  }

  // Force logout (used when token is invalid/expired)
  forceLogout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private handleAuthResponse(response: AuthResponse): void {
    const { user } = response.data;
    const { token } = response;

    // Store user and token
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);

    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  private clearAuthData(): void {
    // Clear subject values
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === role;
  }
}
