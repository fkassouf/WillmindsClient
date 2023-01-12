import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ROLES } from "app/core/enums/core-enum";
import { Observable, of } from "rxjs";
import { AuthenticationService } from "../authentication.service";

@Injectable({
    providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate
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
        if(this._authService.user$?.roles[0] !== ROLES.SUPERADMIN)
        {
            // Redirect to the sign-in page with a redirectUrl param
            let url = state.url;
            this._router.navigate(['/']);

            return of(false);
        }

        // Allow the access
        return of(true);
    }
}