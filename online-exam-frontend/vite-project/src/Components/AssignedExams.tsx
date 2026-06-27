import { Link } from "react-router-dom";
import { FaClock, FaTrophy, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const assigned = [
  {
    id: 1,
    title: "Backend Fundamentals Exam",
    description: "Covers Node.js, Prisma, and PostgreSQL basics.",
    duration: 120,
    passingMarks: 50,
    totalMarks: 100,
  },
  {
    id: 2,
    title: "React.js Advanced",
    description: "Hooks, Context API, React Query and Routing.",
    duration: 90,
    passingMarks: 40,
    totalMarks: 100,
  },
  {
    id: 3,
    title: "Database Management System",
    description: "SQL, Joins, Normalization and Transactions.",
    duration: 60,
    passingMarks: 35,
    totalMarks: 100,
  },
  {
    id: 4,
    title: "Operating Systems",
    description: "Process Scheduling, Memory Management and Deadlocks.",
    duration: 75,
    passingMarks: 40,
    totalMarks: 100,
  },
  {
    id: 5,
    title: "Computer Networks",
    description: "OSI Model, TCP/IP, Routing and Switching.",
    duration: 80,
    passingMarks: 45,
    totalMarks: 100,
  },
];

const AssignedExams = () => {
  return (
    <div className="rounded-2xl border border-orange-400 bg-orange-100 p-6 h-full">
      <h2 className="text-center text-xl font-semibold mb-6">Assigned Exams</h2>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-thin">
        <div className="flex gap-4 w-max">
          {assigned.map((test) => (
            <div
              key={test.id}
              className="w-[520px] flex-shrink-0 rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg transition"
            >
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {test.title}
              </h3>

              {/* Description */}
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {test.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="rounded-lg bg-orange-50 p-3 text-center">
                  <FaClock className="mx-auto text-orange-500 mb-2" />
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold">{test.duration} min</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <FaTrophy className="mx-auto text-blue-500 mb-2" />
                  <p className="text-xs text-gray-500">Total Marks</p>
                  <p className="font-semibold">{test.totalMarks}</p>
                </div>

                <div className="rounded-lg bg-green-50 p-3 text-center">
                  <FaCheckCircle className="mx-auto text-green-500 mb-2" />
                  <p className="text-xs text-gray-500">Passing Marks</p>
                  <p className="font-semibold">{test.passingMarks}</p>
                </div>
              </div>

              {/* Button */}
              <Link
                to={`/my-exams/${test.id}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-white font-medium hover:bg-green-600 transition"
              >
                See Details
                <FaArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignedExams;
