import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

export class ContentRequestMessageHelper {
    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {}

    public confirmDelete(event: Event): Observable<boolean> {
        const eventTarget = event.target as EventTarget;
        const subject = new Subject<boolean>();
        this._confirmationService.confirm({
            message: `Confirma a exclusão da solicitação? Esta ação não poderá ser desfeita.`,
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

    public messageRemoved(): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Solicitação excluída com sucesso!`,
        });
    }

    public messageCreated(): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Solicitação foi cadastrada com sucesso!`,
        });
    }

    public messageUpdated(): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Solicitação foi alterada com sucesso!`,
        });
    }

    public messageErrorTryingRemove(): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar remover solicitação. Tente novamente mais tarde.`,
        });
    }

    public messageErrorTryingInsert(): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar incluir solicitação. Tente novamente mais tarde!`,
        });
    }

    public messageErrorTryingUpdate(): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar alterar solicitação. Tente novamente mais tarde!`,
        });
    }
}
