import { RoadmapActivityType } from './roadmap-activity-type';
import { RoadmapVisibilityType } from './roadmap-visibility-type';

export interface RoadmapActivityForm {
    type: RoadmapActivityType;
}

export interface RoadmapTestForm extends RoadmapActivityForm {
    name: string;
    description: string;
    date: Date | null;
}

export interface RoadmapTaskForm extends RoadmapActivityForm {
    name: string;
    description: string;
}

export interface RoadmapWeekForm {
    startDate: Date | null;
    endDate: Date | null;
    activities: Array<RoadmapTestForm | RoadmapTaskForm>;
}

export interface RoadmapForm {
    id?: string;
    subjectId: string;
    startDate: Date;
    endDate: Date;
    visibility: RoadmapVisibilityType;
    weeks?: Array<RoadmapWeekForm>;
}
