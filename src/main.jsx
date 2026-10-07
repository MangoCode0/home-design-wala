import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import "./index.css";
import "./admin/admin.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminApp.Login />} />
        <Route path="/admin" element={<AdminApp.Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminApp.Dashboard />} />
          <Route path="projects" element={<AdminApp.Projects />} />
          <Route path="projects/new" element={<AdminApp.ProjectForm />} />
          <Route path="projects/:id" element={<AdminApp.ProjectDetails />} />
          <Route path="projects/:id/edit" element={<AdminApp.ProjectForm />} />
          <Route path="enquiries" element={<AdminApp.Enquiries />} />
          <Route path="services" element={<AdminApp.Services />} />
          <Route path="categories" element={<AdminApp.Categories />} />
          <Route path="settings" element={<AdminApp.Settings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
