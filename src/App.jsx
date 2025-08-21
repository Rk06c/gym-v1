
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import  { Suspense, lazy } from 'react'
const Navbar = lazy(() => import('./components/Navbar'));
const MemberTable = lazy(() => import('./components/MemberTable'));
const DeleteHistoryPanel = lazy(() => import('./components/DeleteHistoryPanel'));
//import MemberTable from './components/MemberTable'
//import DeleteHistoryPanel from './components/DeleteHistoryPanel'

function App() {


  return (
    <Router>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                <MemberTable />
                <DeleteHistoryPanel />
              </Suspense>
            }
          />
        </Routes>
      </main>
    </Router>
  )
}

export default App
