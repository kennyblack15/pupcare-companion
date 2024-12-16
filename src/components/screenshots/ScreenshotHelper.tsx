import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEVICE_SIZES = {
  "iPhone 6.5": { width: 1284, height: 2778 },
  "iPhone 5.5": { width: 1242, height: 2208 },
  "iPad Pro": { width: 2048, height: 2732 },
};

export function ScreenshotHelper() {
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof DEVICE_SIZES>("iPhone 6.5");
  const [showHelper, setShowHelper] = useState(true);

  const handleDownload = () => {
    // Hide the helper UI before capturing
    setShowHelper(false);
    setTimeout(() => {
      // Capture screenshot logic would go here
      // For now, we'll just show the helper UI again
      setShowHelper(true);
    }, 100);
  };

  if (!showHelper) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg z-50 flex gap-4 items-center">
      <Select
        value={selectedDevice}
        onValueChange={(value) => setSelectedDevice(value as keyof typeof DEVICE_SIZES)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select device" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(DEVICE_SIZES).map((device) => (
            <SelectItem key={device} value={device}>
              {device}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-sm text-gray-500">
        {DEVICE_SIZES[selectedDevice].width} x {DEVICE_SIZES[selectedDevice].height}
      </div>

      <Button onClick={handleDownload} variant="default">
        Capture Screenshot
      </Button>
    </div>
  );
}