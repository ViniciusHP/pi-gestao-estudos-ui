import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { UserModel } from '../models';

export class UserMessageHelper {
    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {}

    public confirmUserDelete(
        user: UserModel,
        event: Event
    ): Observable<boolean> {
        const eventTarget = event.target as EventTarget;
        const subject = new Subject<boolean>();
        this._confirmationService.confirm({
            message: `Confirma a exclusão do usuário "${user.username}"? Esta ação não poderá ser desfeita.`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            target: eventTarget,
            acceptButtonProps: {
                label: 'Sim',
                severity: 'danger',
            },
            rejectButtonProps: {
                label: 'Não',
                severity: 'primary',
            },
            accept: () => {
                subject.next(true);
                subject.complete();
            },
            reject: () => {
                subject.next(false);
                subject.complete();
            },
        });

        return subject.asObservable();
    }

    public messageUserRemoved(user: UserModel): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Usuário "${user.username}" excluído com sucesso!`,
        });
    }

    public messageUserCreated(user: UserModel): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Usuário "${user.username}" foi cadastrado com sucesso!`,
        });
    }

    public messageUserUpdated(user: UserModel): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Usuário "${user.username}" foi alterado com sucesso!`,
        });
    }

    public messageErrorTryingRemove(user: UserModel): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar remover usuário "${user.username}". Tente novamente mais tarde.`,
        });
    }

    public messageErrorTryingInsert(user: UserModel): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar incluir usuário "${user.username}". Tente novamente mais tarde!`,
        });
    }

    public messageErrorTryingUpdate(user: UserModel): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar alterar usuário "${user.username}". Tente novamente mais tarde!`,
        });
    }
}
