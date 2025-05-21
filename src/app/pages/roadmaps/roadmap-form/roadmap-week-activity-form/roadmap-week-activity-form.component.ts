import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormErrorState } from '../../../../shared/helpers';
import { RoadmapRemoveActivityEvent } from '../../models';

@Component({
    selector: 'app-roadmap-week-activity-form',
    templateUrl: './roadmap-week-activity-form.component.html',
    styleUrl: './roadmap-week-activity-form.component.css',
    standalone: false,
})
export class RoadmapWeekActivityFormComponent implements OnChanges {
    @Input()
    week!: number;

    @Input()
    activity!: number;

    @Input()
    activityFormGroup!: FormGroup;

    @Input()
    requestInProgress!: boolean;

    @Output()
    onRemoveActivity = new EventEmitter<RoadmapRemoveActivityEvent>();

    protected errorStateActivityRequired!: FormErrorState;
    protected errorStateDescriptionRequired!: FormErrorState;

    constructor(private _dr: DestroyRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('activityFormGroup' in changes) {
            this._initializeErrorState();
        }
    }

    protected removeActivity(): void {
        this.onRemoveActivity.emit({
            week: this.week,
            activity: this.activity,
        });
    }

    private _initializeErrorState(): void {
        if (this.errorStateActivityRequired) {
            this.errorStateActivityRequired.destroy();
        }

        if (this.errorStateDescriptionRequired) {
            this.errorStateDescriptionRequired.destroy();
        }

        this.errorStateActivityRequired = new FormErrorState(
            'required',
            this.activityFormGroup.get('name'),
            this._dr
        );

        this.errorStateDescriptionRequired = new FormErrorState(
            'required',
            this.activityFormGroup.get('description'),
            this._dr
        );
    }
}
