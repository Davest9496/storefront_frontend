import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Store the attempted URL for redirecting
    const url: string = state.url;

    // Check if the user is logged in
    if (this.authService.isLoggedInSync()) {
      // Check if this route has any role requirements
      if (route.data && route.data['roles']) {
        const requiredRoles = route.data['roles'] as string[];
        const user = this.authService.getCurrentUser();

        // Check if the user has the required role
        return this.authService.getCurrentUser().pipe(
          take(1),
          map((user) => {
            if (!user) {
              // User is not logged in, redirect to login page
              this.storeRedirectUrl(url);
              return this.router.createUrlTree(['/auth/login']);
            }

            // Check if user has the required role
            const hasRole = requiredRoles.some((role) => user.role === role);
            if (!hasRole) {
              // User doesn't have the required role, redirect to home
              return this.router.createUrlTree(['/']);
            }

            // User has the required role, allow access
            return true;
          }),
        );
      }

      // No specific role requirement, allow access
      return true;
    }

    // User is not logged in, redirect to login page
    this.storeRedirectUrl(url);
    return this.router.createUrlTree(['/auth/login']);
  }

  private storeRedirectUrl(url: string): void {
    if (url && !url.startsWith('/auth')) {
      sessionStorage.setItem('redirectUrl', url);
    }
  }
}
