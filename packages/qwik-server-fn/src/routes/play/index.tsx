import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
// import { AdvancedSearchBox } from './advanced-search-box/advanced-search-box';
import { ComboSearchBox } from './combo-search-box';


export default component$(() => {
  return <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '3rem', width: '75vw' }}>
      <ComboSearchBox.Root>
        <ComboSearchBox.Trigger />
        <ComboSearchBox.List>
          <ComboSearchBox.ListItem key={0} option={{ key: 'jobNumber', label: 'Job Number', type: 'string' }} />
          <ComboSearchBox.ListItem key={1} option={{ key: 'target.property.name', label: 'Property Name', type: 'select' }} />
          <ComboSearchBox.ListItem key={2} option={{ key: 'target.unit.number', label: 'Unit Number', type: 'string' }} />
          <ComboSearchBox.ListItem key={3} option={{ key: 'target.pmsUnitCode', label: 'Unit Code', type: 'string' }} />
          <ComboSearchBox.ListItem key={4} option={{ key: 'target.pmsPropertyCode', label: 'Property Code', type: 'string' }} />
          <ComboSearchBox.ListItem key={5} option={{ key: 'type', label: 'Job Type', type: 'select' }} />
        </ComboSearchBox.List>
      </ComboSearchBox.Root>


      {/* <AdvancedSearchBox /> */}
    </div>
  </>
});

export const head: DocumentHead = {
  title: 'SuiteSpot Playground',
  meta: [
    {
      name: 'description',
      content: 'Play with Components',
    },
  ],
};
