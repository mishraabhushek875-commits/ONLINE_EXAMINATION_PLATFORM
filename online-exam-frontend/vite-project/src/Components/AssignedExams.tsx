import { Link } from "react-router-dom";
import { FaClock, FaTrophy, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useMyAssignedExams } from "../hooks/useExam";

const AssignedExams = () => {
  const { data, isLoading } = useMyAssignedExams();
  const assigned = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white bg-white/80 p-6 text-center text-gray-500 shadow-sm backdrop-blur-xl">
        Loading...
      </div>
    );
  }

  if (assigned.length === 0) {
    return (
      <div className="rounded-2xl border border-white bg-white/80 p-8 text-center text-gray-500 shadow-sm backdrop-blur-xl">
        Abhi koi exam assign nahi hua hai.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
      <div className="flex gap-4 w-max">
        {assigned.map((test) => (
          <div
            key={test.id}
            className="w-[300px] sm:w-[360px] flex-shrink-0 rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-gray-800 leading-snug">
                {test.title}
              </h3>
            </div>

            <p className="mt-1 mb-4 text-sm text-gray-500 line-clamp-2">
              {test.description ?? "No description provided."}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-orange-50 p-2.5 text-center">
                <FaClock className="mx-auto text-orange-500 mb-1" size={14} />
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm font-bold text-orange-600">
                  {test.duration}m
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-center">
                <FaTrophy className="mx-auto text-blue-500 mb-1" size={14} />
                <p className="text-xs text-gray-400">Marks</p>
                <p className="text-sm font-bold text-blue-600">
                  {test.totalMarks}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-center">
                <FaCheckCircle
                  className="mx-auto text-emerald-500 mb-1"
                  size={14}
                />
                <p className="text-xs text-gray-400">Passing</p>
                <p className="text-sm font-bold text-emerald-600">
                  {test.passingMarks}
                </p>
              </div>
            </div>

            <Link
              to={`/my-exams/${test.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              See Details
              <FaArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedExams;
