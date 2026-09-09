/**
 * Algartempo — "Pessoas que movem o Algarve."
 * Interactive Engine & Real-time Controllers
 */

// ============================================================
// OPORTUNIDADES
// As oportunidades públicas vêm exclusivamente do Supabase.
// O backoffice é a fonte de verdade.
// ============================================================


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

  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

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


// ============================================================
// B2B
// ============================================================

const b2bState = {
  headcount: '1–5',
  timeframe: 'Esta Semana',
  sector: 'Hotelaria & Restauração'
};


// ============================================================
// DOCUMENT READY
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  initB2BSelector();
  initStepNarrative();
  initMobileMenu();
  initModals();
  initScrollAnimations();
});


// ============================================================
// FEIRAS / EVENTOS
// ============================================================

function renderEvents() {
  const container = document.getElementById(
    'events-list-container'
  );

  if (!container) return;

  if (!regionalEvents.length) {
    container.innerHTML = `
      <div class="py-10 text-center text-slate-500">
        De momento não existem feiras ou eventos publicados.
      </div>
    `;

    return;
  }

  container.innerHTML = regionalEvents
    .map(evt => {

      const imageUrl = getEventImageUrl(
        evt.image_url
      );

      const image = imageUrl
        ? `
          <img
            src="${escapeHtml(imageUrl)}"
            alt="${escapeHtml(
              evt.title || 'Evento Algartempo'
            )}"
            loading="lazy"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:block;
            "
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
                ${escapeHtml(
                  evt.date_badge ||
                  evt.event_date ||
                  '—'
                )}
              </strong>
            </div>

            <div class="event-editorial__details">

              <span class="event-editorial__status">
                ${escapeHtml(
                  evt.edition ||
                  evt.type ||
                  'Presença Confirmada'
                )}
              </span>

              <h3>
                ${escapeHtml(evt.title || '')}
              </h3>

              <p class="event-editorial__location">
                <i class="fas fa-map-marker-alt"></i>
                ${escapeHtml(evt.location || '')}
              </p>

              <p class="event-editorial__description">
                ${escapeHtml(
                  evt.description || ''
                )}
              </p>

            </div>

            <div class="event-editorial__action">

              <button
                type="button"
                class="event-meeting-btn"
                data-event-title="${escapeHtml(
                  evt.title || ''
                )}"
                data-event-location="${escapeHtml(
                  evt.location || ''
                )}"
              >
                <i class="fas fa-calendar-check"></i>
                <span>Agendar no Stand</span>
              </button>

            </div>

          </div>

        </article>
      `;
    })
    .join('');

  container
    .querySelectorAll('.event-meeting-btn')
    .forEach(button => {

      button.addEventListener('click', () => {

        openEventMeetingModal(
          button.dataset.eventTitle || '',
          button.dataset.eventLocation || ''
        );

      });

    });
}


// ============================================================
// STEP NARRATIVE
// ============================================================

function initStepNarrative() {

  const skillChips =
    document.querySelectorAll('.skill-chip');

  skillChips.forEach(chip => {

    chip.addEventListener('click', () => {

      skillChips.forEach(c =>
        c.classList.remove('active')
      );

      chip.classList.add('active');

      const targetSector =
        chip.getAttribute('data-sector');

      const sectorSelect =
        document.getElementById('filter-sector');

      if (sectorSelect) {
        sectorSelect.value =
          targetSector;
      }

      const jobsSection =
        document.getElementById('vagas');

      if (jobsSection) {

        jobsSection.scrollIntoView({
          behavior: 'smooth'
        });

      }

      if (
        typeof window.filterPublicOpportunities ===
        'function'
      ) {

        window.filterPublicOpportunities();

      }

    });

  });

}


// ============================================================
// B2B SELECTOR
// ============================================================

function initB2BSelector() {

  const headcountBtns =
    document.querySelectorAll(
      '.b2b-headcount-btn'
    );

  const timeframeBtns =
    document.querySelectorAll(
      '.b2b-timeframe-btn'
    );

  const sectorBtns =
    document.querySelectorAll(
      '.b2b-sector-btn'
    );


  headcountBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      headcountBtns.forEach(b =>
        b.classList.remove('active')
      );

      btn.classList.add('active');

      b2bState.headcount =
        btn.getAttribute('data-value');

      updateB2BSummary();

    });

  });


  timeframeBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      timeframeBtns.forEach(b =>
        b.classList.remove('active')
      );

      btn.classList.add('active');

      b2bState.timeframe =
        btn.getAttribute('data-value');

      updateB2BSummary();

    });

  });


  sectorBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      sectorBtns.forEach(b =>
        b.classList.remove('active')
      );

      btn.classList.add('active');

      b2bState.sector =
        btn.getAttribute('data-value');

      updateB2BSummary();

    });

  });


  updateB2BSummary();

}


function updateB2BSummary() {

  const summaryEl =
    document.getElementById(
      'b2b-summary-text'
    );

  if (summaryEl) {

    summaryEl.textContent =
      `${b2bState.headcount} pessoas • Para: ${b2bState.timeframe} • Área: ${b2bState.sector}`;

  }

}


function triggerB2BModalWithState() {

  openB2BModal(b2bState);

}


// ============================================================
// MOBILE MENU
// ============================================================

function initMobileMenu() {

  const toggleBtn =
    document.getElementById(
      'mobile-menu-toggle'
    );

  const closeBtn =
    document.getElementById(
      'mobile-menu-close'
    );

  const drawer =
    document.getElementById(
      'mobile-drawer'
    );

  const links =
    document.querySelectorAll(
      '.mobile-drawer-link'
    );


  function openDrawer() {

    if (drawer) {

      drawer.classList.remove(
        'translate-x-full'
      );

      document.body.style.overflow =
        'hidden';

    }

  }


  function closeDrawer() {

    if (drawer) {

      drawer.classList.add(
        'translate-x-full'
      );

      document.body.style.overflow =
        '';

    }

  }


  if (toggleBtn) {

    toggleBtn.addEventListener(
      'click',
      openDrawer
    );

  }


  if (closeBtn) {

    closeBtn.addEventListener(
      'click',
      closeDrawer
    );

  }


  links.forEach(link => {

    link.addEventListener(
      'click',
      closeDrawer
    );

  });

}


// ============================================================
// MODALS
// ============================================================

function initModals() {

  document.addEventListener(
    'keydown',
    e => {

      if (e.key === 'Escape') {
        closeAllModals();
      }

    }
  );


  const modals =
    document.querySelectorAll(
      '.modal-overlay'
    );


  modals.forEach(modal => {

    modal.addEventListener(
      'click',
      e => {

        if (e.target === modal) {
          closeAllModals();
        }

      }
    );

  });

}


function openApplyModal(
  jobTitle = 'Candidatura Espontânea'
) {

  const modal =
    document.getElementById(
      'apply-modal'
    );

  const titleDisplay =
    document.getElementById(
      'apply-modal-job-title'
    );

  const hiddenInput =
    document.getElementById(
      'apply-job-input'
    );


  if (titleDisplay) {

    titleDisplay.textContent =
      jobTitle;

  }


  if (hiddenInput) {

    hiddenInput.value =
      jobTitle;

  }


  if (modal) {

    modal.classList.remove(
      'modal-hidden'
    );

    document.body.style.overflow =
      'hidden';

  }

}


function closeApplyModal() {

  const modal =
    document.getElementById(
      'apply-modal'
    );

  if (modal) {

    modal.classList.add(
      'modal-hidden'
    );

    document.body.style.overflow =
      '';

  }

}


function openB2BModal(prefill = null) {

  const modal =
    document.getElementById(
      'b2b-modal'
    );


  if (prefill) {

    const headInput =
      document.getElementById(
        'b2b-input-headcount'
      );

    const timeInput =
      document.getElementById(
        'b2b-input-timeframe'
      );

    const secInput =
      document.getElementById(
        'b2b-input-sector'
      );


    if (headInput) {

      headInput.value =
        prefill.headcount;

    }


    if (timeInput) {

      timeInput.value =
        prefill.timeframe;

    }


    if (secInput) {

      secInput.value =
        prefill.sector;

    }

  }


  if (modal) {

    modal.classList.remove(
      'modal-hidden'
    );

    document.body.style.overflow =
      'hidden';

  }

}


function closeB2BModal() {

  const modal =
    document.getElementById(
      'b2b-modal'
    );

  if (modal) {

    modal.classList.add(
      'modal-hidden'
    );

    document.body.style.overflow =
      '';

  }

}


function openEventMeetingModal(
  eventTitle,
  eventLocation
) {

  const modal =
    document.getElementById(
      'event-modal'
    );

  const titleEl =
    document.getElementById(
      'event-modal-title'
    );

  const locEl =
    document.getElementById(
      'event-modal-location'
    );


  if (titleEl) {

    titleEl.textContent =
      eventTitle;

  }


  if (locEl) {

    locEl.textContent =
      eventLocation;

  }


  if (modal) {

    modal.classList.remove(
      'modal-hidden'
    );

    document.body.style.overflow =
      'hidden';

  }

}


function closeEventMeetingModal() {

  const modal =
    document.getElementById(
      'event-modal'
    );

  if (modal) {

    modal.classList.add(
      'modal-hidden'
    );

    document.body.style.overflow =
      '';

  }

}


function closeAllModals() {

  closeApplyModal();
  closeB2BModal();
  closeEventMeetingModal();

}


// ============================================================
// TOAST
// ============================================================

function showToast(
  message,
  iconClass =
    'fa-check-circle text-emerald-400'
) {

  const toast =
    document.getElementById(
      'toast'
    );

  const toastText =
    document.getElementById(
      'toast-message'
    );

  const toastIcon =
    document.getElementById(
      'toast-icon'
    );


  if (!toast || !toastText) {
    return;
  }


  toastText.textContent =
    message;


  if (toastIcon) {

    toastIcon.className =
      `fas ${iconClass} text-lg`;

  }


  toast.classList.remove(
    'translate-y-20',
    'opacity-0',
    'pointer-events-none'
  );

  toast.classList.add(
    'translate-y-0',
    'opacity-100'
  );


  setTimeout(() => {

    toast.classList.add(
      'translate-y-20',
      'opacity-0',
      'pointer-events-none'
    );

    toast.classList.remove(
      'translate-y-0',
      'opacity-100'
    );

  }, 4500);

}


// ============================================================
// FORM HANDLERS
// ============================================================

function handleCandidateSubmit(e) {

  e.preventDefault();

  const form = e.target;

  const name =
    form.querySelector(
      'input[name="candidate_name"]'
    )?.value ||
    'Candidato(a)';


  closeApplyModal();

  form.reset();


  showToast(
    `Obrigado ${name}! A sua candidatura foi registada. A equipa da Algartempo entrará em contacto.`
  );

}


function handleB2BSubmit(e) {

  e.preventDefault();

  const form = e.target;

  const company =
    form.querySelector(
      'input[name="company_name"]'
    )?.value ||
    'sua empresa';


  closeB2BModal();

  form.reset();


  showToast(
    `Pedido para ${company} recebido. O nosso consultor de RH enviará a proposta nas próximas 24h.`
  );

}


function handleEventMeetingSubmit(e) {

  e.preventDefault();

  const form = e.target;

  closeEventMeetingModal();

  form.reset();


  showToast(
    `Reunião no stand agendada com sucesso! Enviámos os detalhes para o seu contacto.`
  );

}


function handleDirectContact(e) {

  e.preventDefault();

  const form = e.target;

  form.reset();


  showToast(
    `Mensagem enviada com sucesso! Responderemos o mais brevemente possível.`
  );

}


// ============================================================
// SCROLL ANIMATIONS
// ============================================================

function initScrollAnimations() {

  const reveals =
    document.querySelectorAll(
      '.reveal-item'
    );


  if (
    !('IntersectionObserver' in window)
  ) {

    reveals.forEach(el =>
      el.classList.add(
        'is-visible'
      )
    );

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              'is-visible'
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.1
      }
    );


  reveals.forEach(el =>
    observer.observe(el)
  );

}


/* =========================================================
   ALGARTEMPO — OPORTUNIDADES PÚBLICAS
   Liga o Backoffice à página pública
   ========================================================= */

(function () {

  let publicOpportunities = [];

  let filteredOpportunities = [];

  let publicOffices = [];


  // ==========================================================
  // ESCAPE
  // ==========================================================

  function escapeOpportunityHtml(value) {

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


  // ==========================================================
  // MEDIA
  // ==========================================================

  function getOpportunityMediaUrl(path) {

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


  function isOpportunityVideo(path) {

    if (!path) {
      return false;
    }

    const value =
      String(path).toLowerCase();


    return (
      value.includes(".mp4") ||
      value.includes(".webm") ||
      value.includes(".mov") ||
      value.includes(".m4v") ||
      value.includes(".avi")
    );

  }


  // ==========================================================
  // DATA
  // ==========================================================

  function formatOpportunityDate(date) {

    if (!date) {
      return "";
    }


    try {

      const dateObject =
        new Date(
          date + "T00:00:00"
        );


      return dateObject.toLocaleDateString(
        "pt-PT",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      );

    } catch {

      return date;

    }

  }


  function normalizeOpportunityText(
    value
  ) {

    return String(value || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();

  }


  // ==========================================================
  // POLO
  // ==========================================================

  function getOpportunityOffice(job) {

    if (
      job &&
      job.office
    ) {

      return job.office;

    }


    if (
      !job ||
      !job.office_id
    ) {

      return null;

    }


    return (
      publicOffices.find(
        office =>
          String(office.id) ===
          String(job.office_id)
      ) ||
      null
    );

  }


  function getOfficeLabel(office) {

    if (!office) {
      return "";
    }


    const name =
      String(
        office.name || ""
      ).trim();


    const city =
      String(
        office.city || ""
      ).trim();


    if (
      name &&
      city &&
      normalizeOpportunityText(name) !==
        normalizeOpportunityText(city)
    ) {

      return `${name} — ${city}`;

    }


    return (
      name ||
      city ||
      ""
    );

  }


  // ==========================================================
  // FILTROS DOS POLOS
  // ==========================================================

  function setOpportunityLocationControls(
    offices
  ) {

    publicOffices =
      Array.isArray(offices)
        ? offices
        : [];


    window.algartempoPublicOffices =
      publicOffices;


    const locationSelect =
      document.getElementById(
        "filter-location"
      );


    if (locationSelect) {

      const currentValue =
        locationSelect.value;


      locationSelect.innerHTML = `
        <option value="todos">
          Todos os Polos
        </option>

        ${publicOffices
          .map(
            office => `
              <option
                value="office:${escapeOpportunityHtml(
                  office.id
                )}"
              >
                ${escapeOpportunityHtml(
                  getOfficeLabel(office)
                )}
              </option>
            `
          )
          .join("")}
      `;


      if (
        currentValue ===
          "todos" ||
        publicOffices.some(
          office =>
            `office:${office.id}` ===
            currentValue
        )
      ) {

        locationSelect.value =
          currentValue ||
          "todos";

      } else {

        locationSelect.value =
          "todos";

      }

    }


    // ========================================================
    // CHIPS
    // ========================================================

    const firstChip =
      document.querySelector(
        ".location-chip"
      );


    if (
      firstChip &&
      firstChip.parentElement
    ) {

      const chipParent =
        firstChip.parentElement;


      chipParent
        .querySelectorAll(
          ".location-chip"
        )
        .forEach(chip =>
          chip.remove()
        );


      chipParent.childNodes.forEach(
        node => {

          if (
            node.nodeType ===
              Node.TEXT_NODE &&
            node.textContent
              .toLowerCase()
              .includes("concelhos")
          ) {

            node.textContent =
              "Polos: ";

          }

        }
      );


      const fragment =
        document.createDocumentFragment();


      const createChip =
        (
          value,
          label,
          active = false
        ) => {

          const chip =
            document.createElement(
              "button"
            );


          chip.type =
            "button";


          chip.className =
            "location-chip px-3 py-1 rounded-full text-xs font-medium transition-colors " +
            (
              active
                ? "active bg-sky-100 text-sky-800"
                : "bg-slate-100 text-slate-700"
            );


          chip.dataset.location =
            value;


          chip.textContent =
            label;


          fragment.appendChild(
            chip
          );

        };


      createChip(
        "todos",
        "Todos",
        true
      );


      publicOffices.forEach(
        office => {

          createChip(
            `office:${office.id}`,
            office.city ||
              office.name ||
              "Polo"
          );

        }
      );


      chipParent.appendChild(
        fragment
      );

    }


    setupOpportunityFilters();

  }


  function syncOpportunityLocationChipState(
    value
  ) {

    document
      .querySelectorAll(
        ".location-chip"
      )
      .forEach(chip => {

        const active =
          (
            chip.dataset.location ||
            "todos"
          ) === value;


        chip.classList.toggle(
          "active",
          active
        );


        if (active) {

          chip.classList.add(
            "bg-sky-100",
            "text-sky-800"
          );

          chip.classList.remove(
            "bg-slate-100",
            "text-slate-700"
          );

        } else {

          chip.classList.remove(
            "active",
            "bg-sky-100",
            "text-sky-800"
          );

          chip.classList.add(
            "bg-slate-100",
            "text-slate-700"
          );

        }

      });

  }


  // ==========================================================
  // RENDER OPORTUNIDADES
  // ==========================================================

  function renderPublicOpportunities() {

    const container =
      document.getElementById(
        "jobs-list-container"
      );


    if (!container) {
      return;
    }


    const countBadge =
      document.getElementById(
        "jobs-count-badge"
      );


    if (countBadge) {

      countBadge.textContent =
        `${filteredOpportunities.length} ${
          filteredOpportunities.length === 1
            ? "Vaga"
            : "Vagas"
        }`;

    }


    if (
      !filteredOpportunities.length
    ) {

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


    container.innerHTML =
      filteredOpportunities
        .map(job => {

          const mediaUrl =
            getOpportunityMediaUrl(
              job.image_url
            );


          const video =
            isOpportunityVideo(
              job.image_url
            );


          let mediaHtml = "";


          // ==================================================
          // VIDEO
          // ==================================================

          if (
            mediaUrl &&
            video
          ) {

            mediaHtml = `
              <div class="relative h-52 bg-slate-100 overflow-hidden">

                <video
                  src="${escapeOpportunityHtml(
                    mediaUrl
                  )}"
                  class="w-full h-full object-cover"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="auto"
                ></video>

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

          // ==================================================
          // IMAGE
          // ==================================================

          else if (mediaUrl) {

            mediaHtml = `
              <div class="relative h-52 bg-slate-100 overflow-hidden">

                <img
                  src="${escapeOpportunityHtml(
                    mediaUrl
                  )}"
                  alt="${escapeOpportunityHtml(
                    job.title ||
                      "Oportunidade Algartempo"
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

          }

          // ==================================================
          // SEM MEDIA
          // ==================================================

          else {

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


          // ==================================================
          // CAMPOS
          // ==================================================

          const sector =
            job.sector ||
            "Oportunidade";


          const location =
            job.location ||
            job.region ||
            "Portugal";


          const contract =
            job.contract_type ||
            "";


          const schedule =
            job.schedule ||
            "";


          const office =
            getOpportunityOffice(
              job
            );


          const officeLabel =
            getOfficeLabel(
              office
            );


          // ==================================================
          // CARD
          // ==================================================

          return `
            <article
              class="editorial-paper rounded-2xl overflow-hidden bg-white border border-[#e2d9cc] hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col"
            >

              ${mediaHtml}


              <div class="p-5 flex flex-col flex-1">


                <div class="flex flex-wrap items-center gap-2 mb-3">

                  <span class="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wide">

                    ${escapeOpportunityHtml(
                      sector
                    )}

                  </span>


                  ${
                    contract
                      ? `
                        <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">

                          ${escapeOpportunityHtml(
                            contract
                          )}

                        </span>
                      `
                      : ""
                  }

                </div>


                <h3 class="text-lg font-heading font-bold text-slate-900 leading-tight mb-2">

                  ${escapeOpportunityHtml(
                    job.title ||
                      ""
                  )}

                </h3>


                ${
                  job.company
                    ? `
                      <p class="text-sm font-semibold text-slate-700 mb-1">

                        ${escapeOpportunityHtml(
                          job.company
                        )}

                      </p>
                    `
                    : ""
                }


                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">

                  <i class="fas fa-map-marker-alt text-sky-600"></i>

                  <span>
                    ${escapeOpportunityHtml(
                      location
                    )}
                  </span>

                </div>


                ${
                  officeLabel
                    ? `
                      <div class="flex items-center gap-2 text-[11px] text-sky-700 mb-4">

                        <i class="fas fa-building text-sky-600"></i>

                        <span class="font-semibold">

                          ${escapeOpportunityHtml(
                            officeLabel
                          )}

                        </span>

                      </div>
                    `
                    : ""
                }


                ${
                  job.description
                    ? `
                      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">

                        ${escapeOpportunityHtml(
                          job.description
                        )}

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

                          <span>

                            ${escapeOpportunityHtml(
                              schedule
                            )}

                          </span>

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

                            Candidaturas até
                            ${escapeOpportunityHtml(
                              formatOpportunityDate(
                                job.deadline
                              )
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

                    <span>
                      Candidatar-me
                    </span>

                    <i class="fas fa-arrow-right"></i>

                  </button>


                </div>

              </div>

            </article>
          `;

        })
        .join("");


    // ========================================================
    // CANDIDATURA
    // ========================================================

    container
      .querySelectorAll(
        ".public-job-apply-btn"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const title =
              button.dataset.jobTitle ||
              "";


            const company =
              button.dataset.jobCompany ||
              "";


            const applicationTitle =
              company
                ? `${title} — ${company}`
                : title;


            if (
              typeof openApplyModal ===
              "function"
            ) {

              openApplyModal(
                applicationTitle
              );

            } else {

              console.warn(
                "openApplyModal não está disponível."
              );

            }

          }
        );

      });

  }


  // ==========================================================
  // FILTRAR OPORTUNIDADES
  // ==========================================================

  function filterPublicOpportunities() {

    const searchInput =
      document.getElementById(
        "filter-search"
      );


    const sectorSelect =
      document.getElementById(
        "filter-sector"
      );


    const locationSelect =
      document.getElementById(
        "filter-location"
      );


    const search =
      searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
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
     */
    const selectedOfficeId =
      window.algartempoSelectedOfficeId ||
      null;


    filteredOpportunities =
      publicOpportunities.filter(
        job => {

          // ================================================
          // PESQUISA
          // ================================================

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
            searchableText.includes(
              search
            );


          // ================================================
          // SETOR
          // ================================================

          const jobSector =
            String(
              job.sector || ""
            ).toLowerCase();


          const matchesSector =
            sector === "todos" ||
            jobSector.includes(
              sector.toLowerCase()
            );


          // ================================================
          // POLO
          // ================================================

          let matchesOffice = true;


          if (location.startsWith("office:")) {

            const selectedLocationOfficeId =
              location.replace(
                "office:",
                ""
              );


            matchesOffice =
              String(
                job.office_id
              ) ===
              String(
                selectedLocationOfficeId
              );

          }


          if (
            selectedOfficeId
          ) {

            matchesOffice =
              matchesOffice &&
              String(
                job.office_id
              ) ===
              String(
                selectedOfficeId
              );

          }


          return (
            matchesSearch &&
            matchesSector &&
            matchesOffice
          );

        }
      );


    syncOpportunityLocationChipState(
      location
    );


    renderPublicOpportunities();

  }


  // ==========================================================
  // DISPONIBILIZAR FUNÇÃO GLOBAL
  // IMPORTANTE PARA OS BOTÕES DOS POLOS
  // ==========================================================

  window.filterPublicOpportunities =
    filterPublicOpportunities;


  // ==========================================================
  // CARREGAR OPORTUNIDADES
  // ==========================================================

  async function loadPublicOpportunities() {

    const container =
      document.getElementById(
        "jobs-list-container"
      );


    if (!container) {
      return;
    }


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

      const {
        data,
        error
      } =
        await supabaseClient
          .from("opportunities")
          .select("*")
          .eq(
            "published",
            true
          )
          .order(
            "featured",
            {
              ascending: false
            }
          )
          .order(
            "sort_order",
            {
              ascending: true
            }
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );


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


      publicOpportunities =
        data || [];


      filteredOpportunities =
        [...publicOpportunities];


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


  // ==========================================================
  // FILTROS
  // ==========================================================

  function setupOpportunityFilters() {

    const searchInput =
      document.getElementById(
        "filter-search"
      );


    const sectorSelect =
      document.getElementById(
        "filter-sector"
      );


    const locationSelect =
      document.getElementById(
        "filter-location"
      );


    if (searchInput) {

      if (
        !searchInput.dataset
          .opportunityFilterReady
      ) {

        searchInput.dataset
          .opportunityFilterReady =
          "true";


        searchInput.addEventListener(
          "input",
          filterPublicOpportunities
        );

      }

    }


    if (sectorSelect) {

      if (
        !sectorSelect.dataset
          .opportunityFilterReady
      ) {

        sectorSelect.dataset
          .opportunityFilterReady =
          "true";


        sectorSelect.addEventListener(
          "change",
          filterPublicOpportunities
        );

      }

    }


    if (locationSelect) {

      if (
        !locationSelect.dataset
          .opportunityFilterReady
      ) {

        locationSelect.dataset
          .opportunityFilterReady =
          "true";


        locationSelect.addEventListener(
          "change",
          () => {

            /*
             * Quando o utilizador muda
             * manualmente o polo, limpa
             * a seleção feita através de
             * um cartão de escritório.
             */

            if (
              locationSelect.value ===
              "todos"
            ) {

              window.algartempoSelectedOfficeId =
                null;

            } else if (
              locationSelect.value.startsWith(
                "office:"
              )
            ) {

              window.algartempoSelectedOfficeId =
                locationSelect.value.replace(
                  "office:",
                  ""
                );

            }


            filterPublicOpportunities();

          }
        );

      }

    }


    // ========================================================
    // CHIPS
    // ========================================================

    document
      .querySelectorAll(
        ".location-chip"
      )
      .forEach(chip => {

        if (
          chip.dataset
            .opportunityFilterReady
        ) {

          return;

        }


        chip.dataset
          .opportunityFilterReady =
          "true";


        chip.addEventListener(
          "click",
          () => {

            const location =
              chip.dataset.location ||
              "todos";


            if (locationSelect) {

              locationSelect.value =
                location;

            }


            if (
              location ===
              "todos"
            ) {

              window.algartempoSelectedOfficeId =
                null;

            } else if (
              location.startsWith(
                "office:"
              )
            ) {

              window.algartempoSelectedOfficeId =
                location.replace(
                  "office:",
                  ""
                );

            }


            syncOpportunityLocationChipState(
              location
            );


            filterPublicOpportunities();

          }
        );

      });

  }


  // ==========================================================
  // CARREGAR POLOS PARA OS FILTROS
  // ==========================================================

  async function loadPublicOpportunityOffices() {

    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from("offices")
          .select("*")
          .eq(
            "published",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true
            }
          )
          .order(
            "name",
            {
              ascending: true
            }
          );


      if (error) {

        console.error(
          "Erro ao carregar polos para oportunidades:",
          error
        );

        setupOpportunityFilters();

        return;

      }


      setOpportunityLocationControls(
        data || []
      );


      // Re-render para permitir
      // imediatamente o filtro por polo.
      filterPublicOpportunities();

    } catch (error) {

      console.error(
        "Erro inesperado ao carregar polos:",
        error
      );

      setupOpportunityFilters();

    }

  }


  // ==========================================================
  // INIT
  // ==========================================================

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      setupOpportunityFilters();

      loadPublicOpportunityOffices();

      loadPublicOpportunities();

    }
  );

})();


/* =========================================================
   ALGARTEMPO — POLOS PÚBLICOS
   Liga "Onde Estamos" ao Backoffice
   ========================================================= */

(function () {

  // ==========================================================
  // ESCAPE
  // ==========================================================

  function escapeOfficeHtml(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }


    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  // ==========================================================
  // IMAGEM
  // ==========================================================

  function getOfficeImageUrl(path) {

    if (!path) {
      return "";
    }


    const value =
      String(path).trim();


    if (
      value.startsWith(
        "http://"
      ) ||
      value.startsWith(
        "https://"
      )
    ) {

      return value;

    }


    const cleanPath =
      value
        .replace(
          /^\/+/,
          ""
        )
        .replace(
          /^media\//,
          ""
        );


    return `${SUPABASE_URL}/storage/v1/object/public/media/${cleanPath}`;

  }


  // ==========================================================
  // SETORES
  // ==========================================================

  function parseOfficeSectors(
    sectors
  ) {

    if (!sectors) {
      return [];
    }


    if (
      Array.isArray(sectors)
    ) {

      return sectors
        .map(item =>
          String(item).trim()
        )
        .filter(Boolean);

    }


    return String(sectors)
      .split(
        /[,;\n|]+/
      )
      .map(item =>
        item.trim()
      )
      .filter(Boolean);

  }


  // ==========================================================
  // GALERIA
  // ==========================================================

  function parseOfficeGallery(
    gallery
  ) {

    if (!gallery) {
      return [];
    }


    if (
      Array.isArray(gallery)
    ) {

      return gallery;

    }


    if (
      typeof gallery ===
      "string"
    ) {

      try {

        const parsed =
          JSON.parse(
            gallery
          );


        return Array.isArray(
          parsed
        )
          ? parsed
          : [];

      } catch {

        return [];

      }

    }


    return [];

  }


  // ==========================================================
  // CARREGAR POLOS
  // ==========================================================

  async function loadPublicOffices() {

    const container =
      document.getElementById(
        "offices-public-container"
      );


    if (!container) {
      return;
    }


    container.innerHTML = `
      <div class="py-12 text-center">

        <div class="editorial-paper rounded-2xl p-8 bg-white border border-[#e2d9cc]">

          <i class="fas fa-spinner fa-spin text-2xl text-sky-600 mb-4"></i>

          <p class="text-sm text-slate-500">

            A carregar polos Algartempo...

          </p>

        </div>

      </div>
    `;


    try {

      const {
        data: offices,
        error
      } =
        await supabaseClient
          .from("offices")
          .select("*")
          .eq(
            "published",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true
            }
          )
          .order(
            "name",
            {
              ascending: true
            }
          );


      if (error) {

        console.error(
          "Erro ao carregar polos:",
          error
        );


        container.innerHTML = `
          <div class="py-12 text-center">

            <p class="text-sm text-slate-500">

              Não foi possível carregar os polos neste momento.

            </p>

          </div>
        `;

        return;

      }


      if (
        !offices ||
        !offices.length
      ) {

        container.innerHTML = `
          <div class="py-12 text-center">

            <p class="text-sm text-slate-500">

              De momento não existem polos publicados.

            </p>

          </div>
        `;

        return;

      }


      // ========================================================
      // RENDER
      // ========================================================

      container.innerHTML =
        offices
          .map(office => {

            const imageUrl =
              getOfficeImageUrl(
                office.image_url
              );


            const sectorList =
              parseOfficeSectors(
                office.sectors
              );


            const gallery =
              parseOfficeGallery(
                office.gallery
              );


            let heroImage =
              imageUrl;


            if (
              !heroImage &&
              gallery.length
            ) {

              const firstGallery =
                gallery[0];


              if (
                typeof firstGallery ===
                "string"
              ) {

                heroImage =
                  getOfficeImageUrl(
                    firstGallery
                  );

              } else if (
                firstGallery &&
                firstGallery.url
              ) {

                heroImage =
                  getOfficeImageUrl(
                    firstGallery.url
                  );

              }

            }


            const imageHtml =
              heroImage
                ? `
                  <img
                    src="${escapeOfficeHtml(
                      heroImage
                    )}"
                    alt="${escapeOfficeHtml(
                      office.name ||
                      office.city ||
                      "Polo Algartempo"
                    )}"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  >
                `
                : `
                  <div class="w-full h-full bg-[#f4efe6] flex items-center justify-center">

                    <div class="text-center">

                      <div class="w-16 h-16 mx-auto rounded-full bg-white border border-[#e2d9cc] flex items-center justify-center mb-3">

                        <i class="fas fa-building text-sky-600 text-xl"></i>

                      </div>

                      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">

                        Polo Algartempo

                      </span>

                    </div>

                  </div>
                `;


            return `
              <article
                class="editorial-paper rounded-2xl overflow-hidden bg-white border border-[#e2d9cc] hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col"
              >

                <!-- IMAGEM -->

                <div class="relative h-64 overflow-hidden">

                  ${imageHtml}

                </div>


                <!-- CONTEÚDO -->

                <div class="p-6 flex flex-col flex-1">


                  <div class="flex items-center justify-between gap-3 border-b border-[#e2d9cc] pb-3 mb-4">

                    <span class="text-xs font-bold text-sky-700 uppercase tracking-wider">

                      ${escapeOfficeHtml(
                        office.region ||
                        "Portugal"
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
                                ? `
                                  <br>

                                  ${escapeOfficeHtml(
                                    office.postal_code
                                  )}
                                `
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
                            String(
                              office.phone
                            ).replace(
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


                  <!-- HORÁRIO -->

                  ${
                    office.hours
                      ? `
                        <div class="flex items-start gap-2 text-[11px] text-slate-500 mb-4">

                          <i class="fas fa-clock text-sky-600 mt-0.5"></i>

                          <span>

                            ${escapeOfficeHtml(
                              office.hours
                            )}

                          </span>

                        </div>
                      `
                      : ""
                  }


                  <!-- BOTÕES -->

                  <div class="mt-auto pt-4 border-t border-[#e2d9cc]">


                    <button
                      type="button"
                      class="public-office-contact-btn w-full py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"

                      data-office-name="${escapeOfficeHtml(
                        office.name
                      )}"
                    >

                      <span>
                        Falar com a Equipa
                      </span>

                      <i class="fas fa-arrow-right"></i>

                    </button>


                    <button
                      type="button"
                      class="public-office-jobs-btn w-full py-2.5 mt-2 rounded-full border border-sky-600 text-sky-700 hover:bg-sky-50 font-heading font-bold text-xs uppercase tracking-wider transition-colors"

                      data-office-id="${escapeOfficeHtml(
                        office.id
                      )}"

                      data-office-city="${escapeOfficeHtml(
                        office.city || ""
                      )}"
                    >

                      <span>
                        Ver oportunidades
                      </span>

                      <i class="fas fa-arrow-right ml-2"></i>

                    </button>


                  </div>

                </div>

              </article>
            `;

          })
          .join("");


      // ========================================================
      // CONTACTO DO POLO
      // ========================================================

      container
        .querySelectorAll(
          ".public-office-contact-btn"
        )
        .forEach(button => {

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


      // ========================================================
      // VER OPORTUNIDADES DO POLO
      // ========================================================

      container
        .querySelectorAll(
          ".public-office-jobs-btn"
        )
        .forEach(button => {

          button.onclick = function () {

            const officeId =
              this.getAttribute(
                "data-office-id"
              );


            const officeCity =
              this.getAttribute(
                "data-office-city"
              ) || "";


            console.log(
              "Polo selecionado:",
              officeId,
              officeCity
            );


            if (
              typeof window.showOpportunitiesForOffice ===
              "function"
            ) {

              window.showOpportunitiesForOffice(
                officeId,
                officeCity
              );

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


  // ==========================================================
  // DOM READY
  // ==========================================================

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      loadPublicOffices();

    }
  );


  // ==========================================================
  // FILTRAR OPORTUNIDADES POR POLO
  // ==========================================================

  window.showOpportunitiesForOffice =
    function (
      officeId,
      officeCity
    ) {

      window.algartempoSelectedOfficeId =
        officeId ||
        null;


      const searchInput =
        document.getElementById(
          "filter-search"
        );


      const sectorSelect =
        document.getElementById(
          "filter-sector"
        );


      const locationSelect =
        document.getElementById(
          "filter-location"
        );


      if (searchInput) {

        searchInput.value =
          "";

      }


      if (sectorSelect) {

        sectorSelect.value =
          "todos";

      }


      /*
       * IMPORTANTE:
       *
       * Não usamos a cidade do escritório
       * como filtro de localização da vaga.
       *
       * Exemplo:
       * uma vaga pode estar em "Quinta do Lago"
       * mas pertencer ao Polo de Quarteira.
       *
       * O filtro correto é office_id.
       */

      if (locationSelect) {

        const officeValue =
          officeId
            ? `office:${officeId}`
            : "todos";


        if (
          [
            ...locationSelect.options
          ].some(
            option =>
              option.value ===
              officeValue
          )
        ) {

          locationSelect.value =
            officeValue;

        } else {

          locationSelect.value =
            "todos";

        }

      }


      if (
        typeof window.filterPublicOpportunities ===
        "function"
      ) {

        window.filterPublicOpportunities();

      }


      const opportunityContainer =
        document.getElementById(
          "jobs-list-container"
        );


      if (opportunityContainer) {

        const opportunitySection =
          document.getElementById(
            "vagas"
          );


        if (opportunitySection) {

          opportunitySection.scrollIntoView(
            {
              behavior: "smooth",
              block: "start"
            }
          );

        } else {

          opportunityContainer.scrollIntoView(
            {
              behavior: "smooth",
              block: "start"
            }
          );

        }

      }

    };

})();