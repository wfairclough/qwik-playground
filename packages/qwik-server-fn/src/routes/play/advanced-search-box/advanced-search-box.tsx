import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './advanced-search-box.css?inline';

export const AdvancedSearchBox = component$(() => {
  useStylesScoped$(styles);
  return (<>
    <div class="advanced-search-box" contentEditable="true">
      <p spellcheck={false}>
        <span class="token mark-search-field">Property</span>
        <span class="token mark-search-operator">=</span>
        <span class="token mark-search-value">123 Main St</span>
      </p>
    </div>
  </>);
});
