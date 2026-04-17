import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';
import { LiveStatus } from './components/LiveStatus';
import { AppLock } from './components/AppLock';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AppLock>
        <Routes>
          <Route path="/" element={<UserPanel />} />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/stat" element={<LiveStatus />} />
          <Route path="*" element={
            <div className="flex min-h-screen items-center justify-center bg-muted">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">404</h1>
                <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
                <a href="/" className="text-primary underline hover:text-primary/90">Return to Home</a>
              </div>
            </div>
          } />
        </Routes>
      </AppLock>
    </BrowserRouter>
  );
}
