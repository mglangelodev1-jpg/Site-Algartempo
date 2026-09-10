(() => {
  const sb = window.supabaseClient;
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  let user = null;
  let profile = null;
  let data = {placements:[],shifts:[],hours:[],documents:[],leave:[],requests:[],notifications:[]};
  let docFilter = 'all';

  const titles={dashboard:'Início',profile:'O meu perfil',schedule:'Horários',hours:'Horas',leave:'Férias e ausências',payroll:'Vencimentos',documents:'Documentos',requests:'Pedidos',notifications:'Notificações'};
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fmtDate=v=>v?new Intl.DateTimeFormat('pt-PT',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v+'T00:00:00')):'—';
  const shortDate=v=>v?new Intl.DateTimeFormat('pt-PT',{day:'2-digit',month:'short'}).format(new Date(v+'T00:00:00')).replace('.',''):'—';
  const time=v=>v?String(v).slice(0,5):'—';
  const hoursFromMinutes=m=>`${Math.floor((m||0)/60)}h${String((m||0)%60).padStart(2,'0')}`;
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
  function message(el,msg,ok=false){el.textContent=msg;el.style.color=ok?'#168355':'#b74646'}
  function showView(view){
    $$('.portal-view').forEach(v=>v.classList.remove('active')); $(`#view-${view}`)?.classList.add('active');
    $$('.portal-nav__item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    $('#page-title').textContent=titles[view]||'My Algartempo';
    if(innerWidth<=800) $('#portal-sidebar').classList.remove('open');
    if(view==='documents') renderDocuments();
    if(view==='notifications') markNotificationsSeen();
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){e.preventDefault();showView(b.dataset.view)}});
  $('#mobile-nav').addEventListener('click',()=>$('#portal-sidebar').classList.toggle('open'));

  async function getTable(table, select='*', order=null){
    let q=sb.from(table).select(select).eq('user_id',user.id);
    if(order) q=q.order(order.col,{ascending:order.asc!==false});
    const {data:d,error}=await q; if(error){console.warn(table,error.message);return []} return d||[];
  }
  async function loadData(){
    const [p,placements,shifts,hours,documents,leave,requests,notifications]=await Promise.all([
      sb.from('employee_profiles').select('*').eq('user_id',user.id).maybeSingle(),
      getTable('employee_placements','*',{col:'active',asc:false}),
      getTable('employee_shifts','*',{col:'shift_date',asc:true}),
      getTable('employee_hours','*',{col:'work_date',asc:false}),
      getTable('employee_documents','*',{col:'created_at',asc:false}),
      getTable('employee_leave_requests','*',{col:'created_at',asc:false}),
      getTable('employee_requests','*',{col:'created_at',asc:false}),
      getTable('employee_notifications','*',{col:'created_at',asc:false})
    ]);
    profile=p.data||null; data={placements,shifts,hours,documents,leave,requests,notifications};
    if(!profile){
      const {data:invite}=await sb.from('employee_invites').select('*').eq('email',user.email||'').is('user_id',null).order('created_at',{ascending:false}).limit(1).maybeSingle();
      const source=invite||{};
      const fallback={user_id:user.id,full_name:source.full_name||user.user_metadata?.full_name||user.email?.split('@')[0]||'Colaborador',email:user.email||'',phone:source.phone||'',address:source.address||'',nif:source.nif||'',social_security_number:source.social_security_number||'',iban:source.iban||'',emergency_contact_name:source.emergency_contact_name||'',emergency_contact_phone:source.emergency_contact_phone||'',polo:source.polo||'',role:source.role||''};
      const ins=await sb.from('employee_profiles').insert(fallback).select('*').maybeSingle(); profile=ins.data||fallback;
      if(invite?.id && ins.data){ await sb.from('employee_invites').update({user_id:user.id,activated_at:new Date().toISOString()}).eq('id',invite.id); }
    }
    renderAll();
  }
  function renderAll(){
    const name=profile.full_name||'Colaborador';
    $('#welcome-name').textContent=name.split(' ')[0];$('#header-name').textContent=name;$('#header-role').textContent=profile.role||'Colaborador';$('#header-avatar').textContent=name.trim().charAt(0).toUpperCase();
    $('#profile-name').value=profile.full_name||'';$('#profile-email').value=profile.email||user.email||'';$('#profile-phone').value=profile.phone||'';$('#profile-address').value=profile.address||'';$('#profile-nif').value=profile.nif||'';$('#profile-ssn').value=profile.social_security_number||'';$('#profile-iban').value=profile.iban||'';$('#profile-polo').value=profile.polo||'';$('#profile-role').value=profile.role||'';$('#profile-emergency-name').value=profile.emergency_contact_name||'';$('#profile-emergency-phone').value=profile.emergency_contact_phone||'';
    renderDashboard();renderSchedule();renderHours();renderLeave();renderDocuments();renderPayroll();renderRequests();renderNotifications();
  }
  function renderDashboard(){
    const upcoming=data.shifts.filter(s=>s.shift_date>=new Date().toISOString().slice(0,10)).slice(0,4);const next=upcoming[0];
    $('#dash-next-shift').textContent=next?fmtDate(next.shift_date):'—';$('#dash-next-shift-meta').textContent=next?`${time(next.start_time)} — ${time(next.end_time)}`:'Sem horário agendado';
    const month=new Date().toISOString().slice(0,7);const mins=data.hours.filter(h=>String(h.work_date).startsWith(month)).reduce((a,h)=>a+(h.total_minutes||0),0);$('#dash-hours').textContent=hoursFromMinutes(mins);
    $('#dash-docs').textContent=data.documents.length;const unread=data.notifications.filter(n=>!n.read_at).length;setBadges(unread);
    const active=data.placements.find(p=>p.active);$('#placement-card').innerHTML=active?`<div class="placement-card"><div class="placement-main"><small class="panel-kicker">COLOCAÇÃO ATUAL</small><strong>${esc(active.job_title||'Função profissional')}</strong><span>${esc(active.company_name)}</span></div><div class="placement-detail"><small>Local</small><strong>${esc(active.workplace||'—')}</strong></div><div class="placement-detail"><small>Polo</small><strong>${esc(active.polo||profile.polo||'—')}</strong></div><div class="placement-detail"><small>Início</small><strong>${fmtDate(active.start_date)}</strong></div><div class="placement-detail"><small>Contrato</small><strong>${esc(active.contract_type||'—')}</strong></div></div>`:'<div class="placement-empty">Ainda não existe uma colocação ativa registada.</div>';
    const attention=[];const pendingDocs=data.documents.filter(d=>d.requires_signature&&!d.signed_at);if(pendingDocs.length)attention.push(`<div class="attention-item"><i class="fa-solid fa-pen-nib"></i><span>Tem <strong>${pendingDocs.length}</strong> documento(s) a aguardar assinatura.</span></div>`);const pendingLeave=data.leave.filter(l=>l.status==='pending');if(pendingLeave.length)attention.push(`<div class="attention-item"><i class="fa-regular fa-calendar"></i><span>Tem um pedido de férias em análise.</span></div>`);$('#attention-list').innerHTML=attention.join('')||'<div class="empty-state">Tudo em ordem. 👌</div>';
    $('#dash-shifts').innerHTML=upcoming.map(s=>`<div class="mini-item"><div class="mini-date">${shortDate(s.shift_date)}</div><div><strong>${time(s.start_time)} — ${time(s.end_time)}</strong><span>${esc(s.company_name||'Horário')} · ${esc(s.workplace||'')}</span></div></div>`).join('')||'<div class="empty-state">Sem horários próximos.</div>';
    $('#dash-notifications').innerHTML=data.notifications.slice(0,3).map(n=>`<div class="mini-item"><div class="mini-date"><i class="fa-regular fa-bell"></i></div><div><strong>${esc(n.title)}</strong><span>${esc(n.message||'')}</span></div></div>`).join('')||'<div class="empty-state">Sem notificações.</div>';
  }
  function renderSchedule(){const future=data.shifts.filter(s=>s.shift_date>=new Date().toISOString().slice(0,10));$('#schedule-month').textContent=new Intl.DateTimeFormat('pt-PT',{month:'long',year:'numeric'}).format(new Date());$('#schedule-list').innerHTML=future.map(s=>`<div class="schedule-item"><div class="schedule-date"><b>${new Date(s.shift_date+'T00:00:00').getDate()}</b><span>${new Intl.DateTimeFormat('pt-PT',{weekday:'short'}).format(new Date(s.shift_date+'T00:00:00')).replace('.','')}</span></div><div class="schedule-main"><strong>${time(s.start_time)} — ${time(s.end_time)}</strong><span>${esc(s.company_name||'')} ${s.workplace?'· '+esc(s.workplace):''}${s.notes?' · '+esc(s.notes):''}</span></div><span class="status ${s.status==='cancelled'?'status--danger':s.status==='pending'?'status--pending':'status--ok'}">${s.status==='cancelled'?'Cancelado':s.status==='pending'?'Pendente':'Confirmado'}</span></div>`).join('')||'<div class="empty-state">Ainda não existem horários registados.</div>'}
  function renderHours(){const month=new Date().toISOString().slice(0,7);const rows=data.hours.filter(h=>String(h.work_date).startsWith(month));const total=rows.reduce((a,h)=>a+(h.total_minutes||0),0),extra=rows.reduce((a,h)=>a+(h.overtime_minutes||0),0);$('#hours-total').textContent=hoursFromMinutes(total);$('#hours-overtime').textContent=hoursFromMinutes(extra);$('#hours-days').textContent=rows.length;$('#hours-table').innerHTML=rows.map(h=>`<tr><td>${fmtDate(h.work_date)}</td><td>${h.clock_in?new Date(h.clock_in).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}):'—'}</td><td>${h.clock_out?new Date(h.clock_out).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}):'—'}</td><td>${hoursFromMinutes(h.total_minutes)}</td><td>${hoursFromMinutes(h.overtime_minutes)}</td><td><span class="status status--ok">${esc(h.status)}</span></td></tr>`).join('')||'<tr><td colspan="6"><div class="empty-state">Sem registos para este mês.</div></td></tr>'}
  function renderLeave(){$('#leave-list').innerHTML=data.leave.map(l=>`<div class="request-item"><div class="request-item__top"><strong>${fmtDate(l.start_date)} — ${fmtDate(l.end_date)}</strong><span class="status ${l.status==='approved'?'status--ok':l.status==='rejected'?'status--danger':'status--pending'}">${l.status==='approved'?'Aprovado':l.status==='rejected'?'Recusado':'Pendente'}</span></div><p>${esc(l.reason||'Sem observação')} · ${esc(l.days)} dia(s)</p>${l.admin_note?`<p><strong>Algartempo:</strong> ${esc(l.admin_note)}</p>`:''}</div>`).join('')||'<div class="empty-state">Ainda não existem pedidos de férias.</div>';$('#leave-balance').textContent='—'}
  function renderDocuments(){const list=data.documents.filter(d=>docFilter==='all'||d.category===docFilter);$('#documents-list').innerHTML=list.map(d=>`<article class="document-card"><div class="document-icon"><i class="fa-regular fa-file-lines"></i></div><div><h3>${esc(d.title)}</h3><p>${esc(d.category)} · ${fmtDate((d.created_at||'').slice(0,10))}<br>${d.requires_signature?(d.signed_at?'Assinado':'A aguardar assinatura'):esc(d.status)}</p><a href="${esc(d.file_url)}" target="_blank" rel="noopener">Abrir documento <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div></article>`).join('')||'<div class="empty-state">Nenhum documento encontrado.</div>'}
  function renderPayroll(){const list=data.documents.filter(d=>d.category==='payroll');const latest=list[0];$('#dash-payroll').textContent=latest?latest.title:'—';$('#dash-payroll-meta').textContent=latest?fmtDate((latest.created_at||'').slice(0,10)):'Consulte os seus documentos';$('#payroll-list').innerHTML=list.map(d=>`<article class="document-card"><div class="document-icon"><i class="fa-solid fa-receipt"></i></div><div><h3>${esc(d.title)}</h3><p>${fmtDate((d.created_at||'').slice(0,10))}</p><a href="${esc(d.file_url)}" target="_blank" rel="noopener">Ver recibo <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div></article>`).join('')||'<div class="empty-state">Ainda não existem recibos disponíveis.</div>'}
  function renderRequests(){$('#requests-list').innerHTML=data.requests.map(r=>`<div class="request-item"><div class="request-item__top"><strong>${esc(r.subject)}</strong><span class="status ${r.status==='closed'?'status--ok':r.status==='in_progress'?'status--pending':'status--pending'}">${r.status==='closed'?'Resolvido':r.status==='in_progress'?'Em análise':'Aberto'}</span></div><p>${esc(r.message)}</p>${r.admin_reply?`<p><strong>Resposta:</strong> ${esc(r.admin_reply)}</p>`:''}<p>${fmtDate((r.created_at||'').slice(0,10))}</p></div>`).join('')||'<div class="empty-state">Ainda não existem pedidos.</div>'}
  function renderNotifications(){$('#notifications-list').innerHTML=data.notifications.map(n=>`<article class="notification-item ${n.read_at?'':'unread'}"><div class="notification-icon"><i class="fa-regular fa-bell"></i></div><div><strong>${esc(n.title)}</strong><p>${esc(n.message||'')}</p><time>${fmtDate((n.created_at||'').slice(0,10))}</time></div></article>`).join('')||'<div class="empty-state">Sem notificações.</div>'}
  function setBadges(n){['nav-badge','header-badge'].forEach(id=>{const b=$('#'+id);b.textContent=n;b.classList.toggle('hidden',!n)})}
  async function markNotificationsSeen(){const unread=data.notifications.filter(n=>!n.read_at);if(!unread.length)return;const now=new Date().toISOString();await Promise.all(unread.map(n=>sb.from('employee_notifications').update({read_at:now}).eq('id',n.id).eq('user_id',user.id)));data.notifications.forEach(n=>{if(!n.read_at)n.read_at=now});setBadges(0);renderNotifications()}

  $('#profile-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;const payload={user_id:user.id,full_name:$('#profile-name').value.trim(),email:user.email,phone:$('#profile-phone').value.trim(),address:$('#profile-address').value.trim(),nif:$('#profile-nif').value.trim(),social_security_number:$('#profile-ssn').value.trim(),iban:$('#profile-iban').value.trim(),polo:$('#profile-polo').value.trim(),role:$('#profile-role').value.trim(),emergency_contact_name:$('#profile-emergency-name').value.trim(),emergency_contact_phone:$('#profile-emergency-phone').value.trim()};const {data:d,error}=await sb.from('employee_profiles').upsert(payload).select('*').maybeSingle();btn.disabled=false;if(error){message($('#profile-message'),error.message);return}profile=d||payload;message($('#profile-message'),'Dados guardados.',true);renderAll();toast('Perfil atualizado.')});
  $('#leave-form').addEventListener('submit',async e=>{e.preventDefault();const start=$('#leave-start').value,end=$('#leave-end').value;if(!start||!end||end<start){toast('Indique um período válido.');return}const days=Math.round((new Date(end)-new Date(start))/86400000)+1;const {data:d,error}=await sb.from('employee_leave_requests').insert({user_id:user.id,start_date:start,end_date:end,days,reason:$('#leave-reason').value.trim()}).select('*').single();if(error){toast('Não foi possível enviar o pedido.');return}data.leave.unshift(d);$('#leave-form').reset();renderLeave();renderDashboard();toast('Pedido de férias enviado.')});
  $('#request-form').addEventListener('submit',async e=>{e.preventDefault();const {data:d,error}=await sb.from('employee_requests').insert({user_id:user.id,subject:$('#request-subject').value.trim(),category:$('#request-category').value,message:$('#request-message').value.trim()}).select('*').single();if(error){message($('#request-message-status'),'Não foi possível enviar o pedido.');return}data.requests.unshift(d);$('#request-form').reset();message($('#request-message-status'),'Pedido enviado.',true);renderRequests();toast('Pedido enviado à Algartempo.')});
  $$('.filter-pill').forEach(b=>b.addEventListener('click',()=>{$$('.filter-pill').forEach(x=>x.classList.remove('active'));b.classList.add('active');docFilter=b.dataset.docFilter;renderDocuments()}));
  $('#schedule-today').addEventListener('click',()=>{const n=data.shifts.find(s=>s.shift_date===new Date().toISOString().slice(0,10));if(n)toast(`Hoje: ${time(n.start_time)} — ${time(n.end_time)}`);else toast('Não tem turno registado para hoje.')});
  $('#forgot-password').addEventListener('click',async()=>{const email=$('#login-email').value.trim();if(!email){message($('#auth-message'),'Indique primeiro o seu email.');return}const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});message($('#auth-message'),error?error.message:'Enviámos instruções para o seu email.',!error)});
  $('#login-form').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:$('#login-email').value.trim(),password:$('#login-password').value});if(error){message($('#auth-message'),error.message);return}await boot()});
  $('#logout-btn').addEventListener('click',async()=>{await sb.auth.signOut();location.reload()});
  async function boot(){const {data:s}=await sb.auth.getSession();user=s.session?.user||null;if(!user){$('#auth-screen').classList.remove('hidden');$('#portal-app').classList.add('hidden');return}$('#auth-screen').classList.add('hidden');$('#portal-app').classList.remove('hidden');await loadData()}
  if(!sb){message($('#auth-message'),'Configuração do Supabase não encontrada.');return}boot();
})();