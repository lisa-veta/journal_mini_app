import { useNavigate } from "react-router-dom";
import "./SchedulePage.css"
const SchedulePage = ({ students = [], days =[] }) => {
    const navigate = useNavigate();

    const handleSubjectClick = (subjectId) => {
        navigate(`/attendance/${subjectId}`);
    };
    return (
        <div className="schedulePage">
            <div className="schedulePage__subject" onClick={() => handleSubjectClick(1)}>
                Английский
            </div>
        </div>
    );
};

export default SchedulePage;