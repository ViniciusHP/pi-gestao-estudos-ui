import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { PaginatorState } from '../../shared/helpers';
import { BrowserTabTitleService } from '../../shared/services';
import { UserMessageHelper } from './helpers';
import { UserModel } from './models';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
    standalone: false,
})
export class UsersComponent implements OnInit {
    protected users: Array<UserModel> = [];
    protected paginatorState!: PaginatorState;
    protected requestInProgress = signal(false);

    protected userMessageHelper!: UserMessageHelper;

    constructor(
        private _userService: UserService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this.userMessageHelper = new UserMessageHelper(
            this._messageService,
            this._confirmationService
        );
        this.paginatorState = new PaginatorState();
        this._findAll();
        this._browserTabTitleService.setTitle('Usuários');
    }

    protected pageChange(event: TablePageEvent): void {
        this.paginatorState.pageChange(event);
        this._findAll();
    }

    protected delete(user: UserModel, event: Event): void {
        const subscription = this.userMessageHelper
            .confirmUserDelete(user, event)
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(user);
                }
                subscription?.unsubscribe();
            });
    }

    private _findAll() {
        this.requestInProgress.set(true);
        this._userService
            .findPage(this.paginatorState.page, this.paginatorState.rows)
            .pipe(finalize(() => this.requestInProgress.set(false)))
            .subscribe((page) => {
                this.users = page.data;
                this.paginatorState.updateTotalRecords(page);
            });
    }

    private _doDelete(user: UserModel): void {
        const id = user.id;
        if (!id) {
            this.userMessageHelper.messageErrorTryingRemove(user);
        }

        this._userService.delete(id as string).subscribe({
            next: () => {
                this.userMessageHelper.messageUserRemoved(user);
                this._findAll();
            },
            error: () => this.userMessageHelper.messageErrorTryingRemove(user),
        });
    }
}
