import { AttendanceTable } from "components/index.jsx";
import { CustomInfo } from "components/index.jsx";
import "./AttendancePage.css"

const AttendancePage = () => {
    const students = [
        { id: 1, name: "Иван Иванов" },
        { id: 2, name: "Анна Смирнова" },
        { id: 3, name: "Петр Сидоров" },
        { id: 4, name: "Ольга Кузнецова" },
        { id: 5, name: "Максим Захаров" },
        { id: 6, name: "Светлана Воронцова" },
        { id: 7, name: "Алексей Морозов" },
        { id: 8, name: "Екатерина Иванова" },
        { id: 9, name: "Дмитрий Фролов" },
        { id: 10, name: "Татьяна Белова" },
        { id: 11, name: "Иван Иванов" },
        { id: 12, name: "Анна Смирнова" },
        { id: 13, name: "Петр Сидоров" },
        { id: 14, name: "Ольга Кузнецова" },
        { id: 15, name: "Максим Захаров" },
        { id: 16, name: "Светлана Воронцова" },
        { id: 17, name: "Алексей Морозов" },
        { id: 18, name: "Екатерина Иванова" },
        { id: 19, name: "Дмитрий Фролов" },
        { id: 20, name: "Татьяна Белова" },
    ];
    const schedule = [
        { id: 1, date: "01.12.2024", lesson: "1 пара" },
        { id: 2, date: "02.12.2024", lesson: "2 пара" },
        { id: 3, date: "03.12.2024", lesson: "3 пара" },
        { id: 4, date: "04.12.2024", lesson: "4 пара" },
        { id: 5, date: "04.12.2024", lesson: "4 пара" },
        { id: 6, date: "04.12.2024", lesson: "4 пара" },
        { id: 7, date: "04.12.2024", lesson: "4 пара" },
        { id: 8, date: "04.12.2024", lesson: "4 пара" },
        { id: 9, date: "04.12.2024", lesson: "4 пара" },
    ];
    return (
        <div className="attendancePage">
            <p className="attendancePage__subject-name">Английский язык</p>
            <div className="attendancePage__teacher">
                <CustomInfo caption="Преподаватель" content="Лариса Гузеева" />
            </div>
            <div className="attendancePage__table">
                <AttendanceTable students={students} schedule={schedule} currentLessonId={2} />
            </div>
        </div>
    );
};

export default AttendancePage;