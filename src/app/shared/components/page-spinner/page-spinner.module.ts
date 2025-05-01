import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PageSpinnerComponent } from './page-spinner.component';

@NgModule({
    declarations: [PageSpinnerComponent],
    imports: [CommonModule, ProgressSpinnerModule],
    exports: [PageSpinnerComponent],
})
export class PageSpinnerModule {}
