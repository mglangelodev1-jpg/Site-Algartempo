/**
 * Algartempo — "Pessoas que movem o Algarve."
 * Interactive Engine & Real-time Controllers
 */

// Job Opportunities Data (Realistic regional opportunities in Algarve)
const jobPostings = [
  {
    id: 1,
    title: "Chefe de Turno / Empregado(a) de Mesa",
    category: "hotelaria",
    categoryLabel: "Hotelaria & Restauração",
    location: "Albufeira",
    locationLabel: "Albufeira / Vilamoura",
    type: "Full-Time",
    contractTag: "Contrato Direto / Época",
    salaryNote: "Salário compatível com a função + Sub. Alimentação",
    description: "Integração em equipa de referência no setor hoteleiro do Algarve. Atendimento de sala, gestão de pedidos e acolhimento com padrão de excelência.",
    requirements: ["Experiência em Restauração/Hotelaria", "Domínio de Inglês", "Boa Apresentação"]
  },
  {
    id: 2,
    title: "Técnico de AVAC e Refrigeração Industrial",
    category: "construcao",
    categoryLabel: "Construção & Manutenção",
    location: "Faro",
    locationLabel: "Faro / Olhão",
    type: "Full-Time",
    contractTag: "Continuidade / Efetivo",
    salaryNote: "Vencimento base + Isenção + Viatura de serviço",
    description: "Manutenção preventiva e corretiva de sistemas de climatização em edifícios comerciais e unidades hoteleiras na zona central do Algarve.",
    requirements: ["Certificação TIM / Gases Fluorados", "Carta de Condução B", "Autonomia Técnica"]
  },
  {
    id: 3,
    title: "Operador de Logística & Condução de Empilhador",
    category: "logistica",
    categoryLabel: "Logística & Armazém",
    location: "Loule",
    locationLabel: "Loulé / São Brás",
    type: "Full-Time",
    contractTag: "Turno Diurno Fixo",
    salaryNote: "Salário Base + Subsídio de Turno e Alimentação",
    description: "Recepção, conferência de mercadorias, expedição de encomendas e arrumação de entreposto logístico com recurso a empilhador.",
    requirements: ["Certificado de Condução de Empilhador", "Sentido de Responsabilidade", "Residência Próxima"]
  },
  {
    id: 4,
    title: "Rececionista Bilingue (M/F)",
    category: "hotelaria",
    categoryLabel: "Hotelaria & Turismo",
    location: "Lagos",
    locationLabel: "Lagos / Portimão",
    type: "Full-Time",
    contractTag: "Reforço e Continuidade",
    salaryNote: "Pacote salarial atrativo + Prémios de época",
    description: "Check-in / check-out de hóspedes, atendimento telefónico e apoio geral aos serviços de concierge num resort no Barlavento Algarvio.",
    requirements: ["Fluência em Inglês e Português (outra língua valorizada)", "Atitude Proativa", "Disponibilidade de Turnos"]
  },
  {
    id: 5,
    title: "Assistente Administrativo(a) & Suporte Operacional",
    category: "administrativo",
    categoryLabel: "Apoio Administrativo",
    location: "Faro",
    locationLabel: "Faro (Sede)",
    type: "Full-Time",
    contractTag: "Entrada Imediata",
    salaryNote: "Remuneração de acordo com o perfil e experiência",
    description: "Gestão documental, apoio ao processamento de assiduidades, atendimento a clientes e arquivo no polo central de Faro.",
    requirements: ["Bons conhecimentos de Excel/Office", "Rigor e Organização", "Gosto pelo Contacto Humano"]
  },
  {
    id: 6,
    title: "Operador de Produção & Embalamento",
    category: "industria",
    categoryLabel: "Indústria & Agroalimentar",
    location: "Tavira",
    locationLabel: "Tavira / VRSA",
    type: "Full-Time",
    contractTag: "Época Alta / Flexível",
    salaryNote: "Salário Base + Horas Noturnas (quando aplicável)",
    description: "Apoio à linha de embalamento, triagem de produto alimentar e cumprimento rigoroso das normas de higiene e segurança alimentar (HACCP).",
    requirements: ["Robustez Física e Agilidade", "Pontualidade", "Disponibilidade Imediata"]
  }
];

// Fairs and In-person Events
const regionalEvents = [
  {
    id: 1,
    title: "Bolsa de Empregabilidade Algarve 2026",
    edition: "Presença Confirmada",
    dateBadge: "MAR 2026",
    location: "Portimão — Centro de Congressos do Arade",
    stand: "Stand Algartempo",
    description: "O ponto de encontro anual entre talentos e as principais entidades empregadoras do Algarve. Agende uma conversa direta com os nossos consultores de recrutamento.",
    type: "Feira de Emprego Regional"
  },
  {
    id: 2,
    title: "Dia Aberto de Recrutamento — Faro & Portimão",
    edition: "Sessão Presencial",
    dateBadge: "ABR 2026",
    location: "Polos Algartempo (Faro e Portimão)",
    stand: "Atendimento Personalizado",
    description: "Entrevistas rápidas e validação de perfil para vagas de entrada imediata em Hotelaria, Logística e Manutenção no Algarve.",
    type: "Recrutamento Expresso"
  }
];

// State for B2B Interactive Selector
const b2bState = {
  headcount: '1–5',
  timeframe: 'Esta Semana',
  sector: 'Hotelaria & Restauração'
};

// Document Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderJobs(jobPostings);
  renderEvents();
  initB2BSelector();
  initFilters();
  initStepNarrative();
  initMobileMenu();
  initModals();
  initScrollAnimations();
});

// Render Jobs in Modern Grid
function renderJobs(jobsToRender = jobPostings) {
  const container = document.getElementById('jobs-list-container');
  const countBadge = document.getElementById('jobs-count-badge');

  if (countBadge) {
    countBadge.textContent = `${jobsToRender.length} Oportunidades`;
  }

  if (!container) return;

  if (jobsToRender.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 px-6 bg-white border border-slate-200 rounded-2xl">
        <div class="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 text-xl">
          <i class="fas fa-search"></i>
        </div>
        <h4 class="text-lg font-heading font-bold text-slate-800 mb-1">Sem oportunidades correspondentes</h4>
        <p class="text-slate-500 text-xs max-w-md mx-auto mb-5">
          Não encontrámos vagas com os filtros atuais. Podes submeter a tua candidatura espontânea diretamente.
        </p>
        <button onclick="openApplyModal('Candidatura Espontânea — Sem Filtros')" class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all">
          Submeter Candidatura Espontânea
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = jobsToRender.map(job => `
    <article class="editorial-paper rounded-2xl p-6 sm:p-7 flex flex-col justify-between group">
      <div>
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
            ${job.categoryLabel}
          </span>
          <span class="text-xs text-slate-500 font-medium">
            <i class="fas fa-map-marker-alt text-sky-600 mr-1"></i> ${job.locationLabel}
          </span>
        </div>

        <h3 class="text-lg sm:text-xl font-heading font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2.5 leading-snug">
          ${job.title}
        </h3>

        <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
          ${job.description}
        </p>

        <div class="space-y-2 py-3 border-y border-slate-100 mb-5 text-xs text-slate-700">
          <div class="flex items-center gap-2">
            <i class="fas fa-file-contract text-sky-600 w-4"></i>
            <span>${job.contractTag}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-wallet text-emerald-600 w-4"></i>
            <span class="font-semibold text-slate-900">${job.salaryNote}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-5">
          ${job.requirements.map(req => `
            <span class="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
              ${req}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="pt-2">
        <button onclick="openApplyModal('${job.title.replace(/'/g, "\\'")}')" class="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm">
          <span>Candidatar a esta Vaga</span>
          <i class="fas fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </article>
  `).join('');
}

// Render Fairs and Events
function renderEvents() {
  const container = document.getElementById('events-list-container');
  if (!container) return;

  container.innerHTML = regionalEvents.map(evt => `
    <div class="editorial-paper rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex flex-col items-center justify-center font-heading font-bold flex-shrink-0">
          <span class="text-[9px] tracking-wider uppercase text-emerald-600 font-semibold">Presença</span>
          <span class="text-xs text-emerald-900">${evt.dateBadge}</span>
        </div>
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold text-emerald-800 bg-emerald-100 mb-1">
            ${evt.edition}
          </span>
          <h4 class="text-base sm:text-lg font-heading font-bold text-slate-900 mb-0.5">${evt.title}</h4>
          <p class="text-slate-500 text-xs mb-1.5"><i class="fas fa-map-marker-alt text-sky-600 mr-1"></i>${evt.location}</p>
          <p class="text-slate-600 text-xs leading-relaxed max-w-2xl">${evt.description}</p>
        </div>
      </div>

      <div class="w-full md:w-auto flex-shrink-0">
        <button onclick="openEventMeetingModal('${evt.title.replace(/'/g, "\\'")}', '${evt.location}')" class="w-full md:w-auto py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
          <i class="fas fa-calendar-check text-sky-400"></i>
          <span>Agendar no Stand</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Interactive Step Narrative (01 TU -> 02 PROCURAS -> 03 NÓS LIGAMOS -> 04 COMEÇA)
function initStepNarrative() {
  const skillChips = document.querySelectorAll('.skill-chip');
  skillChips.forEach(chip => {
    chip.addEventListener('click', () => {
      skillChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const targetSector = chip.getAttribute('data-sector');
      const sectorSelect = document.getElementById('filter-sector');
      if (sectorSelect) {
        sectorSelect.value = targetSector;
      }

      // Smooth scroll to jobs
      const jobsSection = document.getElementById('vagas');
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth' });
      }

      applyFilters();
    });
  });
}

// B2B 3-Step Interactive Selector
function initB2BSelector() {
  const headcountBtns = document.querySelectorAll('.b2b-headcount-btn');
  const timeframeBtns = document.querySelectorAll('.b2b-timeframe-btn');
  const sectorBtns = document.querySelectorAll('.b2b-sector-btn');

  headcountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      headcountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      b2bState.headcount = btn.getAttribute('data-value');
      updateB2BSummary();
    });
  });

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      b2bState.timeframe = btn.getAttribute('data-value');
      updateB2BSummary();
    });
  });

  sectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sectorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      b2bState.sector = btn.getAttribute('data-value');
      updateB2BSummary();
    });
  });

  updateB2BSummary();
}

function updateB2BSummary() {
  const summaryEl = document.getElementById('b2b-summary-text');
  if (summaryEl) {
    summaryEl.textContent = `${b2bState.headcount} pessoas • Para: ${b2bState.timeframe} • Área: ${b2bState.sector}`;
  }
}

function triggerB2BModalWithState() {
  openB2BModal(b2bState);
}

// Job Filter Engine
function initFilters() {
  const searchInput = document.getElementById('filter-search');
  const sectorSelect = document.getElementById('filter-sector');
  const locationSelect = document.getElementById('filter-location');
  const locationChips = document.querySelectorAll('.location-chip');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (sectorSelect) sectorSelect.addEventListener('change', applyFilters);
  if (locationSelect) locationSelect.addEventListener('change', applyFilters);

  locationChips.forEach(chip => {
    chip.addEventListener('click', () => {
      locationChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const loc = chip.getAttribute('data-location');
      if (locationSelect) {
        locationSelect.value = loc;
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  const searchVal = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
  const sectorVal = document.getElementById('filter-sector')?.value || 'todos';
  const locVal = document.getElementById('filter-location')?.value || 'todos';

  const filtered = jobPostings.filter(job => {
    const matchesSearch = !searchVal ||
      job.title.toLowerCase().includes(searchVal) ||
      job.description.toLowerCase().includes(searchVal) ||
      job.requirements.some(r => r.toLowerCase().includes(searchVal)) ||
      job.locationLabel.toLowerCase().includes(searchVal);

    const matchesSector = sectorVal === 'todos' || job.category === sectorVal;
    const matchesLocation = locVal === 'todos' || 
      job.location.toLowerCase() === locVal.toLowerCase() ||
      job.locationLabel.toLowerCase().includes(locVal.toLowerCase());

    return matchesSearch && matchesSector && matchesLocation;
  });

  renderJobs(filtered);
}

// Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-drawer-link');

  function openDrawer() {
    if (drawer) {
      drawer.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer) {
      drawer.classList.add('translate-x-full');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  links.forEach(l => l.addEventListener('click', closeDrawer));
}

// Modal Engine
function initModals() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Backdrop click
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        closeAllModals();
      }
    });
  });
}

function openApplyModal(jobTitle = 'Candidatura Espontânea') {
  const modal = document.getElementById('apply-modal');
  const titleDisplay = document.getElementById('apply-modal-job-title');
  const hiddenInput = document.getElementById('apply-job-input');

  if (titleDisplay) titleDisplay.textContent = jobTitle;
  if (hiddenInput) hiddenInput.value = jobTitle;

  if (modal) {
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) {
    modal.classList.add('modal-hidden');
    document.body.style.overflow = '';
  }
}

function openB2BModal(prefill = null) {
  const modal = document.getElementById('b2b-modal');
  if (prefill) {
    const headInput = document.getElementById('b2b-input-headcount');
    const timeInput = document.getElementById('b2b-input-timeframe');
    const secInput = document.getElementById('b2b-input-sector');

    if (headInput) headInput.value = prefill.headcount;
    if (timeInput) timeInput.value = prefill.timeframe;
    if (secInput) secInput.value = prefill.sector;
  }

  if (modal) {
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeB2BModal() {
  const modal = document.getElementById('b2b-modal');
  if (modal) {
    modal.classList.add('modal-hidden');
    document.body.style.overflow = '';
  }
}

function openEventMeetingModal(eventTitle, eventLocation) {
  const modal = document.getElementById('event-modal');
  const titleEl = document.getElementById('event-modal-title');
  const locEl = document.getElementById('event-modal-location');

  if (titleEl) titleEl.textContent = eventTitle;
  if (locEl) locEl.textContent = eventLocation;

  if (modal) {
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeEventMeetingModal() {
  const modal = document.getElementById('event-modal');
  if (modal) {
    modal.classList.add('modal-hidden');
    document.body.style.overflow = '';
  }
}

function closeAllModals() {
  closeApplyModal();
  closeB2BModal();
  closeEventMeetingModal();
}

// Toast Feedback System
function showToast(message, iconClass = 'fa-check-circle text-emerald-400') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  if (toastIcon) toastIcon.className = `fas ${iconClass} text-lg`;

  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4500);
}

// Form Handlers
function handleCandidateSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[name="candidate_name"]')?.value || 'Candidato(a)';
  closeApplyModal();
  form.reset();
  showToast(`Obrigado ${name}! A sua candidatura foi registada. A equipa da Algartempo entrará em contacto.`);
}

function handleB2BSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const company = form.querySelector('input[name="company_name"]')?.value || 'sua empresa';
  closeB2BModal();
  form.reset();
  showToast(`Pedido para ${company} recebido. O nosso consultor de RH enviará a proposta nas próximas 24h.`);
}

function handleEventMeetingSubmit(e) {
  e.preventDefault();
  const form = e.target;
  closeEventMeetingModal();
  form.reset();
  showToast(`Reunião no stand agendada com sucesso! Enviámos os detalhes para o seu contacto.`);
}

function handleDirectContact(e) {
  e.preventDefault();
  const form = e.target;
  form.reset();
  showToast(`Mensagem enviada com sucesso! Responderemos o mais brevemente possível.`);
}

// Scroll Intersection Reveal
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-item');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}
