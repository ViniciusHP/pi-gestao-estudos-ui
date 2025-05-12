import { Component, Input } from '@angular/core';
import {
    RoadmapActivityType,
    RoadmapTaskModel,
    RoadmapTestModel,
    RoadmapWeekModel,
} from '../../models';

@Component({
    selector: 'app-community-roadmaps-week-line',
    templateUrl: './community-roadmaps-week-line.component.html',
    styleUrl: './community-roadmaps-week-line.component.css',
    standalone: false,
})
export class CommunityRoadmapsWeekLineComponent {
    @Input()
    week!: RoadmapWeekModel;

    @Input()
    weekNumber!: number;

    protected tasks = 0;
    protected tests = 0;
    protected typeOptions = RoadmapActivityType;

    protected getTestActivity(
        activity: RoadmapTestModel | RoadmapTaskModel
    ): RoadmapTestModel {
        return activity as RoadmapTestModel;
    }

    protected getTaskActivity(
        activity: RoadmapTestModel | RoadmapTaskModel
    ): RoadmapTaskModel {
        return activity as RoadmapTaskModel;
    }

    protected getTaskCount(index: number): number {
        if (index == 0) {
            this.tests = 0;
            this.tasks = 0;
        }

        this.tasks++;

        return this.tasks;
    }

    protected getTestCount(index: number): number {
        if (index == 0) {
            this.tests = 0;
            this.tasks = 0;
        }

        this.tests++;

        return this.tests;
    }
}
