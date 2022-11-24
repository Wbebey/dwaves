import "styles/shared/Button.scss";
import styles from "styles/global/styles.module.scss";
import { Icon } from "components/shared";

interface Props {
  handleClick: Function;
  size?: "Regular" | "Large";
  color?: "Negative" | "Neutral" | "Positive";
  icon?: string;
  text?: string;
  isDisabled?: boolean;
  isDark?: boolean;
}

export const Button: React.FC<Props> = ({
  handleClick = () => {},
  size = "Regular",
  color = "Neutral",
  icon,
  text,
  isDisabled = false,
  isDark = false,
}) => {
  const computeClassName = (): string => {
    const sizeClass =
      size === "Regular" ? "ds-button-regular" : "ds-button-small";
    const colorClass =
      color === "Negative"
        ? "ds-button-negative"
        : color === "Neutral"
        ? "ds-button-neutral"
        : "ds-button-positive";

    // Those are there just in case for now
    const isDisabledClass = isDisabled ? "ds-button-disabled" : "";
    const isDarkClass = isDark ? "ds-button-dark" : "";

    // Weird syntax, but helps with formatting and readability
    return [
      "ds-button",
      "ds-flex-row-between",
      "ds-align-self-center",
      sizeClass,
      colorClass,
      isDisabledClass,
      isDarkClass,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const computeTextClassName = (): string => {
    const sizeSuffix = size === "Regular" ? "" : "-l";
    return "ds-text-button" + sizeSuffix;
  };

  return (
    <div className={computeClassName()} onClick={() => handleClick()}>
      {icon ? (
        <div>
          <Icon {...{ icon, size }} />
        </div>
      ) : null}
      {text ? <div className={computeTextClassName()}>{text}</div> : null}
    </div>
  );
};
