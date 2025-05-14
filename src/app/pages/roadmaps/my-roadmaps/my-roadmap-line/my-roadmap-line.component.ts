import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { RoadmapModel } from '../../models';

export interface MyRoadmapLineDelete {
    roadmap: RoadmapModel;
    event: Event;
}

@Component({
    selector: 'app-my-roadmap-line',
    templateUrl: './my-roadmap-line.component.html',
    styleUrl: './my-roadmap-line.component.css',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRoadmapLineComponent {
    @Input()
    roadmap!: RoadmapModel;

    @Input()
    editRouterLink!: string;

    @Output()
    onDelete = new EventEmitter<MyRoadmapLineDelete>();

    protected delete(roadmap: RoadmapModel | undefined, event: Event) {
        this.onDelete.emit({
            roadmap: roadmap as RoadmapModel,
            event,
        });
    }
}
