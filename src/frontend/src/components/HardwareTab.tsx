import { Cable, Cpu, Info, Zap } from "lucide-react";

const WIRING = [
  { arduino: "VCC", strip: "5V", color: "#FF4444" },
  { arduino: "GND", strip: "GND", color: "#888888" },
  { arduino: "D6", strip: "DATA", color: "#44AAFF" },
];

export default function HardwareTab() {
  return (
    <div data-ocid="hardware.panel">
      <h2 className="text-2xl font-bold mb-2">Hardware Setup</h2>
      <p className="text-muted-foreground mb-8">
        Connect your Arduino Nano to a WS2812B or NeoPixel LED strip.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {/* Wiring table */}
        <div data-ocid="hardware.card" className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cable className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Wiring Connections</h3>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 text-xs text-muted-foreground font-medium pb-2 border-b border-border/50">
              <span>Arduino</span>
              <span className="text-center">→</span>
              <span className="text-right">LED Strip</span>
            </div>
            {WIRING.map((w) => (
              <div
                key={w.arduino}
                className="grid grid-cols-3 items-center py-2"
              >
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: w.color }}
                >
                  {w.arduino}
                </span>
                <div className="flex items-center justify-center">
                  <div
                    className="h-0.5 w-10 rounded"
                    style={{ backgroundColor: w.color }}
                  />
                </div>
                <span
                  className="text-sm font-bold font-mono text-right"
                  style={{ color: w.color }}
                >
                  {w.strip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div data-ocid="hardware.card" className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Hardware Specs</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: "Microcontroller", value: "Arduino Nano" },
              { label: "LED Type", value: "WS2812B / NeoPixel" },
              { label: "Data Pin", value: "Digital D6" },
              { label: "Power", value: "5V (USB or external)" },
              { label: "Baud Rate", value: "115200" },
              { label: "Protocol", value: "USB Serial" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium font-mono text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arduino sketch tip */}
        <div className="md:col-span-2 card-glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Arduino Sketch (FastLED)</h3>
          </div>
          <pre className="text-xs font-mono text-muted-foreground bg-muted/20 rounded-lg p-4 overflow-x-auto border border-border/50">
            {`#include <FastLED.h>
#define DATA_PIN    6
#define NUM_LEDS    30  // Change to your LED count
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

void setup() {
  Serial.begin(115200);
  FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS);
  FastLED.setBrightness(200);
}

void loop() {
  if (Serial.available() > 0 && Serial.read() == 0xFF) {
    for (int i = 0; i < NUM_LEDS; i++) {
      while (Serial.available() < 3) {}
      leds[i].r = Serial.read();
      leds[i].g = Serial.read();
      leds[i].b = Serial.read();
    }
    FastLED.show();
  }
}`}
          </pre>
          <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Upload this sketch to your Arduino Nano using the Arduino IDE.
              Install FastLED library via Library Manager. Set NUM_LEDS to match
              your LED count in the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
