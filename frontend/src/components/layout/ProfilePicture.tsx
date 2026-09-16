import { Profile } from "@/lib/api/my_profil_info";
import { getInitials } from "@/utils/getInitials";

export const ProfilePicture = ({
  profile,
  size,
  onClick,
}: {
  profile: Profile | null;
  size: "sm" | "lg";
  onClick?: () => void;
}) => {
  const initials = getInitials(profile);
  let className = ``;
  let fontSize = ``;

  switch (size) {
    case "sm":
      className = "w-9 h-9";
      fontSize = "text-sm";
      break;
    case "lg":
      className = "w-32 h-32";
      fontSize = "text-5xl";
      break;
    default:
      className = "w-9 h-9";
      fontSize = "text-sm";
  }

  return (
    <button
      onClick={onClick}
      className={`${className} rounded-full bg-[var(--accent)] flex items-center justify-center ${onClick ? "cursor-pointer" : ""}`}
    >
      {profile?.photo_url ? (
        <img
          src={profile.photo_url}
          alt={profile.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span
          className={`text-[var(--accent-foreground)] font-semibold ${fontSize}`}
        >
          {initials}
        </span>
      )}
    </button>
  );
};
