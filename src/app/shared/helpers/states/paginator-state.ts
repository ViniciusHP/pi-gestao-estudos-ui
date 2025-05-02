import { TablePageEvent } from 'primeng/table';
import { Page } from '../../../core/models/page';

export class PaginatorState {
    first: number;
    rows: number;
    page: number;
    totalRecords: number;
    initialNumberOfRows: number;

    constructor(first = 0, rows = 30, page = 1) {
        this.first = first;
        this.rows = rows;
        this.page = page;
        this.totalRecords = 0;
        this.initialNumberOfRows = rows;
    }

    public pageChange(event: TablePageEvent): void {
        this.first = event.first;
        this.rows = event.rows;
        this.page = event.first == 0 ? 1 : event.first / event.rows + 1;
    }

    public updateTotalRecords(page: Page<any>): void {
        this.totalRecords = page.totalRecords;
    }
}
