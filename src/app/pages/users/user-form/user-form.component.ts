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
import { UserMessageHelper } from '../helpers';
import { UserModel, UserType } from '../models';
import { UserService } from '../services/user.service';

interface UserTypesOption {
    name: string;
    code: UserType;
}

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.css',
    standalone: false,
})
export class UserFormComponent implements OnInit {
    protected formGroup!: FormGroup;
    protected userTypes?: UserTypesOption[];

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

    protected errorStateFullNameRequired!: FormErrorState;
    protected errorStateUsernameRequired!: FormErrorState;
    protected errorStateEmailRequired!: FormErrorState;
    protected errorStateEmailInvalid!: FormErrorState;
    protected errorStateEmailPrivateRequired!: FormErrorState;
    protected errorStateEmailPrivateInvalid!: FormErrorState;
    protected errorStateRaRequired!: FormErrorState;
    protected errorStatePoleRequired!: FormErrorState;
    protected errorStateCourseRequired!: FormErrorState;
    protected errorStateUserTypeRequired!: FormErrorState;

    protected userMessageHelper!: UserMessageHelper;

    constructor(
        private _fb: FormBuilder,
        private _dr: DestroyRef,
        private _userService: UserService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this._initializePage();
    }

    protected newUser(): void {
        const user = this.formGroup.getRawValue() as UserModel;
        delete user.id;

        this._setRequestInProgress(true);
        this._userService
            .insert(user)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: () => {
                    this.userMessageHelper.messageUserCreated(user);
                    this.navigateToGrid();
                },
                error: () =>
                    this.userMessageHelper.messageErrorTryingInsert(user),
            });
    }

    protected editUser(): void {
        const user = this.formGroup.getRawValue() as UserModel;

        this._setRequestInProgress(true);
        this.editRequest.set(true);
        this._userService
            .update(user)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.editRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.userMessageHelper.messageUserUpdated(user);
                    this.navigateToGrid();
                },
                error: () =>
                    this.userMessageHelper.messageErrorTryingUpdate(user),
            });
    }

    protected deleteUser(event: Event): void {
        const user = this.formGroup.getRawValue() as UserModel;

        const subscription = this.userMessageHelper
            .confirmUserDelete(user, event)
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(user);
                }
                subscription?.unsubscribe();
            });
    }

    protected navigateToGrid(): void {
        this._router.navigate(['users']);
    }

    private _initializePage(): void {
        const userCode = this._activatedRoute.snapshot.params['code'];
        this.userMessageHelper = new UserMessageHelper(
            this._messageService,
            this._confirmationService
        );

        if (userCode) {
            this._initializeEditPage(userCode);
        } else {
            this._initializeInsertPage();
        }

        this._initializeSignals();
    }

    private _initializeEditPage(userCode: string): void {
        this.isInsertMode.set(false);
        this.pageTitle.set('Editar usuário');
        this._browserTabTitleService.setTitle('Editar usuário');
        this.formGroup = this._createForm();
        this._setRequestInProgress(true);
        this._initializeErrorState();
        this._initializeUserTypes();

        this._userService
            .find(userCode)
            .pipe(finalize(() => this._setRequestInProgress(false)))
            .subscribe({
                next: (user) => {
                    this.formGroup = this._createForm(user);
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
        this.pageTitle.set('Novo usuário');
        this._browserTabTitleService.setTitle('Novo usuário');
        this.formGroup = this._createForm();
        this._setRequestInProgress(false);
        this._initializeErrorState();
        this._initializeUserTypes();
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

    private _createForm(user?: UserModel): FormGroup {
        return this._fb.group({
            id: new FormControl(user?.id),
            fullName: new FormControl(user?.fullName, {
                validators: [Validators.required],
            }),
            username: new FormControl(user?.username, {
                validators: [Validators.required],
            }),
            emailUnivesp: new FormControl(user?.emailUnivesp, {
                validators: [Validators.required, Validators.email],
            }),
            emailPrivate: new FormControl(user?.emailPrivate, {
                validators: [Validators.required, Validators.email],
            }),
            ra: new FormControl(user?.ra, {
                validators: [Validators.required],
            }),
            pole: new FormControl(user?.pole, {
                validators: [Validators.required],
            }),
            course: new FormControl(user?.course, {
                validators: [Validators.required],
            }),
            userType: new FormControl(user?.userType, {
                validators: [Validators.required],
            }),
        });
    }

    private _initializeUserTypes(): void {
        this.userTypes = [
            {
                name: 'Usuário',
                code: UserType.USUARIO,
            },
            {
                name: 'Administrador',
                code: UserType.ADMINISTRADOR,
            },
        ];
    }

    private _initializeErrorState(): void {
        this.errorStateFullNameRequired = new FormErrorState(
            'required',
            this.formGroup.get('fullName'),
            this._dr
        );

        this.errorStateUsernameRequired = new FormErrorState(
            'required',
            this.formGroup.get('username'),
            this._dr
        );

        this.errorStateEmailRequired = new FormErrorState(
            'required',
            this.formGroup.get('emailUnivesp'),
            this._dr
        );

        this.errorStateEmailInvalid = new FormErrorState(
            'email',
            this.formGroup.get('emailUnivesp'),
            this._dr
        );

        this.errorStateEmailPrivateRequired = new FormErrorState(
            'required',
            this.formGroup.get('emailPrivate'),
            this._dr
        );

        this.errorStateEmailPrivateInvalid = new FormErrorState(
            'email',
            this.formGroup.get('emailPrivate'),
            this._dr
        );

        this.errorStateRaRequired = new FormErrorState(
            'required',
            this.formGroup.get('ra'),
            this._dr
        );

        this.errorStatePoleRequired = new FormErrorState(
            'required',
            this.formGroup.get('pole'),
            this._dr
        );

        this.errorStateCourseRequired = new FormErrorState(
            'required',
            this.formGroup.get('course'),
            this._dr
        );

        this.errorStateUserTypeRequired = new FormErrorState(
            'required',
            this.formGroup.get('userType'),
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

    private _doDelete(user: UserModel): void {
        const id = user.id;
        if (!id) {
            this.userMessageHelper.messageErrorTryingRemove(user);
        }

        this._setRequestInProgress(true);
        this.deleteRequest.set(true);
        this._userService
            .delete(id as string)
            .pipe(
                finalize(() => {
                    this._setRequestInProgress(false);
                    this.deleteRequest.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.userMessageHelper.messageUserRemoved(user);
                    this.navigateToGrid();
                },
                error: () =>
                    this.userMessageHelper.messageErrorTryingRemove(user),
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
