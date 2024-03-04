import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import { Link } from 'react-router-dom'
import InstructorChart from './InstructorChart'

const Instructor = () => {

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true);
            const InstrcutorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);
            console.log(InstrcutorApiData)

            if (InstrcutorApiData.length)
                setInstructorData(InstrcutorApiData);

            if (result)
                setCourses(result);
            setLoading(false);
        }
        getCourseDataWithStats();
    }, [])

    const {darkMode} = useSelector((state) => state.mode);

    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0);

    return (
        <div>
            <div className="space-y-2 ">
                <h1 className={`text-2xl font-bold ${darkMode ? "text-richblack-5" : "text-richblack-600"}`}>
                    Hi {user?.firstName} 👋
                </h1>
                <p className={`font-medium ${darkMode ? "text-richblack-200" : "text-richblack-400"}`}>
                    Let's start something new
                </p>
            </div>
            {loading ? (
                <div className="spinner"></div>
            ) : courses.length > 0 ? (
                <div>
                    <div className="my-4 flex gap-4 h-[450px] ">
                        {/* Render chart / graph */} 
                        {totalAmount > 0 || totalStudents > 0 ? (
                            <InstructorChart courses={instructorData} />
                        ) : (
                            <div className="flex-1 rounded-md bg-richblack-800 p-6">
                                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                                <p className="mt-4 text-xl font-medium text-richblack-50">
                                    Not Enough Data To Visualize
                                </p>
                            </div>
                        )} 
                        {/* Total Statistics */}
                        <div className={`flex min-w-[250px] flex-col rounded-md ${darkMode ? "bg-richblack-800" : 'bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]'} p-6`}>
                            <p className={`text-lg font-bold ${darkMode ? "text-richblack-5" : "text-richblack-600"}`}>Statistics</p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className={`text-lg ${darkMode ? "text-richblack-200" : "text-richblack-500"}`}>Total Courses</p>
                                    <p className={`text-3xl font-semibold ${darkMode ? "text-richblack-50" : "text-richblack-200"}`}>
                                        {courses.length}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-lg ${darkMode ? "text-richblack-200" : "text-richblack-500"}`}>Total Students</p>
                                    <p className={`text-3xl font-semibold ${darkMode ? "text-richblack-50" : "text-richblack-200"}`}>
                                        {totalStudents}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-lg ${darkMode ? "text-richblack-200" : "text-richblack-500"}`}>Total Income</p>
                                    <p className={`text-3xl font-semibold ${darkMode ? "text-richblack-50" : "text-richblack-200"}`}>
                                        Rs. {totalAmount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-md ${darkMode ? "bg-richblack-800" : "bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]"} p-6`}>
                        {/* Render 3 courses */}
                        <div className="flex items-center justify-between">
                            <p className={` text-lg font-bold ${darkMode ? "text-richblack-5" : "text-richblack-600"} `}>Your Courses</p>
                            <Link to="/dashboard/my-courses">
                                <p className={`text-xs font-semibold  ${darkMode ? "text-yellow-50" : "shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-2 py-2 rounded-md text-richblack-400"}`}>View All</p>
                            </Link>
                        </div>
                        <div className="my-4 flex lg:flex-row flex-col items-start gap-6">
                            {courses.slice(0, 3).map((course) => (
                                <div key={course._id} className="lg:w-1/3 w-full">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="h-[201px] w-full rounded-md object-cover"
                                    />
                                    <div className="mt-3 w-full">
                                        <p className={`text-sm font-medium ${darkMode ? "text-richblack-50" : "text-richblack-500"}`}>
                                            {course.courseName}
                                        </p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <p className="text-xs font-medium text-richblack-300">
                                                {course.studentsEnrolled.length} students
                                            </p>
                                            <p className="text-xs font-medium text-richblack-300">
                                                |
                                            </p>
                                            <p className="text-xs font-medium text-richblack-300">
                                                Rs. {course.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
                    <p className="text-center text-2xl font-bold text-richblack-5">
                        You have not created any courses yet
                    </p>
                    <Link to="/dashboard/add-course">
                        <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                            Create a course
                        </p>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Instructor