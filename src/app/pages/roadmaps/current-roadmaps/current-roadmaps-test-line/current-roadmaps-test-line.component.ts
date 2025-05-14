import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentRoadmapTestModel } from '../../models';

@Component({
    selector: 'app-current-roadmaps-test-line',
    templateUrl: './current-roadmaps-test-line.component.html',
    styleUrl: './current-roadmaps-test-line.component.css',
    standalone: false,
})
export class CurrentRoadmapsTestLineComponent {
    @Input()
    testNumber!: number;

    @Input()
    test!: CurrentRoadmapTestModel;

    @Output()
    onChange = new EventEmitter<void>();
}
