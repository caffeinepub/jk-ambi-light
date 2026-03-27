import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Gauge, Hash, Save, Usb } from "lucide-react";
import { toast } from "sonner";
import type { AmbiSettings } from "../backend.d";

interface Props {
  settings: AmbiSettings;
  onSave: (s: AmbiSettings) => void;
  isSerialConnected: boolean;
  serialPort: SerialPort | null;
  setSerialPort: (p: SerialPort | null) => void;
  setIsConnected: (v: boolean) => void;
}

export default function SettingsTab({
  settings,
  onSave,
  isSerialConnected,
  serialPort,
  setSerialPort,
  setIsConnected,
}: Props) {
  const fps = Number(settings.fps);
  const ledCount = Number(settings.ledCount);
  const isSerialSupported = !!(navigator as Navigator).serial;

  const reconnect = async () => {
    try {
      await serialPort?.close();
    } catch {
      // ignore
    }
    setSerialPort(null);
    setIsConnected(false);

    if (!isSerialSupported) {
      toast.error("Web Serial requires Chrome or Edge.");
      return;
    }
    try {
      const port = await (navigator as Navigator).serial!.requestPort();
      await port.open({ baudRate: 115200 });
      setSerialPort(port);
      setIsConnected(true);
      toast.success("J16 reconnected!");
    } catch {
      toast.error("Could not connect to port.");
    }
  };

  return (
    <div data-ocid="settings.panel">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="max-w-xl space-y-6">
        <div data-ocid="settings.card" className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Capture Frame Rate</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm text-muted-foreground">FPS</Label>
            <span className="text-xl font-bold text-primary">{fps}</span>
          </div>
          <Slider
            data-ocid="settings.input"
            min={10}
            max={114}
            step={1}
            value={[fps]}
            onValueChange={([v]) => onSave({ ...settings, fps: BigInt(v) })}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10 FPS</span>
            <span>60 FPS (default)</span>
            <span>114 FPS</span>
          </div>
          <div className="flex gap-2 mt-3">
            {[30, 60, 90, 114].map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => onSave({ ...settings, fps: BigInt(f) })}
                className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                  fps === f
                    ? "border-primary/60 text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f} FPS
              </button>
            ))}
          </div>
        </div>

        <div data-ocid="settings.card" className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">LED Strip Count</h3>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={300}
              value={ledCount}
              onChange={(e) =>
                onSave({
                  ...settings,
                  ledCount: BigInt(
                    Math.min(300, Math.max(1, Number(e.target.value))),
                  ),
                })
              }
              className="bg-muted/30 border-border max-w-[120px] text-center text-lg font-bold"
            />
            <span className="text-sm text-muted-foreground">LEDs (1–300)</span>
          </div>
        </div>

        <div data-ocid="settings.card" className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Usb className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">USB Serial Port</h3>
          </div>
          <div
            className={`flex items-center gap-2 text-sm mb-4 ${
              isSerialConnected ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isSerialConnected
                  ? "bg-accent animate-pulse"
                  : "bg-muted-foreground"
              }`}
            />
            {isSerialConnected ? "J16 Connected" : "Not connected"}
          </div>
          <Button
            data-ocid="settings.primary_button"
            size="sm"
            className="border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
            onClick={reconnect}
            disabled={!isSerialSupported}
          >
            <Usb className="w-4 h-4 mr-2" />
            {isSerialConnected ? "Reconnect" : "Connect"} USB Port
          </Button>
          {!isSerialSupported && (
            <p className="text-xs text-muted-foreground mt-2">
              Web Serial API requires Google Chrome or Microsoft Edge.
            </p>
          )}
        </div>

        <Button
          data-ocid="settings.save_button"
          className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
          onClick={() => {
            onSave(settings);
            toast.success("Settings saved!");
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
