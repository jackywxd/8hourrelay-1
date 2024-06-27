import { AvatarProps } from '@radix-ui/react-avatar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { User } from '@supabase/supabase-js';

interface UserAvatarProps extends AvatarProps {
  user: Partial<User>;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.user_metadata?.avatar_url ? (
        <AvatarImage alt="Picture" src={user.user_metadata?.avatar_url} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.email}</span>
          <Icons.user className="h-6 w-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
