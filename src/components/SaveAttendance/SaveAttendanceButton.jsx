
import { createAttendance, doneAttendance } from "../../services/api/send.js";
import "./SaveAttendanceButton.css"
const SaveAttendanceButton = ({lesson, schedule, currentLessonData}) => {
    //console.debug("КНОППКАА", lesson, schedule, currentLessonData);
    const currentLesson = schedule.find(item => item.isLessonCurrent === true);

    if (currentLesson) {
        const [day, month] = currentLesson.date.split('.');  // Разбиваем на день и месяц
        const [hour, minute] = currentLesson.time.split(':'); // Разбиваем на часы и минуты

        const currentYear = new Date().getFullYear();  // Получаем текущий год
        const timedate = `${currentYear}-${month}-${day} ${hour}:${minute}:00`;  // Формируем строку времени
        console.log(timedate)
        const handleSave = async () => {
            try {
                const id = await createAttendance(lesson.id, timedate);
                console.log("Посещаемость успешно создана!");
                const updatedStudents = currentLessonData.map(student => ({
                    condition: student.condition === 0 ? 4 : student.condition,
                    id: student.studentId,
                }));
                console.log(updatedStudents)

                await doneAttendance(id, updatedStudents);
                console.log("Посещаемость сохранена успешно!");
            } catch (error) {
                console.error("Ошибка при создании посещаемости:", error);
            }
        };

        return (
            <div  className="buttonSave">
                <button onClick={handleSave}>Сохранить</button>
            </div>
        );
    } else {
        return (
            <div className="buttonSave buttonSave_disabled">
                <button disabled>Сохранить</button>
            </div>
        );
    }
};

export default SaveAttendanceButton;