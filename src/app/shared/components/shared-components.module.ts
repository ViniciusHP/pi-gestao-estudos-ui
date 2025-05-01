import { NgModule } from '@angular/core';
import { PageSpinnerModule } from './page-spinner';
import { PageTitleModule } from './page-title';

@NgModule({
    imports: [PageTitleModule, PageSpinnerModule],
    exports: [PageTitleModule, PageSpinnerModule],
})
export class SharedComponentsModule {}
