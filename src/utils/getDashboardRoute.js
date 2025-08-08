import { routes } from "../constants/routes";
export const getDashboardLink = (user) => {
  const roleToPath = {
    student: routes.student,
    instructor: routes.instructor,
    admin: routes.admin,
  };

  return roleToPath[user?.role] || routes.home;
};
