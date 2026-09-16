// client/src/App.jsx
//
// Defines Inkwell's information architecture (Section 5.1) as routes.
// This file's only job is routing + layout — no business logic here,
// the same "thin top layer" discipline we applied to server/src/index.js
// in Lecture 5.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Feed } from "./components/Feed";
import { PostEditor } from "./components/PostEditor";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/write" element={<PostEditor />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

