import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient : HttpClient) { }

  /**
   * Change password
   *
   * @param credentials
   */
  changePassword(credentials: { email: string, currentPassord: string, newPassword : string }): Observable<any> {
    return this.httpClient.post<any>(environment.api + '/Account/ChangePassword', credentials);
  }
}
