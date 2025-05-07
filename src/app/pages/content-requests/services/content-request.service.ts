import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudRequestsAbstract } from '../../../shared/helpers';
import { ContentRequestModel } from '../models';

const CONTENT_REQUEST_URL = `${environment.apiUrl}/content-requests`;

@Injectable({
    providedIn: 'root',
})
export class ContentRequestService extends CrudRequestsAbstract<
    string,
    ContentRequestModel
> {
    constructor(_http: HttpClient) {
        super(_http);
    }

    protected override getUrl(): string {
        return CONTENT_REQUEST_URL;
    }

    protected override getIdFromModel(
        model: ContentRequestModel
    ): string | null | undefined {
        return model.id;
    }
}
