import "styles/shared/Button.scss";
import styles from "styles/global/styles.module.scss";
import { Icon } from "components/shared";

interface Props {
  handleClick: Function;
  size?: "Regular" | "Large";
  color?: "Negative" | "Neutral" | "Positive";
  icon?: string;
  text?: string;
  width?: number;
  isDisabled?: boolean;
  isDark?: boolean;
}

export const Button: React.FC<Props> = ({
  handleClick = () => {},
  size = "Regular",
  color = "Neutral",
  icon,
  text,
  width,
  isDisabled = false,
  isDark = false,
}) => {
  const computeClassName = (): string => {
    const sizeClass =
      size === "Regular" ? "ds-button-regular" : "ds-button-large";
    const colorClass =
      color === "Negative"
        ? "ds-button-negative"
        : color === "Neutral"
        ? "ds-button-neutral"
        : "ds-button-positive";

    // Those are there just in case for now
    const isDisabledClass = isDisabled ? "ds-button-disabled" : "";
    const isDarkClass = isDark ? "ds-button-dark" : "";
    const isIconClass = icon && !text ? "ds-button-icon" : "";

    // Weird syntax, but helps with formatting and readability
    return [
      "ds-button",
      "ds-flex-center",
      isIconClass ? "ds-flex-row-center" : "ds-flex-row-between",
      "ds-rounded",
      sizeClass,
      colorClass,
      isDisabledClass,
      isDarkClass,
      isIconClass,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const computeTextClassName = (): string => {
    const sizeSuffix = size === "Regular" ? "" : "-l";
    const hasIconClass = icon ? "" : "ds-margin-auto-x";
    return ["ds-text-button" + sizeSuffix, "ds-margin-auto-y", hasIconClass]
      .filter(Boolean)
      .join(" ");
  };

  const computeIconClassName = (): string => {
    const sizeSuffix = size === "Regular" ? "" : "-l";
    return ["ds-icon-button" + sizeSuffix].filter(Boolean).join(" ");
  };

  return (
    <div
      className={computeClassName()}
      style={width ? { width: width + "rem" } : {}}
      onClick={() => handleClick()}
    >
      {icon ? (
        <div className={computeIconClassName()}>
          <Icon {...{ icon, size }} />
        </div>
      ) : null}
      {text ? <div className={computeTextClassName()}>{text}</div> : null}
    </div>
  );
};
