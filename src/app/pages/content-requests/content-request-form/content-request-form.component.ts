import {
    Component,
    computed,
    DestroyRef,
    OnInit,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { FormErrorState } from '../../../shared/helpers';
import { BrowserTabTitleService } from '../../../shared/services';
import { ContentRequestMessageHelper } from '../helpers';
import { ContentRequestModel, ContentRequestStatusType } from '../models';
import { ContentRequestService } from '../services/content-request.service';

interface ContentRequestForm {
    id?: string;
    description: string;
    requestGranted: boolean;
}

@Component({
    selector: 'app-content-request-form',
    templateUrl: './content-request-form.component.html',
    styleUrl: './content-request-form.component.css',
    standalone: false,
})
export class ContentRequestFormComponent implements OnInit {
    protected formGroup!: FormGroup;

    protected pageTitle: WritableSignal<string> = signal('');
    protected disabledInsertBtn!: Signal<boolean>;
    protected disabledEditBtn!: Signal<boolean>;
    protected disabledDeleteBtn!: Signal<boolean>;

    protected isInsertMode = signal(true);
    protected editRequest = signal(false);
    protected deleteRequest = signal(false);
    protected formInvalid = signal(true);
    protected requestInProgress = signal(false);
    protected invalidData = signal(false);

    protected requestGranted = false;

    protected errorStateDescriptionRequired!: FormErrorState;

    protected contentRequestMessageHelper!: ContentRequestMessageHelper;

    constructor(
        private _fb: FormBuilder,
        private _dr: DestroyRef,
        private _contentRequestService: ContentRequestService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this._initializePage();
    }

    protected insert(): void {
        const contentRequest = this.convertFormToModel(
            this.formGroup.getRawValue() as ContentRequestForm
        );
        delete contentRequest.id;

        this._setRequestInProgress(true);
        this._contentRequestService
            .insert(contentRequest)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: () => {
                    this.contentRequestMessageHelper.messageCreated();
                    this.navigateToGrid();
                },
                error: () =>
                    this.contentRequestMessageHelper.messageErrorTryingInsert(),
            });
    }

    protected edit(): void {
        const contentRequest = this.convertFormToModel(
            this.formGroup.getRawValue() as ContentRequestForm
        );

        this._setRequestInProgress(true);
        this.editRequest.set(true);
        this._contentRequestService
            .update(contentRequest)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.editRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.contentRequestMessageHelper.messageUpdated();
                    this.navigateToGrid();
                },
                error: () =>
                    this.contentRequestMessageHelper.messageErrorTryingUpdate(),
            });
    }

    protected delete(event: Event): void {
        const contentRequest = this.convertFormToModel(
            this.formGroup.getRawValue() as ContentRequestForm
        );

        const subscription = this.contentRequestMessageHelper
            .confirmDelete(event)
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(contentRequest);
                }
                subscription?.unsubscribe();
            });
    }

    protected handleStatusChange(checked: boolean): void {
        this.formGroup.get('requestGranted')?.setValue(checked);
        this.requestGranted = checked;
    }

    protected navigateToGrid(): void {
        this._router.navigate(['content-requests']);
    }

    private _initializePage(): void {
        const contentRequestCode = this._activatedRoute.snapshot.params['code'];
        this.contentRequestMessageHelper = new ContentRequestMessageHelper(
            this._messageService,
            this._confirmationService
        );

        if (contentRequestCode) {
            this._initializeEditPage(contentRequestCode);
        } else {
            this._initializeInsertPage();
        }

        this._initializeSignals();
    }

    private _initializeEditPage(contentRequestCode: string): void {
        this.isInsertMode.set(false);
        this.pageTitle.set('Editar solicitação');
        this._browserTabTitleService.setTitle('Editar solicitação');
        this.formGroup = this._createForm();
        this._setRequestInProgress(true);
        this._initializeErrorState();

        this._contentRequestService
            .find(contentRequestCode)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: (contentRequest) => {
                    this.formGroup = this._createForm(contentRequest);
                    this.requestGranted =
                        this.formGroup.get('requestGranted')?.value;

                    this._initializeErrorState();
                    this._observeFormState();
                },
                error: () => {
                    this.invalidData.set(true);
                },
            });
    }

    private _initializeInsertPage(): void {
        this.isInsertMode.set(true);
        this.pageTitle.set('Nova solicitação');
        this._browserTabTitleService.setTitle('Nova solicitação');
        this.formGroup = this._createForm();
        this.requestGranted = false;
        this._setRequestInProgress(false);
        this._initializeErrorState();
        this._observeFormState();
    }

    private _initializeSignals(): void {
        this.disabledInsertBtn = computed(() => {
            return (
                this.requestInProgress() ||
                this.formInvalid() ||
                this.invalidData()
            );
        });
        this.disabledEditBtn = computed(() => {
            return (
                this.requestInProgress() ||
                this.formInvalid() ||
                this.invalidData()
            );
        });
        this.disabledDeleteBtn = computed(() => {
            return (
                this.requestInProgress() ||
                this.formInvalid() ||
                this.invalidData()
            );
        });
    }

    private _createForm(contentRequest?: ContentRequestModel): FormGroup {
        const formValue =
            contentRequest != null
                ? this.convertModelToForm(contentRequest)
                : null;

        const form = this._fb.group({
            id: new FormControl(formValue?.id),
            description: new FormControl(formValue?.description, {
                validators: [Validators.required],
            }),
            requestGranted: new FormControl(formValue?.requestGranted),
        });

        return form;
    }

    private _initializeErrorState(): void {
        this.errorStateDescriptionRequired = new FormErrorState(
            'required',
            this.formGroup.get('description'),
            this._dr
        );
    }

    private _observeFormState(): void {
        this.formGroup.statusChanges
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe(() => {
                this.formInvalid.set(this.formGroup.invalid);
            });
    }

    private _doDelete(contentRequest: ContentRequestModel): void {
        const id = contentRequest.id;

        if (!id) {
            this.contentRequestMessageHelper.messageErrorTryingRemove();
        }

        this._setRequestInProgress(true);
        this.deleteRequest.set(true);
        this._contentRequestService
            .delete(id as string)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.deleteRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.contentRequestMessageHelper.messageRemoved();
                    this.navigateToGrid();
                },
                error: () =>
                    this.contentRequestMessageHelper.messageErrorTryingRemove(),
            });
    }

    private _setRequestInProgress(inProgress: boolean): void {
        this.requestInProgress.set(inProgress);

        if (inProgress) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
    }

    private convertFormToModel(form: ContentRequestForm): ContentRequestModel {
        return {
            id: form.id,
            description: form.description,
            status: form.requestGranted
                ? ContentRequestStatusType.ATENDIDA
                : ContentRequestStatusType.ABERTA,
        };
    }

    private convertModelToForm(model: ContentRequestModel): ContentRequestForm {
        return {
            id: model?.id,
            description: model.description,
            requestGranted: model.status == ContentRequestStatusType.ATENDIDA,
        };
    }
}
