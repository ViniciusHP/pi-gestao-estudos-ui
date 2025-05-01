import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-page-title',
    templateUrl: './page-title.component.html',
    styleUrl: './page-title.component.css',
    standalone: false,
})
export class PageTitleComponent {
    @Input()
    title!: string;

    @ContentChild('actions')
    actionTemplate!: TemplateRef<HTMLElement>;
}
