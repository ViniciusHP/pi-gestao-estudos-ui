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
    FormArray,
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
import { SubjectModel } from '../../subjects/models';
import { SubjectService } from '../../subjects/services';
import { RoadmapMessageHelper, RoadmapModelMapper } from '../helpers';
import {
    RoadmapActivityType,
    RoadmapAddActivityEvent,
    RoadmapAddTestEvent,
    RoadmapForm,
    RoadmapModel,
    RoadmapTaskForm,
    RoadmapTestForm,
    RoadmapVisibilityType,
    RoadmapWeekForm,
} from '../models';
import { RoadmapsService } from '../services';

interface VisibilityOption {
    label: string;
    value: RoadmapVisibilityType;
}

@Component({
    selector: 'app-roadmap-form',
    templateUrl: './roadmap-form.component.html',
    styleUrl: './roadmap-form.component.css',
    standalone: false,
})
export class RoadmapFormComponent implements OnInit {
    protected formGroup!: FormGroup;
    protected weeksFormArray!: FormArray<any>;
    protected weeksFormGroups!: Array<FormGroup>;

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
    protected loadingSubjects = signal(true);

    protected visibilityOptions!: Array<VisibilityOption>;

    protected subjects: WritableSignal<Array<SubjectModel>> = signal([]);

    protected errorStateStartDateRequired!: FormErrorState;
    protected errorStateEndDateRequired!: FormErrorState;
    protected errorStatesSubjectRequired!: FormErrorState;

    protected roadmapMessageHelper!: RoadmapMessageHelper;
    protected roadmapModelMapper!: RoadmapModelMapper;

    constructor(
        private _fb: FormBuilder,
        private _dr: DestroyRef,
        private _roadmapService: RoadmapsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService,
        private _subjectService: SubjectService
    ) {}

    ngOnInit(): void {
        this._initializePage();
    }

    protected insert(): void {
        const roadmap = this.roadmapModelMapper.convertFormToModel(
            this.formGroup.getRawValue(),
            this.subjects()
        );
        delete roadmap.id;

        this._setRequestInProgress(true);
        this._roadmapService
            .insert(roadmap)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: () => {
                    this.roadmapMessageHelper.messageCreated();
                    this.navigateToGrid();
                },
                error: () =>
                    this.roadmapMessageHelper.messageErrorTryingInsert(),
            });
    }

    protected edit(): void {
        const roadmap = this.roadmapModelMapper.convertFormToModel(
            this.formGroup.getRawValue(),
            this.subjects()
        );

        this._setRequestInProgress(true);
        this.editRequest.set(true);
        this._roadmapService
            .update(roadmap)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.editRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.roadmapMessageHelper.messageUpdated();
                    this.navigateToGrid();
                },
                error: () =>
                    this.roadmapMessageHelper.messageErrorTryingUpdate(),
            });
    }

    protected delete(event: Event): void {
        const roadmap = this.roadmapModelMapper.convertFormToModel(
            this.formGroup.getRawValue(),
            this.subjects()
        );

        const subscription = this.roadmapMessageHelper
            .confirmDelete(event)
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(roadmap);
                }
                subscription?.unsubscribe();
            });
    }

    protected navigateToGrid(): void {
        this._router.navigate(['/roadmaps/my-roadmaps']);
    }

    protected getFormControl(control: string): FormControl<any> {
        return this.formGroup.get(control) as FormControl<any>;
    }

    protected addWeek(): void {
        const newWeek = this._createFormWeek();
        this.weeksFormArray.push(newWeek);
    }

    protected addActivity(event: RoadmapAddActivityEvent): void {
        const weekToAdd = event.week - 1;
        const weekForm = this.weeksFormArray.at(weekToAdd) as FormGroup;

        const taskForm = this._createFormTask();
        const formActivities = weekForm.get('activities') as FormArray;
        formActivities.push(taskForm);
    }

    protected addTest(event: RoadmapAddTestEvent): void {
        const weekToAdd = event.week - 1;
        const weekForm = this.weeksFormArray.at(weekToAdd) as FormGroup;

        const testForm = this._createFormTest();
        const formActivities = weekForm.get('activities') as FormArray;
        formActivities.push(testForm);
    }

    private _loadSubjects(): void {
        this.loadingSubjects.set(true);
        this._subjectService
            .findAll()
            .pipe(
                takeUntilDestroyed(this._dr),
                finalize(() => this.loadingSubjects.set(false))
            )
            .subscribe((subjects) => {
                this.subjects.set(subjects);
            });
    }

    private _initializePage(): void {
        const roadmapCode = this._activatedRoute.snapshot.params['code'];
        this.roadmapMessageHelper = new RoadmapMessageHelper(
            this._messageService,
            this._confirmationService
        );
        this.roadmapModelMapper = new RoadmapModelMapper();

        if (roadmapCode) {
            this._initializeEditPage(roadmapCode);
        } else {
            this._initializeInsertPage();
        }

        this._initializeSignals();
        this._initializeVisibilityOptions();
        this._loadSubjects();
    }

    private _initializeEditPage(roadmapCode: string): void {
        this.isInsertMode.set(false);
        this.pageTitle.set('Editar roadmap');
        this._browserTabTitleService.setTitle('Editar roadmap');
        this._initializeForms();
        this._setRequestInProgress(true);
        this._initializeErrorState();

        this._roadmapService
            .find(roadmapCode)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: (roadmap) => {
                    this._initializeForms(roadmap);
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
        this.pageTitle.set('Novo roadmap');
        this._browserTabTitleService.setTitle('Novo roadmap');
        this._initializeForms();
        this._setRequestInProgress(false);
        this._initializeErrorState();
        this._observeFormState();
    }

    private _initializeForms(roadmap?: RoadmapModel): void {
        this.formGroup = this._createForm(roadmap);
        this.weeksFormArray = this.formGroup.get('weeks') as FormArray<any>;
        this.weeksFormGroups =
            (this.weeksFormArray.controls as Array<FormGroup>) ?? [];
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

    private _initializeVisibilityOptions(): void {
        this.visibilityOptions = [
            {
                label: 'Particular',
                value: RoadmapVisibilityType.PRIVATE,
            },
            {
                label: 'Público',
                value: RoadmapVisibilityType.PUBLIC,
            },
        ];
    }

    private _createForm(roadmap?: RoadmapModel): FormGroup {
        const formValue = roadmap
            ? this.roadmapModelMapper.convertModelToForm(roadmap)
            : null;

        const weeksFormArray = new FormArray<any>([]);

        const form = this._fb.group({
            id: new FormControl(formValue?.id),
            startDate: new FormControl(formValue?.startDate, {
                validators: [Validators.required],
            }),
            endDate: new FormControl(formValue?.endDate, {
                validators: [Validators.required],
            }),
            visibility: new FormControl(formValue?.visibility),
            subjectId: new FormControl(formValue?.subjectId, {
                validators: [Validators.required],
            }),
            weeks: weeksFormArray,
        });

        if (formValue?.weeks) {
            formValue?.weeks
                .map((w) => this._createFormWeek(w))
                .filter((a) => a != null)
                .forEach((w) => weeksFormArray.push(w));
        }

        return form;
    }

    private _createFormWeek(roadmapWeek?: RoadmapWeekForm): FormGroup {
        const formValue = roadmapWeek;

        const activitiesFormArray = new FormArray<any>([]);

        const form = this._fb.group({
            startDate: new FormControl(formValue?.startDate, {
                validators: [Validators.required],
            }),
            endDate: new FormControl(formValue?.endDate, {
                validators: [Validators.required],
            }),
            activities: activitiesFormArray,
        });

        if (formValue?.activities) {
            formValue.activities
                .map((a) => this._createFormActivity(a))
                .filter((a) => a != null)
                .forEach((a) => activitiesFormArray.push(a));
        }

        return form;
    }

    private _createFormActivity(
        roadmapActivity?: RoadmapTestForm | RoadmapTaskForm
    ): FormGroup | null {
        if (roadmapActivity?.type == RoadmapActivityType.ACTIVITY) {
            return this._createFormTask(roadmapActivity as RoadmapTaskForm);
        } else if (roadmapActivity?.type == RoadmapActivityType.TEST) {
            return this._createFormTest(roadmapActivity as RoadmapTestForm);
        }

        return null;
    }

    private _createFormTask(roadmapTask?: RoadmapTaskForm): FormGroup {
        const form = this._fb.group({
            name: new FormControl(roadmapTask?.name, {
                validators: [Validators.required],
            }),
            description: new FormControl(roadmapTask?.description, {
                validators: [Validators.required],
            }),
            type: new FormControl(RoadmapActivityType.ACTIVITY),
        });

        return form;
    }

    private _createFormTest(roadmapTest?: RoadmapTestForm): FormGroup {
        const form = this._fb.group({
            name: new FormControl(roadmapTest?.name, {
                validators: [Validators.required],
            }),
            description: new FormControl(roadmapTest?.description, {
                validators: [Validators.required],
            }),
            date: new FormControl(roadmapTest?.date, {
                validators: [Validators.required],
            }),
            type: new FormControl(RoadmapActivityType.TEST),
        });

        return form;
    }

    private _initializeErrorState(): void {
        this.errorStateStartDateRequired = new FormErrorState(
            'required',
            this.formGroup.get('startDate'),
            this._dr
        );

        this.errorStateEndDateRequired = new FormErrorState(
            'required',
            this.formGroup.get('endDate'),
            this._dr
        );

        this.errorStatesSubjectRequired = new FormErrorState(
            'required',
            this.formGroup.get('subject'),
            this._dr
        );
    }

    private _observeFormState(): void {
        this.formGroup.statusChanges
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe(() => {
                this.formInvalid.set(this.formGroup.invalid);

                console.log(
                    this.roadmapModelMapper.convertFormToModel(
                        this.formGroup.getRawValue() as RoadmapForm,
                        this.subjects()
                    )
                );
            });
    }

    private _doDelete(roadmap: RoadmapModel): void {
        const id = roadmap.id;

        if (!id) {
            this.roadmapMessageHelper.messageErrorTryingRemove();
        }

        this._setRequestInProgress(true);
        this.deleteRequest.set(true);
        this._roadmapService
            .delete(id as string)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.deleteRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.roadmapMessageHelper.messageRemoved();
                    this.navigateToGrid();
                },
                error: () =>
                    this.roadmapMessageHelper.messageErrorTryingRemove(),
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
}
