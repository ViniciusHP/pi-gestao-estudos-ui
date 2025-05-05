import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { PaginatorState } from '../../shared/helpers';
import { BrowserTabTitleService } from '../../shared/services';
import { SubjectMessageHelper } from './helpers';
import { SubjectModel } from './models';
import { SubjectService } from './services/subject.service';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrl: './subjects.component.css',
    standalone: false,
})
export class SubjectsComponent implements OnInit {
    protected subjects: Array<SubjectModel> = [];
    protected paginatorState!: PaginatorState;
    protected requestInProgress = signal(false);

    protected subjectMessageHelper!: SubjectMessageHelper;

    constructor(
        private _subjectService: SubjectService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this.subjectMessageHelper = new SubjectMessageHelper(
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

    protected delete(subject: SubjectModel, event: Event): void {
        const subscription = this.subjectMessageHelper
            .confirmSubjectDelete(subject, event)
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(subject);
                }
                subscription?.unsubscribe();
            });
    }

    private _findAll() {
        this.requestInProgress.set(true);
        this._subjectService
            .findPage(this.paginatorState.page, this.paginatorState.rows)
            .pipe(finalize(() => this.requestInProgress.set(false)))
            .subscribe((page) => {
                this.subjects = page.data;
                this.paginatorState.updateTotalRecords(page);
            });
    }

    private _doDelete(subject: SubjectModel): void {
        const id = subject.id;
        if (!id) {
            this.subjectMessageHelper.messageErrorTryingRemove(subject);
        }

        this._subjectService.delete(id as string).subscribe({
            next: () => {
                this.subjectMessageHelper.messageSubjectRemoved(subject);
                this._findAll();
            },
            error: () =>
                this.subjectMessageHelper.messageErrorTryingRemove(subject),
        });
    }
}
