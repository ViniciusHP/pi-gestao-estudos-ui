import { SubjectModel } from '../../subjects/models';
import {
    RoadmapActivityType,
    RoadmapForm,
    RoadmapModel,
    RoadmapTaskForm,
    RoadmapTaskModel,
    RoadmapTestForm,
    RoadmapTestModel,
    RoadmapVisibilityType,
    RoadmapWeekForm,
    RoadmapWeekModel,
} from '../models';

export class RoadmapModelMapper {
    public convertFormToModel(
        form: RoadmapForm,
        subjects: Array<SubjectModel>
    ): RoadmapModel {
        const subjectName = subjects?.find((s) => s.id == form.subjectId)
            ?.name as string;

        const weeks =
            form?.weeks?.map((w) => this.convertWeekFormToModel(w)) ?? [];
        return {
            id: form.id,
            startDate: form.startDate.toISOString(),
            endDate: form.endDate.toISOString(),
            subjectId: form.subjectId,
            subject: subjectName,
            visibility: form.visibility ?? RoadmapVisibilityType.PRIVATE,
            weeks,
        };
    }

    public convertWeekFormToModel(form: RoadmapWeekForm): RoadmapWeekModel {
        const activities =
            form.activities
                ?.map((a) => this.convertActivityFormToModel(a))
                .filter((a) => a != null) ?? [];
        return {
            startDate: form.startDate ? form.startDate?.toISOString() : null,
            endDate: form.endDate ? form.endDate?.toISOString() : null,
            activities: activities,
        };
    }

    public convertActivityFormToModel(
        form: RoadmapTestForm | RoadmapTaskForm
    ): RoadmapTestModel | RoadmapTaskModel | null {
        if (form.type == RoadmapActivityType.ACTIVITY) {
            return this.convertTaskFormToModel(form as RoadmapTaskForm);
        } else if (form.type == RoadmapActivityType.TEST) {
            return this.convertTestFormToModel(form as RoadmapTestForm);
        }

        return null;
    }

    public convertTestFormToModel(form: RoadmapTestForm): RoadmapTestModel {
        return {
            name: form.name,
            description: form.description,
            date: form.date ? form.date.toISOString() : null,
            type: RoadmapActivityType.TEST,
        };
    }

    public convertTaskFormToModel(form: RoadmapTaskForm): RoadmapTaskModel {
        return {
            name: form.name,
            description: form.description,
            type: RoadmapActivityType.ACTIVITY,
        };
    }

    public convertModelToForm(model: RoadmapModel): RoadmapForm {
        const weeks =
            model?.weeks?.map((w) => this.convertWeekModelToForm(w)) ?? [];
        return {
            id: model?.id,
            startDate: new Date(model.startDate),
            endDate: new Date(model.endDate),
            subjectId: model.subjectId,
            visibility: model.visibility ?? RoadmapVisibilityType.PRIVATE,
            weeks,
        };
    }

    public convertWeekModelToForm(model: RoadmapWeekModel): RoadmapWeekForm {
        const activities =
            model.activities
                ?.map((a) => this.convertActivityModelToForm(a))
                .filter((a) => a != null) ?? [];
        return {
            startDate: model.startDate ? new Date(model.startDate) : null,
            endDate: model.endDate ? new Date(model.endDate) : null,
            activities: activities,
        };
    }

    public convertActivityModelToForm(
        model: RoadmapTestModel | RoadmapTaskModel
    ): RoadmapTestForm | RoadmapTaskForm | null {
        if (model.type == RoadmapActivityType.ACTIVITY) {
            return this.convertTaskModelToForm(model as RoadmapTaskModel);
        } else if (model.type == RoadmapActivityType.TEST) {
            return this.convertTestModelToForm(model as RoadmapTestModel);
        }

        return null;
    }

    public convertTestModelToForm(model: RoadmapTestModel): RoadmapTestForm {
        return {
            name: model.name,
            description: model.description,
            date: model.date ? new Date(model.date) : null,
            type: RoadmapActivityType.TEST,
        };
    }

    public convertTaskModelToForm(model: RoadmapTaskModel): RoadmapTaskForm {
        return {
            name: model.name,
            description: model.description,
            type: RoadmapActivityType.ACTIVITY,
        };
    }
}
