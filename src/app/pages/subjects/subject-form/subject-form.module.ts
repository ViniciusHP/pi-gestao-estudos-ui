import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { SharedModule } from '../../../shared/shared.module';
import { SubjectFormComponent } from './subject-form.component';

@NgModule({
    declarations: [SubjectFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,

        InputTextModule,
        ButtonModule,
        FloatLabelModule,
        MessageModule,
        TextareaModule,

        SharedModule,
    ],
    exports: [SubjectFormComponent],
})
export class SubjectFormModule {}
