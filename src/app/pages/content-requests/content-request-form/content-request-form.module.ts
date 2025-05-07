import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

import { TextareaModule } from 'primeng/textarea';
import { SharedModule } from '../../../shared/shared.module';
import { ContentRequestFormComponent } from './content-request-form.component';

@NgModule({
    declarations: [ContentRequestFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        TextareaModule,
        ButtonModule,
        FloatLabelModule,
        MessageModule,
        CheckboxModule,

        SharedModule,
    ],
    exports: [ContentRequestFormComponent],
})
export class ContetRequestFormModule {}
