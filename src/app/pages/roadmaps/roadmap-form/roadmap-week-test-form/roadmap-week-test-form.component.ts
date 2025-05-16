import {
    Component,
    DestroyRef,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormErrorState } from '../../../../shared/helpers';

@Component({
    selector: 'app-roadmap-week-test-form',
    templateUrl: './roadmap-week-test-form.component.html',
    styleUrl: './roadmap-week-test-form.component.css',
    standalone: false,
})
export class RoadmapWeekTestFormComponent implements OnChanges {
    @Input()
    week!: number;

    @Input()
    test!: number;

    @Input()
    testFormGroup!: FormGroup;

    protected errorStateTestRequired!: FormErrorState;
    protected errorStateDescriptionRequired!: FormErrorState;
    protected errorStateDateRequired!: FormErrorState;

    constructor(private _dr: DestroyRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('testFormGroup' in changes) {
            this._initializeErrorState();
        }
    }

    private _initializeErrorState(): void {
        if (this.errorStateTestRequired) {
            this.errorStateTestRequired.destroy();
        }

        if (this.errorStateDescriptionRequired) {
            this.errorStateDescriptionRequired.destroy();
        }

        if (this.errorStateDateRequired) {
            this.errorStateDateRequired.destroy();
        }

        this.errorStateTestRequired = new FormErrorState(
            'required',
            this.testFormGroup.get('name'),
            this._dr
        );

        this.errorStateDescriptionRequired = new FormErrorState(
            'required',
            this.testFormGroup.get('description'),
            this._dr
        );

        this.errorStateDateRequired = new FormErrorState(
            'required',
            this.testFormGroup.get('date'),
            this._dr
        );
    }
}
