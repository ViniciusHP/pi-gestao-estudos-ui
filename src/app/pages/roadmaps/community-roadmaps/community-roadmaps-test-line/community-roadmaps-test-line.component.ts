import { Component, Input } from '@angular/core';
import { RoadmapTestModel } from '../../models';

@Component({
    selector: 'app-community-roadmaps-test-line',
    templateUrl: './community-roadmaps-test-line.component.html',
    styleUrl: './community-roadmaps-test-line.component.css',
    standalone: false,
})
export class CommunityRoadmapsTestLineComponent {
    @Input()
    testNumber!: number;

    @Input()
    test!: RoadmapTestModel;
}
