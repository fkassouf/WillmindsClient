import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { AuthenticationService } from '../authentication.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate
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
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(!this._authService.user$)
        {
            return of(true);
        }

        this._router.navigate(['/']);
        return of(false);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

   
}
