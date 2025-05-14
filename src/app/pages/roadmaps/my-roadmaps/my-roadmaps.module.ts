import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';

import { MyRoadmapLineModule } from './my-roadmap-line/my-roadmap-line.module';
import { MyRoadmapsComponent } from './my-roadmaps.component';

@NgModule({
    declarations: [MyRoadmapsComponent],
    imports: [CommonModule, ButtonModule, DataViewModule, MyRoadmapLineModule],
    exports: [MyRoadmapsComponent],
})
export class MyRoadmapsModule {}
