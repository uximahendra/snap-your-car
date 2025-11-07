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
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <Settings size={20} />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold mb-1">My Cars</h1>
          <p className="text-sm text-muted-foreground">
            {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} • {filteredSessions.reduce((acc, s) => acc + s.images.length, 0)} photos
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Session List */}
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
              <p>No sessions found</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div key={session.id} className="card-elevated p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
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
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.date} • {session.images.length} photos
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          session.images[0]?.status === "processed"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {session.images[0]?.status === "processed" ? "Done" : "Queue"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/session/${session.id}`)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download size={14} className="mr-1" />
                        Export
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
        size="lg"
        className="fixed bottom-20 right-6 rounded-full w-14 h-14 shadow-lg"
        onClick={() => navigate("/capture")}
      >
        <Plus size={24} />
      </Button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <ImageIcon size={24} className="text-primary" />
            <span className="text-xs mt-1 text-primary font-medium">My Cars</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/settings")} className="flex-col h-auto py-2">
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default MyCars;
