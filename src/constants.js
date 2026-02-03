export const MODULES = [
  { id: 'res_prot', name: 'Réseau & Protocoles', coef: 3, icon: 'Network' },
  { id: 'meps', name: 'MEPS', coef: 3, icon: 'Users' }, // Méthodologie et Préparation à la Soutenance? Or Proba/Stats? Assuming generic icon for now.
  { id: 'se', name: 'SE', coef: 3, icon: 'Cpu' }, // Système d'Exploitation
  { id: 'gp', name: 'GP', coef: 3, icon: 'Briefcase' }, // Gestion de Projet?
  { id: 'algo', name: 'Algo', coef: 3, icon: 'Code' },
  { id: 'anglais', name: 'Anglais', coef: 2, icon: 'Globe' },
  { id: 'asgbd', name: 'ASGBD', coef: 3, icon: 'Database' },
];

export const TOTAL_COEF = MODULES.reduce((acc, mod) => acc + mod.coef, 0);
