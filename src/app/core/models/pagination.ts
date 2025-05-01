export interface Pagination<T> {
    first: number;
    next: number;
    last: number;
    pages: number;
    items: number;
    data: Array<T>;
}
