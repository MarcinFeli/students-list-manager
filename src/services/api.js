import { api } from "boot/axios";

export const StudentsAPI = {
  list: () => api.get("/students?select=*"),
  create: (data) => api.post("/students", data),
  patch: (id, data) => api.patch(`/students?id=eq.${id}`, data),
  remove: (id) => api.delete(`/students?id=eq.${id}`),
  unassignAllInClass: (classId) =>
    api.patch(`/students?class_id=eq.${classId}`, { class_id: null }),
};

export const ClassesAPI = {
  list: () => api.get("/classes?select=*"),
  create: (data) => api.post("/classes", data),
  patch: (id, data) => api.patch(`/classes?id=eq.${id}`, data),
  remove: (id) => api.delete(`/classes?id=eq.${id}`),
};
