import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Get the token from the auth service
    const token = this.authService.getToken();

    // If we have a token, add it to the Authorization header
    if (token) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return the cloned request with the Authorization header
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // If we get a 401 (Unauthorized) or 403 (Forbidden) response
          if (error.status === 401 || error.status === 403) {
            // Force logout the user
            this.authService.forceLogout();
          }
          return throwError(() => error);
        }),
      );
    }

    // If no token, just pass the request through
    return next.handle(request);
  }
}
