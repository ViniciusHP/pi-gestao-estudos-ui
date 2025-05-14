import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MyRoadmapLineComponent } from './my-roadmap-line.component';

@NgModule({
    declarations: [MyRoadmapLineComponent],
    imports: [CommonModule, RouterModule, ButtonModule],
    exports: [MyRoadmapLineComponent],
})
export class MyRoadmapLineModule {}
