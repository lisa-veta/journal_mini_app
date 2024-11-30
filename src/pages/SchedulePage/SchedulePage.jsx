//import { useNavigate } from "react-router-dom";
//
// const SchedulePage = ({ students = [], days =[] }) => {
//     const navigate = useNavigate();
//
//     const handleSubjectClick = (subjectId) => {
//         navigate(`/attendance/${subjectId}`);
//     };
//     return (
//         <div className="schedulePage">
//             <div className="schedulePage__subject" onClick={() => handleSubjectClick(1)}>
//                 Английский
//             </div>
//         </div>
//     );
// };
import "./SchedulePage.css"
import {Navigation, Schedule} from "components/index.jsx";

const SchedulePage = ({ students = [], days = [] }) => {

    const schedule =
        {
            "weeks": [
                {
                    "is_even": false,
                    "days": [
                        {
                            "day_number": 1,
                            "subjects": [
                                {
                                    "name": "матанализ",
                                    "room": "666",
                                    "teacher": "мегуминова",
                                    "type_id": 1,
                                    "building_id": 1,
                                    "start_time": "08:00",
                                    "end_time": "15:00"
                                },
                                {
                                    "name": "матанализ",
                                    "room": "666",
                                    "teacher": "мегуминова",
                                    "type_id": 2,
                                    "building_id": 1,
                                    "start_time": "15:10",
                                    "end_time": "21:20"
                                }
                            ]
                        },
                        {
                            "day_number": 2,
                            "subjects": [
                                {
                                    "name": "123",
                                    "room": "уаааа",
                                    "teacher": "534534",
                                    "type_id": 1,
                                    "building_id": 5,
                                    "start_time": "08:00",
                                    "end_time": "14:55"
                                }
                            ]
                        },
                        {
                            "day_number": 3,
                            "subjects": [
                                {
                                    "name": "среда чуваки",
                                    "room": "777",
                                    "teacher": "boba",
                                    "type_id": 1,
                                    "building_id": 3,
                                    "start_time": "08:00",
                                    "end_time": "21:20"
                                }
                            ]
                        },
                        {
                            "day_number": 4,
                            "subjects": [
                                {
                                    "name": "ggg",
                                    "room": "ggg",
                                    "teacher": "gggg",
                                    "type_id": 2,
                                    "building_id": 1,
                                    "start_time": "15:00",
                                    "end_time": "15:30"
                                }
                            ]
                        },
                        {
                            "day_number": 5,
                            "subjects": []
                        },
                        {
                            "day_number": 6,
                            "subjects": []
                        }
                    ]
                },
                {
                    "is_even": true,
                    "days": [
                        {
                            "day_number": 1,
                            "subjects": []
                        },
                        {
                            "day_number": 2,
                            "subjects": []
                        },
                        {
                            "day_number": 3,
                            "subjects": []
                        },
                        {
                            "day_number": 4,
                            "subjects": []
                        },
                        {
                            "day_number": 5,
                            "subjects": [
                                {
                                    "name": "aaaaaaaaaaaa",
                                    "room": "4234234324",
                                    "teacher": "aaaaaaaaaaa",
                                    "type_id": 1,
                                    "building_id": 2,
                                    "start_time": "10:00",
                                    "end_time": "20:30"
                                },
                                {
                                    "name": "Add title",
                                    "room": "",
                                    "teacher": "",
                                    "type_id": 2,
                                    "building_id": 2,
                                    "start_time": "10:00",
                                    "end_time": "21:00"
                                }
                            ]
                        },
                        {
                            "day_number": 6,
                            "subjects": []
                        }
                    ]
                }
            ]
        };

    return (
        <div className="schedule-content">
            <h1 className='schedule-header schedule-header_position'>Расписание</h1>
            <Schedule weeks={schedule.weeks}></Schedule>
            {/*<Navigation></Navigation>*/}

            <div>
                <div className="">
                    Пока
                </div>
            </div >

            <div className="">
                Пока
            </div>
        </div >
    );
};
export default SchedulePage;