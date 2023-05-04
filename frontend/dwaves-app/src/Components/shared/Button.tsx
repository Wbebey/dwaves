import styles from "@/styles/shared/styles.module.scss";
import { Icon } from "components/shared";

interface Props {
  handleClick: Function;
  size: "Regular" | "Large";
  color: "Negative" | "Neutral" | "Positive";
  icon?: string;
  text?: string;
  isDisabled: boolean;
  isDark: boolean;
}

export const Button = ({
  handleClick = () => {},
  size = "Regular",
  color = "Neutral",
  // icon,
  // text,
  isDisabled = false,
  isDark = false,
}) => {
  return <div className="ds-button" onClick={() => handleClick()} />;
};
