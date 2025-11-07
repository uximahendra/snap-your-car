import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, Plus, Eye, Download, Search, ImageIcon } from "lucide-react";
import { mockSessions, mockUser } from "@/lib/mockData";
import { getAllSessionsFromLocalStorage } from "@/lib/storage";

const MyCars = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [localSessions, setLocalSessions] = useState(mockSessions);

  useEffect(() => {
    const saved = getAllSessionsFromLocalStorage();
    setLocalSessions([...saved, ...mockSessions]);
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({ orientation: 'portrait' }).catch(console.warn);
    }
    
    return () => {
      if (Capacitor.isNativePlatform()) {
        ScreenOrientation.unlock().catch(console.warn);
      }
    };
  }, []);

  const filteredSessions = localSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10 shadow-[var(--elevation-2)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <Settings size={22} strokeWidth={2} />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Text */}
        <div>
          <h1 className="text-h1 mb-1">My Cars</h1>
          <p className="text-body-sm text-muted-foreground">
            {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} • {filteredSessions.reduce((acc, s) => acc + s.images.length, 0)} photos
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} strokeWidth={2} />
          <Input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 text-base"
          />
        </div>

        {/* Session List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon size={48} className="mx-auto mb-3 opacity-50" strokeWidth={1.5} />
              <p className="text-body">No sessions found</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div key={session.id} className="bg-card rounded-2xl p-5 shadow-[var(--elevation-2)] hover:shadow-[var(--elevation-3)] transition-all duration-200 border border-border">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border">
                    {session.images[0]?.after ? (
                      <img
                        src={session.images[0].after}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-muted-foreground" strokeWidth={2} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-h3 mb-1 truncate">{session.title}</h3>
                        <p className="text-caption text-muted-foreground">
                          {session.date} • {session.images.length} photos
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          session.images[0]?.status === "processed"
                            ? "bg-success/10 text-success border-success/20 flex-shrink-0"
                            : "bg-warning/10 text-warning border-warning/20 flex-shrink-0"
                        }
                      >
                        {session.images[0]?.status === "processed" ? "Done" : "Queue"}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/session/${session.id}`)}
                        className="flex-1"
                      >
                        <Eye size={16} strokeWidth={2} />
                        <span className="ml-1.5">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download size={16} strokeWidth={2} />
                        <span className="ml-1.5">Export</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="fab"
        className="fixed bottom-24 right-6 bg-primary hover:bg-primary/90"
        onClick={() => navigate("/capture")}
      >
        <Plus size={28} strokeWidth={2.5} />
      </Button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10 shadow-[var(--elevation-3)]">
        <div className="max-w-md mx-auto flex items-center justify-around h-20 px-4">
          <Button variant="ghost" size="lg" className="flex-col h-auto py-3 gap-1 min-w-[72px]">
            <ImageIcon size={24} className="text-primary" strokeWidth={2} />
            <span className="text-caption font-semibold text-primary">My Cars</span>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/settings")} className="flex-col h-auto py-3 gap-1 min-w-[72px]">
            <Settings size={24} strokeWidth={2} />
            <span className="text-caption">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default MyCars;
