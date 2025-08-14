import { routes } from "../constants/routes";

export const getQuickLinks = (user) => {
  if (!user) return [];

  const baseLinks = [{ label: "Profile", path: routes.profile, icon: "👤" }];

  switch (user.role) {
    case "student":
      return [
        { label: "Dashboard", path: routes.student, icon: "📊" },
        { label: "My Courses", path: routes.myCourses, icon: "📚" },
        { label: "Browse Courses", path: routes.allCourses, icon: "🌐" },
        ...baseLinks,
      ];
    case "instructor":
      return [
        { label: "Dashboard", path: routes.instructor, icon: "📊" },
        { label: "Create Course", path: routes.createCourse, icon: "➕" },
        { label: "Add Session", path: routes.addSession, icon: "🎥" },
        ...baseLinks,
      ];
    case "admin":
      return [
        { label: "Dashboard", path: routes.admin, icon: "📊" },
        ...baseLinks,
      ];
    default:
      return baseLinks;
  }
};
