/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Datasets from "./pages/Datasets";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Playground from "./pages/Playground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingBot from "./components/FloatingBot";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen text-slate-900 font-sans selection:bg-purple-500/30 transition-colors duration-300 bg-slate-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/datasets" element={<Datasets />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/playground" element={<Playground />} />
              </Routes>
            </main>
            <Footer />
            <FloatingBot />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
