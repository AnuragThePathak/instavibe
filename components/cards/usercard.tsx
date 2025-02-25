import { Models } from "node-appwrite";
import Link from "next/link";

import AvatarWrapper from "@/components/wrappers/avatarwrapper"
import { Button } from "@/components/ui/button"

type UserCardProps = {
  user: Models.Document;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/profile/${user.$id}`} className="user-card">
			<AvatarWrapper email={user.email} className="w-14 h-14" />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
}