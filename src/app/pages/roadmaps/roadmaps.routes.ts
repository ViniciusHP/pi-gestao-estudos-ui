import { Routes } from '@angular/router';
import { CommunityRoadmapsComponent } from './community-roadmaps/community-roadmaps.component';
import { CurrentRoadmapsComponent } from './current-roadmaps/current-roadmaps.component';
import { MyRoadmapsComponent } from './my-roadmaps/my-roadmaps.component';
import { RoadmapFormComponent } from './roadmap-form/roadmap-form.component';
import { RoadmapsComponent } from './roadmaps.component';

export const roadmapsRoutes: Routes = [
    {
        path: '',
        component: RoadmapsComponent,
        children: [
            {
                path: 'current-roadmaps',
                component: CurrentRoadmapsComponent,
            },
            {
                path: 'community-roadmaps',
                component: CommunityRoadmapsComponent,
            },
            {
                path: 'my-roadmaps',
                component: MyRoadmapsComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'current-roadmaps',
            },
        ],
    },
    {
        path: 'new',
        component: RoadmapFormComponent,
    },
    {
        path: ':code',
        component: RoadmapFormComponent,
    },
];
