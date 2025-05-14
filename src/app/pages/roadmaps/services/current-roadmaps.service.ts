import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudRequestsAbstract } from '../../../shared/helpers';
import { CurrentRoadmapModel } from '../models';

const CURRNET_ROADMAP_URL = `${environment.apiUrl}/current-roadmaps`;

@Injectable({
    providedIn: 'root',
})
export class CurrentRoadmapsService extends CrudRequestsAbstract<
    string,
    CurrentRoadmapModel
> {
    constructor(_http: HttpClient) {
        super(_http);
    }

    protected override getUrl(): string {
        return CURRNET_ROADMAP_URL;
    }

    protected override getIdFromModel(
        model: CurrentRoadmapModel
    ): string | null | undefined {
        return model.id;
    }
}
