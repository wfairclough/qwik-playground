import { onMount, Show, useMetadata, useStore } from "@builder.io/mitosis";
import "./button.css";
import { buttonService } from "./button.service";

useMetadata({ isAttachedToShadowDom: true });

export interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  outline?: boolean;
  intent?: "success" | "warning" | "danger";
  disabled?: boolean;
  classList?: string; // Fallback class
  className?: string;
  class?: string; // Fallback className
  children?: Children;
}

export type ButtonState = {
  classes: { base: string };
  loaded: boolean;
};

export type Children = any; // TODO

export default function Button(props: ButtonProps) {
  const state = useStore<ButtonState>({
    loaded: false,
    classes: { base: "" },
  });

  onMount(() => {
    state.loaded = true;
    state.classes = buttonService.getClasses(
      props.variant,
      props.outline,
      props.intent,
      props.disabled,
      props.className
    );
  });

  return (
    <Show when={state.loaded}>
      <button class={state.classes.base}>{props.children}</button>
    </Show>
  );
}
