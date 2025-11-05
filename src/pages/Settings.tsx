import { useEffect } from "react";
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

const Settings = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile */}
        <div className="card-elevated p-4 text-center">
          <Logo size="sm" />
          <h2 className="text-lg font-semibold mt-4">{mockUser.name}</h2>
          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
          <Button variant="outline" size="sm" className="mt-3">
            <User size={14} className="mr-1" />
            Edit Profile
          </Button>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Preferences</h2>
          
          <div className="card-elevated p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-bg">Default Background</Label>
              <Select defaultValue={backgrounds[0].id}>
                <SelectTrigger id="default-bg">
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

            <div className="flex items-center justify-between">
              <Label htmlFor="watermark-pref">Watermark by Default</Label>
              <Switch id="watermark-pref" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Dark Mode</Label>
              <Switch id="theme" />
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Support</h2>
          
          <div className="card-elevated p-3 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toast.info("Opening FAQ...")}
            >
              <HelpCircle size={20} className="mr-3" />
              FAQ
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toast.info("Opening contact form...")}
            >
              <Mail size={20} className="mr-3" />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Account */}
        <div className="space-y-3">
          <div className="card-elevated p-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                toast.success("Logged out");
                navigate("/");
              }}
            >
              <LogOut size={20} className="mr-3" />
              Log Out
            </Button>
          </div>
        </div>

        {/* App info */}
        <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
          <p>Snap Your Car v1.0.0</p>
          <p>© 2025 • Made with ❤️ in Europe</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
