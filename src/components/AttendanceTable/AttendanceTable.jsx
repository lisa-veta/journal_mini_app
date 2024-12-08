import React, {useEffect, useState} from "react";
import "./AttendanceTable.css";
import { getCellText, getCellStyle } from "./config";
import {SaveAttendanceButton} from "../index";

const AttendanceTable = ({ students, schedule, currentLessonId, attendStudents, attendanceId }) => {
    const [cellStates, setCellStates] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    // Инициализация состояния на основе attendStudents
    useEffect(() => {
        const initialStates = {};
        attendStudents.forEach((entry) => {
            const cellKey = `${entry.studentId}-${entry.scheduleId}`;
            initialStates[cellKey] = entry.condition;
        });
        setCellStates(initialStates);
    }, [attendStudents]);

    // Функция обработки кликов по ячейке
    const handleCellClick = (studentId, lessonId) => {
        // Если урок не тот, пропускаем
        if (lessonId !== currentLessonId) return;

        const cellKey = `${studentId}-${lessonId}`;
        setHasChanges(true);
        // Цикличное переключение состояний ячейки (от 0 до 3)
        setCellStates((prev) => {
            const currentState = prev[cellKey] || 0;
            return {
                ...prev,
                [cellKey]: (currentState + 1) % 4, // Переключаем состояния
            };
        });
    };
    const getCurrentLessonData = () => {
        return students.map((student) => {
            const cellKey = `${student.id}-${currentLessonId}`;
            const condition = cellStates[cellKey] || 0;
            return {
                studentId: student.id,
                condition,
            };
        });
    };
    console.debug("currentLessonId", currentLessonId);
    console.debug("attendStudents", attendStudents);
    console.debug("She", schedule)
    console.debug("She", students)

    return (
        <div>
            <div className="attendancePrev">
                {hasChanges ? "Есть несохраненные изменения" : ""}
            </div>
            <div className="attendanceTable-wrapper">
                <table className="attendanceTable">
                    <thead>
                    <tr>
                        <th>Студент</th>
                        {schedule.map((item) => (
                            <th
                                key={item.id}
                                className="attendanceTable__vertical-header"
                                style={{
                                    backgroundColor:
                                        item.id === currentLessonId ? "#f9f9f9" : "#e0e0e0",
                                    borderColor: item.id === currentLessonId ? "rgb(112,112,112)" : "",
                                    borderWidth: "2px",
                                }}
                            >
                                {item.date}, {item.lesson}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.lastname} {student.name[0]}.</td>
                            {schedule.map((item) => {
                                // Ищем состояние для текущей ячейки
                                const cellState = cellStates[`${student.id}-${item.id}`];
                                return (
                                    <td
                                        key={item.id}
                                        style={
                                        getCellStyle(cellState, item.id === currentLessonId)
                                    }
                                        onClick={() => handleCellClick(student.id, item.id)}
                                    >
                                        {getCellText(cellState)} {/* Выводим текст состояния */}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                <SaveAttendanceButton schedule={schedule} currentLessonData={getCurrentLessonData()}
                                      attendanceId={attendanceId} hasChanges={hasChanges} setHasChanges={setHasChanges}></SaveAttendanceButton>
            </div>
        </div>
    );
};


export default AttendanceTable;