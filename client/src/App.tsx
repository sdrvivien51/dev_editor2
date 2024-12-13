import { Switch, Route } from "wouter";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/write" component={Editor} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
