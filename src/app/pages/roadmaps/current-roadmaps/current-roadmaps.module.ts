import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { CurrentRoadmapsLineComponent } from './current-roadmaps-line/current-roadmaps-line.component';
import { CurrentRoadmapsTaskLineComponent } from './current-roadmaps-task-line/current-roadmaps-task-line.component';
import { CurrentRoadmapsTestLineComponent } from './current-roadmaps-test-line/current-roadmaps-test-line.component';
import { CurrentRoadmapsWeekLineComponent } from './current-roadmaps-week-line/current-roadmaps-week-line.component';
import { CurrentRoadmapsComponent } from './current-roadmaps.component';

@NgModule({
    declarations: [
        CurrentRoadmapsComponent,
        CurrentRoadmapsLineComponent,
        CurrentRoadmapsWeekLineComponent,
        CurrentRoadmapsTestLineComponent,
        CurrentRoadmapsTaskLineComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DataViewModule,
        CheckboxModule,
    ],
    exports: [CurrentRoadmapsComponent],
})
export class CurrentRoadmapsModule {}
