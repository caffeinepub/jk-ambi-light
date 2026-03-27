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

const TV_STEPS = [
  {
    title: "Open Chrome or Edge on your TV",
    description:
      "Android TVs can install Chrome from the Play Store. Alternatively, connect a PC or laptop to the TV via HDMI — the browser then runs on the PC while the image shows on the TV.",
  },
  {
    title: "Navigate to this app",
    description: null,
  },
  {
    title: "Plug in the J16 device",
    description:
      "Insert the J16 USB cable into a USB port on the same device that is running the browser (PC, laptop, or the TV itself).",
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
    title: "Done! LEDs sync with the screen",
    description:
      "The LED strip will now mirror the border colours of whatever is on your screen in real time.",
  },
];

const TV_TIPS = [
  "Use HDMI to connect a laptop or PC to your TV for the best experience.",
  "Android TV with Chrome can also work — install Chrome from the Play Store.",
  "The J16 USB cable should go into the same device running the browser.",
  "Web Serial (USB) only works in Chrome and Edge — not Firefox or Safari.",
];

const STEPS = [
  {
    icon: <Download className="w-5 h-5" />,
    title: "1. Get the Hardware",
    description:
      "Purchase a J16 controller and a WS2812B LED strip. You'll need at least 30\u201360 LEDs for a good ambient effect around your screen.",
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
      "Plug the J16 into your PC or TV via USB. Open J16 Ambi Light in Chrome or Edge, go to Dashboard, and click 'Connect USB'.",
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: "4. Enable Screen Sync",
    description:
      "Toggle 'Ambilight Sync' in the Screen Capture card. Select which display to capture. The app will sample edge pixels and send colours to your LEDs at the configured FPS.",
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
      "The app is free to share! Scan the QR code in the Connection card to send the link to friends and family. Works on PC and TV.",
  },
];

const FAQ = [
  {
    q: "Why doesn't USB connect work?",
    a: "Web Serial API only works in Chrome and Edge browsers. Firefox is not supported.",
  },
  {
    q: "Can I use more than 300 LEDs?",
    a: "The app supports up to 500 LEDs. For more, you may need to reduce FPS to avoid serial bottlenecks.",
  },
  {
    q: "Does it work on TV?",
    a: "Yes! Connect your PC or laptop to the TV via HDMI, open this app in Chrome, plug J16 into USB, and you're set. Android TVs with Chrome installed also work.",
  },
  {
    q: "What LED strip should I buy?",
    a: "WS2812B (NeoPixel) strips are recommended — they're affordable and widely available. 60 LEDs/meter density works well for most screens.",
  },
];

export default function GuideTab() {
  const appUrl =
    typeof window !== "undefined" ? window.location.href : "this page";

  return (
    <div data-ocid="guide.panel">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
