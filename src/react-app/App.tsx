// src/App.tsx

import { Link, Route, Switch } from "wouter";
import { HomePage } from "./features/home/HomePage";
import { GamePage } from "./features/game/GamePage";
import { DeckBuilderPage } from "./features/deck-builder/DeckBuilderPage";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useUserName } from "./hooks/useUserName";
import { UserNameModal } from "./components/UserNameModal";
import "./App.css";

function App() {
  const { userName, setUserName, isModalOpen, setIsModalOpen, clearUserName } =
    useUserName();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="container mx-auto py-4">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              The Will to Fight
            </a>
          </Link>
          {userName && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Hi, {userName}!
              </span>
              <Button variant="outline" size="sm" onClick={clearUserName}>
                Change Name
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/game" component={GamePage} />
          <Route path="/deck-builder" component={DeckBuilderPage} />
          <Route>
            <div className="container mx-auto py-4 text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <Button asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </Route>
        </Switch>
      </main>

      <footer className="container mx-auto py-4 mt-8 text-center text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} The Will to Fight. A Strategic Card Game.
        </p>
      </footer>
      <Toaster richColors />
      <UserNameModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onNameSubmit={setUserName}
      />
    </div>
  );
}

export default App;
