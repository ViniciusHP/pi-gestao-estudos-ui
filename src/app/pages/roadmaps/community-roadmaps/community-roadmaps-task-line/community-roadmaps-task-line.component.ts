import { Component, Input } from '@angular/core';
import { RoadmapTaskModel } from '../../models';

@Component({
    selector: 'app-community-roadmaps-task-line',
    templateUrl: './community-roadmaps-task-line.component.html',
    styleUrl: './community-roadmaps-task-line.component.css',
    standalone: false,
})
export class CommunityRoadmapsTaskLineComponent {
    @Input()
    taskNumber!: number;

    @Input()
    task!: RoadmapTaskModel;
}
