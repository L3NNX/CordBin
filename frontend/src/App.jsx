import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import SharedFile from "./pages/SharedFile";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Architecture from "./pages/Architecture";
import Security from "./pages/Security";
import Documentation from "./pages/Documentation";
import Status from "./pages/Status";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ProtectedRoute from "./hooks/ProtectedRoute";

function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/dashboard" element={
               <ProtectedRoute>
                 <Dashboard />
               </ProtectedRoute>
            }/>
            <Route path="/shared/:token" element={<SharedFile />} />

              {/* Static Pages */}
  <Route path="/about" element={<About />} />
  <Route path="/architecture" element={<Architecture />} />
  <Route path="/security" element={<Security />} />
  <Route path="/docs" element={<Documentation />} />
  <Route path="/status" element={<Status />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/contact" element={<Contact />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}

export default App;