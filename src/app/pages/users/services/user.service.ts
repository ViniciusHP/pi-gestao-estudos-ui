import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudRequestsAbstract } from '../../../shared/helpers';
import { UserModel } from '../models';

const USER_URL = `${environment.apiUrl}/users`;

@Injectable({
    providedIn: 'root',
})
export class UserService extends CrudRequestsAbstract<string, UserModel> {
    constructor(_http: HttpClient) {
        super(_http);
    }

    protected override getUrl(): string {
        return USER_URL;
    }

    protected override getIdFromModel(
        model: UserModel
    ): string | null | undefined {
        return model.id;
    }
}
