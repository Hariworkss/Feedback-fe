import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './App.css'
import CustomerFeedback from './pages/CustomerFeedback'

function App() {
  const router= createBrowserRouter([
    {
      path:'/',
      element: <CustomerFeedback/>
    },
    
  ])
  return (
    <>
     <RouterProvider router={router} />
    </>
  )
}

export default App
