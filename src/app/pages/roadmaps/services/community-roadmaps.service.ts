import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudRequestsAbstract } from '../../../shared/helpers';
import { RoadmapModel } from '../models';

const COMMUNITY_ROADMAP_URL = `${environment.apiUrl}/community-roadmaps`;

@Injectable({
    providedIn: 'root',
})
export class CommunityRoadmapsService extends CrudRequestsAbstract<
    string,
    RoadmapModel
> {
    constructor(_http: HttpClient) {
        super(_http);
    }

    protected override getUrl(): string {
        return COMMUNITY_ROADMAP_URL;
    }

    protected override getIdFromModel(
        model: RoadmapModel
    ): string | null | undefined {
        return model.id;
    }
}
