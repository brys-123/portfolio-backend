const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/projects.json');
const skillsPath = path.join(__dirname, '../data/skills.json');

// ── Helpers ──────────────────────────────────────────────
function readProjects() {
  if (!fs.existsSync(dataPath)) return { projects: [] };
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}
function saveProjects(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function readSkills() {
  if (!fs.existsSync(skillsPath)) {
    // Default skills if file doesn't exist yet
    return { skills: [
      { name: 'Python',      icon: '🐍', level: 90 },
      { name: 'PHP',         icon: '🐘', level: 75 },
      { name: 'Excel',       icon: '📊', level: 85 },
      { name: 'Power BI',    icon: '📈', level: 80 },
      { name: 'HTML',        icon: '🌐', level: 90 },
      { name: 'CSS',         icon: '🎨', level: 85 },
      { name: 'JavaScript',  icon: '⚡', level: 80 },
      { name: 'R',           icon: '📉', level: 70 }
    ]};
  }
  return JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
}
function saveSkills(data) {
  fs.writeFileSync(skillsPath, JSON.stringify(data, null, 2));
}

// ── Profile ───────────────────────────────────────────────
const profilePath = path.join(__dirname, '../data/profile.json');

function readProfile() {
  if (!fs.existsSync(profilePath)) {
    return {
      name: 'Bryson Alfayo Nkinda',
      title: 'Data Science & Machine Learning Student',
      bio: 'Passionate about turning data into actionable insights.',
      email: 'brysonnkinda@gmail.com',
      phone: '',
      location: 'Dar es Salaam, Tanzania'
    };
  }
  return JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
}
function saveProfile(data) {
  fs.writeFileSync(profilePath, JSON.stringify(data, null, 2));
}

// GET /api/profile
router.get('/profile', (req, res) => {
  res.json(readProfile());
});

// PUT /api/profile  ✅ was missing
router.put('/profile', (req, res) => {
  const existing = readProfile();
  const updated = { ...existing, ...req.body };
  saveProfile(updated);
  res.json({ success: true, profile: updated });
});

// ── Skills ────────────────────────────────────────────────

// GET /api/skills
router.get('/skills', (req, res) => {
  res.json(readSkills());
});

// POST /api/skills  ✅ was missing
router.post('/skills', (req, res) => {
  const { name, icon, level } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name is required' });

  const data = readSkills();
  const exists = data.skills.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(400).json({ error: 'Skill already exists' });

  data.skills.push({ name, icon: icon || '💡', level: parseInt(level) || 80 });
  saveSkills(data);
  res.json({ success: true, skills: data.skills });
});

// DELETE /api/skills/:name  ✅ was missing
router.delete('/skills/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const data = readSkills();
  const index = data.skills.findIndex(
    s => s.name.toLowerCase() === name.toLowerCase()
  );

  if (index === -1) return res.status(404).json({ error: 'Skill not found' });

  data.skills.splice(index, 1);
  saveSkills(data);
  res.json({ success: true, skills: data.skills });
});

// ── Projects ──────────────────────────────────────────────

// GET /api/projects
router.get('/projects', (req, res) => {
  res.json(readProjects());
});

// POST /api/projects
router.post('/projects', (req, res) => {
  const { title, description, tech, link } = req.body;
  if (!title || !description || !tech) {
    return res.status(400).json({ error: 'Title, description and tech are required' });
  }

  const data = readProjects();
  const newProject = {
    id: Date.now(),
    title,
    description,
    tech: Array.isArray(tech) ? tech : tech.split(',').map(t => t.trim()),
    link: link || ''
  };

  data.projects.push(newProject);
  saveProjects(data);
  res.json({ success: true, project: newProject });
});

// PUT /api/projects/:id
router.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, tech, link } = req.body;
  const data = readProjects();
  const index = data.projects.findIndex(p => p.id == id);

  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  data.projects[index] = {
    ...data.projects[index],
    title:       title       || data.projects[index].title,
    description: description || data.projects[index].description,
    tech:        tech ? (Array.isArray(tech) ? tech : tech.split(',').map(t => t.trim())) : data.projects[index].tech,
    link:        link        || data.projects[index].link
  };

  saveProjects(data);
  res.json({ success: true, project: data.projects[index] });
});

// DELETE /api/projects/:id
router.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const data = readProjects();
  const index = data.projects.findIndex(p => p.id == id);

  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  data.projects.splice(index, 1);
  saveProjects(data);
  res.json({ success: true, message: 'Project deleted!' });
});

// ── Contact ───────────────────────────────────────────────
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  res.json({ success: true, message: `Thanks ${name}, I will get back to you!` });
});

module.exports = router;