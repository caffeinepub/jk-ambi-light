import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Minus, Plus } from "lucide-react";
import type { AmbiSettings } from "../backend.d";
import { EffectType } from "../backend.d";

interface Props {
  settings: AmbiSettings;
  onSave: (s: AmbiSettings) => void;
}

export default function LEDControlCard({ settings, onSave }: Props) {
  const isOn = settings.currentPowerState;
  const ledCount = Number(settings.ledCount);

  const toggle = () => onSave({ ...settings, currentPowerState: !isOn });
  const setCount = (n: number) =>
    onSave({ ...settings, ledCount: BigInt(Math.min(300, Math.max(1, n))) });

  const effectClass = (() => {
    if (!isOn) return "";
    switch (settings.selectedEffect) {
      case EffectType.rainbow:
        return "led-rainbow";
      case EffectType.breathe:
        return "led-breathe";
      case EffectType.fire:
        return "led-fire";
      default:
        return "led-static";
    }
  })();

  const staticBg =
    isOn &&
    settings.selectedEffect === EffectType.static_ &&
    settings.staticColor
      ? settings.staticColor
      : undefined;

  return (
    <div data-ocid="led_control.card" className="card-glass p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb
            className={`w-5 h-5 ${isOn ? "text-accent" : "text-muted-foreground"}`}
          />
          <h2 className="text-lg font-bold">Main LED Control</h2>
        </div>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="power-toggle"
            className="text-sm text-muted-foreground"
          >
            {isOn ? "ON" : "OFF"}
          </Label>
          <Switch
            id="power-toggle"
            data-ocid="led_control.toggle"
            checked={isOn}
            onCheckedChange={toggle}
            className={isOn ? "data-[state=checked]:bg-accent" : ""}
          />
        </div>
      </div>

      <div className="mb-5">
        <div
          className={`h-8 rounded-full overflow-hidden border border-border/50 transition-all duration-500 ${
            isOn ? effectClass : "bg-muted/30"
          }`}
          style={staticBg ? { backgroundColor: staticBg } : {}}
          data-ocid="led_control.panel"
        >
          {isOn && (
            <div
              className="h-full w-full opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              }}
            />
          )}
        </div>
        <div className="flex justify-between mt-1">
          {Array.from({ length: Math.min(ledCount, 20) }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: positional LED dots
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isOn ? "bg-accent/70" : "bg-muted/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">
          LED Count
        </Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            data-ocid="led_control.secondary_button"
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border bg-muted/30"
            onClick={() => setCount(ledCount - 1)}
            disabled={ledCount <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-foreground">
              {ledCount}
            </span>
            <span className="text-xs text-muted-foreground ml-1">LEDs</span>
          </div>
          <Button
            type="button"
            data-ocid="led_control.primary_button"
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border bg-muted/30"
            onClick={() => setCount(ledCount + 1)}
            disabled={ledCount >= 300}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          {[15, 30, 60, 120].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setCount(n)}
              className={`flex-1 py-1 text-xs rounded border transition-colors ${
                ledCount === n
                  ? "border-primary/60 text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
