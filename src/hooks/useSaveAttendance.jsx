import { doneAttendance, incrementCurrentAttendance } from "../services/api/send";
import { ScheduleService } from "../services/scheduleService/ScheduleService";

export const useSaveAttendance = (schedule, lesson, telegramId) => {

    const transformCondition = (condition) => {
        switch (condition) {
            case 0: return 1;
            case 1: return 4;
            default: return condition;
        }
    };

    const saveAttendance = async (currentLessonData, setHasChanges) => {
        try {
            if (!currentLessonData || currentLessonData.length === 0) return;

            const updatedStudents = currentLessonData.map(student => ({
                condition: transformCondition(student.condition),
                id: student.studentId,
            }));

            console.log("updatedStudents", updatedStudents);

            const scheduleService = new ScheduleService();
            const id = await scheduleService.getAttendanceId(schedule, lesson.id);
            await doneAttendance(id, updatedStudents);
            console.log("Посещаемость сохранена успешно!");

            await incrementCurrentAttendance(telegramId);
            console.log("Типа инкремент сохранения произошел");

            if (setHasChanges) setHasChanges(false);
        } catch (error) {
            console.error("Ошибка при создании посещаемости:", error);
        }
    };

    return { saveAttendance };
};
