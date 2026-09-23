import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Pyq from "./pages/Pyq";
import Syllabus from "./pages/Syllabus";
import Ebooks from "./pages/Ebooks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AIQuestionPaper from "./pages/AIQuestionPaper";
import BranchResources from "./pages/BranchResources";
import StudyAssistant from "./pages/StudyAssistant";
import StudyPlanner from "./pages/StudyPlanner";
import Bookmarks from "./pages/Bookmarks";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Resources */}
        <Route path="/notes" element={<Notes />} />
        <Route path="/pyq" element={<Pyq />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/ebooks" element={<Ebooks />} />

        {/* Branch Resources */}
        <Route
          path="/branch-resources"
          element={<BranchResources />}
        />

        <Route
          path="/branch-resources/:branchId"
          element={<BranchResources />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />

        {/* AI Features */}
        <Route
          path="/ai-question-paper"
          element={<AIQuestionPaper />}
        />

        <Route
          path="/study-assistant"
          element={<StudyAssistant />}
        />

        {/* Study Planner */}
        <Route
          path="/study-planner"
          element={<StudyPlanner />}
        />

        {/* User Features */}
        <Route
          path="/bookmarks"
          element={<Bookmarks />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;