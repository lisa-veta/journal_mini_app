import { AttendanceTable } from "components/index.jsx";

const AttendancePage = ({ students = [], days =[] }) => {
    return (
        <div className="">
            {AttendanceTable}
        </div>
    );
};

export default AttendancePage;