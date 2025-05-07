import { ContentRequestStatusType } from './content-status-type';

export interface ContentRequestModel {
    id?: string;
    description: string;
    status: ContentRequestStatusType;
}
