import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BrowserTabTitleService {
    currentTitle!: string;

    constructor(@Inject(DOCUMENT) private _document: Document) {
        this.currentTitle = this._document.title;
    }

    public setTitle(title: string): void {
        this.currentTitle = `Gestão de estudos - ${title}`;
        this._document.title = this.currentTitle;
    }
}
