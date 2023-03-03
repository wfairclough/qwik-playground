import { $, component$, Slot, useStylesScoped$, useContext, useContextProvider, createContextId, useStore, Signal, useSignal, useTask$, useBrowserVisibleTask$, useId } from '@builder.io/qwik';
import { computePosition, flip } from '@floating-ui/dom';
import comboStyles from './combo-search-box.css?inline';

export interface ComboSearchBoxContext {
  isExpanded: Signal<boolean>;
  triggerRef: Signal<HTMLElement | undefined>;
  triggerLocked: Signal<boolean>;
  listRef: Signal<HTMLElement | undefined>;
  searchItems: Signal<OptionValue[]>;
}

const ComboSearchBoxState = createContextId<ComboSearchBoxContext>('ComboSearchBoxContext');

export const Root = component$(() => {
  useStylesScoped$(comboStyles);
  const isExpanded = useSignal(false);
  const triggerRef = useSignal<HTMLElement>();
  const triggerLocked = useSignal(false);
  const listRef = useSignal<HTMLElement>();
  const searchItems = useSignal<OptionValue[]>([]);
  const state: ComboSearchBoxContext = {
    isExpanded,
    triggerRef,
    triggerLocked,
    listRef,
    searchItems: searchItems,
  };
  useContextProvider(ComboSearchBoxState, state);

  const updatePosition = $(
    (referenceEl: HTMLElement, floatingEl: HTMLElement) => {
      floatingEl.style.setProperty('width', `${referenceEl.clientWidth}px`);
      computePosition(referenceEl, floatingEl, {
        placement: 'bottom',
        middleware: [flip()],
      }).then(({ x, y }) => {
        console.log({ x, y });
        floatingEl.style.setProperty('left', `${x}px`);
        floatingEl.style.setProperty('top', `${y + 8}px`);
      });
    }
  );

  useBrowserVisibleTask$(({ track }) => {
    const trigger = track(() => triggerRef.value)
    const listBox = track(() => listRef.value)
    const expanded = track(() => isExpanded.value)
    if (expanded && trigger && listBox) {
      console.log(`useTask`, { trigger, listBox, expanded });
      updatePosition(trigger, listBox);
    }

    if (expanded && listBox) {
      listBox.focus();
    }

    if (!expanded && trigger) {
      trigger.focus();
    }
  });
  return (<div class="combo-search">
    <Slot />
  </div>);
});

export const Input = component$(() => {
  useStylesScoped$(comboStyles);
  return (<>
    <button></button>
  </>);
});

export const Trigger = component$(() => {
  useStylesScoped$(comboStyles);
  const state = useContext(ComboSearchBoxState);
  return (<>
    <button class="trigger"
      ref={state.triggerRef}
      aria-expanded={state.isExpanded.value}
      onClick$={() => {
        if (state.triggerLocked.value) {
          return;
        }
        state.isExpanded.value = !state.isExpanded.value
      }}
      >
        { state.searchItems.value.length === 0 ? 'Search' : <>
          { state.searchItems.value.map((searchItem) => (<SearchItemChip key={searchItem.id} searchItem={searchItem} />)) }
        </> }
      </button>
  </>);
});

export const SearchItemChip = component$(({ searchItem }: { searchItem: OptionValue }) => {
  const itemValue = useSignal<OptionValue>(searchItem.value);
  const inputRef = useSignal<HTMLInputElement>();
  useStylesScoped$(comboStyles);
  const state = useContext(ComboSearchBoxState);
  useBrowserVisibleTask$(({ track }) => {
    const input = track(() => inputRef.value);
    if (input) {
      input.focus();
      state.triggerLocked.value = true;
    }
  });
  
  useBrowserVisibleTask$(({ track }) => {
    const input = track(() => inputRef.value);
    const itemVal = track(() => itemValue?.value?.value);
    if (itemVal) {
      input?.style?.setProperty('width', `${itemVal?.value?.length + 1}ch`);
    }
  });

  const stopProp = $((e: any) => e.stopPropagation());
  return (<>
    <span class="search-item" 
      onClick$={stopProp}
      onKeyDown$={stopProp}
      onKeyPress$={stopProp}
      onKeyUp$={stopProp}
      onFocus$={stopProp}
      onInput$={stopProp}
      onChange$={stopProp}
    >
      <span class="search-item-key">{searchItem.label}</span>:
      <span class="search-item-value">
        <input class="search-item-value-input"
          ref={inputRef}
          type="text"
          value={itemValue.value?.value}
          onInput$={(e: any) => {
            console.log(`OnInput`, { e });
            if (e?.target) {
              itemValue.value = e.target.value;
            }
          }}
          onChange$={(e) => {
            console.log(`OnChange`, { e });
            itemValue.value = {
              ...itemValue.value,
              value: e.target.value,
            };
          }}
          onBlur$={() => {
            state.triggerLocked.value = false;
          }}
        />
      </span>
      <button class="search-item-del"
        onClick$={() => {
          const newOptions = [...state.searchItems.value.filter((item) => item.key !== searchItem.key)];
          console.log(`Delete`, { newOptions, oldValue: [...state.searchItems.value] });
          state.searchItems.value = newOptions;
        }}
      >
          X
      </button>
    </span>
  </>);
});

export const List = component$(() => {
  useStylesScoped$(comboStyles);
  const context = useContext(ComboSearchBoxState);
  return (
    <ul class="list"
      ref={context.listRef}
      role="listbox"
      tabIndex={0}
      style={{
        display: context?.isExpanded.value ? 'block' : 'none',
        // ...props?.style
      }}
      onBlur$={() => {
        context.isExpanded.value = false;
      }}
    >
      <Slot />
    </ul>
  );
});

export interface OptionValue {
  id?: string;
  key: string;
  label: string;
  [key: string]: any;
}

export interface ListItemProps {
  option: OptionValue;
}

const isOptionValue = (value: string | OptionValue): value is OptionValue => {
  return !!(typeof value !== 'string' && value.label);
};

export const ListItem = component$(({ option }: ListItemProps) => {
  useStylesScoped$(comboStyles);
  const state = useContext(ComboSearchBoxState);
  const id = useId();
  // tabIndex={disabled ? -1 : 0}
  // aria-disabled={disabled}
  // aria-selected={value === contextService.selectedOption.value}
  return (
    <li class="list-item"
      data-key={option.key}
      role="option"
      onClick$={() => {
        state.isExpanded.value = false;
        if (isOptionValue(option)) {
          state.searchItems.value = [...state.searchItems.value, { id, ...option, value: '' }];
        } else {
          state.searchItems.value = [];
        }
      }}
    >
      { isOptionValue(option) ? option.label : <Slot /> }
    </li>
  );
});
