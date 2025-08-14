// src/stores/school.js
import { defineStore } from "pinia";
import { StudentsAPI, ClassesAPI } from "src/services/api";

const toStudent = (r) => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  classId: r.class_id,
});
const toClass = (r) => ({ id: r.id, name: r.name });

export const useSchoolStore = defineStore("school", {
  state: () => ({
    students: [],
    classes: [],
    loading: false,
  }),

  getters: {
    classById: (state) => (id) =>
      state.classes.find((c) => c.id == id) || null,
    studentsByClassId: (state) => (classId) =>
      state.students.filter((s) => s.classId == classId),
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const [clsRes, stuRes] = await Promise.all([
          ClassesAPI.list(),
          StudentsAPI.list(),
        ]);
        this.classes = clsRes.data.map(toClass);
        this.students = stuRes.data.map(toStudent);
      } catch (e) {
        console.error("fetchAll error", e);
      } finally {
        this.loading = false;
      }
    },

    async addClass(name) {
      const trimmed = name?.trim();
      if (!trimmed) return;
      const res = await ClassesAPI.create({ name: trimmed });
      const created = res.data?.[0];
      if (created) this.classes.push(toClass(created));
    },

    async removeClass(classId) {
      await StudentsAPI.unassignAllInClass(classId);
      await ClassesAPI.remove(classId);
      this.students = this.students.map((s) =>
        s.classId === classId ? { ...s, classId: null } : s
      );
      this.classes = this.classes.filter((c) => c.id != classId);
    },

    async addStudent({ firstName, lastName, classId = null }) {
      const f = firstName?.trim();
      const l = lastName?.trim();
      if (!f || !l) return;

      const res = await StudentsAPI.create({
        first_name: f,
        last_name: l,
        class_id: classId,
      });
      const created = res.data?.[0];
      if (created) this.students.push(toStudent(created));
    },

    async assignStudentToClass(studentId, classId) {
      const res = await StudentsAPI.patch(studentId, { class_id: classId });
      const updated = res.data?.[0];
      if (!updated) return;
      const idx = this.students.findIndex((s) => s.id === studentId);
      if (idx !== -1) this.students[idx] = toStudent(updated);
    },

    async unassignStudentFromClass(studentId) {
      const res = await StudentsAPI.patch(studentId, { class_id: null });
      const updated = res.data?.[0];
      if (!updated) return;
      const idx = this.students.findIndex((s) => s.id === studentId);
      if (idx !== -1) this.students[idx] = toStudent(updated);
    },

    async removeStudent(studentId) {
      await StudentsAPI.remove(studentId);
      this.students = this.students.filter((s) => s.id !== studentId);
    },
  },
});
