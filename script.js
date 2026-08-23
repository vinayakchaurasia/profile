const profileData = window.profileData || {};

const aboutParagraphs = profileData.aboutParagraphs || [];
const coreExpertise = profileData.coreExpertise || [];
const skillsByCategory = profileData.skillsByCategory || [];
const experience = profileData.experience || [];
const projects = profileData.projects || [];
const education = profileData.education || [];
const certifications = profileData.certifications || [];

function createChip(skill) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = skill;
  return chip;
}

function renderAbout() {
  const aboutCopy = document.getElementById("aboutCopy");
  const aboutPoints = document.getElementById("aboutPoints");

  aboutParagraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    aboutCopy.appendChild(p);
  });

  coreExpertise.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    aboutPoints.appendChild(li);
  });
}

function renderSkills() {
  const target = document.getElementById("skillsGrid");
  skillsByCategory.forEach((category) => {
    const group = document.createElement("article");
    group.className = "skill-group";

    const title = document.createElement("h3");
    title.textContent = category.title;
    group.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "skills-grid";
    category.items.forEach((skill) => grid.appendChild(createChip(skill)));
    group.appendChild(grid);

    target.appendChild(group);
  });
}

function renderExperience() {
  const target = document.getElementById("timeline");
  experience.forEach((item) => {
    const article = document.createElement("article");
    article.className = "timeline-item";
    article.innerHTML = `
      <h3>${item.company} - ${item.role}</h3>
      <p><strong>${item.period}</strong></p>
      <ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    `;
    target.appendChild(article);
  });
}

function renderProjects() {
  const target = document.getElementById("projectsGrid");
  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "project-card";
    article.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
    target.appendChild(article);
  });
}

function renderList(targetId, items) {
  const target = document.getElementById(targetId);
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function setupMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");
  const header = document.getElementById("topHeader");

  toggle.addEventListener("click", () => nav.classList.toggle("open"));

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      nav.classList.remove("open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      nav.classList.remove("open");
    }
  });
}

function setupTheme() {
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");
  const stored = localStorage.getItem("theme");

  const setThemeUi = (isLight) => {
    if (isLight) {
      icon.textContent = "🌙";
      text.textContent = "Dark";
    } else {
      icon.textContent = "☀️";
      text.textContent = "Light";
    }
  };

  if (stored === "light") {
    document.body.setAttribute("data-theme", "light");
    setThemeUi(true);
  } else {
    setThemeUi(false);
  }

  toggle.addEventListener("click", () => {
    const lightEnabled = document.body.getAttribute("data-theme") === "light";
    if (lightEnabled) {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      setThemeUi(false);
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setThemeUi(true);
    }
  });
}

function setupRevealAnimations() {
  const targets = document.querySelectorAll(".panel, .timeline-item, .project-card, .chip, .section h2");
  targets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${Math.min((index % 8) * 18, 90)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  targets.forEach((element) => observer.observe(element));
}

function setupNavActiveState() {
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const activateById = (id) => {
    links.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", target === id);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        activateById(visible.target.id);
      }
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const syncWithHash = () => {
    if (location.hash) {
      activateById(location.hash.replace("#", ""));
    }
  };

  window.addEventListener("hashchange", syncWithHash);
  syncWithHash();
}

function setupTapAnimations() {
  const interactiveElements = document.querySelectorAll(".btn, .theme-toggle, .menu-toggle, .nav a");
  interactiveElements.forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.remove("tap");
      void element.offsetWidth;
      element.classList.add("tap");
    });
  });
}

function setYear() {
  document.getElementById("year").textContent = String(new Date().getFullYear());
}

function init() {
  renderAbout();
  renderSkills();
  renderExperience();
  renderProjects();
  renderList("educationList", education);
  renderList("certList", certifications);
  setupMenu();
  setupTheme();
  setupTapAnimations();
  setupNavActiveState();
  setYear();
  setupRevealAnimations();
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
}

init();
