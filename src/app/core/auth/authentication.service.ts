import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { environment } from 'environments/environment';
import { User } from '../user/user.types';
import { Account } from 'app/modules/auth/models';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService
{
    private userSubject : BehaviorSubject<User> = new BehaviorSubject<User>(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
      
    )
    {
        let userStorage = localStorage.getItem('user');
       
        if(userStorage != '' && userStorage != null && userStorage != undefined)
        {
            let user = JSON.parse(userStorage);
            this.user = user;
        }
    }

     /**
     * Setter & getter for user
     *
     * @param value
     */
      set user(value: User)
      {
          // Store the value
          this.userSubject.next(value);
      }
  
      get user$(): User
      {
          return this.userSubject.value;
      }


    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post(environment.api + '/Account/resetnewtokenpassword?email=' + email, null);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(credentials : {userId : any, token : any, newPassword : any}): Observable<any>
    {
        return this._httpClient.post(environment.api + '/Account/ResetPassword', credentials);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post<any>(environment.api + '/Account/Login', credentials);              
    }

   
    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        this.user = null;
        // Set the authenticated flag to false
        //this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUpAsAccount(account : Account): Observable<any>
    {
        return this._httpClient.post<any>(environment.api + '/Account/Register', account);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

     /**
     * Get countries
     *
     * 
     */
     getCountries(): Observable<any>
     {
         return this._httpClient.get<any>(environment.api + '/Account/GetCountries');
     }

   
}
