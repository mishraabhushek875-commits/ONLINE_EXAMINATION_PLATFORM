import { Link } from "react-router-dom";
import { FaClock, FaCalendarAlt, FaTrophy, FaArrowRight } from "react-icons/fa";

const exams = [
  {
    id: 1,
    title: "Backend Fundamentals",
    description: "Node.js, Express, Prisma & PostgreSQL",
    duration: 120,
    totalMarks: 100,
    passingMarks: 50,
    questions: 50,
    status: "Assigned",
  },
  {
    id: 2,
    title: "React.js Advanced",
    description: "Hooks, Context API & React Query",
    duration: 90,
    totalMarks: 100,
    passingMarks: 40,
    questions: 40,
    status: "Assigned",
  },
  {
    id: 3,
    title: "Operating Systems",
    description: "Scheduling & Memory Management",
    duration: 60,
    totalMarks: 100,
    passingMarks: 35,
    questions: 30,
    status: "Completed",
  },
  {
    id: 4,
    title: "Computer Networks",
    description: "OSI, TCP/IP & Routing",
    duration: 75,
    totalMarks: 100,
    passingMarks: 40,
    questions: 35,
    status: "Upcoming",
  },
];

const MyExams = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Exams</h1>
          <p className="text-gray-500 mt-2">
            View all your assigned, upcoming and completed exams.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition"
            >
              {/* Status */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    exam.status === "Assigned"
                      ? "bg-orange-100 text-orange-600"
                      : exam.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {exam.status}
                </span>

                <FaCalendarAlt className="text-gray-400" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold">{exam.title}</h2>

              <p className="text-gray-500 text-sm mt-2">{exam.description}</p>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    {exam.duration} min
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="font-semibold">{exam.questions}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total Marks</p>
                  <p className="font-semibold flex items-center gap-2">
                    <FaTrophy className="text-blue-500" />
                    {exam.totalMarks}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Passing Marks</p>
                  <p className="font-semibold">{exam.passingMarks}</p>
                </div>
              </div>

              {/* Button */}
              <Link
                to={`/my-exams/${exam.id}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-white font-medium hover:bg-green-600 transition"
              >
                View Details
                <FaArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyExams;
