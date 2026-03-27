import { Download, Monitor, Settings, Share2, Usb, Zap } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    icon: <Download className="w-5 h-5" />,
    title: "1. Get the Hardware",
    description:
      "Purchase an Arduino Nano and a WS2812B LED strip. You'll need at least 30–60 LEDs for a good ambient effect around your screen.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "2. Wire It Up",
    description:
      "Connect VCC → 5V, GND → GND, and D6 → DATA pin. See the Hardware tab for the wiring diagram and FastLED Arduino sketch.",
  },
  {
    icon: <Usb className="w-5 h-5" />,
    title: "3. Connect via USB",
    description:
      "Plug the Arduino Nano into your PC via USB. Open JK Ambi Light in Chrome or Edge, go to Dashboard, and click 'Connect USB Arduino'.",
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
      "Set the LED count to match your strip, choose effects, set a schedule for auto on/off, and adjust FPS in Settings (10–114 FPS supported).",
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
    a: "The app supports up to 300 LEDs. For more, you may need to reduce FPS to avoid serial bottlenecks.",
  },
  {
    q: "Does it work on TV?",
    a: "Yes! Open the app in Chrome on a PC connected to your TV, or use a Chromebook. The TV acts as your display and the LED strip goes around it.",
  },
  {
    q: "What LED strip should I buy?",
    a: "WS2812B (NeoPixel) strips are recommended — they're affordable and widely available. 60 LEDs/meter density works well for most screens.",
  },
];

export default function GuideTab() {
  return (
    <div data-ocid="guide.panel">
      <h2 className="text-2xl font-bold mb-2">Getting Started Guide</h2>
      <p className="text-muted-foreground mb-8">
        Follow these steps to set up JK Ambi Light in minutes.
      </p>

      <div className="max-w-2xl space-y-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            data-ocid={`guide.item.${i + 1}`}
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
