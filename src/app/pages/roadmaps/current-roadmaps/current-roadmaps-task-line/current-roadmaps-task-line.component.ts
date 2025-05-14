import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentRoadmapTaskModel } from '../../models';

@Component({
    selector: 'app-current-roadmaps-task-line',
    templateUrl: './current-roadmaps-task-line.component.html',
    styleUrl: './current-roadmaps-task-line.component.css',
    standalone: false,
})
export class CurrentRoadmapsTaskLineComponent {
    @Input()
    taskNumber!: number;

    @Input()
    task!: CurrentRoadmapTaskModel;

    @Output()
    onChange = new EventEmitter<void>();
}
