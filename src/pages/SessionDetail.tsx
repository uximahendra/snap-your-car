import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { mockSessions } from "@/lib/mockData";
import { getSessionById } from "@/lib/storage";
import { PageTransition } from "@/components/PageTransition";
import { SessionDetailPageSkeleton } from "@/components/skeletons/SessionDetailSkeleton";

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(mockSessions.find(s => s.id === id));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      
      if (id) {
        // Simulate loading time for smooth transition
        const [localSession] = await Promise.all([
          Promise.resolve(getSessionById(id)),
          new Promise(resolve => setTimeout(resolve, 300))
        ]);
        
        if (localSession) {
          setSession(localSession);
        }
      }
      
      setIsLoading(false);
    };
    
    loadSession();
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

  if (isLoading) {
    return <SessionDetailPageSkeleton />;
  }

  if (!session) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Session not found</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/my-cars")}>
              Back to My Cars
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-6 sticky top-0 z-10 shadow-[var(--elevation-2)]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/my-cars")}
              aria-label="Back to My Cars"
            >
              <ArrowLeft size={22} strokeWidth={2} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Delete session"
            >
              <Trash2 size={20} strokeWidth={2} />
            </Button>
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

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10 shadow-[var(--elevation-4)]">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {/* Show Remove Backgrounds button if not processed yet */}
          {!session.backgroundsRemoved && (
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate("/background-removal-processing", { state: { session } })}
            >
              <span className="mr-2">✨</span>
              Remove Backgrounds & Enhance
            </Button>
          )}
          
          {/* Show Export button if backgrounds are removed */}
          {session.backgroundsRemoved && (
            <Button 
              size="lg" 
              className="w-full"
              aria-label="Export all photos"
            >
              <Download size={20} strokeWidth={2} />
              <span className="ml-2">Export All Photos</span>
            </Button>
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default SessionDetail;
