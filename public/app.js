async function api(path, method = 'GET', body) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch('/api' + path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

function el(tag, cls, inner) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (inner !== undefined) e.innerHTML = inner;
  return e;
}

function renderProjects(list) {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  if (!list.length) {
    container.appendChild(el('div', 'card', '<em>No projects yet</em>'));
    return;
  }
  list.forEach(p => {
    const card = el('div', 'card');
    const h = el('h4', null, `<a ${p.link?`href="${p.link}" target="_blank" rel="noopener">${escapeHTML(p.title)}</a>`:escapeHTML(p.title)}`);
    const desc = el('p', null, escapeHTML(p.description || ''));
    const tech = el('div', 'muted', (p.tech || []).join(', '));
    const actions = el('div', 'card-actions');
    const edit = el('button', 'btn btn-small', 'Edit');
    const del = el('button', 'btn btn-small btn-danger', 'Delete');
    edit.onclick = () => openForm(p);
    del.onclick = async () => {
      if (!confirm('Delete this project?')) return;
      try {
        await api(`/projects/${p.id}`, 'DELETE');
        load();
      } catch (e) { alert(e.message); }
    };
    actions.appendChild(edit);
    actions.appendChild(del);
    card.appendChild(h);
    card.appendChild(desc);
    card.appendChild(tech);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

function escapeHTML(s){
  if(!s) return '';
  return s.replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}

function openForm(p) {
  document.getElementById('project-form').classList.remove('hidden');
  document.getElementById('form-title').textContent = p ? 'Edit Project' : 'Add Project';
  document.getElementById('proj-id').value = p ? p.id : '';
  document.getElementById('proj-title').value = p ? p.title : '';
  document.getElementById('proj-desc').value = p ? p.description : '';
  document.getElementById('proj-tech').value = p ? (p.tech||[]).join(', ') : '';
  document.getElementById('proj-link').value = p ? p.link : '';
}

function closeForm() {
  document.getElementById('project-form').classList.add('hidden');
}

async function saveProject() {
  const id = document.getElementById('proj-id').value;
  const title = document.getElementById('proj-title').value.trim();
  const description = document.getElementById('proj-desc').value.trim();
  const tech = document.getElementById('proj-tech').value.split(',').map(t=>t.trim()).filter(Boolean);
  const link = document.getElementById('proj-link').value.trim();
  if (!title) { alert('Title required'); return; }
  try {
    if (id) {
      await api(`/projects/${id}`, 'PUT', { title, description, tech, link });
    } else {
      await api('/projects', 'POST', { title, description, tech, link });
    }
    closeForm();
    load();
  } catch (e) { alert(e.message); }
}

async function load() {
  try {
    const data = await api('/projects');
    renderProjects(data.projects || []);
  } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', () => {
  load();
  document.getElementById('add-project-btn').addEventListener('click', () => openForm());
  document.getElementById('cancel-project').addEventListener('click', () => { closeForm(); });
  document.getElementById('save-project').addEventListener('click', () => saveProject());
});
