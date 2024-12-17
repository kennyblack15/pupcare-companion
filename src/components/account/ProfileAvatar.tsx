import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STORAGE_URL = "https://uxbfgennjhmsoglrcuwl.supabase.co/storage/v1/object/public/avatars";

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullName?: string;
  className?: string;
}

export function ProfileAvatar({ avatarUrl, fullName, className = "w-24 h-24" }: ProfileAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage 
        src={avatarUrl ? `${STORAGE_URL}/${avatarUrl}` : undefined} 
        alt="Profile" 
      />
      <AvatarFallback>{fullName?.charAt(0) || '?'}</AvatarFallback>
    </Avatar>
  );
}