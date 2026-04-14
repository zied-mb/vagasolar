import React from 'react';

/**
 * Hidden A4-optimized print template for PDF generation.
 * This component is rendered off-screen and captured by html2canvas.
 * It is NEVER shown to the user in the UI.
 */
const PrintTemplate = React.forwardRef(({ resultat }, ref) => {
  if (!resultat || !resultat.billBefore) return null;

  const { billBefore, billAfter, savings, systemSize, payback, co2, productionSolaireAnnuelle } = resultat;

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-TN', { day: '2-digit', month: 'long', year: 'numeric' });
  const refNum = `VS-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;

  const Row = ({ label, trim, annual, highlight = false, strike = false }) => (
    <tr style={{ backgroundColor: highlight ? '#fffbeb' : 'transparent' }}>
      <td style={{ padding: '8px 12px', fontWeight: highlight ? '700' : '500', color: '#1e293b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
        {label}
      </td>
      <td style={{ padding: '8px 12px', textAlign: 'right', color: strike ? '#ef4444' : (highlight ? '#16a34a' : '#334155'), fontWeight: highlight ? '800' : '600', fontSize: '13px', textDecoration: strike ? 'line-through' : 'none', borderBottom: '1px solid #e2e8f0' }}>
        {trim}
      </td>
      <td style={{ padding: '8px 12px', textAlign: 'right', color: strike ? '#ef4444' : (highlight ? '#16a34a' : '#334155'), fontWeight: highlight ? '800' : '600', fontSize: '13px', textDecoration: strike ? 'line-through' : 'none', borderBottom: '1px solid #e2e8f0' }}>
        {annual}
      </td>
    </tr>
  );

  const KpiCard = ({ label, value, sub }) => (
    <div style={{ flex: 1, backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: '900', color: '#92400e', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: '#78716c', marginTop: '3px' }}>{sub}</div>}
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: '-9999px',
        width: '794px', // A4 at 96dpi
        minHeight: '1122px',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#1e293b',
        padding: '48px 52px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '3px solid #f59e0b', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
            ⚡ <span style={{ color: '#d97706' }}>Vaga</span>Solar
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Rapport d'Audit Énergétique — Tarifs STEG Mai 2022</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Référence</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{refNum}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Date</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{dateStr}</div>
        </div>
      </div>

      {/* ── SECTION 1: SYSTEM SPECS ── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d97706', marginBottom: '14px', borderLeft: '4px solid #f59e0b', paddingLeft: '10px' }}>
          1. Dimensionnement du Système Solaire
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <KpiCard label="Capacité Installée" value={`${systemSize.kWp} kWp`} sub={`${systemSize.panels} panneaux × 450W`} />
          <KpiCard label="Production Annuelle" value={`${Number(productionSolaireAnnuelle).toLocaleString()} kWh`} sub="1 500 kWh/kWp/an" />
          <KpiCard label="Investissement Estimé" value={`${systemSize.cost.toLocaleString()} DT`} sub="~3 500 DT/kWp installé" />
        </div>
      </div>

      {/* ── SECTION 2: FINANCIAL COMPARISON ── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d97706', marginBottom: '14px', borderLeft: '4px solid #f59e0b', paddingLeft: '10px' }}>
          2. Comparatif Financier STEG
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#f8fafc', fontWeight: '700', fontSize: '12px', width: '45%' }}>Poste de Dépense</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', color: '#fbbf24', fontWeight: '700', fontSize: '12px', width: '27.5%' }}>Trimestriel (3 mois)</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', color: '#fbbf24', fontWeight: '700', fontSize: '12px', width: '27.5%' }}>Annuel (12 mois)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#fef2f2' }}>
              <td colSpan={3} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avant installation solaire</td>
            </tr>
            <Row
              label="Énergie (HT + TVA)"
              trim={`${((billBefore.energy + billBefore.surtaxes + billBefore.tvaEnergy) * 3).toFixed(2)} DT`}
              annual={`${((billBefore.energy + billBefore.surtaxes + billBefore.tvaEnergy) * 12).toFixed(2)} DT`}
            />
            <Row
              label="Redevance Fixe (+ TVA)"
              trim={`${((billBefore.fixedFee + billBefore.tvaFixed) * 3).toFixed(2)} DT`}
              annual={`${((billBefore.fixedFee + billBefore.tvaFixed) * 12).toFixed(2)} DT`}
            />
            <Row
              label="TOTAL FACTURÉ"
              trim={`${(billBefore.total * 3).toFixed(2)} DT`}
              annual={`${(billBefore.total * 12).toFixed(2)} DT`}
              strike={true}
            />

            <tr style={{ backgroundColor: '#f0fdf4' }}>
              <td colSpan={3} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Après installation VagaSolar</td>
            </tr>
            <Row
              label="Énergie Nette (HT + TVA)"
              trim={`${((billAfter.energy + billAfter.surtaxes + billAfter.tvaEnergy) * 3).toFixed(2)} DT`}
              annual={`${((billAfter.energy + billAfter.surtaxes + billAfter.tvaEnergy) * 12).toFixed(2)} DT`}
            />
            <Row
              label="Redevance Fixe (Incompressible)"
              trim={`${((billAfter.fixedFee + billAfter.tvaFixed) * 3).toFixed(2)} DT`}
              annual={`${((billAfter.fixedFee + billAfter.tvaFixed) * 12).toFixed(2)} DT`}
            />
            <Row
              label="NOUVEAU TOTAL"
              trim={`${(billAfter.total * 3).toFixed(2)} DT`}
              annual={`${(billAfter.total * 12).toFixed(2)} DT`}
              highlight={true}
            />
            <Row
              label="💰 ÉCONOMIES RÉALISÉES"
              trim={`${savings.trimestriel.toFixed(2)} DT`}
              annual={`${savings.annual.toFixed(2)} DT`}
              highlight={true}
            />
          </tbody>
        </table>
      </div>

      {/* ── SECTION 3: ROI & ECOLOGY ── */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d97706', marginBottom: '14px', borderLeft: '4px solid #f59e0b', paddingLeft: '10px' }}>
          3. Rentabilité & Impact Environnemental
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <KpiCard label="Retour sur Investissement" value={`${payback} ans`} sub={`Basé sur ${savings.annual.toFixed(0)} DT/an d'économies`} />
          <KpiCard label="Réduction CO₂" value={`${co2} T`} sub="Émission évitée par an" />
          <KpiCard label="Taux de Couverture" value={`~${Math.min(100, Math.round((Number(productionSolaireAnnuelle) / (Number(productionSolaireAnnuelle) + billAfter.energy * 12)) * 100))}%`} sub="Autoconsommation annuelle" />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
          Ce rapport est généré automatiquement par le moteur de simulation VagaSolar.<br />
          Les valeurs sont estimatives — basées sur les tarifs officiels STEG (Mai 2022).
        </div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}>
          vagasolar.com
        </div>
      </div>
    </div>
  );
});

PrintTemplate.displayName = 'PrintTemplate';
export default PrintTemplate;
