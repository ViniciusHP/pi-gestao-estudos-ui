import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormErrorState } from '../../../../shared/helpers';
import {
    RoadmapActivityType,
    RoadmapAddActivityEvent,
    RoadmapAddTestEvent,
    RoadmapRemoveActivityEvent,
    RoadmapRemoveWeekEvent,
} from '../../models';

@Component({
    selector: 'app-roadmap-week-form',
    templateUrl: './roadmap-week-form.component.html',
    styleUrl: './roadmap-week-form.component.css',
    standalone: false,
})
export class RoadmapWeekFormComponent implements OnChanges {
    @Input()
    week!: number;

    @Input()
    weekFormGroup!: FormGroup;

    @Input()
    requestInProgress!: boolean;

    @Output()
    onAddActivity = new EventEmitter<RoadmapAddActivityEvent>();

    @Output()
    onAddTest = new EventEmitter<RoadmapAddTestEvent>();

    @Output()
    onRemoveWeek = new EventEmitter<RoadmapRemoveWeekEvent>();

    @Output()
    onRemoveActivity = new EventEmitter<RoadmapRemoveActivityEvent>();

    protected tasks = 0;
    protected tests = 0;

    protected errorStateStartDateRequired!: FormErrorState;
    protected errorStateEndDateRequired!: FormErrorState;
    protected activitiesFormGroup!: Array<FormGroup>;
    protected typeOptions = RoadmapActivityType;

    constructor(private _dr: DestroyRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('weekFormGroup' in changes && this.weekFormGroup) {
            this._initializeErrorState();
            this._initializeActivities();
        }
    }

    protected addActivity(): void {
        this.onAddActivity.emit({
            week: this.week,
        });
    }

    protected addTest(): void {
        this.onAddTest.emit({
            week: this.week,
        });
    }

    protected removeWeek(): void {
        this.onRemoveWeek.emit({
            week: this.week,
        });
    }

    protected removeActivity(event: RoadmapRemoveActivityEvent): void {
        this.onRemoveActivity.emit(event);
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

    private _initializeErrorState(): void {
        this.errorStateStartDateRequired = new FormErrorState(
            'required',
            this.weekFormGroup.get('startDate'),
            this._dr
        );

        this.errorStateEndDateRequired = new FormErrorState(
            'required',
            this.weekFormGroup.get('endDate'),
            this._dr
        );
    }

    private _initializeActivities(): void {
        const activities = this.weekFormGroup?.get(
            'activities'
        ) as FormArray<any>;

        this.activitiesFormGroup = activities
            ? (activities?.controls as Array<FormGroup>)
            : [];
    }
}
