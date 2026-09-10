/**
 * Algartempo — "Pessoas que movem o Algarve."
 * Interactive Engine & Real-time Controllers
 */

// ============================================================
// OPORTUNIDADES
// As oportunidades públicas vêm exclusivamente do Supabase.
// O backoffice é a fonte de verdade — não manter vagas hardcoded aqui.
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
// INICIALIZAÇÃO
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

      const imageUrl =
        getEventImageUrl(evt.image_url);

      const image = imageUrl
        ? `
          <img
            src="${escapeHtml(imageUrl)}"
            alt="${escapeHtml(
              evt.title || 'Evento Algartempo'
            )}"
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
                ${escapeHtml(
                  evt.title || ''
                )}
              </h3>

              <p class="event-editorial__location">
                <i class="fas fa-map-marker-alt"></i>
                ${escapeHtml(
                  evt.location || ''
                )}
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
        sectorSelect.value = targetSector;
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
// B2B
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

  links.forEach(link =>
    link.addEventListener(
      'click',
      closeDrawer
    )
  );

}


// ============================================================
// MODAIS
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


function openB2BModal(
  prefill = null
) {

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

  const form =
    e.target;

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

  const form =
    e.target;

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

  const form =
    e.target;


  closeEventMeetingModal();

  form.reset();


  showToast(
    'Reunião no stand agendada com sucesso! Enviámos os detalhes para o seu contacto.'
  );

}


function handleDirectContact(e) {

  e.preventDefault();

  const form =
    e.target;


  form.reset();


  showToast(
    'Mensagem enviada com sucesso! Responderemos o mais brevemente possível.'
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

          if (entry.isIntersecting) {

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


// =========================================================
// OPORTUNIDADES PÚBLICAS
// Supabase = fonte de verdade
// =========================================================

(function () {

  let publicOpportunities = [];
  let filteredOpportunities = [];
  let publicOffices = [];


  function escapeOpportunityHtml(value) {

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


  function getOpportunityMediaUrl(path) {

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


  function normalizeOpportunityText(value) {

    return String(
      value || ""
    )
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();

  }


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


    return publicOffices.find(
      office =>
        String(office.id) ===
        String(job.office_id)
    ) || null;

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
      normalizeOpportunityText(
        name
      ) !==
      normalizeOpportunityText(
        city
      )
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
              <option value="office:${escapeOpportunityHtml(
                office.id
              )}">
                ${escapeOpportunityHtml(
                  getOfficeLabel(office)
                )}
              </option>
            `
          )
          .join("")}
      `;


      if (
        currentValue === "todos" ||
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
        .forEach(
          chip =>
            chip.remove()
        );


      chipParent.childNodes
        .forEach(node => {

          if (
            node.nodeType ===
              Node.TEXT_NODE &&
            node.textContent
              .toLowerCase()
              .includes(
                "concelhos"
              )
          ) {

            node.textContent =
              "Polos: ";

          }

        });


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
      .forEach(
        chip => {

          const active =
            (
              chip.dataset.location ||
              "todos"
            ) ===
            value;


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

        }
      );

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
        .map(
          job => {

            const mediaUrl =
              getOpportunityMediaUrl(
                job.image_url
              );


            const video =
              isOpportunityVideo(
                job.image_url
              );


            let mediaHtml =
              "";


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

                </div>
              `;

            } else if (mediaUrl) {

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


            const sector =
              job.sector ||
              "Oportunidade";


            const location =
              job.location ||
              job.region ||
              "Algarve";


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
                      job.title
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

          }
        )
        .join("");


    container
      .querySelectorAll(
        ".public-job-apply-btn"
      )
      .forEach(
        button => {

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

        }
      );

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
        ? normalizeOpportunityText(
            searchInput.value
          )
        : "";


    const sector =
      sectorSelect
        ? sectorSelect.value
        : "todos";


    const location =
      locationSelect
        ? locationSelect.value
        : "todos";


    const selectedOfficeId =
      window.algartempoSelectedOfficeId ||
      null;


    filteredOpportunities =
      publicOpportunities.filter(
        job => {

          const office =
            getOpportunityOffice(
              job
            );


          const searchableText = [

            job.title,
            job.company,
            job.location,
            job.region,
            job.sector,
            job.description,
            job.requirements,

            office &&
              office.name,

            office &&
              office.city,

            office &&
              office.region

          ]
            .filter(Boolean)
            .join(" ");


          const matchesSearch =
            !search ||
            normalizeOpportunityText(
              searchableText
            ).includes(
              search
            );


          const jobSector =
            normalizeOpportunityText(
              job.sector
            );


          const matchesSector =
            sector === "todos" ||
            jobSector.includes(
              normalizeOpportunityText(
                sector
              )
            );


          let matchesLocation =
            true;


          if (
            location !==
            "todos"
          ) {

            const locationOfficeId =
              location.startsWith(
                "office:"
              )
                ? location.substring(
                    7
                  )
                : null;


            if (
              locationOfficeId
            ) {

              matchesLocation =
                String(
                  job.office_id ||
                  ""
                ) ===
                String(
                  locationOfficeId
                );

            } else {

              const jobLocationText =
                normalizeOpportunityText(
                  [
                    job.location,
                    job.region,

                    office &&
                      office.name,

                    office &&
                      office.city,

                    office &&
                      office.region

                  ]
                    .filter(Boolean)
                    .join(" ")
                );


              matchesLocation =
                jobLocationText.includes(
                  normalizeOpportunityText(
                    location
                  )
                );

            }

          }


          const matchesSelectedOffice =
            !selectedOfficeId ||
            String(
              job.office_id ||
              ""
            ) ===
            String(
              selectedOfficeId
            );


          return (
            matchesSearch &&
            matchesSector &&
            matchesLocation &&
            matchesSelectedOffice
          );

        }
      );


    syncOpportunityLocationChipState(
      location
    );


    renderPublicOpportunities();

  }


  // ==========================================================
  // EXPOR GLOBAL
  // ==========================================================

  window.filterPublicOpportunities =
    filterPublicOpportunities;


  window.refreshOpportunityOfficeFilters =
    setOpportunityLocationControls;


  // ==========================================================
  // CARREGAR OPORTUNIDADES + POLOS
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

      const [
        opportunitiesResponse,
        officesResponse
      ] = await Promise.all([

        supabaseClient
          .from("opportunities")
          .select("*")
          .eq("published", true)
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
          ),


        supabaseClient
          .from("offices")
          .select("*")
          .eq("published", true)
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
          )

      ]);


      const {
        data: opportunitiesData,
        error: opportunitiesError
      } =
        opportunitiesResponse;


      const {
        data: officesData,
        error: officesError
      } =
        officesResponse;


      if (
        opportunitiesError
      ) {

        console.error(
          "Erro ao carregar oportunidades:",
          opportunitiesError
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


      if (
        officesError
      ) {

        console.warn(
          "Não foi possível carregar os polos para as oportunidades:",
          officesError
        );

      }


      publicOpportunities =
        opportunitiesData || [];


      publicOffices =
        officesData || [];


      window.algartempoPublicOffices =
        publicOffices;


      setOpportunityLocationControls(
        publicOffices
      );


      filteredOpportunities =
        [
          ...publicOpportunities
        ];


      filterPublicOpportunities();

      // Se viemos de "Ver oportunidades" num polo, aplica o polo automaticamente.
      const params = new URLSearchParams(window.location.search);
      const officeIdFromUrl = params.get("office_id");

      if (officeIdFromUrl) {
        const office = publicOffices.find(
          item => String(item.id) === String(officeIdFromUrl)
        );

        if (office) {
          window.algartempoSelectedOfficeId = String(office.id);

          const locationSelect = document.getElementById("filter-location");
          const officeValue = `office:${office.id}`;

          if (locationSelect) {
            locationSelect.value = officeValue;
          }

          filterPublicOpportunities();

          requestAnimationFrame(() => {
            const jobsSection = document.getElementById("vagas");
            if (jobsSection) {
              jobsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }
          });
        }
      }

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
  // EVENTOS DOS FILTROS
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


    if (
      searchInput &&
      !searchInput.dataset.algartempoBound
    ) {

      searchInput.addEventListener(
        "input",
        filterPublicOpportunities
      );


      searchInput.dataset.algartempoBound =
        "true";

    }


    if (
      sectorSelect &&
      !sectorSelect.dataset.algartempoBound
    ) {

      sectorSelect.addEventListener(
        "change",
        filterPublicOpportunities
      );


      sectorSelect.dataset.algartempoBound =
        "true";

    }


    if (
      locationSelect &&
      !locationSelect.dataset.algartempoBound
    ) {

      locationSelect.addEventListener(
        "change",
        () => {

          window.algartempoSelectedOfficeId =
            null;


          filterPublicOpportunities();

        }
      );


      locationSelect.dataset.algartempoBound =
        "true";

    }


    if (
      !document.body.dataset
        .algartempoLocationChipsBound
    ) {

      document.addEventListener(
        "click",
        event => {

          const chip =
            event.target.closest(
              ".location-chip"
            );


          if (!chip) {
            return;
          }


          const location =
            chip.dataset.location ||
            "todos";


          window.algartempoSelectedOfficeId =
            null;


          if (locationSelect) {

            locationSelect.value =
              location;

          }


          syncOpportunityLocationChipState(
            location
          );


          filterPublicOpportunities();

        }
      );


      document.body.dataset
        .algartempoLocationChipsBound =
        "true";

    }

  }


  document.addEventListener(
    "DOMContentLoaded",
    () => {

      setupOpportunityFilters();

      loadPublicOpportunities();

    }
  );

})();


// ============================================================
// CONTACTO DE UM POLO
// Modal independente para a página "Onde Estamos".
// ============================================================

window.openOfficeContactModal = function (officeName, email, phone) {
  const existing = document.getElementById("office-contact-modal");
  if (existing) existing.remove();

  const safeName = String(officeName || "Polo Algartempo");
  const safeEmail = String(email || "");
  const safePhone = String(phone || "");
  const phoneHref = safePhone.replace(/[^0-9+]/g, "");
  const subject = encodeURIComponent(`Contacto — ${safeName}`);

  const modal = document.createElement("div");
  modal.id = "office-contact-modal";
  modal.className = "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
      <button type="button" aria-label="Fechar" class="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center" data-close-office-contact>
        <i class="fas fa-times"></i>
      </button>

      <span class="inline-block px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider mb-3">Contacto</span>
      <h3 class="text-2xl font-heading font-bold text-slate-900 pr-10">${escapeHtml(safeName)}</h3>
      <p class="text-sm text-slate-500 mt-2 mb-6">Fale diretamente com a equipa deste polo.</p>

      <div class="space-y-3">
        ${safePhone ? `
          <a href="tel:${escapeHtml(phoneHref)}" class="flex items-center gap-3 p-4 rounded-2xl bg-[#faf8f5] border border-[#e2d9cc] hover:border-sky-400 transition-colors">
            <span class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center"><i class="fas fa-phone"></i></span>
            <span><small class="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Telefone</small><strong class="text-sm text-slate-800">${escapeHtml(safePhone)}</strong></span>
          </a>
        ` : ""}

        ${safeEmail ? `
          <a href="mailto:${escapeHtml(safeEmail)}?subject=${subject}" class="flex items-center gap-3 p-4 rounded-2xl bg-[#faf8f5] border border-[#e2d9cc] hover:border-sky-400 transition-colors">
            <span class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center"><i class="fas fa-envelope"></i></span>
            <span class="min-w-0"><small class="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Email</small><strong class="text-sm text-slate-800 break-all">${escapeHtml(safeEmail)}</strong></span>
          </a>
        ` : ""}
      </div>

      <button type="button" data-close-office-contact class="w-full mt-5 py-3 rounded-full border border-slate-200 text-slate-700 font-heading font-bold text-xs uppercase tracking-wider hover:bg-slate-50">Fechar</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  const close = () => {
    modal.remove();
    document.body.style.overflow = "";
  };

  modal.querySelectorAll("[data-close-office-contact]").forEach(btn => btn.addEventListener("click", close));
  modal.addEventListener("click", event => {
    if (event.target === modal) close();
  });
  document.addEventListener("keydown", function escHandler(event) {
    if (event.key === "Escape") {
      close();
      document.removeEventListener("keydown", escHandler);
    }
  });
};


// ============================================================
// POLOS PÚBLICOS
// Liga "Onde Estamos" ao Backoffice
// ============================================================

(function () {


  function escapeOfficeHtml(
    value
  ) {

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


  function getOfficeImageUrl(
    path
  ) {

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


  function normalizeOfficeNavigationText(
    value
  ) {

    return String(
      value || ""
    )
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim()
      .toLowerCase();

  }


  // ==========================================================
  // ATUALIZAR A BARRA DE POLOS
  // ==========================================================

  function syncPublicOfficeNavigation(
    offices
  ) {

    if (
      !Array.isArray(offices) ||
      !offices.length
    ) {

      return;

    }


    const legacyNames =
      new Set([

        "faro",
        "loule",
        "loulé",
        "albufeira",
        "portimao",
        "portimão",
        "lagos",
        "tavira",
        "vrsa",
        "silves",
        "s. bras",
        "s. brás",
        "sao bras",
        "são brás"

      ]);


    const navItems =
      [
        ...document.querySelectorAll(
          "a, button"
        )
      ]
        .filter(
          element => {

            const label =
              normalizeOfficeNavigationText(
                element.textContent
              );


            return legacyNames.has(
              label
            );

          }
        );


    if (
      navItems.length < 3
    ) {

      return;

    }


    const orderedOffices =
      [...offices].sort(
        (a, b) =>

          Number(
            a.sort_order || 0
          ) -
          Number(
            b.sort_order || 0
          ) ||

          String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            ),
            "pt-PT"
          )
      );


    navItems
      .slice(
        0,
        orderedOffices.length
      )
      .forEach(
        (item, index) => {

          const office =
            orderedOffices[index];


          if (!office) {
            return;
          }


          item.textContent =
            String(
              office.city ||
              office.name ||
              "Polo"
            ).toUpperCase();


          item.dataset.officeId =
            office.id;


          if (
            item.tagName ===
            "A"
          ) {

            item.setAttribute(
              "href",
              "#onde-estamos"
            );

          }

        }
      );

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


    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from("offices")
          .select("*")
          .eq("published", true)
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


      window.algartempoPublicOffices =
        offices;


      syncPublicOfficeNavigation(
        offices
      );


      if (
        typeof window
          .refreshOpportunityOfficeFilters ===
        "function"
      ) {

        window.refreshOpportunityOfficeFilters(
          offices
        );

      }


      if (
        !offices.length
      ) {

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
          .map(
            office => {

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
                  .filter(
                    Boolean
                  )
                  .slice(
                    0,
                    4
                  );


              return `
                <article
                  class="editorial-paper rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e2d9cc] hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col"
                >

                  <div class="relative h-56 bg-slate-100 overflow-hidden">

                    ${
                      imageUrl
                        ? `
                          <img
                            src="${escapeOfficeHtml(
                              imageUrl
                            )}"
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
                        onclick="openOfficeContactModal(${JSON.stringify(String(office.name || 'Polo Algartempo'))}, ${JSON.stringify(String(office.email || ''))}, ${JSON.stringify(String(office.phone || ''))})"
                      >
                        <span>Falar com a Equipa</span>
                        <i class="fas fa-arrow-right"></i>
                      </button>


                      <a
                        href="oportunidades.html?office_id=${encodeURIComponent(office.id)}#vagas"
                        class="public-office-jobs-btn w-full py-2.5 mt-2 rounded-full border border-sky-600 text-sky-700 hover:bg-sky-50 font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center"
                      >
                        <span>Ver oportunidades</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                      </a>

                    </div>

                  </div>

                </article>
              `;

            }
          )
          .join("");


      // Os botões dos polos são links reais:
      // - Falar com a Equipa -> email/telefone do polo
      // - Ver oportunidades -> oportunidades.html?office_id=...


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
  // CARREGAR POLOS AO ABRIR A PÁGINA
  // ==========================================================

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      loadPublicOffices();

    }
  );


  // ==========================================================
  // VER OPORTUNIDADES DE UM POLO
  // ==========================================================

  window.showOpportunitiesForOffice =
    function (
      officeId,
      officeCity
    ) {

      window.algartempoSelectedOfficeId =
        officeId || null;


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
        typeof window
          .filterPublicOpportunities ===
        "function"
      ) {

        window.filterPublicOpportunities();

      }


      const opportunityContainer =
        document.getElementById(
          "jobs-list-container"
        );


      if (
        opportunityContainer
      ) {

        opportunityContainer.scrollIntoView(
          {
            behavior: "smooth",
            block: "start"
          }
        );

      }

    };

})();

/* Sobre Nós — reveal on scroll */
(function () {
  const sections = document.querySelectorAll('.about-new, .about-history');
  if (!sections.length) return;

  const reveal = (section) => section.classList.add('about-visible');

  if (!('IntersectionObserver' in window)) {
    sections.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  sections.forEach(section => observer.observe(section));
})();

