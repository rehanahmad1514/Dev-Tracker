import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { IssuesProvider } from './context/IssuesContext';
import { SocketProvider } from './context/SocketContext';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Issues from './pages/Issues';
import CreateProjectPage from './pages/CreateProjectPage';
import CreateIssuePage from './pages/CreateIssuePage';
import Reports from './pages/Reports';

// element={<ProjectsProvider><MainLayout /></ProjectsProvider>}

function App() {
  return (
    <Router>
       <AuthProvider>
        <SocketProvider>
          <ToastContainer />
          <Routes>
            {/* pablic route outside the main layout */}
            <Route path="/" element={<Landing/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Register/>} ></Route>
            
            {/* Protected Routes inside MainLayout, wrapped by ProjectsProvider */}
              <Route element={<ProjectsProvider><MainLayout /></ProjectsProvider>}>
              {/* <Route index element={<MainLayout></MainLayout>}></Route> */}
              <Route path="/dashboard" element={<Dashboard/>}></Route>
              <Route path="/projects" element={<Projects/>}></Route>
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/create-project" element={<CreateProjectPage />} />
              <Route path="/issues" element={<IssuesProvider><Issues /></IssuesProvider>}></Route>
              <Route path="/create-issue" element={<IssuesProvider><CreateIssuePage /></IssuesProvider>} />
              <Route path="/reports" element={<IssuesProvider><Reports /></IssuesProvider>} />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
