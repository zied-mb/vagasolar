import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiArrowLeft, FiCheck, FiPhone, FiMail, FiCalendar, FiZap, FiSun, FiTrendingDown, FiShield, FiBarChart2 } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_LABELS = { new:'Nouveau', contacted:'Contacté', quote_sent:'Devis Envoyé', closed:'Clôturé' };

const MiniStatCard = ({ icon, label, value, sub }) => (
  <div className="bg-gray-800/60 border border-white/8 rounded-2xl p-5 hover:border-amber-400/30 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       {cloneElement(icon, { size: 48 })}
    </div>
    <div className="flex items-center gap-2.5 mb-2 relative z-10">
      <div className="p-1.5 bg-amber-400/10 rounded-lg text-amber-400">{icon}</div>
      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-2xl font-extrabold text-white relative z-10">{value}</p>
    {sub && <p className="text-xs text-amber-400/80 mt-1 relative z-10">{sub}</p>}
  </div>
);

// Helper for cloning icons (needed since icon is passed as a prop)
const cloneElement = (element, props) => React.cloneElement(element, props);

const ComparisonChart = ({ title, data, savingsPercent }) => (
  <div className="bg-gray-900 border border-white/8 rounded-2xl p-6 relative overflow-hidden group">
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div>
        <h3 className="font-bold text-white flex items-center gap-2">
          <FiBarChart2 className="text-amber-400"/>
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Comparatif Avant vs Après Solaire</p>
      </div>
      {savingsPercent > 0 && (
         <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold">
            -{savingsPercent}% d'économie
         </div>
      )}
    </div>
    <div className="h-56 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{top:5,right:10,left:-20,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
          <XAxis dataKey="name" stroke="#6b7280" tick={{fill:'#9ca3af',fontSize:11,fontWeight:500}} axisLine={false} tickLine={false}/>
          <YAxis stroke="#6b7280" tick={{fill:'#9ca3af',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={(v)=>`${Math.round(v)} DT`}/>
          <Tooltip 
            cursor={{fill:'rgba(255,255,255,0.03)'}} 
            contentStyle={{backgroundColor:'#0f172a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',color:'#fff'}} 
            itemStyle={{color:'#fbbf24'}}
            formatter={(value) => [`${value.toFixed(2)} DT`, 'Facture STEG']}
          />
          <Bar dataKey="val" radius={[6,6,0,0]} barSize={60} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#374151' : 'url(#gold_grad)'} />
            ))}
          </Bar>
          <defs>
            <linearGradient id="gold_grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#d97706" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AdminLeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead,    setLead]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes,   setNotes]   = useState('');
  const [status,  setStatus]  = useState('new');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/leads/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setLead(d.lead);
          setNotes(d.lead.notes || '');
          setStatus(d.lead.status);
        }
      })
      .catch(() => navigate('/admin/leads'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_URL}/api/leads/${id}/status`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"/></div>;
  if (!lead)   return <div className="text-gray-400 text-center py-16">Lead introuvable.</div>;

  const { resultat } = lead;

  // ── Data Normalization Logic ──────────────────────────────────────────────
  // Fallback for older leads that don't have the enriched "totals" object
  const bBefore = resultat?.billBefore?.total || 0;
  const bAfter  = resultat?.billAfter?.total  || 0;

  const quarterlyBefore = resultat?.totals?.quarterly?.before || (bBefore * 3);
  const quarterlyAfter  = resultat?.totals?.quarterly?.after  || (bAfter * 3);
  const annualBefore    = resultat?.totals?.annual?.before    || (bBefore * 12);
  const annualAfter     = resultat?.totals?.annual?.after     || (bAfter * 12);

  const qSavingsPct = quarterlyBefore > 0 ? Math.round(((quarterlyBefore - quarterlyAfter) / quarterlyBefore) * 100) : 0;
  const aSavingsPct = annualBefore > 0 ? Math.round(((annualBefore - annualAfter) / annualBefore) * 100) : 0;

  const chartDataQ = [
    { name: 'Avant Solaire', val: parseFloat(quarterlyBefore.toFixed(2)) },
    { name: 'Après Solaire', val: parseFloat(quarterlyAfter.toFixed(2)) },
  ];

  const chartDataA = [
    { name: 'Avant Solaire', val: parseFloat(annualBefore.toFixed(2)) },
    { name: 'Après Solaire', val: parseFloat(annualAfter.toFixed(2)) },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Top Nav */}
      <div className="flex items-center gap-4">
        <Link to="/admin/leads" className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all border border-white/5 shadow-lg">
          <FiArrowLeft size={18}/>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white">{lead.prenom} {lead.nom}</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2 mt-0.5">
            Audit généré le {new Date(lead.createdAt).toLocaleDateString('fr-TN', {day:'2-digit',month:'long',year:'numeric'})}
            {lead.pdfDownloaded && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-bold uppercase tracking-wider">
                <FiCheck size={10}/> PDF téléchargé
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sidebar: Identity + CRM (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Identity Card */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-6 space-y-5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-colors"/>
            <h3 className="font-bold text-xs uppercase tracking-widest text-amber-400 border-b border-white/5 pb-3">Coordonnées Client</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 group-hover/item:text-amber-400 transition-colors"><FiPhone size={18}/></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-0.5">Téléphone</p><a href={`tel:${lead.telephone}`} className="text-white hover:text-amber-400 transition-colors font-medium">{lead.telephone}</a></div>
              </div>
              {lead.email && (
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 group-hover/item:text-amber-400 transition-colors"><FiMail size={18}/></div>
                  <div><p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-0.5">Email</p><a href={`mailto:${lead.email}`} className="text-white hover:text-amber-400 transition-colors font-medium truncate max-w-[180px] block">{lead.email}</a></div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400"><FiCalendar size={18}/></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-0.5">Date Soumission</p><p className="text-white font-medium">{new Date(lead.createdAt).toLocaleString('fr-TN')}</p></div>
              </div>
            </div>
          </div>

          {/* CRM Control */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-6 space-y-5 shadow-xl">
             <h3 className="font-bold text-xs uppercase tracking-widest text-amber-400 border-b border-white/5 pb-3">Actions CRM</h3>
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block tracking-wider">État du Lead</label>
                  <select value={status} onChange={(e)=>setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/50 appearance-none shadow-inner"
                  >
                    {Object.entries(STATUS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block tracking-wider">Commentaires Internes</label>
                  <textarea rows={5} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Détail de l'échange..."
                    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none shadow-inner"
                  />
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {saved ? '✓ Mise à jour réussie' : saving ? 'Transmission...' : 'Enregistrer les notes'}
                </button>
             </div>
          </div>
        </div>

        {/* Main Content: Reports & Stats (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {resultat ? (
            <>
              {/* Top KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MiniStatCard icon={<FiSun size={20}/>}          label="Puissance" value={`${resultat.systemSize?.kWp} kWp`} sub={`${resultat.systemSize?.panels} panneaux`}/>
                <MiniStatCard icon={<FiTrendingDown size={20}/>} label="Eco. / An" value={`${Math.round(annualBefore - annualAfter)} DT`} sub={`Soit -${aSavingsPct}%`}/>
                <MiniStatCard icon={<FiShield size={20}/>}       label="Rembourse" value={`${resultat.payback} ans`} sub={`Coût: ${resultat.systemSize?.cost?.toLocaleString()} DT`}/>
                <MiniStatCard icon={<FiZap size={20}/>}          label="CO₂ Évité" value={`${resultat.co2} T`} sub="Tonnes / an"/>
              </div>

              {/* Visual Comparisons Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComparisonChart title="Analyse Trimestrielle" data={chartDataQ} savingsPercent={qSavingsPct} />
                <ComparisonChart title="Analyse Annuelle" data={chartDataA} savingsPercent={aSavingsPct} />
              </div>

              {/* Technical Billing Table */}
              <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-gray-800/40 border-b border-white/5 flex items-center justify-between">
                   <h3 className="font-bold text-white text-sm">Détail Technique (Facturation Mensuelle)</h3>
                   <span className="px-2 py-0.5 bg-amber-400/10 rounded text-[10px] text-amber-400 font-bold uppercase tracking-tighter">Données de simulation</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-px h-[80%] bg-white/5" />
                    
                    {/* Before Table */}
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Avant Installation</p>
                      <div className="space-y-2.5">
                        {[
                          ['Énergie de base', `${resultat.billBefore?.energy?.toFixed(2)} DT`],
                          ['Surtaxes STEG', `${resultat.billBefore?.surtaxes?.toFixed(2)} DT`],
                          ['TVA sur Énergie', `${resultat.billBefore?.tvaEnergy?.toFixed(2)} DT`],
                          ['Redevance Fixe', `${resultat.billBefore?.fixedFee?.toFixed(2)} DT`],
                        ].map(([k,v]) => (
                          <div key={k} className="flex justify-between items-center py-1 pb-2 border-b border-white/5">
                            <span className="text-gray-400 text-xs">{k}</span>
                            <span className="text-white text-sm font-medium">{v}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3">
                           <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Mensuel</span>
                           <span className="text-xl font-black text-gray-600 line-through decoration-red-500/40">{resultat.billBefore?.total?.toFixed(2)} DT</span>
                        </div>
                      </div>
                    </div>

                    {/* After Table */}
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-amber-400 uppercase tracking-[0.2em]">Avec Vaga Solar</p>
                      <div className="space-y-2.5">
                         {[
                          ['Énergie Nette', `${resultat.billAfter?.energy?.toFixed(2)} DT`],
                          ['Surtaxes Minimales', `${resultat.billAfter?.surtaxes?.toFixed(2)} DT`],
                          ['TVA Réduite', `${resultat.billAfter?.tvaEnergy?.toFixed(2)} DT`],
                          ['Frais Fixes', `${resultat.billAfter?.fixedFee?.toFixed(2)} DT`],
                        ].map(([k,v]) => (
                          <div key={k} className="flex justify-between items-center py-1 pb-2 border-b border-white/5">
                            <span className="text-gray-400 text-xs">{k}</span>
                            <span className="text-white text-sm font-medium">{v}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 bg-amber-400/5 -mx-4 px-4 py-3 rounded-xl border border-amber-400/10">
                           <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Nouveau Mensuel</span>
                           <div className="text-right">
                              <span className="text-2xl font-black text-amber-400 block">{resultat.billAfter?.total?.toFixed(2)} DT</span>
                              <span className="text-[10px] text-green-400 font-bold uppercase tracking-tighter">-${Math.round((resultat.billBefore?.total||0) - (resultat.billAfter?.total||0))} d'économie / mois</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input parameters snapshot */}
              <div className="bg-gray-800/30 border border-white/5 rounded-2xl p-5 flex items-center gap-6">
                 <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-3">Données d'entrée Simulateur</p>
                    <div className="flex gap-8">
                       <div><p className="text-[10px] text-gray-600 font-bold">Consommation</p><p className="text-white text-sm font-bold">{lead.consommationMensuelle} <span className="text-gray-500 font-normal">kWh</span></p></div>
                       <div><p className="text-[10px] text-gray-600 font-bold">Type Bâtiment</p><p className="text-white text-sm font-bold capitalize">{lead.typeBatiment}</p></div>
                       <div><p className="text-[10px] text-gray-600 font-bold">Cible Couverture</p><p className="text-white text-sm font-bold">{lead.couvertureVoulue}%</p></div>
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-900 border border-dashed border-white/10 rounded-3xl p-20 text-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-600 mx-auto"><FiZap size={30}/></div>
               <div>
                  <h3 className="text-white font-bold">Aucune donnée d'audit</h3>
                  <p className="text-gray-500 text-sm">Le lead n'a pas complété la simulation jusqu'au bout.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeadDetail;
