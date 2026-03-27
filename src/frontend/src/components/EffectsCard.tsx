import {
  Check,
  Flame,
  Monitor,
  Music,
  Palette,
  Waves,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { AmbiSettings } from "../backend.d";
import { EffectType } from "../backend.d";

const SCREEN_GRAB_EFFECT = "screen_grab" as const;
type EffectTypeOrScreenGrab = EffectType | typeof SCREEN_GRAB_EFFECT;

interface Props {
  settings: AmbiSettings;
  onSave: (s: AmbiSettings) => void;
  fullWidth?: boolean;
}

const EFFECTS: {
  id: EffectTypeOrScreenGrab;
  label: string;
  description: string;
  icon: React.ReactNode;
  previewClass: string;
}[] = [
  {
    id: EffectType.static_,
    label: "Static Color",
    description: "Solid single color",
    icon: <Palette className="w-5 h-5" />,
    previewClass: "led-static",
  },
  {
    id: EffectType.rainbow,
    label: "Rainbow Wave",
    description: "Cycling color wave",
    icon: <Waves className="w-5 h-5" />,
    previewClass: "led-rainbow",
  },
  {
    id: EffectType.breathe,
    label: "Breathe",
    description: "Pulsing glow effect",
    icon: <Wind className="w-5 h-5" />,
    previewClass: "led-breathe",
  },
  {
    id: EffectType.fire,
    label: "Fire",
    description: "Flickering flame",
    icon: <Flame className="w-5 h-5" />,
    previewClass: "led-fire",
  },
  {
    id: EffectType.music,
    label: "Music Sync",
    description: "Reacts to audio",
    icon: <Music className="w-5 h-5" />,
    previewClass: "led-rainbow",
  },
  {
    id: SCREEN_GRAB_EFFECT,
    label: "Screen Grab",
    description: "Syncs LEDs to screen colors",
    icon: <Monitor className="w-5 h-5" />,
    previewClass: "led-rainbow",
  },
];

const COLOR_PRESETS = [
  "#FF0000",
  "#FF8800",
  "#FFFF00",
  "#00FF00",
  "#4AA3FF",
  "#8800FF",
  "#FF00FF",
  "#FFFFFF",
];

export default function EffectsCard({ settings, onSave, fullWidth }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [localEffect, setLocalEffect] = useState<EffectTypeOrScreenGrab>(
    settings.selectedEffect,
  );

  const selected: EffectTypeOrScreenGrab = settings.screenCaptureActive
    ? SCREEN_GRAB_EFFECT
    : localEffect;

  const isStaticSelected = selected === EffectType.static_;

  const selectEffect = (id: EffectTypeOrScreenGrab) => {
    if (id === SCREEN_GRAB_EFFECT) {
      setLocalEffect(SCREEN_GRAB_EFFECT);
      onSave({ ...settings, screenCaptureActive: true });
      setShowPicker(false);
    } else {
      setLocalEffect(id);
      onSave({
        ...settings,
        selectedEffect: id,
        screenCaptureActive: false,
      });
      setShowPicker(id === EffectType.static_);
    }
  };

  return (
    <div data-ocid="effects.card" className="card-glass p-5">
      <h2 className="text-lg font-bold mb-4">Lighting Effects</h2>

      <div
        className={`grid gap-3 ${
          fullWidth
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            : "grid-cols-1"
        }`}
      >
        {EFFECTS.map((effect, i) => {
          const isActive = selected === effect.id;
          return (
            <motion.button
              type="button"
              key={String(effect.id)}
              data-ocid={`effects.item.${i + 1}`}
              onClick={() => selectEffect(effect.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex ${
                fullWidth ? "flex-col items-center" : "flex-row items-center"
              } gap-3 p-3 rounded-xl border transition-all text-left ${
                isActive
                  ? "border-primary/60 bg-primary/10 glow-blue"
                  : "border-border bg-muted/20 hover:border-border/80 hover:bg-muted/30"
              }`}
            >
              <div
                className={`${
                  fullWidth ? "w-full h-2" : "w-10 h-10 rounded-lg"
                } ${effect.previewClass} overflow-hidden rounded flex-shrink-0`}
                style={
                  effect.id === EffectType.static_
                    ? { backgroundColor: settings.staticColor }
                    : {}
                }
              />

              <div
                className={`flex flex-col ${fullWidth ? "items-center" : ""}`}
              >
                <div className="flex items-center gap-1.5">
                  {effect.icon}
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {effect.label}
                  </span>
                </div>
                {!fullWidth && (
                  <span className="text-xs text-muted-foreground">
                    {effect.description}
                  </span>
                )}
              </div>

              {isActive && (
                <div className="ml-auto">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected === SCREEN_GRAB_EFFECT && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary flex-shrink-0" />
            Screen Grab requires screen sharing permission. Enable it in the
            Screen Capture card on the Dashboard.
          </p>
        </motion.div>
      )}

      {(showPicker || isStaticSelected) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <label
            htmlFor="static-color-picker"
            className="text-xs text-muted-foreground block mb-2"
          >
            Pick Static Color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="static-color-picker"
              data-ocid="effects.input"
              type="color"
              value={settings.staticColor}
              onChange={(e) =>
                onSave({ ...settings, staticColor: e.target.value })
              }
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <div
              className="flex-1 h-8 rounded-lg border border-border/50"
              style={{ backgroundColor: settings.staticColor }}
            />
            <span className="text-sm font-mono text-muted-foreground">
              {settings.staticColor.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => onSave({ ...settings, staticColor: c })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor:
                    settings.staticColor === c ? "white" : "transparent",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
