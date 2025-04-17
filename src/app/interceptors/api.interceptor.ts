import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Log the request for debugging
    console.log(`API Request: ${request.method} ${request.url}`);

    // Clone the request and add headers if needed
    const apiReq = request.clone({
      headers: request.headers
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json'),
    });

    // Start a timer to measure request duration
    const startTime = Date.now();

    // Process the request and handle errors
    return next.handle(apiReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);

        // You can add custom error handling here
        // For example, redirect to login page on 401 errors
        if (error.status === 401) {
          console.warn('Authentication required');
          // Redirect to login page or show auth modal
        }

        return throwError(() => error);
      }),
      finalize(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Request to ${request.url} took ${duration}ms`);
      }),
    );
  }
}
