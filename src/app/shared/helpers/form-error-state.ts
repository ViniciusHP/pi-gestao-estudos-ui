import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export class FormErrorState {
    private _errorsSubject = new BehaviorSubject<boolean>(false);
    private _withError = false;
    private _subscription!: Subscription;

    constructor(
        private _error: string,
        private _control: AbstractControl | null,
        private _df: DestroyRef
    ) {
        this._initialize();
    }

    public hasError(): Observable<boolean> {
        return this._errorsSubject.asObservable();
    }

    public destroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._errorsSubject.complete();
        }
    }

    private _initialize(): void {
        if (this._control == null) {
            return;
        }

        this._subscription = this._control.statusChanges
            .pipe(takeUntilDestroyed(this._df))
            .subscribe(() => {
                if (this._control && this._control.invalid) {
                    this._notifyError(this._control.hasError(this._error));
                } else {
                    this._notifyError(false);
                }
            });

        this._df?.onDestroy(() => {
            this.destroy();
        });
    }

    private _notifyError(withError: boolean): void {
        if (this._withError != withError) {
            this._withError = withError;
            this._errorsSubject.next(withError);
        }
    }
}
