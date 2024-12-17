import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AvatarUploadProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUpload({ isUploading, onFileChange }: AvatarUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Profile Picture</Label>
      <Input
        id="avatar"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
}