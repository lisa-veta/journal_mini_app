import "./SchedulePage.css"
import { Schedule } from "components/index.jsx";
import { useEffect, useState } from 'react';
import { ScheduleService } from '../../services/scheduleService/ScheduleService.js';
import {Button, Icon, ThemeProvider} from '@gravity-ui/uikit';
import {ArrowDownToLine} from '@gravity-ui/icons';
import {getAllLessons} from "../../services/api/send";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import styled from "styled-components";
import {useSelector} from "react-redux";

const DownloadButton = styled(Button)`
    margin-right: 1rem;
`

const SchedulePage = (props) => {
    const [allLessons, setAllLessons] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [weeks, setWeeks] = useState([
        { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
        { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
    ]);
    const userRole = useSelector((state) => state.userRole);

    useEffect(() => {
        (() => {
            try {
                const parsedData = props.schedule;

                const tempSchedule = {
                    weeks: [
                        { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
                        { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
                    ]
                };

                for (let i = 0; i < parsedData.length; i++) {
                    let dayIndex = new ScheduleService().GetWeekDayIndex(parsedData[i].week_day);
                    let weekIndex = parsedData[i].number_week - 1;

                    tempSchedule.weeks[weekIndex].days[dayIndex].day_number = dayIndex + 1;
                    if(userRole === 'student') {
                        tempSchedule.weeks[weekIndex].days[dayIndex].subjects.push(
                            {
                                name: parsedData[i].lesson,
                                id_lesson: parsedData[i].id_lesson,
                                room: parsedData[i].classroom,
                                teachers: parsedData[i]?.teachers.map(t => t),
                                type_id: (parsedData[i].type_lesson === "Лекция") ? 1 :
                                    (parsedData[i].type_lesson === "Практика") ? 2 :
                                        (parsedData[i].type_lesson === "Лабораторная работа") ? 3 : 4,
                                start_time: parsedData[i].lesson_start_time,
                                end_time: parsedData[i].lesson_end_time,
                                id: parsedData[i].id
                            }
                        );
                    } else {
                        tempSchedule.weeks[weekIndex].days[dayIndex].subjects.push(
                            {
                                name: parsedData[i].lesson,
                                id_lesson: parsedData[i].id_lesson,
                                room: parsedData[i].classroom,
                                group_id: parsedData[i].group_id,
                                group_name: parsedData[i].abbr_group,
                                type_id: (parsedData[i].type_lesson === "Лекция") ? 1 :
                                    (parsedData[i].type_lesson === "Практика") ? 2 :
                                        (parsedData[i].type_lesson === "Лабораторная работа") ? 3 : 4,
                                start_time: parsedData[i].lesson_start_time,
                                end_time: parsedData[i].lesson_end_time,
                                id: parsedData[i].id
                            }
                        );
                    }
                }
                setWeeks(tempSchedule.weeks);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [props.schedule, userRole]);

    useEffect(() => {
        if(userRole === 'teacher') {
            return;
        }
        (async() => {
            try {
                const lessons = await getAllLessons(props.groupId);
                setAllLessons(lessons[0].get_lessons_by_group);
            }
            catch (error) {
                console.error(error);
            }
        })();
    }, [userRole]);

    if(userRole === 'student') {
        return (
            <div className="schedule-content">
                <ThemeProvider theme={'light'}>
                    <ModalWindow open={openModal}
                                 setOpen={setOpenModal}
                                 lessons={allLessons}
                                 groupId={props.groupId} />
                </ThemeProvider>
                <div className={'header'}>
                    <h1 className='schedule-header schedule-header_position'>Расписание</h1>
                    <DownloadButton view="outlined"
                                    size="l"
                                    onClick={() => setOpenModal(true)}>
                        <Icon data={ArrowDownToLine} size={18}/>
                        Скачать посещаемость
                    </DownloadButton>
                </div>

                <Schedule weeks={weeks}
                          groupId={props.groupId}
                          date={props.date}
                          schedule={props.schedule}
                          telegramId={props.telegramId}>
                </Schedule>
            </div>
        );
    }

    return (
        <div className="schedule-content">
            <div className={'header'}>
                <h1 className='schedule-header schedule-header_position'>Расписание</h1>
            </div>

            <Schedule weeks={weeks}
                      date={props.date}
                      schedule={props.schedule}
                      telegramId={props.telegramId}>
            </Schedule>
        </div>
    );
};
export default SchedulePage;