import {confirmAttendance, doneAttendance, incrementCurrentAttendance} from "../services/api/send";
import { ScheduleService } from "../services/scheduleService/ScheduleService";

export const useSaveAttendance = () => {

    const transformCondition = (condition) => {
        switch (condition) {
            case 0: return 1;
            case 1: return 4;
            default: return condition;
        }
    };

    const saveAttendance = async (schedule, lesson, telegramId, userRole, currentLessonData, hasChanges) => {
        try {
            if (!currentLessonData || currentLessonData.length === 0) return;

            const updatedStudents = currentLessonData.map(student => ({
                condition: transformCondition(student.condition),
                id: student.studentId,
            }));

            const scheduleService = new ScheduleService();
            console.log(userRole, schedule, lesson.id)
            const id = await scheduleService.getAttendanceId(schedule, lesson.id);
            if(userRole === 'student'){
                await doneAttendance(id, updatedStudents);
                console.log("Посещаемость сохранена успешно!");

                await incrementCurrentAttendance(telegramId);
                console.log("Типа инкремент сохранения произошел");
                return true;
            } else {
                if(hasChanges) {
                    await doneAttendance(id, updatedStudents);
                    console.log("Посещаемость сохранена успешно!");
                }
                await confirmAttendance(id);
                console.log("Посещаемость подтверждена успешно!");
                return true;
            }
        } catch (error) {
            console.error("Ошибка при создании посещаемости:", userRole, error);
            return false;
        }
    };

    return { saveAttendance };
};
