// Algartempo - Interactive Scripts

// Sample Job Postings Data
const jobPostings = [
  {
    id: 1,
    title: "Rececionista de Hotel 4*/5*",
    category: "hotelaria",
    location: "Albufeira / Vilamoura",
    type: "Full-Time / Temporário",
    salary: "950€ - 1.250€ / mês",
    posted: "Hoje",
    description: "Procuramos profissionais comunicativos, com fluência em Inglês e gosto pelo atendimento ao cliente para unidade hoteleira de referência.",
    tags: ["Inglês Fluente", "Experiência Prévia", "Turnos Rotativos", "Entrada Imediata"]
  },
  {
    id: 2,
    title: "Técnico de Manutenção e Climatização",
    category: "construcao",
    location: "Faro / Loulé",
    type: "Full-Time / Contrato com perspetiva de continuidade",
    salary: "1.200€ - 1.500€ / mês",
    posted: "Há 1 dia",
    description: "Empresa do setor de climatização e AVAC procura técnico com carteira profissional e carta de condução para assistência técnica.",
    tags: ["TIM / AVAC", "Carta Condução B", "Experiência 2+ anos"]
  },
  {
    id: 3,
    title: "Empregado(a) de Mesa / Bar",
    category: "hotelaria",
    location: "Portimão / Lagos",
    type: "Full-Time",
    salary: "900€ - 1.150€ + Gorjetas",
    posted: "Há 2 dias",
    description: "Excelente oportunidade para integrar equipa dinâmica em restaurante conceituado no Barlavento Algarvio. Bom ambiente e progressão.",
    tags: ["Atendimento", "Línguas Estrangeiras", "Dinamismo"]
  },
  {
    id: 4,
    title: "Operador de Logística e Empilhador",
    category: "logistica",
    location: "São Brás de Alportel / Olhão",
    type: "Full-Time / Turno Fixo",
    salary: "880€ - 1.050€ / mês",
    posted: "Há 3 dias",
    description: "Preparação de encomendas (picking), organização de armazém e condução de empilhador com certificado válido.",
    tags: ["Certificado Empilhador", "Picking", "Responsabilidade"]
  },
  {
    id: 5,
    title: "Assistente Administrativo(a) & RH",
    category: "administrativo",
    location: "Faro",
    type: "Full-Time / Substituição Licença",
    salary: "1.000€ - 1.200€ / mês",
    posted: "Há 4 dias",
    description: "Gestão documental, apoio ao processamento salarial, atendimento telefónico e suporte ao departamento de recrutamento.",
    tags: ["Excel Avançado", "Organização", "Comunicação"]
  },
  {
    id: 6,
    title: "Encarregado de Obra Civil",
    category: "construcao",
    location: "Tavira / Vila Real de Sto. António",
    type: "Full-Time",
    salary: "1.600€ - 2.000€ / mês",
    posted: "Há 5 dias",
    description: "Supervisão de equipas em obra residencial de luxo, controlo de prazos, medições e cumprimento de normas de segurança.",
    tags: ["Liderança", "Leitura de Projetos", "Experiência Comprovada"]
  }
];

// Sample Events & Fairs Data
const companyEvents = [
  {
    id: 1,
    title: "Bolsa de Empregabilidade Algarve 2026",
    category: "feira-emprego",
    dateDay: "24-25",
    dateMonth: "MAR",
    fullDate: "24 e 25 de Março de 2026",
    time: "09:30 - 18:00",
    location: "Centro de Congressos do Arade, Parchal - Portimão",
    booth: "Stand B14 (Piso 1)",
    tag: "Feira de Emprego & Turismo",
    status: "Confirmado",
    description: "Estaremos presentes no maior evento de emprego do Algarve! Venha entregar o seu CV diretamente à nossa equipa de recrutadores ou agende uma reunião para a sua empresa.",
    highlight: true
  },
  {
    id: 2,
    title: "Mostra de Emprego & Carreiras da Universidade do Algarve",
    category: "academico",
    dateDay: "15",
    dateMonth: "ABR",
    fullDate: "15 de Abril de 2026",
    time: "10:00 - 17:30",
    location: "Campus de Gambelas, UAlg - Faro",
    booth: "Espaço Empresas - Stand 08",
    tag: "Estágios & Jovens Talentos",
    status: "Inscrições Abertas",
    description: "Apresentação de programas de estágio, oportunidades de primeiro emprego e saídas profissionais para recém-licenciados e estudantes universitários.",
    highlight: false
  },
  {
    id: 3,
    title: "Fórum Regional de Recursos Humanos & Hospitalidade",
    category: "conferencia",
    dateDay: "08",
    dateMonth: "MAI",
    fullDate: "8 de Maio de 2026",
    time: "14:00 - 19:00",
    location: "Hotel Quinta do Lago, Almancil",
    booth: "Painel de Oradores & Networking Lounge",
    tag: "Conferência B2B",
    status: "Exclusivo Empresas",
    description: "Mesa redonda sobre 'A Retenção de Talento e a Flexibilidade no Trabalho Temporário em 2026', com intervenção da direção da Algartempo.",
    highlight: true
  },
  {
    id: 4,
    title: "FATACIL 2026 - Espaço Negócios e Empreendedorismo",
    category: "exposicao",
    dateDay: "21-30",
    dateMonth: "AGO",
    fullDate: "21 a 30 de Agosto de 2026",
    time: "18:00 - 24:00",
    location: "Parque de Feiras e Exposições, Lagoa",
    booth: "Pavilhão Institucional - Stand 42",
    tag: "Feira Multissetorial",
    status: "Presença Anual",
    description: "Visite o nosso stand na maior feira do sul do país. Atendimento personalizado para candidatos e empresários de todos os setores.",
    highlight: false
  }
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  renderJobs();
  renderEvents();
  initCounters();
  initMobileMenu();
  initModals();
  initFilters();
});

// Render Job Postings
function renderJobs(filteredJobs = jobPostings) {
  const container = document.getElementById('jobs-container');
  const countBadge = document.getElementById('jobs-count');
  
  if (countBadge) {
    countBadge.textContent = `${filteredJobs.length} vagas disponíveis`;
  }

  if (!container) return;

  if (filteredJobs.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-search text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">Nenhuma vaga encontrada</h3>
        <p class="text-slate-600 max-w-md mx-auto mb-6">Não encontramos ofertas que correspondam aos filtros selecionados. Envie a sua candidatura espontânea!</p>
        <button onclick="openApplyModal('Candidatura Espontânea')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
          Submeter Candidatura Espontânea
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredJobs.map(job => `
    <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover-card-effect flex flex-col justify-between relative overflow-hidden group">
      <div class="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            job.category === 'hotelaria' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            job.category === 'construcao' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
            job.category === 'logistica' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            'bg-sky-50 text-sky-700 border border-sky-200'
          }">
            <i class="fas ${
              job.category === 'hotelaria' ? 'fa-hotel' :
              job.category === 'construcao' ? 'fa-hard-hat' :
              job.category === 'logistica' ? 'fa-truck-loading' :
              'fa-briefcase'
            } text-[10px]"></i>
            ${job.category}
          </span>
          <span class="text-xs text-slate-400 flex items-center gap-1">
            <i class="far fa-clock"></i> ${job.posted}
          </span>
        </div>

        <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
          ${job.title}
        </h3>

        <p class="text-sm text-slate-600 mb-4 line-clamp-2">
          ${job.description}
        </p>

        <div class="space-y-2 mb-5">
          <div class="flex items-center text-xs text-slate-600 gap-2">
            <i class="fas fa-map-marker-alt text-blue-500 w-4"></i>
            <span>${job.location}</span>
          </div>
          <div class="flex items-center text-xs text-slate-600 gap-2">
            <i class="fas fa-euro-sign text-emerald-500 w-4"></i>
            <span class="font-semibold text-slate-700">${job.salary}</span>
          </div>
          <div class="flex items-center text-xs text-slate-600 gap-2">
            <i class="fas fa-user-clock text-sky-500 w-4"></i>
            <span>${job.type}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-6">
          ${job.tags.map(tag => `
            <span class="bg-slate-50 text-slate-600 border border-slate-200/60 px-2.5 py-1 rounded-md text-[11px]">
              ${tag}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button onclick="openApplyModal('${job.title.replace(/'/g, "\\'")}')" class="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
          <span>Candidatar Agora</span>
          <i class="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Render Events & Fairs
function renderEvents(filter = 'todos') {
  const container = document.getElementById('events-container');
  if (!container) return;

  const filtered = filter === 'todos' ? companyEvents : companyEvents.filter(e => e.category === filter);

  container.innerHTML = filtered.map(evt => `
    <div class="bg-white rounded-2xl border ${evt.highlight ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200'} p-6 shadow-sm hover-card-effect relative overflow-hidden flex flex-col justify-between">
      ${evt.highlight ? '<div class="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-sky-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-sm">Destaque</div>' : ''}
      <div>
        <div class="flex items-start gap-4 mb-5">
          <!-- Calendar Box -->
          <div class="flex-shrink-0 w-16 h-16 rounded-2xl event-date-box text-white flex flex-col items-center justify-center shadow-md">
            <span class="text-xs font-semibold uppercase tracking-wider text-sky-200">${evt.dateMonth}</span>
            <span class="text-xl font-extrabold leading-tight">${evt.dateDay}</span>
          </div>

          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-1 border border-blue-100">
              ${evt.tag}
            </span>
            <h3 class="text-lg font-bold text-slate-900 leading-snug">
              ${evt.title}
            </h3>
          </div>
        </div>

        <p class="text-sm text-slate-600 mb-5 leading-relaxed">
          ${evt.description}
        </p>

        <div class="bg-slate-50 rounded-xl p-3.5 space-y-2 mb-6 border border-slate-100">
          <div class="flex items-center text-xs text-slate-700 gap-2">
            <i class="far fa-calendar-alt text-blue-600 w-4"></i>
            <span class="font-medium">${evt.fullDate} (${evt.time})</span>
          </div>
          <div class="flex items-center text-xs text-slate-700 gap-2">
            <i class="fas fa-map-marker-alt text-rose-500 w-4"></i>
            <span>${evt.location}</span>
          </div>
          <div class="flex items-center text-xs text-slate-700 gap-2">
            <i class="fas fa-store text-amber-500 w-4"></i>
            <span class="font-semibold text-slate-900">${evt.booth}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 pt-3 border-t border-slate-100">
        <button onclick="openEventMeetingModal('${evt.title.replace(/'/g, "\\'")}', '${evt.fullDate}')" class="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
          <i class="fas fa-calendar-check"></i>
          <span>Agendar Reunião no Stand</span>
        </button>
        <a href="https://maps.google.com/?q=${encodeURIComponent(evt.location)}" target="_blank" rel="noopener noreferrer" class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors flex items-center justify-center" title="Ver Localização no Mapa">
          <i class="fas fa-directions"></i>
        </a>
      </div>
    </div>
  `).join('');
}

// Filter Logic for Jobs
function initFilters() {
  const searchInput = document.getElementById('job-search-input');
  const categorySelect = document.getElementById('job-category-select');
  const locationSelect = document.getElementById('job-location-select');

  function applyJobFilters() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const category = categorySelect?.value || 'todos';
    const loc = locationSelect?.value || 'todos';

    const filtered = jobPostings.filter(job => {
      const matchQuery = !query || 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.tags.some(t => t.toLowerCase().includes(query));

      const matchCategory = category === 'todos' || job.category === category;
      const matchLocation = loc === 'todos' || job.location.toLowerCase().includes(loc.toLowerCase());

      return matchQuery && matchCategory && matchLocation;
    });

    renderJobs(filtered);
  }

  searchInput?.addEventListener('input', applyJobFilters);
  categorySelect?.addEventListener('change', applyJobFilters);
  locationSelect?.addEventListener('change', applyJobFilters);
}

// Event Filter Tabs
function filterEventsTab(category, btnElement) {
  const tabs = document.querySelectorAll('.event-tab-btn');
  tabs.forEach(tab => {
    tab.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
    tab.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
  });

  if (btnElement) {
    btnElement.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
    btnElement.classList.add('bg-blue-600', 'text-white', 'shadow-md');
  }

  renderEvents(category);
}

// Animated Statistics Counter
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const step = Math.ceil(target / (duration / 25));
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = target.toLocaleString('pt-PT');
              clearInterval(timer);
            } else {
              counter.textContent = current.toLocaleString('pt-PT');
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// Mobile Menu
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      toggleBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
    } else {
      mobileMenu.classList.add('hidden');
      toggleBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      toggleBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    });
  });
}

// Modals Management
function initModals() {
  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openApplyModal(jobTitle = 'Candidatura Espontânea') {
  const modal = document.getElementById('apply-modal');
  const jobTitleInput = document.getElementById('apply-job-title');
  const titleDisplay = document.getElementById('apply-modal-job-name');

  if (jobTitleInput) jobTitleInput.value = jobTitle;
  if (titleDisplay) titleDisplay.textContent = jobTitle;

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

function openB2BModal() {
  const modal = document.getElementById('b2b-modal');
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

function openEventMeetingModal(eventTitle, eventDate) {
  const modal = document.getElementById('event-meeting-modal');
  const titleInput = document.getElementById('meeting-event-title');
  const titleDisplay = document.getElementById('meeting-event-name');
  const dateDisplay = document.getElementById('meeting-event-date');

  if (titleInput) titleInput.value = eventTitle;
  if (titleDisplay) titleDisplay.textContent = eventTitle;
  if (dateDisplay) dateDisplay.textContent = eventDate;

  if (modal) {
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeEventMeetingModal() {
  const modal = document.getElementById('event-meeting-modal');
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

// Toast Notifications System
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  
  if (type === 'success') {
    toastIcon.className = 'fas fa-check-circle text-emerald-500 text-lg';
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border-l-4 border-emerald-500 shadow-2xl rounded-xl py-3 px-5 text-slate-800 translate-y-0 opacity-100';
  } else {
    toastIcon.className = 'fas fa-info-circle text-blue-500 text-lg';
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border-l-4 border-blue-500 shadow-2xl rounded-xl py-3 px-5 text-slate-800 translate-y-0 opacity-100';
  }

  setTimeout(() => {
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border-l-4 border-emerald-500 shadow-2xl rounded-xl py-3 px-5 text-slate-800 translate-y-20 opacity-0 pointer-events-none';
  }, 4500);
}

// Form Submission Handlers
function handleCandidateSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]').value;
  
  closeApplyModal();
  form.reset();
  showToast(`Obrigado ${name}! A sua candidatura foi submetida com sucesso à equipa da Algartempo.`, 'success');
}

function handleB2BSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const company = form.querySelector('input[name="company_name"]')?.value || 'empresa';
  
  closeB2BModal();
  form.reset();
  showToast(`Pedido de proposta recebido com sucesso! O nosso consultor de RH entrará em contacto hoje.`, 'success');
}

function handleEventMeetingSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[name="meeting_name"]')?.value || '';
  
  closeEventMeetingModal();
  form.reset();
  showToast(`Reunião agendada com sucesso! Enviámos a confirmação e o bilhete de stand para o seu e-mail.`, 'success');
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  
  form.reset();
  showToast(`Mensagem enviada com sucesso! Responderemos no prazo máximo de 24 horas.`, 'success');
}
