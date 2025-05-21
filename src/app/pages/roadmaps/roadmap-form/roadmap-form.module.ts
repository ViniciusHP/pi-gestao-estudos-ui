import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SharedModule } from '../../../shared/shared.module';
import { RoadmapFormComponent } from './roadmap-form.component';
import { RoadmapWeekActivityFormComponent } from './roadmap-week-activity-form/roadmap-week-activity-form.component';
import { RoadmapWeekFormComponent } from './roadmap-week-form/roadmap-week-form.component';
import { RoadmapWeekTestFormComponent } from './roadmap-week-test-form/roadmap-week-test-form.component';

@NgModule({
    declarations: [
        RoadmapFormComponent,
        RoadmapWeekFormComponent,
        RoadmapWeekActivityFormComponent,
        RoadmapWeekTestFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,

        ButtonModule,
        DatePickerModule,
        FloatLabelModule,
        MessageModule,
        SelectButtonModule,
        SelectModule,
        InputTextModule,
        TextareaModule,
        TooltipModule,

        SharedModule,
    ],
    exports: [RoadmapFormComponent],
})
export class RoadmapFormModule {}
