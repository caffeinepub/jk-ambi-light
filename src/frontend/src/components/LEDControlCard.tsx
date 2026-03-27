import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Monitor } from "lucide-react";
import type { AmbiSettings } from "../backend.d";
import { EffectType } from "../backend.d";

type LedSides = { top: number; bottom: number; left: number; right: number };

interface Props {
  settings: AmbiSettings;
  onSave: (s: AmbiSettings) => void;
  ledSides: LedSides;
  setLedSides: (s: LedSides) => void;
}

function SideInput({
  label,
  value,
  onChange,
  ocid,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  ocid: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
      <input
        data-ocid={ocid}
        type="number"
        min={1}
        max={500}
        value={value}
        onChange={(e) => {
          const v = Math.min(500, Math.max(1, Number(e.target.value) || 1));
          onChange(v);
        }}
        className="w-14 text-center text-sm font-bold bg-muted/40 border border-border/60 rounded-md px-1 py-1 text-foreground focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}

export default function LEDControlCard({
  settings,
  onSave,
  ledSides,
  setLedSides,
}: Props) {
  const isOn = settings.currentPowerState;
  const total = ledSides.top + ledSides.bottom + ledSides.left + ledSides.right;

  const toggle = () => onSave({ ...settings, currentPowerState: !isOn });

  const updateSide = (side: keyof LedSides, value: number) => {
    const next = { ...ledSides, [side]: value };
    setLedSides(next);
    const newTotal = next.top + next.bottom + next.left + next.right;
    onSave({ ...settings, ledCount: BigInt(newTotal) });
  };

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
      {/* Header */}
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

      {/* LED Strip Visualization */}
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
          {Array.from({ length: Math.min(total, 20) }).map((_, i) => (
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

      {/* TV Frame Layout */}
      <div>
        <Label className="text-sm text-muted-foreground mb-3 block">
          LED Count per Side
        </Label>

        <div className="flex flex-col items-center gap-2">
          {/* Top input */}
          <SideInput
            label="Top"
            value={ledSides.top}
            onChange={(v) => updateSide("top", v)}
            ocid="led_control.top.input"
          />

          {/* Middle row: Left | Screen | Right */}
          <div className="flex items-center gap-3 w-full">
            {/* Left */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Left
              </span>
              <input
                data-ocid="led_control.left.input"
                type="number"
                min={1}
                max={500}
                value={ledSides.left}
                onChange={(e) => {
                  const v = Math.min(
                    500,
                    Math.max(1, Number(e.target.value) || 1),
                  );
                  updateSide("left", v);
                }}
                className="w-14 text-center text-sm font-bold bg-muted/40 border border-border/60 rounded-md px-1 py-1 text-foreground focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* TV Screen */}
            <div
              className="flex-1 rounded-lg border-2 border-primary/30 bg-black/50 flex flex-col items-center justify-center gap-1.5 relative"
              style={{ minHeight: "100px" }}
            >
              {/* Corner accents */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-primary/50 rounded-tl" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-primary/50 rounded-tr" />
              <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-primary/50 rounded-bl" />
              <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-primary/50 rounded-br" />
              <Monitor className="w-6 h-6 text-primary/40" />
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                Screen
              </span>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Right
              </span>
              <input
                data-ocid="led_control.right.input"
                type="number"
                min={1}
                max={500}
                value={ledSides.right}
                onChange={(e) => {
                  const v = Math.min(
                    500,
                    Math.max(1, Number(e.target.value) || 1),
                  );
                  updateSide("right", v);
                }}
                className="w-14 text-center text-sm font-bold bg-muted/40 border border-border/60 rounded-md px-1 py-1 text-foreground focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Bottom input */}
          <SideInput
            label="Bottom"
            value={ledSides.bottom}
            onChange={(v) => updateSide("bottom", v)}
            ocid="led_control.bottom.input"
          />
        </div>

        {/* Total */}
        <div className="mt-3 text-center">
          <span className="text-xs text-muted-foreground">Total: </span>
          <span className="text-sm font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground ml-1">LEDs</span>
        </div>
      </div>
    </div>
  );
}
