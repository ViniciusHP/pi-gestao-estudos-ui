import { RoadmapActivityType } from './roadmap-activity-type';
import { RoadmapVisibilityType } from './roadmap-visibility-type';

export interface CurrentRoadmapActivityModel {
    type: RoadmapActivityType;
}

export interface CurrentRoadmapTestModel extends CurrentRoadmapActivityModel {
    name: string;
    description: string;
    date: string | null;
    checked: boolean;
}

export interface CurrentRoadmapTaskModel extends CurrentRoadmapActivityModel {
    name: string;
    description: string;
    checked: boolean;
}

export interface CurrentRoadmapWeekModel {
    startDate: string | null;
    endDate: string | null;
    checked: boolean;
    activities?: Array<CurrentRoadmapTestModel | CurrentRoadmapTaskModel>;
}

export interface CurrentRoadmapModel {
    id?: string;
    checked: boolean;
    createdByUser?: string;
    subject: string;
    subjectId: string;
    startDate: string;
    endDate: string;
    visibility: RoadmapVisibilityType;
    weeks?: Array<CurrentRoadmapWeekModel>;
}
