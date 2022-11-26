import "styles/shared/Button.scss";
import { Icon } from "components/shared";

interface Props {
  handleClick: Function;
  size?: "Regular" | "Large";
  color?: "Main" | "Negative" | "Neutral" | "Positive";
  icon?: string;
  text?: string;
  width?: number;
  isDisabled?: boolean;
}

export const Button: React.FC<Props> = ({
  handleClick = () => {},
  size = "Regular",
  color = "Main",
  icon,
  text,
  width,
  isDisabled = false,
}) => {
  const computeClassName = (): string => {
    const sizeClass =
      size === "Regular" ? "ds-button-regular" : "ds-button-large";

    let colorClass: string;
    switch (color) {
      case "Neutral":
        colorClass = "ds-button-neutral";
        break;
      case "Positive":
        colorClass = "ds-button-positive";
        break;
      case "Negative":
        colorClass = "ds-button-negative";
        break;
      default:
        colorClass = "ds-button-main";
        break;
    }

    // Those are there just in case for now
    const isDisabledClass = isDisabled ? "ds-button-disabled" : "";
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
    <button
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
    </button>
  );
};
