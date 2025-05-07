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
import { SubjectMessageHelper } from '../helpers';
import { SubjectModel } from '../models';
import { SubjectService } from '../services/subject.service';

@Component({
    selector: 'app-subject-form',
    templateUrl: './subject-form.component.html',
    styleUrl: './subject-form.component.css',
    standalone: false,
})
export class SubjectFormComponent implements OnInit {
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

    protected errorStateNameRequired!: FormErrorState;
    protected errorStateDescriptionRequired!: FormErrorState;

    protected subjectMessageHelper!: SubjectMessageHelper;

    constructor(
        private _fb: FormBuilder,
        private _dr: DestroyRef,
        private _subjectService: SubjectService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this._initializePage();
    }

    protected newSubject(): void {
        const subject = this.formGroup.getRawValue() as SubjectModel;
        delete subject.id;

        this._setRequestInProgress(true);
        this._subjectService
            .insert(subject)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: () => {
                    this.subjectMessageHelper.messageSubjectCreated(subject);
                    this.navigateToGrid();
                },
                error: () =>
                    this.subjectMessageHelper.messageErrorTryingInsert(subject),
            });
    }

    protected editSubject(): void {
        const subject = this.formGroup.getRawValue() as SubjectModel;

        this._setRequestInProgress(true);
        this.editRequest.set(true);
        this._subjectService
            .update(subject)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.editRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.subjectMessageHelper.messageSubjectUpdated(subject);
                    this.navigateToGrid();
                },
                error: () =>
                    this.subjectMessageHelper.messageErrorTryingUpdate(subject),
            });
    }

    protected deleteSubject(event: Event): void {
        const subject = this.formGroup.getRawValue() as SubjectModel;

        const subscription = this.subjectMessageHelper
            .confirmSubjectDelete(subject, event)
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(subject);
                }
                subscription?.unsubscribe();
            });
    }

    protected navigateToGrid(): void {
        this._router.navigate(['subjects']);
    }

    private _initializePage(): void {
        const subjectCode = this._activatedRoute.snapshot.params['code'];
        this.subjectMessageHelper = new SubjectMessageHelper(
            this._messageService,
            this._confirmationService
        );

        if (subjectCode) {
            this._initializeEditPage(subjectCode);
        } else {
            this._initializeInsertPage();
        }

        this._initializeSignals();
    }

    private _initializeEditPage(subjectCode: string): void {
        this.isInsertMode.set(false);
        this.pageTitle.set('Editar disciplina');
        this._browserTabTitleService.setTitle('Editar disciplina');
        this.formGroup = this._createForm();
        this._setRequestInProgress(true);
        this._initializeErrorState();

        this._subjectService
            .find(subjectCode)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: (subject) => {
                    this.formGroup = this._createForm(subject);
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
        this.pageTitle.set('Nova disciplina');
        this._browserTabTitleService.setTitle('Nova disciplina');
        this.formGroup = this._createForm();
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

    private _createForm(subject?: SubjectModel): FormGroup {
        const form = this._fb.group({
            id: new FormControl(subject?.id),
            name: new FormControl(subject?.name, {
                validators: [Validators.required],
            }),
            description: new FormControl(subject?.description, {
                validators: [Validators.required],
            }),
        });

        form.get('id')?.disable();

        return form;
    }

    private _initializeErrorState(): void {
        this.errorStateNameRequired = new FormErrorState(
            'required',
            this.formGroup.get('name'),
            this._dr
        );

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

    private _doDelete(subject: SubjectModel): void {
        const id = subject.id;

        if (!id) {
            this.subjectMessageHelper.messageErrorTryingRemove(subject);
        }

        this._setRequestInProgress(true);
        this.deleteRequest.set(true);
        this._subjectService
            .delete(id as string)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.deleteRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.subjectMessageHelper.messageSubjectRemoved(subject);
                    this.navigateToGrid();
                },
                error: () =>
                    this.subjectMessageHelper.messageErrorTryingRemove(subject),
            });
    }

    private _setRequestInProgress(inProgress: boolean): void {
        this.requestInProgress.set(inProgress);

        if (inProgress) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
            this.formGroup.get('id')?.disable();
        }
    }
}
