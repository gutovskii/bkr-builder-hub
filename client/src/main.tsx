import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loginRoute } from './pages/Login.tsx'
import { registerRoute } from './pages/Register.tsx'
import { componentsListPageRoute } from './pages/ComponentsListPage.tsx'
import { componentDetailsRoute } from './pages/ComponentDetailsPage.tsx';
import { componentsRoute } from './pages/ComponentsPage.tsx';
import { profileRoute } from './pages/ProfilePage.tsx';
import { createBuildRoute } from './pages/CreateBuildPage.tsx';
import { buildDetailsPageRoute } from './pages/BuildDetailsPage.tsx';
import { buildsListPageRoute } from './pages/BuildsListPage.tsx';
import { buildsCreatedListPageRoute } from './pages/BuildsCreatedListPage.tsx';
import { buildsSavedListPageRoute } from './pages/BuildsSavedListPage.tsx';
import { userPageRoute } from './pages/UserPage.tsx';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([
  indexRoute, 
  loginRoute, 
  profileRoute,
  registerRoute, 
  componentsRoute,
  componentsListPageRoute, 
  componentDetailsRoute,
  createBuildRoute,
  buildsListPageRoute,
  buildsCreatedListPageRoute,
  buildsSavedListPageRoute,
  buildDetailsPageRoute,
  userPageRoute,
])

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if (!localStorage.getItem('build')) localStorage.setItem('build', JSON.stringify({}));

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
