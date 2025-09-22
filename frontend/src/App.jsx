import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BatPixelLoader } from '@/components/BatPixelLoader';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateRepository = lazy(() => import("./pages/CreateRepository"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Users = lazy(() => import("./pages/Users"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Repositories = lazy(() => import("./pages/Repositories"));
const MyRepositories = lazy(() => import("./pages/MyRepositories"));
const RepositoryDetails = lazy(() => import("./pages/RepositoryDetails"));
const EditRepository = lazy(() => import("./pages/EditRepository"));
const RepositoryIssues = lazy(() => import("./pages/RepositoryIssues"));
const IssueDetails = lazy(() => import("./pages/IssueDetails"));
const CreateIssue = lazy(() => import("./pages/CreateIssue"));
const EditIssue = lazy(() => import("./pages/EditIssue"));
const Support = lazy(() => import("./pages/Support"));
const Issues = lazy(() => import("./pages/Issues"));
const StarredRepositories = lazy(() => import("./pages/StarredRepositories"));
const UserFollowers = lazy(() => import("./pages/UserFollowers"));
const UserFollowing = lazy(() => import("./pages/UserFollowing"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const CLIDocumentation = lazy(() => import("./pages/CLIDocumentation"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <BatPixelLoader 
      size={3} 
      speed={0.5} 
      text="Loading BitBranch..." 
      className="text-center"
    />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/support" element={<Support />} />
                <Route path="/cli" element={<CLIDocumentation />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/repository/new" element={<ProtectedRoute><CreateRepository /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                
                {/* User Management Routes */}
                <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                <Route path="/users/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/users/:id/followers" element={<ProtectedRoute><UserFollowers /></ProtectedRoute>} />
                <Route path="/users/:id/following" element={<ProtectedRoute><UserFollowing /></ProtectedRoute>} />
                
                {/* Repository Management Routes */}
                <Route path="/repositories" element={<ProtectedRoute><Repositories /></ProtectedRoute>} />
                <Route path="/repos" element={<ProtectedRoute><Repositories /></ProtectedRoute>} />
                <Route path="/repos/my" element={<ProtectedRoute><MyRepositories /></ProtectedRoute>} />
                <Route path="/repos/starred" element={<ProtectedRoute><StarredRepositories /></ProtectedRoute>} />
                <Route path="/repos/:id" element={<ProtectedRoute><RepositoryDetails /></ProtectedRoute>} />
                <Route path="/repos/:id/edit" element={<ProtectedRoute><EditRepository /></ProtectedRoute>} />
                <Route path="/repos/:name/:owner" element={<ProtectedRoute><RepositoryDetails /></ProtectedRoute>} />
                
                {/* Issues System Routes */}
                <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
                <Route path="/issues/create" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
                <Route path="/repos/:id/issues" element={<ProtectedRoute><RepositoryIssues /></ProtectedRoute>} />
                <Route path="/repos/:id/issues/create" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
                <Route path="/issues/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
                <Route path="/issues/:id/edit" element={<ProtectedRoute><EditIssue /></ProtectedRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
