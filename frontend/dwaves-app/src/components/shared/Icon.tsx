import * as IconSax from "iconsax-react";
import { MouseEventHandler } from "react";
import styles from "styles/global/styles.module.scss";

interface Props {
  icon: string;
  variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  size?: "Small" | "Regular" | "Large";
  color?: string;
  onClick?: MouseEventHandler;
  contentBackground?: string;
}

export const Icon: React.FC<Props> = ({
  icon = "info",
  variant = "Linear",
  size = "Regular",
  color = styles.colMainDark,
  contentBackground,
  onClick,
}) => {
  const icons: { [key: string]: IconSax.Icon } = {
    play: IconSax.Play,
    pause: IconSax.Pause,
    next: IconSax.Next,
    previous: IconSax.Previous,
    loop: IconSax.ArrowRotateLeft,
    random: IconSax.ArrowSwapHorizontal,
    like: IconSax.Heart,
    dislike: IconSax.HeartSlash,
    alertPos: IconSax.TickCircle,
    alertNeutral: IconSax.InfoCircle,
    alertNeg: IconSax.Danger,
    edit: IconSax.Edit2,
    settings: IconSax.Setting2,
    add: IconSax.AddCircle,
    remove: IconSax.CloseCircle,
    search: IconSax.SearchNormal1,
    user: IconSax.ProfileCircle,
    playlist: IconSax.MusicFilter,
    song: IconSax.MusicCircle,
    close: IconSax.CloseSquare,
    home: IconSax.Home2,
    return: IconSax.Back,
    upload: IconSax.DocumentUpload,
    trash: IconSax.Trash,
    save: IconSax.Add,
    star: IconSax.Star1
  };
  const Icon: IconSax.Icon = icons[icon];

  return (
    <Icon
      variant={variant}
      size={size === "Small" ? 18 : size === "Regular" ? 24 : 32}
      color={color}
      onClick={onClick}
    />
  );
};
