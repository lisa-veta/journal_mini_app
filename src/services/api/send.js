//const url = 'http://185.104.249.229:3000';
const url = 'https://elejournal.ru';

/* Создать новую посещаемость (общую).
    classId - ид пары,
    timedate - дата пары и время начала пары, формат 2024-11-18 16:40:00
Возвращает id посещаемости (общей).*/
// export async function createAttendance(classId, timedate) {
//     const endPoint = '/create-attendance';
//     const data = { classId: classId, timedate: timedate };
//     await sendPost(endPoint, data);
// }

export async function createAttendance(classId, timedate) {
    const endPoint = '/create-attendance';
    const data = { classId: classId, timedate: timedate };
    try {
        const response = await sendPost(endPoint, data);
        console.debug(response);
        if (response) {
            return response[0].id;
        } else {
            throw new Error("ID посещаемости не найдено в ответе.");
        }
    } catch (error) {
        console.error("Ошибка при создании посещаемости:", error);
        throw error;
    }
}

/* Открыть уже существующую посещаемость (общую).
    classId - ид пары,
    timedate - дата пары и время начала пары, формат 2024-11-18 16:40:00
Возвращает список студентов с ид их состояния
[
    {
        "id_condition_student": 1,
        "name": "Елизавета",
        "lastname": "Перникова",
        "patronymic": "Олеговна"
    },
    {
        "id_condition_student": 1,
        "name": "Анастасия",
        "lastname": "Кузнецова",
        "patronymic": "Александровна"
    }
]
.*/

export async function openAttendance(classId, timedate) {
    const endPoint = '/open-attendance';
    const data = { classId: classId, timedate: timedate };
    try {
        const response = await sendPost(endPoint, data);
        console.debug(response);
        if (response) {
            return response[0].id;
        } else {
            throw new Error("ID посещаемости не найдено в ответе.");
        }
    } catch (error) {
        console.error("Ошибка при создании посещаемости:", error);
        throw error;
    }
}

export async function getIdAttendanceIfExist(classId, timedate) {
    const endPoint = '/get-id-attendance-if-exist';
    const data = { classId: classId, timedate: timedate };
    try {
        const response = await sendPost(endPoint, data);
        console.debug("getIdAttendanceIfExist sendPost", response);
        if (response) {
            return response[response.length -1].id;
        } else {
            throw new Error("ID посещаемости не найдено в ответе.");
        }
    } catch (error) {
        console.error("Ошибка при создании посещаемости:", error);
        throw error;
    }
}

/* Сохранить посещаемость (общую).
    attendanceId - ид посещаемости,
    students - список студентов
    {
        "attendanceId": 87,
        "students": [
            {
                "condition": 1,
                "id": 5
            },
            {
                "condition": 2,
                "id": 6
            }
        ]
    }
Возващает ничего. Если не прошло будет 404*/
export async function doneAttendance(attendanceId, students) {
    const endPoint = '/attendancedone';
    const data = { attendanceId: attendanceId, students: students };
    await sendPostWithoutResult(endPoint, data);
}

/* Расписание.  ДОБАВИТЬ
    groupId - ид группы,
Возвращает
[
    {
        "id": 1,
        "week_day": "Понедельник",
        "number_week": 2,
        "lesson_start_time": "16:40:00",
        "lesson_end_time": "18:10:00",
        "classroom": "А-17",
        "lesson": "Анализ данных",
        "type_lesson": "Лекция",
        "name": "В.",
        "lastname": "Мирасов",
        "patronymic": "Ф."
    },
    {
        "id": 2,
        "week_day": "Понедельник",
        "number_week": 2,
        "lesson_start_time": "18:20:00",
        "lesson_end_time": "19:50:00",
        "classroom": "А-17",
        "lesson": "Базы и хранилища данных",
        "type_lesson": "Лекция",
        "name": "Иван",
        "lastname": "Барабанщиков",
        "patronymic": "В."
    }
]
Если его нет, то 404*/

export async function timeTable(groupId) {
    const endPoint = '/time-table';
    const data = { groupId: groupId };
    return await sendPost(endPoint, data);
}

/* Студенты.
    groupId - ид группы,
Возващает
[
    {
        "id": 1,
        "nickname": "base",
        "password": "base",
        "name": "Елизавета",
        "lastname": "Перникова",
        "patronymic": "Олеговна",
        "is_headman": false,
        "id_group": 5
    },
    {
        "id": 2,
        "nickname": "base",
        "password": "base",
        "name": "Анастасия",
        "lastname": "Кузнецова",
        "patronymic": "Александровна",
        "is_headman": false,
        "id_group": 5
    }
]
Если его нет, то 404*/
export default async function students(groupId) {
    const endPoint = '/students';
    const data = { groupId: groupId };
    return await sendPost(endPoint, data);
}

/*
принимает:
telegramId - ид пользователя который нужно запросить у самого телеграмма
возвращает:
200 - всё ок, в теле ответа ид группы
404 - юзер не авторизован
*/

export async function authorizationTelegram(telegramId) {
    const endPoint = '/authorization-telegram';
    const data = { telegramId: telegramId };
    return await sendPost(endPoint, data);
}

async function sendPost(endPoint, data) {
    try {
        const response = await fetch(url + endPoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.log(error.message);
    }
}

async function sendPut(endPoint, data) {
    try {
        const response = await fetch(url + endPoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error in sendPut:', {
            url: url + endPoint,
            method: 'PUT',
            error: error.message
        });
        throw error;
    }
}

async function sendPostWithoutResult(endPoint, data) {
    try {
        await fetch(url + endPoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error.message);
    }
}

async function sendGet(endPoint) {
    try {
        const response = await fetch(url + endPoint, {
            method: 'GET'
        });
        return await response.json();
    } catch (error) {
        console.log(error.message);
    }
}

/* Открыть все уже существующие посещаемости (общие).
    lessonId - ид занятия,
Возващает список студентов с ид их состояния и времени пары
[
    {
        "time_date": "2024-11-18T13:40:00.000Z",
        "condition": "Н",
        "name": "Елизавета",
        "lastname": "Перникова",
        "patronymic": "Олеговна"
    },
    {
        "time_date": "2024-11-18T13:40:00.000Z",
        "condition": "Н",
        "name": "Анастасия",
        "lastname": "Кузнецова",
        "patronymic": "Александровна"
    },
]
.*/

export async function openFullAttendance(lessonId) {
    const endPoint = '/open-full-attendance';
    const data = { lessonId: lessonId };
    return await sendPost(endPoint, data);
}

export async function incrementOpenMiniapp(telegramId) {
    const endPoint = '/increment_open_miniapp_count';
    const data = { telegramId: telegramId };
    return await sendPost(endPoint, data);
}

export async function incrementOpenCurrentLesson(telegramId) {
    const endPoint = '/increment_open_current_lesson';
    const data = { telegramId: telegramId };
    return await sendPost(endPoint, data);
}

export async function incrementCurrentAttendance(telegramId) {
    const endPoint = '/increment_currect_attendance';
    const data = { telegramId: telegramId };
    return await sendPost(endPoint, data);
}

export async function getAllLessons(groupId) {
    const endPoint = '/group/lessons';
    const data = { groupId: groupId };
    return await sendPost(endPoint, data);
}

export async function getTeacherTimetable(teacherId) {
    const endPoint = `/teacher/timetable?teacherId=${teacherId}`;
    return await sendGet(endPoint);
}

export async function getTeacherDisciplinesGroups(teacherId) {
    const endPoint = `/teacher/disciplines-groups?teacherId=${teacherId}`;
    return await sendGet(endPoint);
}

export async function getUserRole(telegramId) {
    const endPoint = `/check-role?telegramId=${telegramId}`;
    return await sendGet(endPoint);
}

export async function authTeacher(telegramId) {
    const endPoint = '/authorization-telegram/teacher';
    const data = { telegramId: telegramId };
    return await sendPost(endPoint, data);
}

/// PUT /teacher/attendance/confirm
// query parametr: attendanceId
// Описание: подтверждение уже существующей посещаемости
export async function confirmAttendance(attendanceId) {
    const endPoint = `/teacher/attendance/confirm?attendanceId=${attendanceId}`;
    return await sendPut(endPoint, {});
}