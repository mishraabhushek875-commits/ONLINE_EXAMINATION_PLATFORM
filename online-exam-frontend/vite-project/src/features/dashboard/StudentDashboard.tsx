import { LuNotepadText } from "react-icons/lu";
import { FaChartLine } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import AssignedExams from "../../Components/AssignedExams";

const StudentDashboard = () => {
  return (
    <div className="p-8">
      {/* Header */}

      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome, Arsalan 👋</h1>

        <p className="text-gray-600">
          Keep learning, keep growing, you are on the right path to success.
        </p>
      </div>

      {/* Cards */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="flex items-center gap-4 p-6 rounded-xl border border-orange-400 bg-orange-100 hover:shadow-lg transition">
          <div className="p-4 rounded-full bg-orange-500 text-white">
            <LuNotepadText size={32} />
          </div>

          <div>
            <h2 className="text-sm text-gray-600 font-semibold">
              Total Exam Assigned
            </h2>

            <h1 className="text-2xl font-bold">12</h1>

            <p className="text-sm text-gray-600">Go on clear the exams.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-xl border border-blue-400 bg-blue-100 hover:shadow-lg transition">
          <div className="p-4 rounded-full bg-blue-500 text-white">
            <FaChartLine size={32} />
          </div>

          <div>
            <h2 className="text-sm text-gray-600 font-semibold">
              Completed Exams
            </h2>

            <h1 className="text-2xl font-bold">8</h1>

            <p className="text-sm text-gray-600">Excellent, stay consistent.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-xl border border-green-400 bg-green-100 hover:shadow-lg transition">
          <div className="p-4 rounded-full bg-green-500 text-white">
            <LuNotepadText size={32} />
          </div>

          <div>
            <h2 className="text-sm text-gray-600 font-semibold">
              Pending Exams
            </h2>

            <h1 className="text-2xl font-bold">4</h1>

            <p className="text-sm text-gray-600">
              Keep going, you're doing great.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-xl border border-red-400 bg-red-100 hover:shadow-lg transition">
          <div className="p-4 rounded-full bg-red-500 text-white">
            <FaChartLine size={32} />
          </div>

          <div>
            <h2 className="text-sm text-gray-600 font-semibold">
              Average Score
            </h2>

            <h1 className="text-2xl font-bold">80%</h1>

            <p className="text-sm text-gray-600">
              Better score, better opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-green-400 bg-green-100 p-6">
          <h2 className="text-center text-xl font-semibold mb-6">
            Latest Result
          </h2>

          <div className="bg-white rounded-xl p-5 flex gap-6">
            {/* Left Status */}
            <div className="w-1/3 flex flex-col items-center justify-center border-r border-gray-200 pr-6">
              <div className="w-24 h-24 rounded-2xl bg-green-100 border border-green-500 flex items-center justify-center">
                <ImCross className="text-red-500" size={45} />
              </div>

              <span className="mt-4 px-4 py-1 rounded-full bg-red-100 text-red-600 font-semibold">
                Failed
              </span>
            </div>

            {/* Right Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Java Programming
              </h3>

              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div>
                  <p className="text-gray-500">Total Marks</p>
                  <p className="font-semibold">100</p>
                </div>

                <div>
                  <p className="text-gray-500">Obtained Marks</p>
                  <p className="font-semibold text-red-600">32</p>
                </div>

                <div>
                  <p className="text-gray-500">Passing Marks</p>
                  <p className="font-semibold">40</p>
                </div>

                <div>
                  <p className="text-gray-500">Questions</p>
                  <p className="font-semibold">50</p>
                </div>

                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold">60 Minutes</p>
                </div>

                <div>
                  <p className="text-gray-500">Percentage</p>
                  <p className="font-semibold text-red-600">32%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AssignedExams />
      </div>
    </div>
  );
};

export default StudentDashboard;
