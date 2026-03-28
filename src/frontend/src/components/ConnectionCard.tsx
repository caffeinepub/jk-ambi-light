import { Button } from "@/components/ui/button";
import { CheckCircle, Share2, Usb, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  serialPort: SerialPort | null;
  isConnected: boolean;
  setSerialPort: (p: SerialPort | null) => void;
  setIsConnected: (v: boolean) => void;
}

export default function ConnectionCard({
  serialPort,
  isConnected,
  setSerialPort,
  setIsConnected,
}: Props) {
  const isSerialSupported = !!(navigator as Navigator).serial;

  const connect = async () => {
    if (!isSerialSupported) {
      toast.error("Web Serial not supported. Use Chrome or Edge browser.");
      return;
    }
    try {
      const port = await (navigator as Navigator).serial!.requestPort();
      await port.open({ baudRate: 115200 });
      setSerialPort(port);
      setIsConnected(true);
      toast.success("J16 connected!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("cancelled") && !msg.includes("No port selected")) {
        toast.error(`Connection failed: ${msg}`);
      }
    }
  };

  const disconnect = async () => {
    try {
      await serialPort?.close();
    } catch {
      // ignore
    }
    setSerialPort(null);
    setIsConnected(false);
    toast.success("Disconnected from J16.");
  };

  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=140x140&chl=${encodeURIComponent(window.location.href)}&choe=UTF-8`;

  return (
    <div data-ocid="connection.card" className="card-glass p-5">
      <div className="flex items-center gap-2 mb-4">
        <Usb
          className={`w-5 h-5 ${
            isConnected ? "text-accent" : "text-muted-foreground"
          }`}
        />
        <h2 className="text-lg font-bold">Connection Status</h2>
      </div>

      {/* USB Status */}
      <div
        className={`flex items-center gap-3 p-3 rounded-xl border mb-4 transition-all ${
          isConnected
            ? "border-accent/40 bg-accent/10 glow-green"
            : "border-border bg-muted/20"
        }`}
      >
        {isConnected ? (
          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex-1">
          <p
            className={`text-sm font-semibold ${
              isConnected ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {isConnected ? "J16 Connected" : "Not Connected"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isConnected
              ? "115200 baud · USB Serial"
              : isSerialSupported
                ? "Connect J16 to your TV's USB port"
                : "Your TV needs Chrome or Edge browser"}
          </p>
        </div>
      </div>

      {isConnected ? (
        <Button
          data-ocid="connection.delete_button"
          variant="outline"
          size="sm"
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 mb-4"
          onClick={disconnect}
        >
          Disconnect
        </Button>
      ) : (
        <Button
          data-ocid="connection.primary_button"
          size="sm"
          className="w-full bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 mb-4"
          onClick={connect}
          disabled={!isSerialSupported}
        >
          <Usb className="w-4 h-4 mr-2" />
          Connect USB J16
        </Button>
      )}

      {/* QR Code Share */}
      <div className="border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Share this app</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            data-ocid="connection.panel"
            className="bg-white p-1.5 rounded-lg flex-shrink-0"
          >
            <img
              src={qrUrl}
              alt="QR Code to share this app"
              width={112}
              height={112}
              className="block"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground mb-1">
              Scan to open JK Ambi Light
            </p>
            <p className="text-xs text-muted-foreground break-all">
              {window.location.href.substring(0, 40)}
              {window.location.href.length > 40 ? "..." : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
