import * as IconSax from "iconsax-react";
import styles from "@/styles/shared/styles.module.scss";

interface Props {
  icon: string;
  variant: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  size: "Small" | "Regular" | "Large";
  small: boolean;
  color: string;
}

export const Icon: React.FC<Props> = ({
  icon = "info",
  variant = "Linear",
  size = "Regular",
  color = styles.colMainDark,
}) => {
  const icons: { [key: string]: IconSax.Icon } = {
    play: IconSax.Play,
    pause: IconSax.Pause,
    next: IconSax.Next,
    previous: IconSax.Previous,
    loop: IconSax.ArrowRotateLeft,
    random: IconSax.ArrowSwapHorizontal,
    like: IconSax.Like,
    dislike: IconSax.Dislike,
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
    close: IconSax.CloseSquare,
    home: IconSax.Home2,
    return: IconSax.Back,
  };
  const Icon: IconSax.Icon = icons[icon];

  return (
    <Icon
      variant={variant}
      size={size === "Small" ? 18 : size === "Regular" ? 24 : 32}
      color={color}
    />
  );
};
