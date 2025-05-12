import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { CommunityRoadmapsLineComponent } from './community-roadmaps-line/community-roadmaps-line.component';
import { CommunityRoadmapsTaskLineComponent } from './community-roadmaps-task-line/community-roadmaps-task-line.component';
import { CommunityRoadmapsTestLineComponent } from './community-roadmaps-test-line/community-roadmaps-test-line.component';
import { CommunityRoadmapsWeekLineComponent } from './community-roadmaps-week-line/community-roadmaps-week-line.component';
import { CommunityRoadmapsComponent } from './community-roadmaps.component';

@NgModule({
    declarations: [
        CommunityRoadmapsComponent,
        CommunityRoadmapsLineComponent,
        CommunityRoadmapsWeekLineComponent,
        CommunityRoadmapsTaskLineComponent,
        CommunityRoadmapsTestLineComponent,
    ],
    imports: [CommonModule, ButtonModule, DataViewModule],
    exports: [CommunityRoadmapsComponent],
})
export class CommunityRoadmapsModule {}
