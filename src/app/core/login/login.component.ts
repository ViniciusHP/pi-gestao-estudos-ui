import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormErrorState } from '../../shared/helpers';
import { BrowserTabTitleService } from '../../shared/services';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: false,
})
export class LoginComponent implements OnInit {
    protected formGroup!: FormGroup;
    protected errorStateEmailRequired!: FormErrorState;
    protected errorStateEmailInvalid!: FormErrorState;
    protected errorStatePasswordRequired!: FormErrorState;

    protected disabledAccessBtn = signal(true);

    constructor(
        private _fb: FormBuilder,
        private _dr: DestroyRef,
        private _loginService: LoginService,
        private _browserTabTitleService: BrowserTabTitleService
    ) {}

    ngOnInit(): void {
        this._initializePage();
    }

    protected doLogin(): void {
        if (this.disabledAccessBtn()) {
            return;
        }

        this._loginService
            .doLogin({
                email: this.formGroup.get('email')?.value,
                password: this.formGroup.get('password')?.value,
            })
            .subscribe();
    }

    private _initializePage(): void {
        this.formGroup = this._createForm();
        this._browserTabTitleService.setTitle('Login');
        this._initializeErrorStates();
        this._observeFormState();
    }

    private _createForm(): FormGroup {
        return this._fb.group({
            email: new FormControl(null, {
                validators: [Validators.email, Validators.required],
            }),
            password: new FormControl(null, {
                validators: [Validators.required],
            }),
        });
    }

    private _initializeErrorStates(): void {
        this.errorStateEmailRequired = new FormErrorState(
            'required',
            this.formGroup.get('email'),
            this._dr
        );

        this.errorStateEmailInvalid = new FormErrorState(
            'email',
            this.formGroup.get('email'),
            this._dr
        );

        this.errorStatePasswordRequired = new FormErrorState(
            'required',
            this.formGroup.get('password'),
            this._dr
        );
    }

    private _observeFormState(): void {
        this.formGroup.statusChanges
            .pipe(takeUntilDestroyed(this._dr))
            .subscribe(() => {
                this.disabledAccessBtn.set(this.formGroup.invalid);
            });
    }
}
