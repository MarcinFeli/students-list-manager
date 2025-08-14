const routes = [
  {
    path: "/",
    redirect: "/students",
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "students",
        name: "students",
        component: () => import("pages/StudentsPage.vue"),
      },
      {
        path: "classes",
        name: "classes",
        component: () => import("pages/ClassesPage.vue"),
      },
      {
        path: "classes/:id",
        name: "class-details",
        props: true,
        component: () => import("pages/ClassDetailsPage.vue"),
      },
    ],
  },
];

export default routes;
