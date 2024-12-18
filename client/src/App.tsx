import { Switch, Route } from "wouter";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";
import BlogArticle from "./pages/article";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased">
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="container mx-auto flex-1 space-y-4 px-4 py-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/write" component={Editor} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/auth-callback" component={AuthCallback} />
            <Route path="/article/:slug" component={BlogArticle} />
            <Route>
              <div className="flex h-[50vh] items-center justify-center">
                <h1 className="text-2xl font-bold">404 Page Not Found</h1>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
