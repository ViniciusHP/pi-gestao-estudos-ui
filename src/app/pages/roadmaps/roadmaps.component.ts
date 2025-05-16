import { Location } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

interface Tab {
    route: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-roadmaps',
    templateUrl: './roadmaps.component.html',
    styleUrl: './roadmaps.component.css',
    standalone: false,
})
export class RoadmapsComponent implements OnInit {
    protected tabs: Array<Tab> = [
        {
            route: 'current-roadmaps',
            label: 'Roadmaps atuais',
            icon: 'pi pi-bookmark-fill',
        },
        {
            route: 'community-roadmaps',
            label: 'Roadmaps da comunidade',
            icon: 'pi pi-users',
        },
        { route: 'my-roadmaps', label: 'Meus roadmaps', icon: 'pi pi-list' },
    ];

    protected initialTabRoute!: string;
    protected showNewBtn = signal(false);

    constructor(
        private _location: Location,
        private _router: Router,
        private _dr: DestroyRef
    ) {}

    ngOnInit(): void {
        this.initialTabRoute = this._getInitialTab();
        this.showNewBtn.set(this._location.path().includes('my-roadmaps'));

        this._router.events
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe((e) => {
                if (e instanceof NavigationEnd) {
                    this.showNewBtn.set(e.url.includes('my-roadmaps'));
                }
            });
    }

    private _getInitialTab(): string {
        const location = this._location.path();
        return (
            this.tabs.find((tab) => location.includes(tab.route))?.route ??
            'current-roadmaps'
        );
    }
}
