import "./SchedulePage.css"
import { Navigation, Schedule } from "components/index.jsx";
import { timeTable } from '../../services/api/send.js';
import { useEffect, useState } from 'react';
import { IsLessonCurrent, GetWeekDayIndex } from '../../services/schedule/ScheduleService.js';
import { CurrentTime } from '../../services/api/timeApi.js';

const SchedulePage = (props) => {

    const [weeks, setWeeks] = useState(
        [
            { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
            { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
        ]
    );

    useEffect(() => {
        (async () => {
            try {
                const data = await timeTable(props.groupId);
                const parsedData = JSON.parse(JSON.stringify(data));
                //console.log('ответ с сервера', JSON.stringify(data));

                const tempSchedule = {
                    weeks: [
                        { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
                        { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
                    ]
                };

                for (let i = 0; i < parsedData.length; i++) {
                    let dayIndex = GetWeekDayIndex(parsedData[i].week_day);
                    let weekIndex = parsedData[i].number_week - 1;

                    tempSchedule.weeks[weekIndex].days[dayIndex].day_number = dayIndex + 1;

                    tempSchedule.weeks[weekIndex].days[dayIndex].subjects.push(
                            {
                                name: parsedData[i].lesson,
                                id_lesson: parsedData[i].id_lesson,
                                room: parsedData[i].classroom,
                                teachers: parsedData[i].teachers,
                                type_id: (parsedData[i].type_lesson === "Лекция") ? 1 :
                                    (parsedData[i].type_lesson === "Практика") ? 2 :
                                        (parsedData[i].type_lesson === "Лабораторная работа") ? 3 : 4,
                                //building_id: 1,
                                start_time: parsedData[i].lesson_start_time,
                                end_time: parsedData[i].lesson_end_time,
                                id: parsedData[i].id
                            }
                    );
                }
                
                setWeeks(tempSchedule.weeks);
                //IsLessonCurrent(7);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

//    useEffect(() => {setSchedule(
//        {
//            "weeks": [
//                {
//                    "is_even": false,
//                    "days": [
//                        {
//                            "day_number": 1,
//                            "subjects": [
//                                {
//                                    "name": "матанализ",
//                                    "room": "666",
//                                    "teacher": "мегуминова",
//                                    "type_id": 1,
//                                    "building_id": 1,
//                                    "start_time": "08:00",
//                                    "end_time": "15:00"
//                                },
//                                {
//                                    "name": "матанализ",
//                                    "room": "666",
//                                    "teacher": "мегуминова",
//                                    "type_id": 2,
//                                    "building_id": 1,
//                                    "start_time": "15:10",
//                                    "end_time": "21:20"
//                                }
//                            ]
//                        },
//                        {
//                            "day_number": 2,
//                            "subjects": [
//                                {
//                                    "name": "123",
//                                    "room": "уаааа",
//                                    "teacher": "534534",
//                                    "type_id": 1,
//                                    "building_id": 5,
//                                    "start_time": "08:00",
//                                    "end_time": "14:55"
//                                }
//                            ]
//                        },
//                        {
//                            "day_number": 3,
//                            "subjects": [
//                                {
//                                    "name": "среда чуваки",
//                                    "room": "777",
//                                    "teacher": "boba",
//                                    "type_id": 1,
//                                    "building_id": 3,
//                                    "start_time": "08:00",
//                                    "end_time": "21:20"
//                                }
//                            ]
//                        },
//                        {
//                            "day_number": 4,
//                            "subjects": [
//                                {
//                                    "name": "ggg",
//                                    "room": "ggg",
//                                    "teacher": "gggg",
//                                    "type_id": 2,
//                                    "building_id": 1,
//                                    "start_time": "15:00",
//                                    "end_time": "15:30"
//                                }
//                            ]
//                        },
//                        {
//                            "day_number": 5,
//                            "subjects": []
//                        },
//                        {
//                            "day_number": 6,
//                            "subjects": []
//                        }
//                    ]
//                },
//                {
//                    "is_even": true,
//                    "days": [
//                        {
//                            "day_number": 1,
//                            "subjects": []
//                        },
//                        {
//                            "day_number": 2,
//                            "subjects": []
//                        },
//                        {
//                            "day_number": 3,
//                            "subjects": []
//                        },
//                        {
//                            "day_number": 4,
//                            "subjects": []
//                        },
//                        {
//                            "day_number": 5,
//                            "subjects": [
//                                {
//                                    "name": "aaaaaaaaaaaa",
//                                    "room": "4234234324",
//                                    "teacher": "aaaaaaaaaaa",
//                                    "type_id": 1,
//                                    "building_id": 2,
//                                    "start_time": "10:00",
//                                    "end_time": "20:30"
//                                },
//                                {
//                                    "name": "Add title",
//                                    "room": "",
//                                    "teacher": "",
//                                    "type_id": 2,
//                                    "building_id": 2,
//                                    "start_time": "10:00",
//                                    "end_time": "21:00"
//                                }
//                            ]
//                        },
//                        {
//                            "day_number": 6,
//                            "subjects": []
//                        }
//                    ]
//                }
//            ]
//        });
//}, []);

    return (
        <div className="schedule-content">
            <h1 className='schedule-header schedule-header_position'>Расписание</h1>
            <Schedule weeks={weeks} groupId={props.groupId} date={props.date}></Schedule>
            {/*<Navigation></Navigation>*/}
        </div >
    );
};
export default SchedulePage;