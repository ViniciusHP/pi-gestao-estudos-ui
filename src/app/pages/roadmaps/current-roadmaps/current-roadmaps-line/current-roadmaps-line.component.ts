import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentRoadmapModel } from '../../models';

@Component({
    selector: 'app-current-roadmaps-line',
    templateUrl: './current-roadmaps-line.component.html',
    styleUrl: './current-roadmaps-line.component.css',
    standalone: false,
})
export class CurrentRoadmapsLineComponent {
    @Input()
    roadmap!: CurrentRoadmapModel;

    @Output()
    onChange = new EventEmitter<void>();
}
