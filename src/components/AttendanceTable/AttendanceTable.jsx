import React, {useEffect, useState} from "react";
import "./AttendanceTable.css";
import { getCellText, getCellStyle } from "./config";
import {SaveAttendanceButton} from "../index";

const AttendanceTable = ({ lesson, students, schedule, currentLessonId, attendStudents }) => {
    const [cellStates, setCellStates] = useState({});

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
            const condition = cellStates[cellKey] || 0; // Учитываем состояние
            return {
                studentId: student.id,
                condition,
            };
        });
    };
    console.debug("currentLessonId", currentLessonId);
    console.debug("attendStudents", attendStudents);
    schedule.sort((a, b) => {
        const [dayA, monthA] = a.date.split('.').map(Number);
        const [dayB, monthB] = b.date.split('.').map(Number);

        const dateA = new Date(2024, monthA - 1, dayA);
        const dateB = new Date(2024, monthB - 1, dayB);

        if (dateA - dateB !== 0) {
            return dateA - dateB;
        }

        const lessonNumberA = parseInt(a.lesson.match(/\d+/));
        const lessonNumberB = parseInt(b.lesson.match(/\d+/));

        return lessonNumberA - lessonNumberB;
    });
    return (
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
                                    style={getCellStyle(cellState, item.id === currentLessonId)}
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
            <div>
                <SaveAttendanceButton lesson={lesson} schedule={schedule}
                                      currentLessonData={getCurrentLessonData()}></SaveAttendanceButton>
            </div>
        </div>
    );
};


export default AttendanceTable;