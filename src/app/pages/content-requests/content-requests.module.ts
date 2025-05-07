import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { SharedModule } from '../../shared/shared.module';
import { ContetRequestFormModule } from './content-request-form/content-request-form.module';
import { ContentRequestsComponent } from './content-requests.component';
import { usersRoutes } from './content-requests.routes';

@NgModule({
    declarations: [ContentRequestsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(usersRoutes),

        ButtonModule,
        TableModule,
        TagModule,

        ContetRequestFormModule,
        SharedModule,
    ],
    exports: [ContentRequestsComponent],
})
export class ContentRequestsModule {}
