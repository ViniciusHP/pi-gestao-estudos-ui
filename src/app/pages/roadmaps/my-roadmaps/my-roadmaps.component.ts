import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { PaginatorState } from '../../../shared/helpers';
import { RoadmapMessageHelper } from '../helpers';
import { RoadmapModel } from '../models';
import { RoadmapsService } from '../services';
import { MyRoadmapLineDelete } from './my-roadmap-line/my-roadmap-line.component';

@Component({
    selector: 'app-my-roadmaps',
    templateUrl: './my-roadmaps.component.html',
    styleUrl: './my-roadmaps.component.css',
    standalone: false,
})
export class MyRoadmapsComponent implements OnInit {
    protected paginatorState!: PaginatorState;
    protected myRoadmaps: WritableSignal<Array<RoadmapModel>> = signal([]);
    protected requestInProgress = signal(false);
    protected roadmapMessageHelper!: RoadmapMessageHelper;

    constructor(
        private _myRoadmapsService: RoadmapsService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.paginatorState = new PaginatorState();
        this.roadmapMessageHelper = new RoadmapMessageHelper(
            this._messageService,
            this._confirmationService
        );
        this._findAll();
    }

    protected pageChange(event: TablePageEvent): void {
        this.paginatorState.pageChange(event);
        this._findAll();
    }

    protected delete(event: MyRoadmapLineDelete): void {
        const subscription = this.roadmapMessageHelper
            .confirmDelete(event.event)
            .subscribe((confirm) => {
                if (confirm) {
                    this._doDelete(event.roadmap);
                }
                subscription?.unsubscribe();
            });
    }

    private _findAll() {
        this.requestInProgress.set(true);
        this._myRoadmapsService
            .findPage(this.paginatorState.page, this.paginatorState.rows)
            .pipe(finalize(() => this.requestInProgress.set(false)))
            .subscribe((page) => {
                this.myRoadmaps.set(page.data);
                this.paginatorState.updateTotalRecords(page);
            });
    }

    private _doDelete(roadmap: RoadmapModel): void {
        const id = roadmap.id;
        if (!id) {
            this.roadmapMessageHelper.messageErrorTryingRemove();
        }

        this._myRoadmapsService.delete(id as string).subscribe({
            next: () => {
                this.roadmapMessageHelper.messageRemoved();
                this._findAll();
            },
            error: () => this.roadmapMessageHelper.messageErrorTryingRemove(),
        });
    }
}
