import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudRequestsAbstract } from '../../../shared/helpers';
import { SubjectModel } from '../models';

const SUBJECT_URL = `${environment.apiUrl}/subjects`;

@Injectable({
    providedIn: 'root',
})
export class SubjectService extends CrudRequestsAbstract<string, SubjectModel> {
    constructor(_http: HttpClient) {
        super(_http);
    }

    protected override getUrl(): string {
        return SUBJECT_URL;
    }

    protected override getIdFromModel(
        model: SubjectModel
    ): string | null | undefined {
        return model.id;
    }
}
