import { Button } from "@/components/ui/button";
import {
  Download,
  Monitor,
  Settings,
  Share2,
  Tv,
  Usb,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const TV_STEPS = [
  {
    title: "Open Chrome or Edge on your Smart TV",
    description:
      "Android TVs and Smart TVs with Chrome or Edge browser are supported. Install Chrome from the Play Store if needed.",
  },
  {
    title: "Navigate to this app",
    description: null,
  },
  {
    title: "Plug in the J16 device",
    description: "Insert the J16 USB cable into a USB port on your Smart TV.",
  },
  {
    title: "Click \u201cConnect USB\u201d in the Dashboard tab",
    description:
      "The browser will show a device-picker popup. Select the J16 device and click Connect.",
  },
  {
    title: "Enable Ambilight Sync",
    description:
      "In the Screen Capture card, toggle 'Ambilight Sync' on and choose which display to capture.",
  },
  {
    title: "Done! LEDs sync with your TV screen",
    description:
      "The LED strip will now mirror the border colours of whatever is on your TV in real time.",
  },
];

const TV_TIPS = [
  "Android TV and Smart TVs with Chrome or Edge work great.",
  "Install Chrome from the Google Play Store if your TV doesn't have it.",
  "The J16 USB cable should go into a USB port on your TV.",
  "Web Serial (USB) only works in Chrome and Edge — not Firefox or Safari.",
];

const STEPS = [
  {
    icon: <Download className="w-5 h-5" />,
    title: "1. Get the Hardware",
    description:
      "Purchase a J16 controller and a WS2812B LED strip. You'll need at least 30\u201360 LEDs for a good ambient effect around your TV.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "2. Wire It Up",
    description:
      "Connect VCC \u2192 5V, GND \u2192 GND, and D6 \u2192 DATA pin. See the Hardware tab for the FastLED sketch.",
  },
  {
    icon: <Usb className="w-5 h-5" />,
    title: "3. Connect via USB",
    description:
      "Plug the J16 into your Smart TV via USB. Open J16 Ambi Light in Chrome or Edge, go to Dashboard, and click 'Connect USB'.",
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: "4. Enable Screen Sync",
    description:
      "Toggle 'Ambilight Sync' in the Screen Capture card. Select the display to capture. The app samples edge pixels and sends colours to your LEDs at the configured FPS.",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "5. Configure & Customise",
    description:
      "Set the LED count to match your strip, choose effects, set a schedule for auto on/off, and adjust FPS in Settings (10\u2013114 FPS supported).",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "6. Share the App",
    description:
      "The app is free to share! Scan the QR code in the Connection card to send the link to friends and family. Works on any Smart TV.",
  },
];

const FAQ = [
  {
    q: "Why doesn't USB connect work?",
    a: "Web Serial API only works in Chrome and Edge browsers. Make sure your Smart TV has Chrome or Edge installed.",
  },
  {
    q: "Can I use more than 300 LEDs?",
    a: "The app supports up to 500 LEDs. For more, you may need to reduce FPS to avoid serial bottlenecks.",
  },
  {
    q: "Does it work on Smart TV?",
    a: "Yes! Install Chrome or Edge on your Smart TV, open this app, plug J16 into your TV's USB port, and you're set.",
  },
  {
    q: "What LED strip should I buy?",
    a: "WS2812B (NeoPixel) strips are recommended — they're affordable and widely available. 60 LEDs/meter density works well for most TVs.",
  },
];

export default function GuideTab() {
  const appUrl =
    typeof window !== "undefined" ? window.location.href : "this page";
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    } else {
      toast.info(
        'To install: tap the Chrome menu (\u22ee) and choose "Add to Home Screen"',
        { duration: 5000 },
      );
    }
  };

  return (
    <div data-ocid="guide.panel">
      {/* Install on TV card */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-glass p-5 mb-8 border border-primary/20"
        data-ocid="guide.install.card"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Install App on Your TV</h2>
            <p className="text-xs text-muted-foreground">
              Works offline · Fullscreen · Background sync
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Install J16 Ambi Light as a native app on your TV or device. Once
          installed, it runs in the background and keeps your LEDs synced even
          when you switch apps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="card-glass p-3 text-center">
            <div className="text-2xl mb-1">📺</div>
            <p className="text-xs font-semibold mb-0.5">Open in Chrome</p>
            <p className="text-xs text-muted-foreground">On your Smart TV</p>
          </div>
          <div className="card-glass p-3 text-center">
            <div className="text-2xl mb-1">⬇️</div>
            <p className="text-xs font-semibold mb-0.5">Tap Install</p>
            <p className="text-xs text-muted-foreground">
              Use the button below or Chrome menu → "Add to Home Screen"
            </p>
          </div>
          <div className="card-glass p-3 text-center">
            <div className="text-2xl mb-1">🚀</div>
            <p className="text-xs font-semibold mb-0.5">Launch & Run</p>
            <p className="text-xs text-muted-foreground">
              Opens fullscreen and syncs LEDs in the background
            </p>
          </div>
        </div>

        <Button
          onClick={handleInstall}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          size="lg"
          data-ocid="guide.install.button"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App Now
        </Button>

        {!installPrompt && (
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-green-400">✓</span>
            App may already be installed — button will still guide you if
            needed.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-2xl mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
            <Tv className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold">TV Setup Guide</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Get J16 Ambi Light running on your TV in six simple steps.
        </p>

        <div className="space-y-3">
          {TV_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              data-ocid={`guide.item.${i + 1}`}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="card-glass p-4 flex gap-4 items-start"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold mb-0.5">{step.title}</p>
                {i === 1 ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In the browser address bar, type or paste:{" "}
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded break-all">
                      {appUrl}
                    </span>
                  </p>
                ) : (
                  step.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            TV Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TV_TIPS.map((tip, i) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05, duration: 0.25 }}
                className="card-glass p-3 flex gap-2 items-start border-l-2 border-primary/50"
              >
                <span className="text-primary mt-0.5">💡</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tip}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <hr className="border-border/50 mb-10" />

      <h2 className="text-2xl font-bold mb-2">Getting Started Guide</h2>
      <p className="text-muted-foreground mb-8">
        Follow these steps to set up J16 Ambi Light in minutes.
      </p>

      <div className="max-w-2xl space-y-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            data-ocid={`guide.step.${i + 1}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="card-glass p-5 flex gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
              {step.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mt-10">
        <h3 className="text-lg font-bold mb-4">FAQ</h3>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <div key={item.q} className="card-glass p-4">
              <p className="text-sm font-semibold mb-1">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
