import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaClipboardList,
  FaTrophy,
  FaCheckCircle,
  FaBookOpen,
  FaPlayCircle,
} from "react-icons/fa";

const ExamDetail = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/my-exams"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
        >
          <FaArrowLeft />
          Back to My Exams
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Backend Fundamentals Exam
              </h1>

              <p className="text-gray-500 mt-2">
                Test your understanding of Node.js, Express.js, Prisma ORM,
                PostgreSQL and REST APIs.
              </p>
            </div>

            <div>
              <span className="px-5 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">
                Assigned
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <div className="rounded-xl bg-orange-100 border border-orange-300 p-5 text-center">
            <FaClock className="mx-auto text-orange-500 text-3xl mb-3" />
            <p className="text-gray-600 text-sm">Duration</p>
            <h2 className="text-2xl font-bold">120 Min</h2>
          </div>

          <div className="rounded-xl bg-blue-100 border border-blue-300 p-5 text-center">
            <FaClipboardList className="mx-auto text-blue-500 text-3xl mb-3" />
            <p className="text-gray-600 text-sm">Questions</p>
            <h2 className="text-2xl font-bold">50</h2>
          </div>

          <div className="rounded-xl bg-green-100 border border-green-300 p-5 text-center">
            <FaTrophy className="mx-auto text-green-500 text-3xl mb-3" />
            <p className="text-gray-600 text-sm">Total Marks</p>
            <h2 className="text-2xl font-bold">100</h2>
          </div>

          <div className="rounded-xl bg-red-100 border border-red-300 p-5 text-center">
            <FaCheckCircle className="mx-auto text-red-500 text-3xl mb-3" />
            <p className="text-gray-600 text-sm">Passing Marks</p>
            <h2 className="text-2xl font-bold">40</h2>
          </div>
        </div>

        {/* Description + Topics */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Exam Description
            </h2>

            <p className="text-gray-600 leading-7">
              This examination evaluates your backend development skills using
              Node.js, Express.js, Prisma ORM and PostgreSQL. The questions
              include theory, coding concepts, REST APIs, authentication,
              database operations and real-world backend scenarios.
            </p>
          </div>

          {/* Topics */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Topics Covered
            </h2>

            <div className="flex flex-wrap gap-3">
              {[
                "Node.js",
                "Express.js",
                "Prisma ORM",
                "PostgreSQL",
                "REST API",
                "Authentication",
                "JWT",
                "Middleware",
              ].map((topic) => (
                <span
                  key={topic}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium"
                >
                  <FaBookOpen />
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Instructions
          </h2>

          <ul className="space-y-4 text-gray-600">
            <li>✅ Total duration of the examination is 120 minutes.</li>

            <li>✅ There are 50 multiple-choice questions.</li>

            <li>✅ Each question carries equal marks.</li>

            <li>✅ No negative marking.</li>

            <li>✅ You cannot pause the examination once started.</li>

            <li>✅ Make sure you have a stable internet connection.</li>

            <li>✅ Do not refresh or close the browser window.</li>

            <li>✅ Click "Submit Exam" before the timer ends.</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition">
            <FaPlayCircle size={20} />
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
