import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/auth/authentication.service';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent
{
    /**
     * Constructor
     */
    constructor(public authService : AuthenticationService)
    {
    }
}
