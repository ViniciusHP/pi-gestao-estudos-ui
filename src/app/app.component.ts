import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule, ConfirmPopupModule, ToastModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {}
