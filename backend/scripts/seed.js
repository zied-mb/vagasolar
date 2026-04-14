/**
 * VagaSolar — Admin Seed Script
 *
 * Creates the initial admin user + seeds Projects, Testimonials, and STEG Rates
 * from the existing static constants.
 *
 * Usage:  npm run seed          (from the /backend directory)
 * Safety: Checks for duplicates — safe to run multiple times.
 */

require('dotenv').config();
const mongoose    = require('mongoose');
const User        = require('../models/User');
const StegRate    = require('../models/StegRate');
const Project     = require('../models/Project');
const Testimonial = require('../models/Testimonial');

// ─── Static Data (mirrors src/constants/) ─────────────────────────────────────
const PROJECTS_DATA = [
  {
    title: 'Installation Résidentielle - Béja',
    type: 'residential',
    description: 'Grâce à ses 3 kWc, cette installation produit désormais sa propre électricité et allège significativement les dépenses énergétiques du foyer.',
    capacity: '3 kWc', savings: '70%', location: 'Béja', order: 1,
    image: 'https://scontent.ftun6-1.fna.fbcdn.net/v/t39.30808-6/528905158_606150825899757_1419074768972983839_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=UWXZ90VGYa4Q7kNvwG9DPz0&_nc_oc=Adk-OitJCX1N_l-H2pYaUfXa9cI7zbsIjkPx_ME7fckOl9PnqS2jFmKUklzQA7EBzb8&_nc_zt=23&_nc_ht=scontent.ftun6-1.fna&_nc_gid=S0MldEiHwoEalruVkD15Jw&oh=00_AfZQEgeebwgCjmeHDWeT2-YPOZPliTcnOojId8NwYD7JBw&oe=68DFC98B',
    gallery: [],
  },
  {
    title: 'Éclairage Public Solaire',
    type: 'commercial',
    description: "Projet 100% réussi d'éclairage public solaire. Installation clé en main avec matériel haut de gamme.",
    capacity: 'Système autonome', savings: '100%', location: 'Tunisie', order: 2,
    image: 'https://scontent.ftun6-1.fna.fbcdn.net/v/t39.30808-6/518342956_592505030597670_707505346529142206_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=5gmFicFnJ_wQ7kNvwFQ1TjZ&_nc_oc=Adk9Ez5MQUHg6v_OyQ_BcAiKj28Tb2_xMLL3ZB3kiQkkRwX2jawbwgnjqzsbCcfX1B4&_nc_zt=23&_nc_ht=scontent.ftun6-1.fna&_nc_gid=gbGr5WJOO7nT1xsKzgO8Rw&oh=00_AfZcIu5A5HRqFEWz6X7fg0z6wjzFXXiUnaEL5rk6GG7RVw&oe=68DFA31B',
    gallery: [],
  },
  {
    title: 'Installation Mornaguia',
    type: 'residential',
    description: "Nouvelle installation de 4 kWc/2kWc. Investissement rentable et durable pour maison ou entreprise.",
    capacity: '4 kWc/2kWc', savings: '75%', location: 'Mornaguia', order: 3,
    image: 'https://scontent.ftun6-1.fna.fbcdn.net/v/t39.30808-6/511065945_571704259344414_6973710604476868262_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=_3haSe-5kJYQ7kNvwGa7dKL&_nc_oc=AdmKqV8NgBiUz-wWyl6VMwJBtwUW8Xz1sC39sSaFnka8TsIVTB6WEQOaRZCG38sCa24&_nc_zt=23&_nc_ht=scontent.ftun6-1.fna&_nc_gid=3E2udWHE0qEpt9-nuzYQ5Q&oh=00_Afb9PmITuqJRNSaq6N4YWsfQ4VlwauTo2xgJqMjf-PH04A&oe=68DFA175',
    gallery: [],
  },
  {
    title: 'Installation Photovoltaïque - Takelsa',
    type: 'residential',
    description: "Installation résidentielle raccordée au réseau STEG. Laissez le soleil payer votre facture d'énergie.",
    capacity: '3 kWc', savings: '65%', location: 'Takelsa', order: 4,
    image: 'https://scontent.ftun6-1.fna.fbcdn.net/v/t39.30808-6/509817211_567678049747035_365958727869426232_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GYvUN_s0H68Q7kNvwGuAqpJ&_nc_oc=AdkD1FThrr17rjdcrz2__vxuV8fDjciCb6KDaRVZecl9s1NKIS5UB6_Bk7xvmKqeR74&_nc_zt=23&_nc_ht=scontent.ftun6-1.fna&_nc_gid=opfHujhgAQpBoIK1KkW53w&oh=00_AfYZw_wpkJNwem3jHNYkGxH4FFbGwOrIRJ8YUZkLEIq9eg&oe=68DFC84F',
    gallery: [],
  },
  {
    title: 'Nouvelle Installation - Hammamet',
    type: 'residential',
    description: "Nouvelle installation photovoltaïque avec puissance 7 kWc. Passez à l'énergie solaire dès aujourd'hui !",
    capacity: '7 kWc', savings: '75%', location: 'Hammamet', order: 5,
    image: 'https://scontent.ftun6-1.fna.fbcdn.net/v/t39.30808-6/499933667_546028021912038_6433293401879010940_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=DUitPzT39UgQ7kNvwEV8BDk&_nc_oc=AdkHfyXC9moFNLL-vWS-SeukMpkLAVnGjie2dRtJLgeL5X1j2sXBvLJ-Q4o0WCC06aM&_nc_zt=23&_nc_ht=scontent.ftun6-1.fna&_nc_gid=XuJj0Mzu8Wc4DKg6cM-Fkg&oh=00_AfaE24LegzGVUDrJYfE83k21C8SJgoxios2Hh1hRzDouSA&oe=68DFBEFC',
    gallery: [],
  },
  {
    title: 'Installation Photovoltaïque - Nabeul',
    type: 'residential',
    description: 'Installations photovoltaïques résidentielles raccordées au réseau STEG avec puissance 3 kWc.',
    capacity: '3 kWc', savings: '70%', location: 'Nabeul', order: 6,
    image: 'https://scontent.ftun6-1.fna.fbcdn.net/v/t39.30808-6/497467218_541794085668765_2619622294164995386_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=pBFf4WbOdQIQ7kNvwGFlyX7&_nc_oc=AdkCiWQZS4IWAGgTb5XGLjjeYG6xtBukSfRLsVpysI0EOx-ejQLsAh70YKmtLrg93Bs&_nc_zt=23&_nc_ht=scontent.ftun6-1.fna&_nc_gid=DwWTKCSD5nnOpaARFYpKgQ&oh=00_AfbWqlxNqaFe8v4ss7gtFc71QgtNTXr73uCmj4HSTf_cxQ&oe=68DFADB7',
    gallery: [],
  },
];

const TESTIMONIALS_DATA = [
  { name: 'Mohamed Ali',     role: 'Propriétaire de villa', rating: 5,
    content: "L'installation solaire de VagaSolar a réduit ma facture d'électricité de 70%. L'équipe était professionnelle et le service après-vente est excellent. Je recommande vivement!",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', order: 1 },
  { name: 'Samira Ben Ammar', role: "Directrice d'usine", rating: 5,
    content: "Nous avons installé un système solaire 250kW dans notre usine. En un an, économies notables, retour rapide sur investissement et une équipe très compétente.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', order: 2 },
  { name: 'Karim Jlassi',    role: "Gérant d'hôtel", rating: 4,
    content: "Solution parfaite pour notre hôtel en bord de mer. Malgré les conditions difficiles, les panneaux fonctionnent parfaitement. Service impeccable et installation rapide.",
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80', order: 3 },
  { name: 'Leila Trabelsi',  role: 'Propriétaire agricole', rating: 5,
    content: "Grâce à VagaSolar, notre exploitation est maintenant énergétiquement autonome. L'installation a été rapide et le système nécessite très peu d'entretien.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', order: 4 },
];

const STEG_RATES_DEFAULT = {
  residentialTranches: [
    { limit: 50,   rate: 0.062 },
    { limit: 100,  rate: 0.096 },
    { limit: 200,  rate: 0.176 },
    { limit: 300,  rate: 0.218 },
    { limit: 500,  rate: 0.341 },
    { limit: 9999, rate: 0.414 },
  ],
  flatRateProfessional: 0.380, flatRateAgricultural: 0.380,
  surtaxesPerKwh: 0.010, tvaResidentialLow: 0.07, tvaResidentialHigh: 0.13,
  tvaProfessional: 0.19, redevanceFixeResidential: 3.5,
  redevanceFixeProfessional: 15.0, redevanceFixeAgricultural: 15.0,
  panelWattage: 450, systemPricePerKwp: 3500,
  productionPerKwp: 1500, co2EmissionFactor: 0.56,
};

// ─── Main Seed Function ───────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Admin User
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const adminPass  = process.env.INITIAL_ADMIN_PASSWORD;
    if (!adminEmail || !adminPass) {
      throw new Error('INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env');
    }

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      console.log(`ℹ️  Admin already exists: ${adminEmail} — skipping.`);
    } else {
      await User.create({ email: adminEmail, password: adminPass });
      console.log(`✅ Admin created: ${adminEmail}`);
    }

    // 2. STEG Rates (singleton)
    const existingRates = await StegRate.findOne();
    if (existingRates) {
      console.log('ℹ️  STEG rates already seeded — skipping.');
    } else {
      await StegRate.create(STEG_RATES_DEFAULT);
      console.log('✅ STEG rates seeded.');
    }

    // 3. Projects
    const projectCount = await Project.countDocuments();
    if (projectCount > 0) {
      console.log(`ℹ️  ${projectCount} projects already exist — skipping.`);
    } else {
      await Project.insertMany(PROJECTS_DATA);
      console.log(`✅ ${PROJECTS_DATA.length} projects seeded.`);
    }

    // 4. Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount > 0) {
      console.log(`ℹ️  ${testCount} testimonials already exist — skipping.`);
    } else {
      await Testimonial.insertMany(TESTIMONIALS_DATA);
      console.log(`✅ ${TESTIMONIALS_DATA.length} testimonials seeded.`);
    }

    console.log('\n🎉 Seed complete. Run: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
