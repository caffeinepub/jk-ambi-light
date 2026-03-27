import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Gauge, Monitor } from "lucide-react";
import { toast } from "sonner";
import type { AmbiSettings } from "../backend.d";

interface Props {
  settings: AmbiSettings;
  onSave: (s: AmbiSettings) => void;
  screenStream: MediaStream | null;
  setScreenStream: (s: MediaStream | null) => void;
}

export default function ScreenCaptureCard({
  settings,
  onSave,
  screenStream,
  setScreenStream,
}: Props) {
  const fps = Number(settings.fps);
  const isCapturing = settings.screenCaptureActive && !!screenStream;
  const isSupported = !!navigator.mediaDevices?.getDisplayMedia;

  const toggleCapture = async () => {
    if (isCapturing) {
      for (const t of screenStream?.getTracks() ?? []) {
        t.stop();
      }
      setScreenStream(null);
      onSave({ ...settings, screenCaptureActive: false });
    } else {
      if (!isSupported) {
        toast.error("Screen capture not supported. Use Chrome or Edge.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: fps },
        });
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          setScreenStream(null);
          onSave({ ...settings, screenCaptureActive: false });
        });
        setScreenStream(stream);
        onSave({ ...settings, screenCaptureActive: true });
        toast.success("Screen capture started!");
      } catch {
        toast.error("Screen capture cancelled or denied.");
      }
    }
  };

  const setFps = (v: number) => onSave({ ...settings, fps: BigInt(v) });

  return (
    <div data-ocid="screen_capture.card" className="card-glass p-5">
      <div className="flex items-center gap-2 mb-4">
        <Monitor
          className={`w-5 h-5 ${
            isCapturing ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <h2 className="text-lg font-bold">Screen Capture</h2>
        {isCapturing && (
          <span className="ml-auto text-xs font-medium text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full animate-pulse-glow">
            ● LIVE
          </span>
        )}
      </div>

      {!isSupported && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Screen capture requires Chrome or Edge
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <Label htmlFor="ambilight-sync" className="text-sm font-medium">
            Ambilight Sync
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Capture screen edges and sync to LED strip
          </p>
        </div>
        <Switch
          id="ambilight-sync"
          data-ocid="screen_capture.toggle"
          checked={isCapturing}
          onCheckedChange={toggleCapture}
          disabled={!isSupported}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="mb-4">
        <Label
          htmlFor="display-select"
          className="text-xs text-muted-foreground mb-1.5 block"
        >
          Display
        </Label>
        <Select defaultValue="primary">
          <SelectTrigger
            id="display-select"
            data-ocid="screen_capture.select"
            className="bg-muted/30 border-border text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary Display</SelectItem>
            <SelectItem value="secondary">Secondary Display</SelectItem>
            <SelectItem value="window">Application Window</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            Capture FPS
          </Label>
          <span className="text-sm font-bold text-primary">{fps} FPS</span>
        </div>
        <Slider
          data-ocid="screen_capture.input"
          min={10}
          max={114}
          step={1}
          value={[fps]}
          onValueChange={([v]) => setFps(v)}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>10</span>
          <span>60</span>
          <span>114</span>
        </div>
      </div>

      {isCapturing && (
        <Button
          type="button"
          data-ocid="screen_capture.secondary_button"
          variant="outline"
          size="sm"
          className="mt-4 w-full border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={toggleCapture}
        >
          Stop Capture
        </Button>
      )}
    </div>
  );
}
