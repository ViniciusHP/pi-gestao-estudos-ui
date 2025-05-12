import { RoadmapActivityType } from './roadmap-activity-type';
import { RoadmapVisibilityType } from './roadmap-visibility-type';

export interface RoadmapActivityModel {
    type: RoadmapActivityType;
}

export interface RoadmapTestModel extends RoadmapActivityModel {
    name: string;
    description: string;
    date: string | null;
}

export interface RoadmapTaskModel extends RoadmapActivityModel {
    name: string;
    description: string;
}

export interface RoadmapWeekModel {
    startDate: string | null;
    endDate: string | null;
    activities?: Array<RoadmapTestModel | RoadmapTaskModel>;
}

export interface RoadmapModel {
    id?: string;
    createdByUser?: string;
    subject: string;
    subjectId: string;
    startDate: string;
    endDate: string;
    visibility: RoadmapVisibilityType;
    weeks?: Array<RoadmapWeekModel>;
}
