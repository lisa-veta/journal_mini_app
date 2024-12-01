import React, {useEffect, useState} from "react";
import "./AttendanceTable.css";
import { openFullAttendance } from '../../services/api/send.js';

const AttendanceTable = ({ students, schedule, currentLessonId, attendStudents }) => {
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

    // Функция для определения стиля ячейки в зависимости от состояния
    const getCellStyle = (state, isActive) => {
        let style = {};

        if (isActive) {
            // Для активных ячеек
            switch (state) {
                case 1:
                    style = { backgroundColor: "rgba(230, 145, 145, 1)" }; // Яркий красный для неявки
                    break;
                case 2:
                    style = { backgroundColor: "rgba(255, 236, 152, 1)" }; // Яркий желтый для больничного
                    break;
                case 3:
                    style = { backgroundColor: "rgba(170, 234, 255, 1)" }; // Яркий голубой для упражнения
                    break;
                default:
                    break;
            }
        } else {
            // Для неактивных ячеек (с полупрозрачностью)
            switch (state) {
                case 1:
                    style = { backgroundColor: "rgba(230, 145, 145, 0.5)" }; // Полупрозрачный красный
                    break;
                case 2:
                    style = { backgroundColor: "rgba(255, 236, 152, 0.5)" }; // Полупрозрачный желтый
                    break;
                case 3:
                    style = { backgroundColor: "rgba(170, 234, 255, 0.5)" }; // Полупрозрачный голубой
                    break;
                default:
                    style = { backgroundColor: "rgba(224, 224, 224, 0.5)" }; // Полупрозрачный стандартный фон
                    break;
            }

            // Дополнительный стиль для серого фона для неактивных ячеек
            style = { ...style, cursor: "not-allowed" };
        }

        return style;
    };

    // Функция для определения текста в ячейке
    const getCellText = (state) => {
        let text = '';

        switch (state) {
            case 1:
                text = "н"; // Неявка
                break;
            case 2:
                text = "б"; // Больничный
                break;
            case 3:
                text = "уп"; // Упражнение
                break;
            default:
                text = ''; // Пустое состояние
                break;
        }

        return text;
    };

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
        </div>
    );
};


export default AttendanceTable;