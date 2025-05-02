import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Page, Pagination } from '../../../core/models';

export abstract class CrudRequestsAbstract<Id, Model> {
    constructor(protected http: HttpClient) {}

    public findPage(page: number, size: number): Observable<Page<Model>> {
        return this.http
            .get<Pagination<Model>>(this.getUrl(), {
                params: {
                    _page: page,
                    _per_page: size,
                },
            })
            .pipe(
                map((p) => {
                    return {
                        data: p.data,
                        totalRecords: p.items,
                        page: page,
                        size,
                    };
                })
            );
    }

    public findAll(): Observable<Array<Model>> {
        return this.http.get<Array<Model>>(this.getUrl());
    }

    public find(id: Id): Observable<Model> {
        return this.http.get<Model>(`${this.getUrl()}/${id}`);
    }

    public insert(model: Model): Observable<Model> {
        return this.http.post<Model>(this.getUrl(), model);
    }

    public update(model: Model): Observable<Model> {
        return this.http.put<Model>(
            `${this.getUrl()}/${this.getIdFromModel(model)}`,
            model
        );
    }

    public delete(id: Id): Observable<Id> {
        return this.http.delete<Id>(`${this.getUrl()}/${id}`);
    }

    protected abstract getUrl(): string;
    protected abstract getIdFromModel(model: Model): Id | null | undefined;
}
