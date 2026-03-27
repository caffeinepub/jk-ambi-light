import { Toaster } from "@/components/ui/sonner";
import { Share2, Usb, Wifi, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AmbiSettings } from "./backend.d";
import { EffectType } from "./backend.d";
import AutomationCard from "./components/AutomationCard";
import ConnectionCard from "./components/ConnectionCard";
import EffectsCard from "./components/EffectsCard";
import GuideTab from "./components/GuideTab";
import HardwareTab from "./components/HardwareTab";
import LEDControlCard from "./components/LEDControlCard";
import ScreenCaptureCard from "./components/ScreenCaptureCard";
import SettingsTab from "./components/SettingsTab";
import { useSettings, useUpdateSettings } from "./hooks/useQueries";

type TabId = "dashboard" | "effects" | "settings" | "hardware" | "guide";

type LedSides = { top: number; bottom: number; left: number; right: number };

const DEFAULT_LED_SIDES: LedSides = {
  top: 30,
  bottom: 30,
  left: 20,
  right: 20,
};

const NAV_TABS: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "effects", label: "Effects" },
  { id: "settings", label: "Settings" },
  { id: "hardware", label: "Hardware" },
  { id: "guide", label: "Guide" },
];

const DEFAULT_SETTINGS: AmbiSettings = {
  fps: BigInt(60),
  currentPowerState: false,
  autoOnTime: "08:00",
  staticColor: "#4AA3FF",
  ledCount: BigInt(100),
  scheduleDays: [true, true, true, true, true, false, false],
  autoOffTime: "23:00",
  autoPowerEnabled: false,
  selectedEffect: EffectType.rainbow,
  screenCaptureActive: false,
};

function loadLedSides(): LedSides {
  try {
    const stored = localStorage.getItem("j16_led_sides");
    if (stored) return JSON.parse(stored) as LedSides;
  } catch {}
  return DEFAULT_LED_SIDES;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [settings, setSettings] = useState<AmbiSettings>(DEFAULT_SETTINGS);
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null);
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [dominantColor, setDominantColor] = useState<
    [number, number, number] | null
  >(null);
  const [ledSides, setLedSidesState] = useState<LedSides>(loadLedSides);

  const { data: backendSettings } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();

  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const setLedSides = useCallback((sides: LedSides) => {
    setLedSidesState(sides);
    localStorage.setItem("j16_led_sides", JSON.stringify(sides));
  }, []);

  // Keep app alive in background via AudioContext trick
  useEffect(() => {
    let ctx: AudioContext | null = null;
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        try {
          ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          gain.gain.value = 0.001;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
        } catch {}
      } else {
        ctx?.close().catch(() => {});
        ctx = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      ctx?.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (backendSettings) {
      setSettings(backendSettings);
    }
  }, [backendSettings]);

  const saveSettings = useCallback(
    (newSettings: AmbiSettings) => {
      setSettings(newSettings);
      updateSettings(newSettings);
    },
    [updateSettings],
  );

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", { description: url });
    } catch {
      toast.error("Could not copy link");
    }
  }, []);

  useEffect(() => {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }

    const shouldRun =
      settings.currentPowerState &&
      settings.screenCaptureActive &&
      screenStream &&
      isSerialConnected &&
      serialPort;

    if (!shouldRun) return;

    const fps = Number(settings.fps);
    const interval = Math.max(1000 / fps, 8);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.srcObject !== screenStream) {
      video.srcObject = screenStream;
      video.play().catch(() => {});
    }

    loopRef.current = setInterval(async () => {
      if (!canvas || !video || video.readyState < 2) return;

      const w = video.videoWidth || 1920;
      const h = video.videoHeight || 1080;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, w, h);
      const colors = sampleEdgePixels(
        ctx,
        w,
        h,
        ledSides.top,
        ledSides.bottom,
        ledSides.left,
        ledSides.right,
      );

      if (colors.length > 0) {
        const avg = colors.reduce(
          (acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]],
          [0, 0, 0],
        );
        setDominantColor([
          Math.round(avg[0] / colors.length),
          Math.round(avg[1] / colors.length),
          Math.round(avg[2] / colors.length),
        ]);
      }

      try {
        if (serialPort?.writable) {
          const writer = serialPort.writable.getWriter();
          const packet = new Uint8Array(1 + colors.length * 3);
          packet[0] = 0xff;
          for (let i = 0; i < colors.length; i++) {
            const [r, g, b] = colors[i];
            packet[1 + i * 3] = r;
            packet[2 + i * 3] = g;
            packet[3 + i * 3] = b;
          }
          await writer.write(packet);
          writer.releaseLock();
        }
      } catch {
        // Ignore write errors
      }
    }, interval);

    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
        loopRef.current = null;
      }
    };
  }, [
    settings.currentPowerState,
    settings.screenCaptureActive,
    settings.fps,
    ledSides,
    screenStream,
    isSerialConnected,
    serialPort,
  ]);

  const bgTint =
    dominantColor && settings.currentPowerState
      ? `radial-gradient(ellipse at 50% 0%, rgba(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]},0.12) 0%, transparent 70%)`
      : "none";

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.055 0.012 225) 0%, oklch(0.075 0.015 225) 100%)",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: bgTint, zIndex: 0 }}
      />

      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} className="hidden" muted playsInline />

      <div className="relative z-10">
        <header
          className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md"
          style={{ background: "oklch(0.055 0.012 225 / 0.85)" }}
        >
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 glow-blue">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                JK <span className="text-primary text-glow-blue">Ambi</span>{" "}
                Light
              </span>
            </div>

            <nav className="flex items-center gap-1 flex-1">
              {NAV_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  data-ocid={`nav.${tab.id}.link`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "text-foreground nav-underline"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground bg-muted/30 hover:text-foreground hover:border-primary/40 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>

            <div
              data-ocid="usb.status.panel"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isSerialConnected
                  ? "border-accent/40 text-accent bg-accent/10 glow-green"
                  : "border-border text-muted-foreground bg-muted/30"
              }`}
            >
              {isSerialConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <Usb className="w-3 h-3" />
              )}
              {isSerialConnected ? "USB Connected" : "USB Disconnected"}
            </div>
          </div>
        </header>

        <main className="max-w-[1200px] mx-auto px-6 pb-16">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center py-12 pb-8">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
                    Illuminate Your World:{" "}
                    <span className="text-primary text-glow-blue">
                      Smart J16 Ambient Lighting.
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                    Control, Schedule, and Sync your LED strips seamlessly via
                    USB.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-5">
                    <LEDControlCard
                      settings={settings}
                      onSave={saveSettings}
                      ledSides={ledSides}
                      setLedSides={setLedSides}
                    />
                    <EffectsCard settings={settings} onSave={saveSettings} />
                  </div>

                  <div className="flex flex-col gap-5">
                    <ScreenCaptureCard
                      settings={settings}
                      onSave={saveSettings}
                      screenStream={screenStream}
                      setScreenStream={setScreenStream}
                    />
                    <ConnectionCard
                      serialPort={serialPort}
                      isConnected={isSerialConnected}
                      setSerialPort={setSerialPort}
                      setIsConnected={setIsSerialConnected}
                    />
                    <AutomationCard settings={settings} onSave={saveSettings} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "effects" && (
              <motion.div
                key="effects"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="py-10"
              >
                <h2 className="text-2xl font-bold mb-6">Lighting Effects</h2>
                <EffectsCard
                  settings={settings}
                  onSave={saveSettings}
                  fullWidth
                />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="py-10"
              >
                <SettingsTab
                  settings={settings}
                  onSave={saveSettings}
                  isSerialConnected={isSerialConnected}
                  serialPort={serialPort}
                  setSerialPort={setSerialPort}
                  setIsConnected={setIsSerialConnected}
                />
              </motion.div>
            )}

            {activeTab === "hardware" && (
              <motion.div
                key="hardware"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="py-10"
              >
                <HardwareTab />
              </motion.div>
            )}

            {activeTab === "guide" && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="py-10"
              >
                <GuideTab />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-border/30 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} JK Ambi Light. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      <Toaster
        theme="dark"
        toastOptions={{ className: "!bg-card !border-border !text-foreground" }}
      />
    </div>
  );
}

function sampleEdgePixels(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
): [number, number, number][] {
  const leds: [number, number, number][] = [];
  const sample = (x: number, y: number): [number, number, number] => {
    const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  for (let i = 0; i < top; i++) {
    leds.push(sample((i / top) * w, 1));
  }
  for (let i = 0; i < right; i++) {
    leds.push(sample(w - 2, (i / right) * h));
  }
  for (let i = 0; i < bottom; i++) {
    leds.push(sample(((bottom - i) / bottom) * w, h - 2));
  }
  for (let i = 0; i < left; i++) {
    leds.push(sample(1, ((left - i) / left) * h));
  }

  return leds;
}

export { toast };
