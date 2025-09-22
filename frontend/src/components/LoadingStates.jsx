import React from 'react';
import { BatPixelLoader, BatPixelLoaderMini } from '@/components/BatPixelLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Full page loading with bat animation
export function FullPageLoader({ message = "Loading BitBranch..." }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <BatPixelLoader 
        size={3} 
        speed={0.5} 
        text={message}
        className="text-center"
      />
    </div>
  );
}

// Card loading state with bat animation
export function CardLoader({ message = "Loading...", className = "" }) {
  return (
    <Card className={`glass-card border-glass-border/50 ${className}`}>
      <CardContent className="p-8 text-center">
        <BatPixelLoader 
          size={2} 
          speed={0.4} 
          text={message}
          className="text-center"
        />
      </CardContent>
    </Card>
  );
}

// Inline loader for buttons and small components
export function InlineLoader({ size = 1, className = "" }) {
  return (
    <BatPixelLoaderMini className={`inline-block ${className}`} />
  );
}

// Repository list skeleton with bat loader
export function RepositoryListLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-8">
        <BatPixelLoader 
          size={2} 
          speed={0.4} 
          text="Loading repositories..."
          className="text-center"
        />
      </div>
      
      {/* Skeleton cards */}
      {[1, 2, 3].map(i => (
        <Card key={i} className="glass-card border-glass-border/50 animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Issue list skeleton with bat loader
export function IssueListLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-8">
        <BatPixelLoader 
          size={2} 
          speed={0.4} 
          text="Loading issues..."
          className="text-center"
        />
      </div>
      
      {/* Skeleton cards */}
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="glass-card border-glass-border/50 animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// User list skeleton with bat loader
export function UserListLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-8">
        <BatPixelLoader 
          size={2} 
          speed={0.4} 
          text="Loading users..."
          className="text-center"
        />
      </div>
      
      {/* Skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="glass-card border-glass-border/50 animate-pulse">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Dashboard loading state
export function DashboardLoader() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center py-12">
        <BatPixelLoader 
          size={3} 
          speed={0.5} 
          text="Loading your dashboard..."
          className="text-center"
        />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="glass-card border-glass-border/50 animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent activity skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-glass-border/50 animate-pulse">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-glass-border/50 animate-pulse">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoader({ children, loading = false, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="flex items-center gap-2">
          <InlineLoader />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Form loading overlay
export function FormLoader({ loading = false, message = "Saving..." }) {
  if (!loading) return null;
  
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <BatPixelLoader 
        size={2} 
        speed={0.4} 
        text={message}
        className="text-center"
      />
    </div>
  );
}
