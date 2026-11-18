import '../css/app.css';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

createInertiaApp({
  title: (title) => (title ? `${title} — Dapoer Nusantara` : 'Dapoer Nusantara — Cita Rasa Warisan'),
  resolve: (name) => {
    const pages = import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx', { eager: true });
    const page = pages[`./Pages/${name}.tsx`];
    if (!page) {
      throw new Error(`Inertia page not found: ./Pages/${name}.tsx`);
    }
    return page;
  },
  setup({ el, App, props }) {
    if (!el) return;
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#c85a32',
    showSpinner: false,
  },
});
