import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const AlbumManager = lazy(() => import("./pages/AlbumManager"));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <AlbumManager />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
