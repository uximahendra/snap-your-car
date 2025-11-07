import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User, HelpCircle, Mail, LogOut } from "lucide-react";
import { mockUser, backgrounds } from "@/lib/mockData";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { PageTransition } from "@/components/PageTransition";
import { SettingsPageSkeleton } from "@/components/skeletons/SettingsSkeleton";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 300);
    
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({ orientation: 'portrait' }).catch(console.warn);
    }
    
    return () => {
      clearTimeout(timer);
      if (Capacitor.isNativePlatform()) {
        ScreenOrientation.unlock().catch(console.warn);
      }
    };
  }, []);

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border p-5 sticky top-0 z-10 shadow-[var(--elevation-2)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-cars")}
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </Button>
          <h1 className="text-h2">Settings</h1>
          <div className="w-11" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile */}
        <div className="bg-card rounded-2xl p-6 text-center shadow-[var(--elevation-2)] border border-border">
          <Logo size="md" />
          <h2 className="text-h2 mt-5">{mockUser.name}</h2>
          <p className="text-body text-muted-foreground mt-1">{mockUser.email}</p>
          <Button variant="outline" size="default" className="mt-4">
            <User size={18} strokeWidth={2} />
            <span className="ml-2">Edit Profile</span>
          </Button>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <h2 className="text-h3">Preferences</h2>
          
          <div className="bg-card rounded-2xl p-5 space-y-5 shadow-[var(--elevation-2)] border border-border">
            <div className="space-y-2.5">
              <Label htmlFor="default-bg" className="text-body font-semibold">Default Background</Label>
              <Select defaultValue={backgrounds[0].id}>
                <SelectTrigger id="default-bg" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgrounds.map((bg) => (
                    <SelectItem key={bg.id} value={bg.id}>
                      {bg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-1">
              <Label htmlFor="watermark-pref" className="text-body font-semibold cursor-pointer">Watermark by Default</Label>
              <Switch id="watermark-pref" defaultChecked />
            </div>

            <div className="flex items-center justify-between py-1">
              <Label htmlFor="theme" className="text-body font-semibold cursor-pointer">Dark Mode</Label>
              <Switch 
                id="theme" 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h2 className="text-h3">Support</h2>
          
          <div className="bg-card rounded-2xl p-2 space-y-1 shadow-[var(--elevation-2)] border border-border">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start h-14"
              onClick={() => toast.info("Opening FAQ...")}
            >
              <HelpCircle size={22} strokeWidth={2} />
              <span className="ml-3 text-body font-medium">FAQ</span>
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start h-14"
              onClick={() => toast.info("Opening contact form...")}
            >
              <Mail size={22} strokeWidth={2} />
              <span className="ml-3 text-body font-medium">Contact Support</span>
            </Button>
          </div>
        </div>

        {/* Account */}
        <div className="space-y-3">
          <div className="bg-card rounded-2xl p-2 shadow-[var(--elevation-2)] border border-border">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-14"
              onClick={() => {
                toast.success("Logged out");
                navigate("/");
              }}
            >
              <LogOut size={22} strokeWidth={2} />
              <span className="ml-3 text-body font-medium">Log Out</span>
            </Button>
          </div>
        </div>

        {/* App info */}
        <div className="text-center text-caption text-muted-foreground space-y-1 pt-6">
          <p className="font-medium">Snap Your Car v1.0.0</p>
          <p>© 2025 • Made with ❤️ in Europe</p>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Settings;
