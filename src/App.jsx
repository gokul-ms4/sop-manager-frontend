import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SopHeadings from "./pages/SopHeadings";
import AskAI from "./pages/AskAI";
import Layout from "./components/Layout";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

// Shared base style for all toast types — dark card matching the app's
// slate-900 buttons and hero banners, rounded-xl to match card radius.
const baseStyle = {
  background: "#0f172a",       // slate-900
  color: "#f1f5f9",            // slate-100
  borderRadius: "12px",
  fontSize: "13px",
  fontWeight: "500",
  padding: "12px 16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
  maxWidth: "360px",
  lineHeight: "1.5",
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3500,

          // Base applied to every toast; type-specific options below
          // override or extend it.
          style: baseStyle,

          success: {
            style: {
              ...baseStyle,
              borderLeft: "3px solid #059669", // emerald-600
            },
            iconTheme: {
              primary: "#059669",   // emerald-600 checkmark
              secondary: "#0f172a", // slate-900 background circle
            },
          },

          error: {
            duration: 4500,
            style: {
              ...baseStyle,
              borderLeft: "3px solid #ef4444", // red-500
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0f172a",
            },
          },

          loading: {
            style: {
              ...baseStyle,
              borderLeft: "3px solid #64748b", // slate-500
            },
            iconTheme: {
              primary: "#059669",   // emerald spinner
              secondary: "#1e293b", // slate-800 track
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sop-management"
            element={
              <ProtectedRoute>
                <Layout>
                  <SopHeadings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ask-ai"
            element={
              <ProtectedRoute>
                <Layout>
                  <AskAI />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
