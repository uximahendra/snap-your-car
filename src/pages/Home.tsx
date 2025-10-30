import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Armchair, Plus, Settings, Image as ImageIcon } from "lucide-react";
import { mockSessions, mockUser } from "@/lib/mockData";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings size={20} />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Hi {mockUser.name.split(" ")[0]} 👋</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Lifetime Access Active
            </Badge>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Start Capturing</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/capture?mode=exterior")}
              className="card-elevated group hover:shadow-lg transition-all interactive-scale"
            >
              <div className="flex flex-col items-center text-center p-4 space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Car size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Exterior</h3>
                  <p className="text-xs text-muted-foreground">7 angles</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/capture?mode=interior")}
              className="card-elevated group hover:shadow-lg transition-all interactive-scale"
            >
              <div className="flex flex-col items-center text-center p-4 space-y-3">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Armchair size={32} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Interior</h3>
                  <p className="text-xs text-muted-foreground">5 angles</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Sessions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/gallery")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {mockSessions.slice(0, 2).map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/gallery/${session.id}`)}
                className="w-full card-elevated hover:shadow-lg transition-all interactive-scale"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    {session.images[0]?.after ? (
                      <img
                        src={session.images[0].after}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.images.length} photos • {session.date}
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        session.images[0]?.status === "processed"
                          ? "bg-success/10 text-success border-success/20 mt-1"
                          : "bg-warning/10 text-warning border-warning/20 mt-1"
                      }
                    >
                      {session.images[0]?.status === "processed"
                        ? "Processed"
                        : "In Queue"}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button
          variant="fab"
          size="fab"
          onClick={() => navigate("/capture")}
          className="shadow-2xl"
        >
          <Plus size={28} />
        </Button>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="flex-col h-auto py-2"
          >
            <Car size={24} className="text-primary" />
            <span className="text-xs mt-1 text-primary font-medium">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/gallery")}
            className="flex-col h-auto py-2"
          >
            <ImageIcon size={24} />
            <span className="text-xs mt-1">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            className="flex-col h-auto py-2"
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
