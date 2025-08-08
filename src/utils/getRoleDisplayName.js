export const getRoleDisplayName = (role) => {
  const roleToName = {
    student: "Student",
    instructor: "Instructor",
    admin: "Administrator",
  };

  const key = (role ?? "").toString().toLowerCase();
  return roleToName[key] || "User";
};
