const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const rootDir = path.join(__dirname, '..');

const loadBrowserData = (fileName, globalName) => {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(rootDir, fileName), 'utf8'), sandbox);
  return sandbox.window[globalName];
};

const services = loadBrowserData('services-data.js', 'PEREVODBY_SERVICES');
const contentBySlug = loadBrowserData('services-content.js', 'PEREVODBY_SERVICE_CONTENT');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

const header = indexHtml.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || '';
const footer = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] || '';

const escapeHtml = (value = '') =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const serviceUrlById = new Map(services.map((service) => [service.id, service.url]));

const normalizeNavigation = (html) =>
  html
    .replace(/href="#(service-[^"]+)"/g, (_match, id) => `href="${serviceUrlById.get(id) || '/#services'}"`)
    .replace(/href="#([^"]+)"/g, 'href="/#$1"')
    .replace(/href="styles\.css"/g, 'href="/styles.css"')
    .replace(/src="([^/][^":]+)"/g, 'src="/$1"');

const renderBlocks = (blocks) =>
  blocks
    .map((block) => `<${block.tag === 'h2' || block.tag === 'h3' ? block.tag : 'p'}>${escapeHtml(block.text)}</${block.tag === 'h2' || block.tag === 'h3' ? block.tag : 'p'}>`)
    .join('\n');

const renderServiceContent = (blocks) => {
  const sections = [];
  let currentSection = null;

  blocks.forEach((block) => {
    if (block.tag === 'h2' || block.tag === 'h3') {
      currentSection = { title: block.text, paragraphs: [] };
      sections.push(currentSection);
      return;
    }

    if (!currentSection) {
      currentSection = { title: '', paragraphs: [] };
      sections.push(currentSection);
    }

    currentSection.paragraphs.push(block.text);
  });

  return sections
    .filter((section) => section.title || section.paragraphs.length)
    .map((section) => `
              <section class="service-copy__section">
                ${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ''}
                ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n                ')}
              </section>`)
    .join('\n');
};

const renderPage = (service) => {
  const source = contentBySlug[service.slug] || {};
  const blocks = Array.isArray(source.blocks) ? source.blocks : [];
  const lead = blocks[0]?.text || service.description;
  const intro = blocks[1]?.text || service.details[0] || '';
  const details = blocks.length > 2 ? blocks.slice(2) : service.details.slice(1).map((text) => ({ tag: 'p', text }));
  const pageTitle = source.title || service.title;
  const description = (intro || lead).slice(0, 220);

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)} — ПереводБай</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="page-glow" aria-hidden="true"></div>
    ${normalizeNavigation(header)}

    <main id="top">
      <section id="service-page" class="section service-page">
        <div class="container service-page__grid">
          <article class="service-page__content">
            <a class="service-page__back" href="/#services">← Все услуги</a>
            <p class="eyebrow">Услуга бюро переводов</p>
            <h1 id="service-page-title">${escapeHtml(pageTitle)}</h1>
            <p id="service-page-description" class="service-page__lead">${escapeHtml(intro)}</p>
            <div class="service-page__price">${escapeHtml(lead)}</div>
            <div id="service-page-details" class="service-page__details service-copy">
${renderServiceContent(details) || renderBlocks(details)}
            </div>
            <div class="service-page__actions">
              <a class="btn btn-main" href="#service-order-form">Оставить заявку</a>
              <a class="btn btn-ghost" href="tel:+375445581642">Позвонить</a>
            </div>
          </article>

          <form
            id="service-order-form"
            class="contact-form contact-form-v2 service-page__form"
            action="/api/order"
            method="post"
            enctype="multipart/form-data"
            data-order-form
          >
            <div class="form-head">
              <h3>Отправьте документы на расчет</h3>
              <p id="service-form-note">Заявка будет отправлена по услуге: ${escapeHtml(pageTitle)}.</p>
            </div>

            <input id="service-form-service" type="hidden" name="service" value="${escapeHtml(pageTitle)}" />

            <label class="visually-hidden" aria-hidden="true">
              Компания
              <input type="text" name="company" tabindex="-1" autocomplete="off" />
            </label>

            <label>
              Имя
              <input type="text" name="name" placeholder="Как к вам обращаться" required />
            </label>
            <label>
              Телефон (WhatsApp/Viber) *
              <input type="tel" name="phone" placeholder="+375 (__) ___-__-__" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="name@example.com" />
            </label>
            <label>
              Срочность
              <select name="urgency">
                <option>Обычный срок</option>
                <option>Срочно сегодня/завтра</option>
                <option>Очень срочно за 3-6 часов</option>
              </select>
            </label>
            <label>
              Комментарий к заказу
              <textarea
                name="comment"
                rows="3"
                placeholder="Укажите язык, страну подачи, требования к заверению и срок"
              ></textarea>
            </label>

            <label class="file-field">
              Прикрепите файлы (jpg, pdf, doc) *
              <input
                type="file"
                name="files"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.rtf"
                multiple
                required
              />
              <span class="file-field__button">Выбрать файлы</span>
              <span class="file-field__text">Можно выбрать несколько файлов. До 5 файлов, каждый до 10 МБ.</span>
            </label>

            <label class="checkbox checkbox-v2">
              <input type="checkbox" name="consent" required />
              <span>
                Даю согласие на обработку персональных данных согласно
                <a href="/pages/privacy">политике обработки данных</a>.
              </span>
            </label>

            <button class="btn btn-main" type="submit">
              Отправить заявку → Менеджер ответит через 15 минут
            </button>
            <p class="form-status" aria-live="polite" data-form-status></p>
          </form>
        </div>
      </section>
    </main>

    ${normalizeNavigation(footer)}

    <script src="/services-data.js"></script>
    <script src="/services-content.js"></script>
    <script src="/pages-data.js"></script>
    <script src="/script.js"></script>
  </body>
</html>
`;
};

const servicesDir = path.join(rootDir, 'services');
fs.mkdirSync(servicesDir, { recursive: true });

services.forEach((service) => {
  const pageDir = path.join(servicesDir, service.slug);
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'index.html'), renderPage(service));
});

console.log(`Generated ${services.length} service pages in ${path.relative(rootDir, servicesDir)}/`);
