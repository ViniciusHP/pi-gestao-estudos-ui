import { Component, Input } from '@angular/core';
import { RoadmapModel } from '../../models';

@Component({
    selector: 'app-community-roadmaps-line',
    templateUrl: './community-roadmaps-line.component.html',
    styleUrl: './community-roadmaps-line.component.css',
    standalone: false,
})
export class CommunityRoadmapsLineComponent {
    @Input()
    roadmap!: RoadmapModel;
}
