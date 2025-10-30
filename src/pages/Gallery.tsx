import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Grid3x3, List, Download, Trash2, Eye } from "lucide-react";
import { mockSessions } from "@/lib/mockData";

const Gallery = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold">My Cars</h1>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="w-9 h-9"
              >
                <Grid3x3 size={18} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="w-9 h-9"
              >
                <List size={18} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {mockSessions.length} sessions • {mockSessions.reduce((acc, s) => acc + s.images.length, 0)} photos
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {mockSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/gallery/${session.id}`)}
                className="card-elevated hover:shadow-lg transition-all interactive-scale group"
              >
                <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-2">
                  {session.images[0]?.after && (
                    <img
                      src={session.images[0].after}
                      alt={session.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-semibold text-sm truncate">
                    {session.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {session.images.length} photos
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        session.images[0]?.status === "processed"
                          ? "bg-success/10 text-success border-success/20 text-[10px] px-2 py-0"
                          : "bg-warning/10 text-warning border-warning/20 text-[10px] px-2 py-0"
                      }
                    >
                      {session.images[0]?.status === "processed" ? "Done" : "Queue"}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="card-elevated p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    {session.images[0]?.after && (
                      <img
                        src={session.images[0].after}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
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
                        {session.images[0]?.status === "processed"
                          ? "Processed"
                          : "In Queue"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/gallery/${session.id}`)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download size={14} className="mr-1" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
