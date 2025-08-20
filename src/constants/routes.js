export const routes = {
  login: "/login",
  register: "/register",
  verifyOtp: "/verify-otp",
  forgetPassword: "/forget-password",
  resetPasswordOtp: "/reset-password-otp",
  resetPassword: "/reset-password",

  student: "/dashboard",
  instructor: "/instructor-dashboard",
  instructorWithCourse: (courseId = ":courseId") => `/instructor-dashboard/${courseId}`,
  admin: "/admin-dashboard",

  myCourses: "/courses",
  allCourses: "/all-courses",
  createCourse: "/create-course",
  editCourse: (id = ":id") => `/edit-course/${id}`,
  courseDetails: (id = ":id") => `/course/${id}`,

  // Sessions
  addSession: "/add-session",
  addSessionWithCourse: (courseId = ":courseId") => `/add-session/${courseId}`,
  editSession: (id = ":id") => `/edit-session/${id}`,
  editSessionWithCourse: (sessionId = ":sessionId", courseId = ":courseId") => `/edit-session/${sessionId}/${courseId}`,

  // Profile & Settings
  changePassword: (userId = ":userId") => `/change-password/${userId}`,
  profile: "/profile",

  // Misc
  home: "/",
  notFound: "*",
};
