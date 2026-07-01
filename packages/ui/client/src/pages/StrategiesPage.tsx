import { useEffect } from 'react';
import './StrategiesPage.scss';
import { usePageContext } from '../context/PageContext';
import { StrategyCard } from './strategies/StrategyCard';
import { StrategyModal } from './strategies/StrategyModal';
import { useStrategies } from './strategies/useStrategies';

export function StrategiesPage() {
  const { setPageTitle, setToolbar } = usePageContext();
  const {
    strategies, loading, message, showModal, setShowModal, isEditMode, formName, setFormName,
    formBaseType, formInterval, setFormInterval, formParameters, setFormParameters,
    handleOpenCreate, handleOpenEdit, handleBaseTypeChange, handleSave, handleDelete
  } = useStrategies(setPageTitle);

  useEffect(() => {
    setToolbar(
      <button className="tb-btn-primary" onClick={handleOpenCreate}>
        <i className="la la-plus" style={{ marginRight: 4 }} />Create Strategy
      </button>
    );
  }, [setToolbar, handleOpenCreate]);

  return (
    <div className="strategies-page">
      {message && (
        <div className={`notification-banner ${message.type}`}>
          <i className={`la ${message.type === 'success' ? 'la-check-circle' : 'la-exclamation-circle'}`}></i>
          <span>{message.text}</span>
        </div>
      )}
      <div className="strategies-layout">
        {loading ? (
          <div className="empty-state"><i className="la la-spinner la-spin" /><h4>Loading strategies...</h4></div>
        ) : strategies.length === 0 ? (
          <div className="empty-state">
            <i className="la la-sliders-h" /><h4>No custom strategies yet</h4>
            <p>Create strategy rules by customizing parameters and choosing timeframe intervals.</p>
            <button className="btn-primary" style={{ width: 'auto' }} onClick={handleOpenCreate}>Create Custom Strategy</button>
          </div>
        ) : (
          <div className="strategies-grid">
            {strategies.map(strat => (
              <StrategyCard key={strat.id} strat={strat} handleOpenEdit={handleOpenEdit} handleDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <StrategyModal
          isEditMode={isEditMode} formName={formName} setFormName={setFormName} formBaseType={formBaseType}
          handleBaseTypeChange={handleBaseTypeChange} formInterval={formInterval} setFormInterval={setFormInterval}
          formParameters={formParameters} setFormParameters={setFormParameters} handleSave={handleSave} setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
