import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import Quiz from "./pages/Quiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/notes" element={<Notes />} />
        <Route path="/pyq" element={<Pyq />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/ebooks" element={<Ebooks />} />

        <Route path="/branch-resources" element={<BranchResources />} />
        <Route path="/branch-resources/:branchId" element={<BranchResources />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/ai-question-paper" element={<AIQuestionPaper />} />
        <Route path="/study-assistant" element={<StudyAssistant />} />
        <Route path="/study-planner" element={<StudyPlanner />} />

        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz" element={<Quiz />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;