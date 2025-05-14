import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    CurrentRoadmapTaskModel,
    CurrentRoadmapTestModel,
    CurrentRoadmapWeekModel,
    RoadmapActivityType,
} from '../../models';

@Component({
    selector: 'app-current-roadmaps-week-line',
    templateUrl: './current-roadmaps-week-line.component.html',
    styleUrl: './current-roadmaps-week-line.component.css',
    standalone: false,
})
export class CurrentRoadmapsWeekLineComponent {
    @Input()
    week!: CurrentRoadmapWeekModel;

    @Input()
    weekNumber!: number;

    @Output()
    onChange = new EventEmitter<void>();

    protected tasks = 0;
    protected tests = 0;
    protected typeOptions = RoadmapActivityType;

    protected getTestActivity(
        activity: CurrentRoadmapTestModel | CurrentRoadmapTaskModel
    ): CurrentRoadmapTestModel {
        return activity as CurrentRoadmapTestModel;
    }

    protected getTaskActivity(
        activity: CurrentRoadmapTestModel | CurrentRoadmapTaskModel
    ): CurrentRoadmapTaskModel {
        return activity as CurrentRoadmapTaskModel;
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
