import React from 'react';

import { slowImport } from '../../../App';
import { SuspenseLoading } from '../../../components/Loading';
import i18n from '../../../utils/i18n';

const GrimoireDefinitionsEN = React.lazy(() => import('./en/'));
const GrimoireDefinitionsDE = React.lazy(() => slowImport(import('./de/')));
const GrimoireDefinitionsES = React.lazy(() => slowImport(import('./es/')));
const GrimoireDefinitionsFR = React.lazy(() => slowImport(import('./fr/')));
const GrimoireDefinitionsIT = React.lazy(() => slowImport(import('./it/')));
const GrimoireDefinitionsJA = React.lazy(() => slowImport(import('./ja/')));
const GrimoireDefinitionsPTBR = React.lazy(() => slowImport(import('./pt-br/')));

function GrimoireWrapper() {
  if (i18n.language === 'de') {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsDE />
      </React.Suspense>
    );
  } else if (i18n.language === 'es') {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsES />
      </React.Suspense>
    );
  } else if (i18n.language === 'fr') {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsFR />
      </React.Suspense>
    );
  } else if (i18n.language === 'it') {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsIT />
      </React.Suspense>
    );
  } else if (i18n.language === 'ja') {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsJA />
      </React.Suspense>
    );
  } else if (i18n.language === 'pt-br') {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsPTBR />
      </React.Suspense>
    );
  } else {
    return (
      <React.Suspense fallback={<SuspenseLoading />}>
        <GrimoireDefinitionsEN />
      </React.Suspense>
    );
  }
}

export default GrimoireWrapper;