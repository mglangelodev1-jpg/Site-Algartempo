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

// ============================================================
// FEIRAS E EVENTOS — CARREGADOS DO SUPABASE
// ============================================================

let regionalEvents = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getEventImageUrl(path) {
  if (!path) return '';

  const value = String(path).trim();

  // Se a BD já tiver a URL completa, usa-a diretamente
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  // Se a BD tiver apenas o caminho, cria a URL pública do Supabase
  const cleanPath = value
    .replace(/^\/+/, '')
    .replace(/^media\//, '');

  return `${SUPABASE_URL}/storage/v1/object/public/media/${cleanPath}`;
}
async function loadEvents() {
  const container = document.getElementById(
    'events-list-container'
  );

  if (!container) return;

  container.innerHTML = `
    <div class="py-10 text-center text-slate-500">
      A carregar feiras e eventos...
    </div>
  `;

  const { data, error } = await supabaseClient
    .from('events')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('event_date', { ascending: true });

  if (error) {
    console.error(
      'Erro ao carregar feiras:',
      error
    );

    container.innerHTML = `
      <div class="py-10 text-center text-slate-500">
        De momento não existem feiras disponíveis.
      </div>
    `;

    return;
  }

  regionalEvents = data || [];

  renderEvents();
}

// State for B2B Interactive Selector
const b2bState = {
  headcount: '1–5',
  timeframe: 'Esta Semana',
  sector: 'Hotelaria & Restauração'
};

// Document Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderJobs(jobPostings);
  loadEvents();
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

  if (!regionalEvents.length) {
    container.innerHTML = `
      <div class="py-10 text-center text-slate-500">
        De momento não existem feiras ou eventos publicados.
      </div>
    `;
    return;
  }

  container.innerHTML = regionalEvents.map(evt => {
    const imageUrl = getEventImageUrl(evt.image_url);

    const image = imageUrl
      ? `
        <img
          src="${escapeHtml(imageUrl)}"
          alt="${escapeHtml(evt.title || 'Evento Algartempo')}"
          loading="lazy"
          style="width:100%;height:100%;object-fit:cover;display:block;"
        >
      `
      : `
        <div class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
          Sem imagem
        </div>
      `;

    return `
      <article class="event-editorial">

        <div class="event-editorial__image">
          ${image}
        </div>

        <div class="event-editorial__content">

          <div class="event-editorial__date">
            <span>DATA</span>
            <strong>
              ${escapeHtml(evt.date_badge || evt.event_date || '—')}
            </strong>
          </div>

          <div class="event-editorial__details">

            <span class="event-editorial__status">
              ${escapeHtml(evt.edition || evt.type || 'Presença Confirmada')}
            </span>

            <h3>
              ${escapeHtml(evt.title || '')}
            </h3>

            <p class="event-editorial__location">
              <i class="fas fa-map-marker-alt"></i>
              ${escapeHtml(evt.location || '')}
            </p>

            <p class="event-editorial__description">
              ${escapeHtml(evt.description || '')}
            </p>

          </div>

          <div class="event-editorial__action">
            <button
              type="button"
              class="event-meeting-btn"
              data-event-title="${escapeHtml(evt.title || '')}"
              data-event-location="${escapeHtml(evt.location || '')}"
            >
              <i class="fas fa-calendar-check"></i>
              <span>Agendar no Stand</span>
            </button>
          </div>

        </div>

      </article>
    `;
  }).join('');

  container.querySelectorAll('.event-meeting-btn').forEach(button => {
    button.addEventListener('click', () => {
      openEventMeetingModal(
        button.dataset.eventTitle || '',
        button.dataset.eventLocation || ''
      );
    });
  });
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
/* =========================================================
   ALGARTEMPO — OPORTUNIDADES PÚBLICAS
   Liga o Backoffice à página pública
   ========================================================= */

(function () {
  let publicOpportunities = [];
  let filteredOpportunities = [];

  function escapeOpportunityHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getOpportunityMediaUrl(path) {
    if (!path) return "";

    const value = String(path).trim();

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    const cleanPath = value
      .replace(/^\/+/, "")
      .replace(/^media\//, "");

    return `${SUPABASE_URL}/storage/v1/object/public/media/${cleanPath}`;
  }

  function isOpportunityVideo(path) {
    if (!path) return false;

    const value = String(path).toLowerCase();

    return (
      value.includes(".mp4") ||
      value.includes(".webm") ||
      value.includes(".mov") ||
      value.includes(".m4v") ||
      value.includes(".avi")
    );
  }

  function formatOpportunityDate(date) {
    if (!date) return "";

    try {
      const dateObject = new Date(date + "T00:00:00");

      return dateObject.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return date;
    }
  }

  function renderPublicOpportunities() {
    const container = document.getElementById(
      "jobs-list-container"
    );

    if (!container) return;

    const countBadge = document.getElementById(
      "jobs-count-badge"
    );

    if (countBadge) {
      countBadge.textContent = `${filteredOpportunities.length} ${
        filteredOpportunities.length === 1
          ? "Vaga"
          : "Vagas"
      }`;
    }

    if (!filteredOpportunities.length) {
      container.innerHTML = `
        <div class="md:col-span-2 lg:col-span-3 py-14 text-center">
          <div class="editorial-paper rounded-2xl p-8 bg-white border border-[#e2d9cc]">
            <i class="fas fa-search text-3xl text-slate-300 mb-4"></i>

            <h3 class="text-lg font-heading font-bold text-slate-900 mb-2">
              Não encontrámos oportunidades.
            </h3>

            <p class="text-sm text-slate-500">
              Experimenta alterar os filtros ou a pesquisa.
            </p>
          </div>
        </div>
      `;

      return;
    }

    container.innerHTML = filteredOpportunities
      .map((job) => {
        const mediaUrl = getOpportunityMediaUrl(
          job.image_url
        );

        const video = isOpportunityVideo(
          job.image_url
        );

        let mediaHtml = "";

        if (mediaUrl && video) {
          mediaHtml = `
            <div class="relative h-52 bg-slate-100 overflow-hidden">
              <video
  src="${escapeOpportunityHtml(mediaUrl)}"
  class="w-full h-full object-cover"
  autoplay
  muted
  loop
  playsinline
  preload="auto"
></video>
            </div>
          `;
        } else if (mediaUrl) {
          mediaHtml = `
            <div class="relative h-52 bg-slate-100 overflow-hidden">
              <img
                src="${escapeOpportunityHtml(mediaUrl)}"
                alt="${escapeOpportunityHtml(
                  job.title || "Oportunidade Algartempo"
                )}"
                class="w-full h-full object-cover"
                loading="lazy"
              >

              ${
                job.featured
                  ? `
                    <div class="absolute top-3 left-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide">
                        <i class="fas fa-star"></i>
                        Destaque
                      </span>
                    </div>
                  `
                  : ""
              }
            </div>
          `;
        } else {
          mediaHtml = `
            <div class="relative h-52 bg-[#f4efe6] flex items-center justify-center overflow-hidden">
              <div class="text-center">
                <div class="w-14 h-14 mx-auto rounded-full bg-white border border-[#e2d9cc] flex items-center justify-center mb-3">
                  <i class="fas fa-briefcase text-sky-600 text-lg"></i>
                </div>

                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Oportunidade
                </span>
              </div>

              ${
                job.featured
                  ? `
                    <div class="absolute top-3 left-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide">
                        <i class="fas fa-star"></i>
                        Destaque
                      </span>
                    </div>
                  `
                  : ""
              }
            </div>
          `;
        }

        const sector = job.sector || "Oportunidade";
        const location = job.location || job.region || "Algarve";
        const contract = job.contract_type || "";
        const schedule = job.schedule || "";

        return `
          <article
            class="editorial-paper rounded-2xl overflow-hidden bg-white border border-[#e2d9cc] hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col"
          >

            ${mediaHtml}

            <div class="p-5 flex flex-col flex-1">

              <div class="flex flex-wrap items-center gap-2 mb-3">

                <span class="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wide">
                  ${escapeOpportunityHtml(sector)}
                </span>

                ${
                  contract
                    ? `
                      <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        ${escapeOpportunityHtml(contract)}
                      </span>
                    `
                    : ""
                }

              </div>

              <h3 class="text-lg font-heading font-bold text-slate-900 leading-tight mb-2">
                ${escapeOpportunityHtml(job.title)}
              </h3>

              ${
                job.company
                  ? `
                    <p class="text-sm font-semibold text-slate-700 mb-1">
                      ${escapeOpportunityHtml(job.company)}
                    </p>
                  `
                  : ""
              }

              <div class="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <i class="fas fa-map-marker-alt text-sky-600"></i>
                <span>${escapeOpportunityHtml(location)}</span>
              </div>

              ${
                job.description
                  ? `
                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      ${escapeOpportunityHtml(job.description)}
                    </p>
                  `
                  : ""
              }

              <div class="mt-auto pt-4 border-t border-[#e2d9cc]">

                ${
                  schedule
                    ? `
                      <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                        <i class="fas fa-clock text-sky-600"></i>
                        <span>${escapeOpportunityHtml(schedule)}</span>
                      </div>
                    `
                    : ""
                }

                ${
                  job.deadline
                    ? `
                      <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
                        <i class="fas fa-calendar-alt text-sky-600"></i>
                        <span>
                          Candidaturas até ${escapeOpportunityHtml(
                            formatOpportunityDate(job.deadline)
                          )}
                        </span>
                      </div>
                    `
                    : ""
                }

                <button
                  type="button"
                  class="public-job-apply-btn w-full py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  data-job-title="${escapeOpportunityHtml(
                    job.title || ""
                  )}"
                  data-job-company="${escapeOpportunityHtml(
                    job.company || ""
                  )}"
                >
                  <span>Candidatar-me</span>
                  <i class="fas fa-arrow-right"></i>
                </button>

              </div>

            </div>

          </article>
        `;
      })
      .join("");

    container
      .querySelectorAll(".public-job-apply-btn")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const title =
            button.dataset.jobTitle || "";

          const company =
            button.dataset.jobCompany || "";

          const applicationTitle = company
            ? `${title} — ${company}`
            : title;

          if (typeof openApplyModal === "function") {
            openApplyModal(applicationTitle);
          } else {
            console.warn(
              "openApplyModal não está disponível."
            );
          }
        });
      });
  }

  function filterPublicOpportunities() {

  const searchInput =
    document.getElementById("filter-search");

  const sectorSelect =
    document.getElementById("filter-sector");

  const locationSelect =
    document.getElementById("filter-location");


  const search =
    searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";


  const sector =
    sectorSelect
      ? sectorSelect.value
      : "todos";


  const location =
    locationSelect
      ? locationSelect.value
      : "todos";


  /*
   * Polo selecionado através de
   * "Ver oportunidades" num escritório.
   *
   * null = mostrar todas
   */
  const selectedOfficeId =
    window.algartempoSelectedOfficeId || null;


  filteredOpportunities =
    publicOpportunities.filter((job) => {

      /*
       * PESQUISA
       */
      const searchableText = [

        job.title,
        job.company,
        job.location,
        job.region,
        job.sector,
        job.description,
        job.requirements

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


      const matchesSearch =
        !search ||
        searchableText.includes(search);


      /*
       * SETOR
       */
      const jobSector =
        String(
          job.sector || ""
        ).toLowerCase();


      const matchesSector =
        sector === "todos" ||
        jobSector.includes(
          sector.toLowerCase()
        );


      /*
       * LOCALIZAÇÃO
       */
      const jobLocation =
        String(
          job.location || ""
        ).toLowerCase();


      const matchesLocation =
        location === "todos" ||
        jobLocation.includes(
          location.toLowerCase()
        );


      /*
       * POLO ALGARTEMPO
       */
      const matchesOffice =
        !selectedOfficeId ||
        String(job.office_id) ===
          String(selectedOfficeId);


      return (
        matchesSearch &&
        matchesSector &&
        matchesLocation &&
        matchesOffice
      );

    });


  renderPublicOpportunities();

}

window.filterPublicOpportunities = filterPublicOpportunities;

  async function loadPublicOpportunities() {
    const container =
      document.getElementById(
        "jobs-list-container"
      );

    if (!container) return;

    container.innerHTML = `
      <div class="md:col-span-2 lg:col-span-3 py-14 text-center">
        <div class="editorial-paper rounded-2xl p-8 bg-white border border-[#e2d9cc]">
          <i class="fas fa-spinner fa-spin text-2xl text-sky-600 mb-4"></i>

          <p class="text-sm text-slate-500">
            A carregar oportunidades...
          </p>
        </div>
      </div>
    `;

    try {
      const selectedOfficeId =
  window.algartempoSelectedOfficeId || null;

let query = supabaseClient
  .from("opportunities")
  .select("*")
  .eq("published", true);

if (selectedOfficeId) {
  query = query.eq(
    "office_id",
    Number(selectedOfficeId)
  );
}

const {
  data,
  error
} = await query
  .order("featured", {
    ascending: false
  })
  .order("sort_order", {
    ascending: true
  })
  .order("created_at", {
    ascending: false
  });

      if (error) {
        console.error(
          "Erro ao carregar oportunidades:",
          error
        );

        container.innerHTML = `
          <div class="md:col-span-2 lg:col-span-3 py-14 text-center">
            <div class="editorial-paper rounded-2xl p-8 bg-white border border-red-200">
              <i class="fas fa-exclamation-triangle text-2xl text-red-500 mb-4"></i>

              <h3 class="text-lg font-heading font-bold text-slate-900 mb-2">
                Não foi possível carregar as oportunidades.
              </h3>

              <p class="text-sm text-slate-500">
                Tenta novamente dentro de alguns instantes.
              </p>
            </div>
          </div>
        `;

        return;
      }

      publicOpportunities = data || [];
      filteredOpportunities = [...publicOpportunities];

      renderPublicOpportunities();

    } catch (error) {
      console.error(
        "Erro inesperado nas oportunidades:",
        error
      );

      container.innerHTML = `
        <div class="md:col-span-2 lg:col-span-3 py-14 text-center">
          <div class="editorial-paper rounded-2xl p-8 bg-white border border-red-200">
            <i class="fas fa-exclamation-triangle text-2xl text-red-500 mb-4"></i>

            <p class="text-sm text-slate-500">
              Ocorreu um erro ao carregar as oportunidades.
            </p>
          </div>
        </div>
      `;
    }
  }

  function setupOpportunityFilters() {
    const searchInput =
      document.getElementById("filter-search");

    const sectorSelect =
      document.getElementById("filter-sector");

    const locationSelect =
      document.getElementById("filter-location");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        filterPublicOpportunities
      );
    }

    if (sectorSelect) {
      sectorSelect.addEventListener(
        "change",
        filterPublicOpportunities
      );
    }

    if (locationSelect) {
      locationSelect.addEventListener(
        "change",
        filterPublicOpportunities
      );
    }

    document
      .querySelectorAll(".location-chip")
      .forEach((chip) => {
        chip.addEventListener("click", () => {
          const location =
            chip.dataset.location || "todos";

          if (locationSelect) {
            locationSelect.value = location;
          }

          document
            .querySelectorAll(".location-chip")
            .forEach((item) => {
              item.classList.remove(
                "active",
                "bg-sky-100",
                "text-sky-800"
              );

              item.classList.add(
                "bg-slate-100",
                "text-slate-700"
              );
            });

          chip.classList.add(
            "active",
            "bg-sky-100",
            "text-sky-800"
          );

          chip.classList.remove(
            "bg-slate-100",
            "text-slate-700"
          );

          filterPublicOpportunities();
        });
      });
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      setupOpportunityFilters();
      loadPublicOpportunities();
    }
  );

})();

/* =========================================================
   ALGARTEMPO — POLOS PÚBLICOS
   Liga "Onde Estamos" ao Backoffice
   ========================================================= */

(function () {

  function escapeOfficeHtml(value) {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function getOfficeImageUrl(path) {

    if (!path) {
      return "";
    }

    const value =
      String(path).trim();

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    const cleanPath =
      value
        .replace(/^\/+/, "")
        .replace(/^media\//, "");

    return `${SUPABASE_URL}/storage/v1/object/public/media/${cleanPath}`;
  }


  async function loadPublicOffices() {

    const container =
      document.getElementById(
        "offices-public-container"
      );

    if (!container) {
      return;
    }


    try {

      const {
        data,
        error
      } = await supabaseClient
        .from("offices")
        .select("*")
        .eq("published", true)
        .order("sort_order", {
          ascending: true
        })
        .order("name", {
          ascending: true
        });


      if (error) {

        console.error(
          "Erro ao carregar polos:",
          error
        );

        container.innerHTML = `
          <div class="md:col-span-2 lg:col-span-3 py-12 text-center">

            <div class="editorial-paper rounded-2xl p-8 bg-[#faf8f5] border border-[#e2d9cc]">

              <i class="fas fa-exclamation-triangle text-2xl text-amber-600 mb-3"></i>

              <h3 class="text-lg font-heading font-bold text-slate-900 mb-2">
                Não foi possível carregar os polos.
              </h3>

              <p class="text-sm text-slate-500">
                Tenta novamente dentro de alguns instantes.
              </p>

            </div>

          </div>
        `;

        return;
      }


      const offices =
        data || [];


      if (!offices.length) {

        container.innerHTML = `
          <div class="md:col-span-2 lg:col-span-3 py-12 text-center">

            <div class="editorial-paper rounded-2xl p-8 bg-[#faf8f5] border border-[#e2d9cc]">

              <i class="fas fa-map-marker-alt text-2xl text-sky-600 mb-3"></i>

              <h3 class="text-lg font-heading font-bold text-slate-900 mb-2">
                Estamos a preparar a nossa rede.
              </h3>

              <p class="text-sm text-slate-500">
                Contacta a nossa equipa para saber onde estamos.
              </p>

            </div>

          </div>
        `;

        return;
      }


      container.innerHTML =
        offices
          .map((office) => {

            const imageUrl =
              getOfficeImageUrl(
                office.image_url
              );


            const sectors =
              office.sectors
                ? String(
                    office.sectors
                  )
                : "";


            const sectorList =
              sectors
                .split(",")
                .map(
                  sector =>
                    sector.trim()
                )
                .filter(Boolean)
                .slice(0, 4);


            return `
              <article
                class="editorial-paper rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e2d9cc] hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col"
              >

                <!-- IMAGEM -->

                <div class="relative h-56 bg-slate-100 overflow-hidden">

                  ${
                    imageUrl
                      ? `
                        <img
                          src="${escapeOfficeHtml(imageUrl)}"
                          alt="${escapeOfficeHtml(
                            office.name
                          )}"
                          class="w-full h-full object-cover"
                          loading="lazy"
                        >
                      `
                      : `
                        <div class="w-full h-full flex items-center justify-center bg-[#f4efe6]">

                          <div class="text-center">

                            <div class="w-14 h-14 mx-auto rounded-full bg-white border border-[#e2d9cc] flex items-center justify-center mb-3">
                              <i class="fas fa-map-marker-alt text-sky-600 text-lg"></i>
                            </div>

                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Polo Algartempo
                            </span>

                          </div>

                        </div>
                      `
                  }

                </div>


                <!-- CONTEÚDO -->

                <div class="p-6 flex flex-col flex-1">

                  <div class="flex items-center justify-between gap-3 border-b border-[#e2d9cc] pb-3 mb-4">

                    <span class="text-xs font-bold text-sky-700 uppercase tracking-wider">
                      ${escapeOfficeHtml(
                        office.region || "Portugal"
                      )}
                    </span>

                    <span class="text-[10px] text-slate-500 font-semibold">
                      Presença Local
                    </span>

                  </div>


                  <h3 class="text-xl font-heading font-bold text-slate-900 leading-tight mb-1">
                    ${escapeOfficeHtml(
                      office.name
                    )}
                  </h3>


                  ${
                    office.city
                      ? `
                        <p class="text-sm font-semibold text-slate-700 mb-3">
                          ${escapeOfficeHtml(
                            office.city
                          )}
                        </p>
                      `
                      : ""
                  }


                  ${
                    office.description
                      ? `
                        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                          ${escapeOfficeHtml(
                            office.description
                          )}
                        </p>
                      `
                      : ""
                  }


                  <!-- SETORES -->

                  ${
                    sectorList.length
                      ? `
                        <div class="flex flex-wrap gap-1.5 mb-4">

                          ${sectorList
                            .map(
                              sector => `
                                <span class="px-2.5 py-1 rounded-full bg-white border border-[#e2d9cc] text-[10px] font-semibold text-slate-600">
                                  ${escapeOfficeHtml(
                                    sector
                                  )}
                                </span>
                              `
                            )
                            .join("")}

                        </div>
                      `
                      : ""
                  }


                  <!-- MORADA -->

                  ${
                    office.address
                      ? `
                        <div class="flex items-start gap-2.5 text-xs text-slate-600 mb-2">

                          <i class="fas fa-map-marker-alt text-sky-600 mt-0.5"></i>

                          <span>
                            ${escapeOfficeHtml(
                              office.address
                            )}

                            ${
                              office.postal_code
                                ? `<br>${escapeOfficeHtml(
                                    office.postal_code
                                  )}`
                                : ""
                            }
                          </span>

                        </div>
                      `
                      : ""
                  }


                  <!-- TELEFONE -->

                  ${
                    office.phone
                      ? `
                        <a
                          href="tel:${escapeOfficeHtml(
                            office.phone.replace(
                              /[^0-9+]/g,
                              ""
                            )
                          )}"
                          class="flex items-center gap-2.5 text-xs text-slate-600 hover:text-sky-700 mb-2 transition-colors"
                        >

                          <i class="fas fa-phone text-sky-600"></i>

                          <span>
                            ${escapeOfficeHtml(
                              office.phone
                            )}
                          </span>

                        </a>
                      `
                      : ""
                  }


                  <!-- EMAIL -->

                  ${
                    office.email
                      ? `
                        <a
                          href="mailto:${escapeOfficeHtml(
                            office.email
                          )}"
                          class="flex items-center gap-2.5 text-xs text-slate-600 hover:text-sky-700 mb-4 transition-colors"
                        >

                          <i class="fas fa-envelope text-sky-600"></i>

                          <span>
                            ${escapeOfficeHtml(
                              office.email
                            )}
                          </span>

                        </a>
                      `
                      : ""
                  }


                  <div class="mt-auto pt-4 border-t border-[#e2d9cc]">

                    ${
                      office.hours
                        ? `
                          <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-4">

                            <i class="fas fa-clock text-sky-600"></i>

                            <span>
                              ${escapeOfficeHtml(
                                office.hours
                              )}
                            </span>

                          </div>
                        `
                        : ""
                    }


                    <button
                      type="button"
                      class="public-office-contact-btn w-full py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      data-office-name="${escapeOfficeHtml(
                        office.name
                      )}"
                    >

                      <span>Falar com a Equipa</span>

                      <i class="fas fa-arrow-right"></i>

                    </button>

                    <button
  type="button"
  class="public-office-jobs-btn w-full py-2.5 mt-2 rounded-full border border-sky-600 text-sky-700 hover:bg-sky-50 font-heading font-bold text-xs uppercase tracking-wider transition-colors"
  data-office-id="${office.id}"
  data-office-city="${escapeOfficeHtml(
    office.city || ""
  )}"
>
  <span>Ver oportunidades</span>
  <i class="fas fa-arrow-right ml-2"></i>
</button>

                  </div>

                </div>

              </article>
            `;

          })
          .join("");


      container
        .querySelectorAll(
          ".public-office-contact-btn"
        )
        .forEach((button) => {

          button.addEventListener(
            "click",
            () => {

              const officeName =
                button.dataset.officeName ||
                "Polo Algartempo";


              if (
                typeof openApplyModal ===
                "function"
              ) {

                openApplyModal(
                  `Contacto — ${officeName}`
                );

              } else {

                console.warn(
                  "openApplyModal não está disponível."
                );

              }

            }
          );

        });

  container
  .querySelectorAll(".public-office-jobs-btn")
  .forEach((button) => {

    button.onclick = function () {

  const officeId =
    this.getAttribute("data-office-id");

  const officeCity =
    this.getAttribute("data-office-city") || "";

  console.log(
    "Polo selecionado:",
    officeId,
    officeCity
  );

  window.algartempoSelectedOfficeId =
    officeId || null;

  const searchInput =
    document.getElementById("filter-search");

  const sectorSelect =
    document.getElementById("filter-sector");

  const locationSelect =
    document.getElementById("filter-location");

  if (searchInput) {
    searchInput.value = "";
  }

  if (sectorSelect) {
    sectorSelect.value = "todos";
  }

 if (locationSelect) {
  locationSelect.value = "todos";
}

window.filterPublicOpportunities();

  const opportunitiesSection =
    document.getElementById("vagas");

  if (opportunitiesSection) {
    opportunitiesSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};

  });


    } catch (error) {

      console.error(
        "Erro inesperado nos polos:",
        error
      );

      container.innerHTML = `
        <div class="md:col-span-2 lg:col-span-3 py-12 text-center">

          <p class="text-sm text-slate-500">
            Ocorreu um erro ao carregar os polos.
          </p>

        </div>
      `;
    }

  }


  document.addEventListener(
    "DOMContentLoaded",
    () => {
      loadPublicOffices();
    }
  );

  window.showOpportunitiesForOffice = function(officeId, officeCity) {

  window.algartempoSelectedOfficeId = officeId || null;

  const searchInput =
    document.getElementById("filter-search");

  const sectorSelect =
    document.getElementById("filter-sector");

  if (searchInput) {
    searchInput.value = "";
  }

  if (sectorSelect) {
    sectorSelect.value = "todos";
  }

  filterPublicOpportunities();

  const opportunityContainer =
    document.getElementById("jobs-list-container");

  if (opportunityContainer) {
    opportunityContainer.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

})();