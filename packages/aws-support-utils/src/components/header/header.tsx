import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { SuiteSpotLogo } from '../icons/qwik';
import styles from './header.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href="https://support-utils.suitespot.dev/" title="SuiteSpot">
          <SuiteSpotLogo size="160px" />
        </a>
      </div>
      <div class="title">
        <h3>Support Utils</h3>
      </div>
    </header>
  );
});
