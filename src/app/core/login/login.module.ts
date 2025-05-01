import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { LoginComponent } from './login.component';
import { loginRoutes } from './login.routes';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(loginRoutes),
        ReactiveFormsModule,

        CardModule,
        InputTextModule,
        FloatLabelModule,
        ButtonModule,
        MessageModule,
    ],
    exports: [LoginComponent],
})
export class LoginModule {}
