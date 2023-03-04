class ButtonService {
  public getClasses(
    variant?: string,
    outline?: boolean,
    intent?: string,
    disabled?: boolean,
    className?: string
  ) {
    const base = [
      "pa-button",
      [variant, `pa-button--${variant}`],
      [outline, "pa-button--outline"],
      [intent, `is-${intent}`],
      [disabled, "is-disabled"],
      className || "",
    ]
      .filter(Boolean)
      .join(" ");

    return { base };
  }
}

export const buttonService = new ButtonService();
