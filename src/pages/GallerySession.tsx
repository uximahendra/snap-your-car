import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Trash2, Share2 } from "lucide-react";
import { mockSessions } from "@/lib/mockData";
import { toast } from "sonner";

const GallerySession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = mockSessions.find((s) => s.id === id);

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
          <h2 className="text-xl font-semibold mb-2">Session not found</h2>
          <Button onClick={() => navigate("/gallery")}>Back to Gallery</Button>
        </div>
      </div>
    );
  }

  const handleDownloadAll = () => {
    toast.success("Preparing download...", {
      description: "Your images will be ready shortly"
    });
  };

  const handleShare = () => {
    toast.success("Share link copied!", {
      description: "Share your enhanced photos"
    });
  };

  const handleDelete = () => {
    toast.error("Session deleted", {
      description: "This action cannot be undone"
    });
    setTimeout(() => navigate("/gallery"), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/gallery")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold">{session.title}</h1>
            <div className="w-9" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
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
      </header>

      {/* Actions */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex gap-2">
        <Button variant="default" className="flex-1" onClick={handleDownloadAll}>
          <Download size={16} className="mr-2" />
          Download All
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 size={16} />
        </Button>
        <Button variant="ghost" onClick={handleDelete}>
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Images Grid */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {session.images.map((image) => (
            <div key={image.id} className="card-elevated p-2">
              <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-2 relative">
                {image.after && (
                  <img
                    src={image.after}
                    alt={image.angle}
                    className="w-full h-full object-cover"
                  />
                )}
                {image.status === "processed" && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-success/90 text-white border-0 text-[10px] px-2 py-0">
                      Done
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-medium text-foreground">{image.angle}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => toast.success("Image downloaded")}
                >
                  <Download size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySession;
