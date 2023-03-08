import { component$, useStyles$ } from "@builder.io/qwik";
import { QOverviewFlow_ } from "../../integrations/react/flow";
import styles from "../../integrations/react/overview.css?inline";

export const QOverviewFlow = component$(() => {
  useStyles$(styles);
  return (
    <div class="flow-wrapper">
      <QOverviewFlow_ client:load />
    </div>
  );
});
