import { Info, Zap } from "lucide-react";

export default function HardwareTab() {
  return (
    <div data-ocid="hardware.panel">
      <h2 className="text-2xl font-bold mb-2">Hardware Setup</h2>
      <p className="text-muted-foreground mb-8">
        Connect your J16 to a WS2812B or NeoPixel LED strip.
      </p>

      <div className="max-w-3xl">
        {/* Sketch */}
        <div className="card-glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">J16 Sketch (FastLED)</h3>
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
              Upload this sketch to your J16 using the IDE. Install FastLED
              library via Library Manager. Set NUM_LEDS to match your LED count
              in the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
