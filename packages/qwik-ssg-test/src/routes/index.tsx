import { component$, useSignal, useBrowserVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import { type IonModal } from '@ionic/core/components/ion-modal';
import { type IonToggle } from '@ionic/core/components/ion-toggle';
import { type ToggleCustomEvent } from '@ionic/core';

export default component$(() => {
  console.log('rendering Main Route');
  const modalRef = useSignal<IonModal>();
  const isChecked = useSignal<boolean>(true);
  const toggleRef = useSignal<IonToggle>();

  useBrowserVisibleTask$(({ track, cleanup }) => {
    const toggle = track(() => toggleRef.value);
    if (!toggle) {
      return;
    }
    const changeListener = (e: ToggleCustomEvent) => {
      console.log(e);
      isChecked.value = e.detail.checked;
    };
    toggle.addEventListener('ionChange', changeListener as any);

    cleanup(() => {
      toggle.removeEventListener('ionChange', changeListener as any);
    });
  });

  return (<>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Welcome to Qwik</ion-title>
          <ion-toggle ref={toggleRef} slot="end" color="white" checked={isChecked.value}>

          </ion-toggle>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <p>
          This is a starter template for building a Qwik site.
        </p>
        <p>
          <Link href="/docs">Read the docs</Link>
        </p>

        <ion-button color="accent" {...(isChecked.value ? { disabled: false } : {})} onClick$={() => modalRef.value?.present()}>
          Open modal
        </ion-button>
      </ion-content>
    </ion-page>

    <ion-modal ref={modalRef}>
      <ion-header>
        <ion-toolbar color="black">
          <ion-title>Modal Header</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <p>This is modal content</p>
      </ion-content>
    </ion-modal>
  </>);
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
