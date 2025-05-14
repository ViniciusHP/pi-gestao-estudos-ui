import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudRequestsAbstract } from '../../../shared/helpers';
import { RoadmapModel } from '../models';

const ROADMAP_URL = `${environment.apiUrl}/roadmaps`;

@Injectable({
    providedIn: 'root',
})
export class RoadmapsService extends CrudRequestsAbstract<
    string,
    RoadmapModel
> {
    constructor(_http: HttpClient) {
        super(_http);
    }

    protected override getUrl(): string {
        return ROADMAP_URL;
    }

    protected override getIdFromModel(
        model: RoadmapModel
    ): string | null | undefined {
        return model.id;
    }
}
