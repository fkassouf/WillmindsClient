import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { AuthenticationService } from '../authentication.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthenticationService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can match
     *
     * @param route
     * @param segments
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>| Promise<boolean> {
        if(!this._authService.user$)
        {
            // Redirect to the sign-in page with a redirectUrl param
            let url = state.url;
            this._router.navigate(['sign-in'], {queryParams: {url}});

            return of(false);
        }

        // Allow the access
        return of(true);
    }

    
}
