import React from "react";

export default function PrimaryButton({
  onClick,
  children,
  type = "button",
  className = "",
  icon = null,
  variant = "dark",
  disabled = false,
}) {
  const variantClass =
    variant === "light"
      ? "primary-button primary-button--light"
      : "primary-button";
  const hasText =
    children !== undefined && children !== null && children !== "";
  const hasIcon = !!icon;

  const gapClass = hasIcon && hasText ? "gap-2" : "gap-0";
  const sizeClass =
    hasIcon && !hasText
      ? "w-9 h-9 p-0 justify-center" // icon button
      : "px-3 py-2";

  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${gapClass} ${sizeClass} ${disabledClass} ${className}`}
    >
      {hasIcon ? <span className="inline-flex">{icon}</span> : null}
      {hasText ? <span>{children}</span> : null}
    </button>
  );
}
