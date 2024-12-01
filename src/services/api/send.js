/* Привязка к html элементам */
//const responseDiv = document.getElementById('response');
//const btnDudes = document.getElementById('dudes');
//const btnAuthorization = document.getElementById('authorization');
//const btnCreateAttendance = document.getElementById('createAttendance');
//const btnOpenAttendance = document.getElementById('openAttendance');
//const btnDoneAttendance = document.getElementById('doneAttendance');
//const btnTimeTable = document.getElementById('timetable');
//const btnStudents = document.getElementById('students');

/* URL сервера */
const url = 'http://185.104.249.229:3000';

/* Простой запрос get. Возвращается текст dudes. */
async function getDudes() {
    const endPoint = '/dudes';
    sendGet(endPoint);
}

/* Авторизация. Если всё ок, то 200 и все о старосте
[
{
"id": 5,
"nickname": "headman-PrI-301",
"password": "headman",
"name": "Калентьев",
"lastname": "Дмитрий",
"patronymic": "Евгеньевич",
"is_headman": true,
"id_group": 5
}
]
. Иначе ошибка 404. */

async function authorization(nick, password) {
    const endPoint = '/authorization';
    const data = { email: nick, password: password };
    sendPost(endPoint, data);
}

/* Создать новую посещаемость (общую).
    classId - ид пары,
    timedate - дата пары и время начала пары, формат 2024-11-18 16:40:00
Возващает id посещаемости (общей).*/
async function createAttendance(classId, timedate) {
    const endPoint = '/create-attendance';
    const data = { classId: classId, timedate: timedate };
    sendPost(endPoint, data);
}

/* Открыть уже существующую посещаемость (общую).
    classId - ид пары,
    timedate - дата пары и время начала пары, формат 2024-11-18 16:40:00
Возващает список студентов с ид их состояния
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
async function openAttendance(classId, timedate) {
    const endPoint = '/open-attendance';
    const data = { classId: classId, timedate: timedate };
    sendPost(endPoint, data);
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
async function doneAttendance(attendanceId, students) {
    const endPoint = '/attendancedone';
    const data = { attendanceId: attendanceId, students: students };
    sendPostWithoutResult(endPoint, data);
    displayResponse("good maybe");
}

/* Расписание.  ДОБАВИТЬ
    groupId - ид группы,
Возващает
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

async function sendPost(endPoint, data) {
    try {
        const response = await fetch(url + endPoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        const jsonData = await response.json();
        //console.log(jsonData);
        return jsonData;
    } catch (error) {
        console.log(error.message);
        //displayResponse({ error: error.message });
    }
}

async function sendPostWithoutResult(endPoint, data) {
    try {
        const response = await fetch(url + endPoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
    } catch (error) {
        displayResponse({ error: error.message });
    }
}

async function sendGet(endPoint) {
    try {
        const response = await fetch(url + endPoint, {
                method: 'GET',
            });
            const jsonData = await response.json();
            displayResponse(jsonData);
    } catch (error) {
        displayResponse({ error: error.message });
    }
}

/* Вывод на экран результата */
function displayResponse(data) {
  //responseDiv.innerText = JSON.stringify(data, null, 2);
}

/* Привязка кнопок к методам */
//btnDudes.addEventListener('click', getDudes);
//btnAuthorization.addEventListener('click', () => authorization('headman-PrI-301', 'headman'));
//btnCreateAttendance.addEventListener('click', () => createAttendance(1, '2024-11-18 17:40:00'));
//btnOpenAttendance.addEventListener('click', () => openAttendance(1, '2024-11-18 16:40:00'));
//btnDoneAttendance.addEventListener('click', () => doneAttendance(88, [{"condition": 1,"id": 5},{"condition": 2,"id": 6}]));
//btnTimeTable.addEventListener('click', () => timeTable(5));
//btnStudents.addEventListener('click', () => students(5));