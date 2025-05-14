import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { PaginatorState } from '../../../shared/helpers';
import { RoadmapMessageHelper } from '../helpers';
import { CurrentRoadmapModel } from '../models';
import { CurrentRoadmapsService } from '../services';

@Component({
    selector: 'app-current-roadmaps',
    templateUrl: './current-roadmaps.component.html',
    styleUrl: './current-roadmaps.component.css',
    standalone: false,
})
export class CurrentRoadmapsComponent implements OnInit {
    protected paginatorState!: PaginatorState;
    protected currentRoadmaps: WritableSignal<Array<CurrentRoadmapModel>> =
        signal([]);
    protected requestInProgress = signal(false);
    protected roadmapMessageHelper!: RoadmapMessageHelper;

    constructor(
        private _currentRoadmapsService: CurrentRoadmapsService,
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

    protected handleOnChange(roadmap: CurrentRoadmapModel): void {
        this._currentRoadmapsService.update(roadmap).subscribe();
    }

    private _findAll() {
        this.requestInProgress.set(true);
        this._currentRoadmapsService
            .findPage(this.paginatorState.page, this.paginatorState.rows)
            .pipe(finalize(() => this.requestInProgress.set(false)))
            .subscribe((page) => {
                this.currentRoadmaps.set(page.data);
                this.paginatorState.updateTotalRecords(page);
            });
    }
}
