import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';

import { SharedModule } from '../../../shared/shared.module';
import { UserFormComponent } from './user-form.component';

@NgModule({
    declarations: [UserFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,

        InputTextModule,
        ButtonModule,
        FloatLabelModule,
        MessageModule,
        InputNumberModule,
        SelectModule,

        SharedModule,
    ],
    exports: [UserFormComponent],
})
export class UserFormModule {}
