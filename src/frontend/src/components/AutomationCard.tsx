import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";
import type { AmbiSettings } from "../backend.d";

interface Props {
  settings: AmbiSettings;
  onSave: (s: AmbiSettings) => void;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AutomationCard({ settings, onSave }: Props) {
  const toggleDay = (i: number) => {
    const days = [...settings.scheduleDays];
    days[i] = !days[i];
    onSave({ ...settings, scheduleDays: days });
  };

  return (
    <div data-ocid="automation.card" className="card-glass p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-bold">Automation & Schedule</h2>
        </div>
        <Switch
          data-ocid="automation.toggle"
          checked={settings.autoPowerEnabled}
          onCheckedChange={(v) => onSave({ ...settings, autoPowerEnabled: v })}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div
        className={`space-y-4 transition-opacity ${
          settings.autoPowerEnabled
            ? "opacity-100"
            : "opacity-40 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label
              htmlFor="auto-on-time"
              className="text-xs text-muted-foreground mb-1.5 block"
            >
              Auto On
            </Label>
            <Input
              id="auto-on-time"
              data-ocid="automation.input"
              type="time"
              value={settings.autoOnTime}
              onChange={(e) =>
                onSave({ ...settings, autoOnTime: e.target.value })
              }
              className="bg-muted/30 border-border text-sm"
            />
          </div>
          <div>
            <Label
              htmlFor="auto-off-time"
              className="text-xs text-muted-foreground mb-1.5 block"
            >
              Auto Off
            </Label>
            <Input
              id="auto-off-time"
              data-ocid="automation.input"
              type="time"
              value={settings.autoOffTime}
              onChange={(e) =>
                onSave({ ...settings, autoOffTime: e.target.value })
              }
              className="bg-muted/30 border-border text-sm"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Active Days
          </Label>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((dayLabel, i) => (
              <button
                type="button"
                key={dayLabel}
                data-ocid={`automation.toggle.${i + 1}`}
                title={dayLabel}
                onClick={() => toggleDay(i)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  settings.scheduleDays[i]
                    ? "border-primary/60 bg-primary/20 text-primary"
                    : "border-border bg-muted/20 text-muted-foreground"
                }`}
              >
                {DAYS[i]}
              </button>
            ))}
          </div>
        </div>

        {settings.autoPowerEnabled && (
          <p className="text-xs text-muted-foreground">
            LEDs will turn on at{" "}
            <span className="text-foreground font-medium">
              {settings.autoOnTime}
            </span>{" "}
            and off at{" "}
            <span className="text-foreground font-medium">
              {settings.autoOffTime}
            </span>{" "}
            on selected days.
          </p>
        )}
      </div>
    </div>
  );
}
