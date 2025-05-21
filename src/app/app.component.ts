import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';

interface MenuItem {
    name: string;
    link: string;
    icon?: string;
}

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        CommonModule,
        RouterModule,
        ButtonModule,
        DrawerModule,
        ConfirmPopupModule,
        ToastModule,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    @ViewChild('drawerRef')
    drawerRef!: Drawer;

    protected visible: boolean = false;
    protected showSidenavBtn = signal(false);

    protected menu: Array<MenuItem> = [
        {
            name: 'Usuários',
            link: '/users',
            icon: 'pi pi-users',
        },
        {
            name: 'Disciplinas',
            link: '/subjects',
            icon: 'pi pi-bookmark-fill',
        },
        {
            name: 'Solicitações',
            link: '/content-requests',
            icon: 'pi pi-list',
        },
        {
            name: 'Roadmaps',
            link: '/roadmaps',
            icon: 'pi pi-map',
        },
    ];

    constructor(private _router: Router) {}

    ngOnInit(): void {
        this._router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.visible = false;

                this.showSidenavBtn.set(
                    !e.urlAfterRedirects.includes('/login')
                );
            }
        });
    }

    protected closeCallback(e: Event): void {
        this.drawerRef.close(e);
    }

    protected disconect(): void {
        this._router.navigate(['/login']);
    }
}
