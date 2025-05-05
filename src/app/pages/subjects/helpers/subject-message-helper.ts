import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { SubjectModel } from '../models';

export class SubjectMessageHelper {
    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {}

    public confirmSubjectDelete(
        subject: SubjectModel,
        event: Event
    ): Observable<boolean> {
        const eventTarget = event.target as EventTarget;
        const sub = new Subject<boolean>();
        this._confirmationService.confirm({
            message: `Confirma a exclusão da disciplina "${subject.name}"? Esta ação não poderá ser desfeita.`,
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
                sub.next(true);
                sub.complete();
            },
            reject: () => {
                sub.next(false);
                sub.complete();
            },
        });

        return sub.asObservable();
    }

    public messageSubjectRemoved(subject: SubjectModel): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Disciplina "${subject.name}" excluída com sucesso!`,
        });
    }

    public messageSubjectCreated(subject: SubjectModel): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Disciplina "${subject.name}" foi cadastrada com sucesso!`,
        });
    }

    public messageSubjectUpdated(subject: SubjectModel): void {
        this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Disciplina "${subject.name}" foi alterada com sucesso!`,
        });
    }

    public messageErrorTryingRemove(subject: SubjectModel): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar remover disciplina "${subject.name}". Tente novamente mais tarde.`,
        });
    }

    public messageErrorTryingInsert(subject: SubjectModel): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar incluir disciplina "${subject.name}". Tente novamente mais tarde!`,
        });
    }

    public messageErrorTryingUpdate(subject: SubjectModel): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao tentar alterar disciplina "${subject.name}". Tente novamente mais tarde!`,
        });
    }
}
