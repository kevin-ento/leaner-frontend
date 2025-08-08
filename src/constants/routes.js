export const routes = {
  login: "/login",
  register: "/register",
  verifyOtp: "/verify-otp",
  forgetPassword: "/forget-password",
  resetPasswordOtp: "/reset-password-otp",
  resetPassword: "/reset-password",

  student: "/dashboard",
  instructor: "/instructor-dashboard",
  admin: "/admin-dashboard",

  myCourses: "/courses",
  allCourses: "/all-courses",
  createCourse: "/create-course",
  editCourse: (id = ":id") => `/edit-course/${id}`,
  courseDetails: (id = ":id") => `/course/${id}`,

  // Sessions
  addSession: "/add-session",
  editSession: (id = ":id") => `/edit-session/${id}`,

  // Profile & Settings
  changePassword: (userId = ":userId") => `/change-password/${userId}`,
  profile: "/profile",

  // Misc
  home: "/",
  notFound: "*",
};
