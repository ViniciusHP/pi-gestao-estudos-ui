export interface Page<T> {
    data: Array<T>;
    totalRecords: number;
    page: number;
    size: number;
}
