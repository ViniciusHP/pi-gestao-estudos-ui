import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

import { SharedModule } from '../../shared/shared.module';
import { CommunityRoadmapsModule } from './community-roadmaps/community-roadmaps.module';
import { CurrentRoadmapsModule } from './current-roadmaps/current-roadmaps.module';
import { MyRoadmapsModule } from './my-roadmaps/my-roadmaps.module';
import { RoadmapFormModule } from './roadmap-form/roadmap-form.module';
import { RoadmapsComponent } from './roadmaps.component';
import { roadmapsRoutes } from './roadmaps.routes';

@NgModule({
    declarations: [RoadmapsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(roadmapsRoutes),

        ButtonModule,
        TabsModule,

        SharedModule,
        MyRoadmapsModule,
        CurrentRoadmapsModule,
        CommunityRoadmapsModule,
        RoadmapFormModule,
    ],
    exports: [],
})
export class RoadmapsModule {}
