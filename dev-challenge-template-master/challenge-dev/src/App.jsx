import './App.css'
import { createBrowserRouter, RouterProvider, Link, Route } from 'react-router-dom'
import Homepage from './components/homepage.jsx'
import CardDetail from './components/cardDetail.jsx'
import ErrorPage from './components/errorPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/detail/:id',
    element: <CardDetail />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])

function App() {
  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App
