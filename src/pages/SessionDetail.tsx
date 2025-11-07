import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { mockSessions } from "@/lib/mockData";
import { getSessionById } from "@/lib/storage";

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(mockSessions.find(s => s.id === id));

  useEffect(() => {
    if (id) {
      const localSession = getSessionById(id);
      if (localSession) {
        setSession(localSession);
      }
    }
  }, [id]);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Session not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/my-cars")}>
            Back to My Cars
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border p-5 sticky top-0 z-10 shadow-[var(--elevation-2)]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/my-cars")}
            >
              <ArrowLeft size={22} strokeWidth={2} />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="default">
                <Download size={18} strokeWidth={2} />
                <span className="ml-2">Export</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 size={18} strokeWidth={2} />
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-h2">{session.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-body-sm text-muted-foreground">
                {session.date} • {session.images.length} photos
              </p>
              <Badge
                variant="secondary"
                className={
                  session.images[0]?.status === "processed"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }
              >
                {session.images[0]?.status === "processed" ? "Processed" : "In Queue"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Images Grid */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {session.images.map((image) => (
            <div key={image.id} className="space-y-3">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-[var(--elevation-2)] hover:shadow-[var(--elevation-3)] transition-all duration-200 border border-border">
                <img
                  src={image.after || image.before}
                  alt={image.angle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center px-2">
                <p className="text-body font-semibold truncate">{image.angle}</p>
                {image.background && (
                  <p className="text-caption text-muted-foreground capitalize mt-0.5">
                    {image.background.replace('-', ' ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
