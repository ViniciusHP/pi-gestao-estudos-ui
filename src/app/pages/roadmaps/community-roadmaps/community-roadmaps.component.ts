import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { PaginatorState } from '../../../shared/helpers';
import { RoadmapMessageHelper } from '../helpers';
import { RoadmapModel } from '../models';
import { CommunityRoadmapsService } from '../services/community-roadmaps.service';

@Component({
    selector: 'app-community-roadmaps',
    templateUrl: './community-roadmaps.component.html',
    styleUrl: './community-roadmaps.component.css',
    standalone: false,
})
export class CommunityRoadmapsComponent implements OnInit {
    protected paginatorState!: PaginatorState;
    protected communityRoadmaps: WritableSignal<Array<RoadmapModel>> = signal(
        []
    );
    protected requestInProgress = signal(false);
    protected roadmapMessageHelper!: RoadmapMessageHelper;

    constructor(
        private _communityRoadmapsService: CommunityRoadmapsService,
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

    private _findAll() {
        this.requestInProgress.set(true);
        this._communityRoadmapsService
            .findPage(this.paginatorState.page, this.paginatorState.rows)
            .pipe(finalize(() => this.requestInProgress.set(false)))
            .subscribe((page) => {
                this.communityRoadmaps.set(page.data);
                this.paginatorState.updateTotalRecords(page);
            });
    }
}
