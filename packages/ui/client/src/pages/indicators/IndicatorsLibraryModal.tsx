import { FC, useState, useRef, useEffect } from 'react';
import { INDICATORS_SCHEMA, IndicatorSchema, IndicatorsState } from './useIndicators';

interface IndicatorsLibraryModalProps {
  state: IndicatorsState;
}

export const IndicatorsLibraryModal: FC<IndicatorsLibraryModalProps> = ({ state }) => {
  const [search, setSearch] = useState('');
  const [pendingIndicators, setPendingIndicators] = useState<IndicatorSchema[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount, and clear pending selections when modal opens/closes
  useEffect(() => {
    if (state.libraryOpen) {
      setPendingIndicators([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
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

  const handleQueueIndicator = (schema: IndicatorSchema) => {
    setPendingIndicators(prev => [...prev, schema]);
  };

  const handleRemovePending = (indexToRemove: number) => {
    setPendingIndicators(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApply = () => {
    pendingIndicators.forEach(schema => {
      state.addIndicator(schema);
    });
    setPendingIndicators([]);
    state.setLibraryOpen(false);
  };

  const handleClose = () => {
    setPendingIndicators([]);
    state.setLibraryOpen(false);
  };

  // Count active instances per type (including pending additions)
  const activeCounts: Record<string, number> = {};
  state.activeIndicators.forEach(ind => {
    activeCounts[ind.type] = (activeCounts[ind.type] || 0) + 1;
  });
  pendingIndicators.forEach(schema => {
    activeCounts[schema.type] = (activeCounts[schema.type] || 0) + 1;
  });

  return (
    <div className="ind-modal-backdrop" onClick={handleClose}>
      <div className="ind-library-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ind-library-modal__header">
          <span className="ind-library-modal__title">Indicators</span>
          <button
            className="ind-library-modal__close"
            onClick={handleClose}
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
                    onClick={() => handleQueueIndicator(schema)}
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

        {/* Pending / Selected list */}
        {pendingIndicators.length > 0 && (
          <div className="ind-library-modal__pending-section">
            <div className="ind-library-modal__section-label">Selected to Add</div>
            <div className="ind-library-modal__pending-list">
              {pendingIndicators.map((schema, idx) => (
                <div key={idx} className="ind-library-modal__pending-item">
                  <span>{schema.name}</span>
                  <button
                    onClick={() => handleRemovePending(idx)}
                    aria-label={`Remove pending ${schema.name}`}
                  >
                    <i className="la la-times" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="ind-library-modal__footer">
          <button
            className="ind-library-modal__btn ind-library-modal__btn--cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="ind-library-modal__btn ind-library-modal__btn--apply"
            onClick={handleApply}
            disabled={pendingIndicators.length === 0}
          >
            Apply ({pendingIndicators.length})
          </button>
        </div>
      </div>
    </div>
  );
};
