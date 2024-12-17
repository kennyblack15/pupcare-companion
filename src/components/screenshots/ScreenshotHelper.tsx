import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import html2canvas from "html2canvas";
import { useToast } from "@/components/ui/use-toast";

const DEVICE_SIZES = {
  "iPhone 6.5": { width: 1284, height: 2778 },
  "iPhone 5.5": { width: 1242, height: 2208 },
  "iPad Pro": { width: 2048, height: 2732 },
};

export function ScreenshotHelper() {
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof DEVICE_SIZES>("iPhone 6.5");
  const [showHelper, setShowHelper] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsCapturing(true);
      setShowHelper(false);

      // Wait for helper UI to hide
      await new Promise(resolve => setTimeout(resolve, 100));

      const mainElement = document.querySelector('main');
      if (!mainElement) {
        throw new Error('Could not find main element');
      }

      // Set temporary styles for screenshot
      const originalStyles = {
        width: mainElement.style.width,
        height: mainElement.style.height,
        transform: mainElement.style.transform,
        transformOrigin: mainElement.style.transformOrigin,
      };

      // Calculate scale to match device dimensions
      const scale = DEVICE_SIZES[selectedDevice].width / mainElement.offsetWidth;
      
      mainElement.style.width = `${mainElement.offsetWidth}px`;
      mainElement.style.height = `${DEVICE_SIZES[selectedDevice].height / scale}px`;
      mainElement.style.transform = `scale(${scale})`;
      mainElement.style.transformOrigin = 'top left';

      const canvas = await html2canvas(mainElement, {
        scale: 1,
        width: DEVICE_SIZES[selectedDevice].width,
        height: DEVICE_SIZES[selectedDevice].height,
        windowWidth: mainElement.offsetWidth * scale,
        windowHeight: DEVICE_SIZES[selectedDevice].height,
      });

      // Restore original styles
      Object.assign(mainElement.style, originalStyles);

      // Create download link
      const link = document.createElement('a');
      link.download = `pawcare-${selectedDevice.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Screenshot captured!",
        description: `Saved as ${link.download}`,
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      toast({
        title: "Screenshot failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setShowHelper(true);
      setIsCapturing(false);
    }
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

      <Button 
        onClick={handleDownload} 
        variant="default"
        disabled={isCapturing}
      >
        {isCapturing ? "Capturing..." : "Capture Screenshot"}
      </Button>
    </div>
  );
}
