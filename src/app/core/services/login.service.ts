import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginModel, LoginResponseModel } from '../models';

const LOGIN_URL = `${environment.apiUrl}/login`;

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private _http: HttpClient) {}

    public doLogin(model: LoginModel): Observable<LoginResponseModel> {
        return this._http.post<LoginResponseModel>(LOGIN_URL, model);
    }
}
