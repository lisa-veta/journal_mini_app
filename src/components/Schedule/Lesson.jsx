import { useNavigate } from "react-router-dom";
function Lesson(props) {
    const navigate = useNavigate();

    let lessonType;
    switch (props.lesson.type_id) {
        case 1:
            lessonType = 'Лекция';
            break;
        case 2:
            lessonType = 'Практика';
            break;
        case 3:
            lessonType = 'Лабораторная работа';
            break;
        default:
            lessonType = 'Другое'
    }

    const handleSubjectClick = () => {
        console.log(JSON.stringify(props));
        navigate(`/attendance/${props.lesson.id}`, { state: { lesson: props.lesson } });
     };
    return (
        <div className='lesson-container' onClick={() => handleSubjectClick()}>
            <div className='time-container'>
                <div className='lesson-time-start'>{props.lesson.start_time.slice(0, 5)}</div>
                <div className='lesson-time-end'>{props.lesson.end_time.slice(0, 5)}</div>
            </div>

            <div className='lesson-info-container'>
                <div className='lesson-info-row'>
                    <div className='lesson-name'>{props.lesson.name}</div>
                    <div className='lesson-teacher'>{props.lesson.teacher_lastName}</div>
                </div>
                <div className='lesson-room-and-type'>{props.lesson.room}, {lessonType}</div>
            </div>
        </div>
    );
}

export default Lesson;