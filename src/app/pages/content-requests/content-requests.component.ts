import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { PaginatorState } from '../../shared/helpers';
import { BrowserTabTitleService } from '../../shared/services';
import { ContentRequestMessageHelper } from './helpers';
import { ContentRequestModel, ContentRequestStatusType } from './models';
import { ContentRequestService } from './services/content-request.service';

@Component({
    selector: 'app-content-requests',
    templateUrl: './content-requests.component.html',
    styleUrl: './content-requests.component.css',
    standalone: false,
})
export class ContentRequestsComponent implements OnInit {
    protected contentRequest: Array<ContentRequestModel> = [];
    protected paginatorState!: PaginatorState;
    protected contentRequestStatusTypes = ContentRequestStatusType;
    protected requestInProgress = signal(false);

    protected contentRequestMessageHelper!: ContentRequestMessageHelper;

    constructor(
        private _contentRequestService: ContentRequestService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this.contentRequestMessageHelper = new ContentRequestMessageHelper(
            this._messageService,
            this._confirmationService
        );
        this.paginatorState = new PaginatorState();
        this._findAll();
        this._browserTabTitleService.setTitle('Solicitações');
    }

    protected pageChange(event: TablePageEvent): void {
        this.paginatorState.pageChange(event);
        this._findAll();
    }

    protected delete(contentRequest: ContentRequestModel, event: Event): void {
        const subscription = this.contentRequestMessageHelper
            .confirmDelete(event)
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(contentRequest);
                }
                subscription?.unsubscribe();
            });
    }

    private _findAll() {
        this.requestInProgress.set(true);
        this._contentRequestService
            .findPage(this.paginatorState.page, this.paginatorState.rows)
            .pipe(finalize(() => this.requestInProgress.set(false)))
            .subscribe((page) => {
                this.contentRequest = page.data;
                this.paginatorState.updateTotalRecords(page);
            });
    }

    private _doDelete(contentRequest: ContentRequestModel): void {
        const id = contentRequest.id;
        if (!id) {
            this.contentRequestMessageHelper.messageErrorTryingRemove();
        }

        this._contentRequestService.delete(id as string).subscribe({
            next: () => {
                this.contentRequestMessageHelper.messageRemoved();
                this._findAll();
            },
            error: () =>
                this.contentRequestMessageHelper.messageErrorTryingRemove(),
        });
    }
}
