import { FC, useState, useRef, useEffect } from 'react';
import { INDICATORS_SCHEMA, IndicatorSchema, IndicatorsState } from './useIndicators';

interface IndicatorsLibraryModalProps {
  state: IndicatorsState;
}

export const IndicatorsLibraryModal: FC<IndicatorsLibraryModalProps> = ({ state }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    if (state.libraryOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.libraryOpen]);

  if (!state.libraryOpen) return null;

  const query = search.toLowerCase().trim();
  const filtered = query
    ? INDICATORS_SCHEMA.filter(
        s =>
          s.type.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    : INDICATORS_SCHEMA;

  const handleAdd = (schema: IndicatorSchema) => {
    state.addIndicator(schema);
  };

  // Count active instances per type
  const activeCounts: Record<string, number> = {};
  state.activeIndicators.forEach(ind => {
    activeCounts[ind.type] = (activeCounts[ind.type] || 0) + 1;
  });

  return (
    <div className="ind-modal-backdrop" onClick={() => state.setLibraryOpen(false)}>
      <div className="ind-library-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ind-library-modal__header">
          <span className="ind-library-modal__title">Indicators</span>
          <button
            className="ind-library-modal__close"
            onClick={() => state.setLibraryOpen(false)}
            aria-label="Close indicators library"
          >
            <i className="la la-times" />
          </button>
        </div>

        {/* Search */}
        <div className="ind-library-modal__search">
          <i className="la la-search" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search indicators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="ind-library-modal__search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <i className="la la-times-circle" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="ind-library-modal__body">
          {/* Technicals list */}
          <div className="ind-library-modal__section">
            <div className="ind-library-modal__section-label">Technicals</div>
            <div className="ind-library-modal__list">
              {filtered.length === 0 && (
                <div className="ind-library-modal__empty">
                  No indicators match your search.
                </div>
              )}
              {filtered.map((schema) => {
                const count = activeCounts[schema.type] || 0;
                return (
                  <button
                    key={schema.type}
                    className="ind-library-modal__item"
                    onClick={() => handleAdd(schema)}
                    title={schema.description}
                  >
                    <span className="ind-library-modal__item-name">{schema.name}</span>
                    <span className="ind-library-modal__item-type">{schema.type}</span>
                    {count > 0 && (
                      <span className="ind-library-modal__item-badge">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
