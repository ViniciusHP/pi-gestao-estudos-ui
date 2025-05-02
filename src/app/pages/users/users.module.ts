import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

import { ButtonModule } from 'primeng/button';

import { SharedModule } from '../../shared/shared.module';
import { UserFormModule } from './user-form/user-form.module';
import { UsersComponent } from './users.component';
import { usersRoutes } from './users.routes';

@NgModule({
    declarations: [UsersComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(usersRoutes),

        ButtonModule,
        TableModule,

        UserFormModule,
        SharedModule,
    ],
    exports: [UsersComponent],
})
export class UsersModule {}
