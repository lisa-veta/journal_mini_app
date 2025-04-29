import {confirmAttendance, doneAttendance, incrementCurrentAttendance} from "../services/api/send";
import { ScheduleService } from "../services/scheduleService/ScheduleService";

export const useSaveAttendance = (schedule, lesson, telegramId, userRole) => {

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

            const scheduleService = new ScheduleService();
            const id = await scheduleService.getAttendanceId(schedule, lesson.id);
            if(userRole === 'student'){
                await doneAttendance(id, updatedStudents);
                console.log("Посещаемость сохранена успешно!");

                await incrementCurrentAttendance(telegramId);
                console.log("Типа инкремент сохранения произошел");
            } else {
                await confirmAttendance(id);
                console.log("Посещаемость подтверждена успешно!");
            }


            if (setHasChanges) setHasChanges(false);
        } catch (error) {
            console.error("Ошибка при создании посещаемости:", error);
        }
    };

    return { saveAttendance };
};
