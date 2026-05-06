const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const servicesDropdown = document.querySelector('.menu-dropdown');
const servicesDropdownToggle = document.querySelector('.menu-dropdown__toggle');
const menuDropdowns = Array.from(document.querySelectorAll('.menu-dropdown'));
const serviceMenuLinks = Array.from(
  document.querySelectorAll('.menu-dropdown__panel a[href^="#service-"]')
);
const serviceCategories = Array.from(document.querySelectorAll('[data-service-category]'));
const services = window.PEREVODBY_SERVICES || [];
const serviceSourceContent = window.PEREVODBY_SERVICE_CONTENT || {};
const sitePages = window.PEREVODBY_PAGES || {};
const servicesById = new Map(services.map((service) => [service.id, service]));
const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
const servicePage = document.getElementById('service-page');
const servicePageTitle = document.getElementById('service-page-title');
const servicePageDescription = document.getElementById('service-page-description');
const servicePageDetails = document.getElementById('service-page-details');
const serviceFormService = document.getElementById('service-form-service');
const serviceFormNote = document.getElementById('service-form-note');
const contentPage = document.getElementById('content-page');
const contentPageEyebrow = document.getElementById('content-page-eyebrow');
const contentPageTitle = document.getElementById('content-page-title');
const contentPageLead = document.getElementById('content-page-lead');
const contentPageSections = document.getElementById('content-page-sections');
const themeToggle = document.getElementById('theme-toggle');
const themeState = document.getElementById('theme-state');
const root = document.documentElement;
const themeStorageKey = 'perevodby-theme';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const getSavedTheme = () => {
  try {
    const value = localStorage.getItem(themeStorageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // localStorage can be unavailable in restrictive browser modes.
  }
};

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  if (themeState) {
    themeState.textContent = isDark ? 'Темная' : 'Светлая';
  }
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'
    );
  }
};

const initializeTheme = () => {
  const savedTheme = getSavedTheme();
  const initialTheme = savedTheme || (mediaQuery.matches ? 'dark' : 'light');
  applyTheme(initialTheme);
};

initializeTheme();

const activateServiceLinks = () => {
  services.forEach((service) => {
    document.querySelectorAll(`a[href="#${service.id}"]`).forEach((link) => {
      link.href = service.url;
    });

    const serviceItem = document.getElementById(service.id);
    if (!serviceItem || serviceItem.querySelector('a')) {
      return;
    }

    const link = document.createElement('a');
    link.className = 'service-item-link';
    link.href = service.url;
    link.textContent = serviceItem.textContent.trim();
    serviceItem.textContent = '';
    serviceItem.append(link);
  });
};

const getServiceFromPath = () => {
  const match = window.location.pathname.match(/^\/services\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }

  return servicesBySlug.get(decodeURIComponent(match[1])) || null;
};

const hideRegularSections = (activeSection) => {
  document.querySelectorAll('main > section').forEach((section) => {
    section.hidden = section !== activeSection;
  });
};

const renderServicePage = () => {
  const service = getServiceFromPath();
  if (!service || !servicePage) {
    return;
  }

  hideRegularSections(servicePage);
  servicePage.hidden = false;
  const sourceContent = serviceSourceContent[service.slug];
  const sourceBlocks = Array.isArray(sourceContent?.blocks) ? sourceContent.blocks : [];

  if (servicePageTitle) {
    servicePageTitle.textContent = sourceContent?.title || service.title;
  }

  if (servicePageDescription) {
    servicePageDescription.textContent = sourceBlocks[0]?.text || service.description;
  }

  if (servicePageDetails) {
    servicePageDetails.innerHTML = '';
    const details = sourceBlocks.length ? sourceBlocks.slice(1) : service.details.map((text) => ({ tag: 'p', text }));
    details.forEach((detail) => {
      const tagName = detail.tag === 'h2' || detail.tag === 'h3' ? detail.tag : 'p';
      const node = document.createElement(tagName);
      node.textContent = detail.text;
      servicePageDetails.append(node);
    });
  }

  if (serviceFormService) {
    serviceFormService.value = service.title;
  }

  if (serviceFormNote) {
    serviceFormNote.textContent = `Заявка будет отправлена по услуге: ${service.title}.`;
  }

  document.title = `${service.title} — ПереводБай`;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href !== '#service-order-form') {
      link.href = `/${href}`;
    }
  });
};

const getContentPageFromPath = () => {
  const match = window.location.pathname.match(/^\/pages\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }

  return sitePages[decodeURIComponent(match[1])] || null;
};

const renderContentPage = () => {
  const page = getContentPageFromPath();
  if (!page || !contentPage) {
    return;
  }

  hideRegularSections(contentPage);
  contentPage.hidden = false;

  if (contentPageEyebrow) contentPageEyebrow.textContent = page.eyebrow;
  if (contentPageTitle) contentPageTitle.textContent = page.title;
  if (contentPageLead) contentPageLead.textContent = page.lead;

  if (contentPageSections) {
    contentPageSections.innerHTML = '';
    page.sections.forEach(([title, paragraphs]) => {
      const article = document.createElement('article');
      article.className = 'content-page__section';
      const heading = document.createElement('h2');
      heading.textContent = title;
      article.append(heading);
      paragraphs.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        article.append(paragraph);
      });
      contentPageSections.append(article);
    });
  }

  document.title = `${page.title} — ПереводБай`;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      link.href = `/${href}`;
    }
  });
};

activateServiceLinks();
renderServicePage();
renderContentPage();

const closeServicesDropdown = () => {
  menuDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.menu-dropdown__toggle');
    dropdown.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
};

const setServiceCategoryState = (category, isOpen) => {
  if (!category) {
    return;
  }

  const toggle = category.querySelector('.services-category__toggle');
  const panel = category.querySelector('[data-service-panel]');
  category.classList.toggle('is-open', isOpen);

  if (toggle) {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Скрыть список' : 'Открыть список';
  }

  if (panel) {
    panel.hidden = !isOpen;
  }
};

const openServiceCategoryByTarget = (targetId) => {
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  const category = target?.closest('[data-service-category]');
  if (!category) {
    return;
  }

  setServiceCategoryState(category, true);
};

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const opened = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(opened));
    if (!opened) {
      closeServicesDropdown();
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      closeServicesDropdown();
    });
  });
}

menuDropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('.menu-dropdown__toggle');
  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpened = dropdown.classList.contains('is-open');
    closeServicesDropdown();
    if (isOpened) {
      return;
    }

    dropdown.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  });
});

document.addEventListener('click', (event) => {
  if (!menuDropdowns.some((dropdown) => dropdown.contains(event.target))) {
    closeServicesDropdown();
  }
});

serviceMenuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      openServiceCategoryByTarget(href.replace('#', ''));
    }
  });
});

serviceCategories.forEach((category) => {
  const toggle = category.querySelector('.services-category__toggle');
  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = category.classList.contains('is-open');
    setServiceCategoryState(category, !isOpen);
  });
});

const syncServiceCategoryWithHash = () => {
  const targetId = window.location.hash.replace('#', '');
  if (!targetId.startsWith('service-')) {
    return;
  }

  openServiceCategoryByTarget(targetId);
};

syncServiceCategoryWithHash();
window.addEventListener('hashchange', syncServiceCategoryWithHash);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeServicesDropdown();
  }
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

if (typeof mediaQuery.addEventListener === 'function') {
  mediaQuery.addEventListener('change', (event) => {
    if (!getSavedTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
}

const revealItems = document.querySelectorAll('.section-reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const fileInput = document.getElementById('file-upload');
const fileUploadText = document.getElementById('file-upload-text');
const filePreviewList = document.getElementById('file-preview-list');
const previewModal = document.getElementById('preview-modal');
const previewModalTitle = document.getElementById('preview-modal-title');
const previewModalContent = document.getElementById('preview-modal-content');
const previewModalSwitch = document.getElementById('preview-modal-switch');
const previewBeforeBtn = document.getElementById('preview-before-btn');
const previewAfterBtn = document.getElementById('preview-after-btn');
const examplePhotoLinks = Array.from(document.querySelectorAll('.example-photo'));
const defaultFileText = 'Можно выбрать несколько файлов. До 5 файлов, каждый до 10 МБ.';
let activePreviewUrl = null;
let selectedFiles = [];
let previewGalleryItems = [];
let previewGalleryIndex = 0;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} Б`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} КБ`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} МБ`;
};

const isPreviewableFile = (file) => {
  const lowerName = file.name.toLowerCase();
  return (
    file.type.startsWith('image/') ||
    file.type === 'application/pdf' ||
    lowerName.endsWith('.pdf') ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg') ||
    lowerName.endsWith('.png')
  );
};

const closePreviewModal = () => {
  if (!previewModal || !previewModalContent) {
    return;
  }

  previewModal.hidden = true;
  previewModalContent.innerHTML = '';
  previewGalleryItems = [];
  previewGalleryIndex = 0;
  if (previewModalTitle) {
    previewModalTitle.textContent = '';
  }
  if (previewModalSwitch) {
    previewModalSwitch.hidden = true;
  }
  previewBeforeBtn?.classList.remove('is-active');
  previewAfterBtn?.classList.remove('is-active');

  if (activePreviewUrl) {
    URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = null;
  }
};

const updatePreviewSwitchButtons = () => {
  if (!previewModalSwitch || !previewBeforeBtn || !previewAfterBtn) {
    return;
  }

  const hasGallery = previewGalleryItems.length >= 2;
  previewModalSwitch.hidden = !hasGallery;
  if (!hasGallery) {
    return;
  }

  previewBeforeBtn.textContent = previewGalleryItems[0]?.label || 'До';
  previewAfterBtn.textContent = previewGalleryItems[1]?.label || 'После';
  previewBeforeBtn.classList.toggle('is-active', previewGalleryIndex === 0);
  previewAfterBtn.classList.toggle('is-active', previewGalleryIndex === 1);
};

const renderGalleryImage = () => {
  if (!previewModalContent || !previewGalleryItems.length) {
    return;
  }

  const item = previewGalleryItems[previewGalleryIndex];
  previewModalContent.innerHTML = '';
  const viewer = document.createElement('img');
  viewer.src = item.url;
  viewer.alt = item.title || 'Предпросмотр документа';
  previewModalContent.append(viewer);

  if (previewModalTitle) {
    previewModalTitle.textContent = item.title || 'Пример перевода документа';
  }

  updatePreviewSwitchButtons();
};

const openPreviewGallery = (items, startIndex = 0) => {
  if (!previewModal || !previewModalContent || !items.length) {
    return;
  }

  closePreviewModal();
  previewGalleryItems = items;
  previewGalleryIndex = Math.min(Math.max(0, startIndex), items.length - 1);
  previewModal.hidden = false;
  renderGalleryImage();
};

const openPreviewModal = (file) => {
  if (!previewModal || !previewModalContent) {
    return;
  }

  closePreviewModal();
  activePreviewUrl = URL.createObjectURL(file);
  previewModal.hidden = false;

  if (previewModalTitle) {
    previewModalTitle.textContent = file.name;
  }

  const isImage = file.type.startsWith('image/');
  const viewer = document.createElement(isImage ? 'img' : 'iframe');
  viewer.src = activePreviewUrl;
  viewer.setAttribute('title', file.name);
  previewModalContent.append(viewer);
  updatePreviewSwitchButtons();
};

const openFileExternally = (file) => {
  const fileUrl = URL.createObjectURL(file);
  window.open(fileUrl, '_blank', 'noopener');
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
};

const openPreviewModalByUrl = (url, title) => {
  if (!previewModal || !previewModalContent) {
    return;
  }

  closePreviewModal();
  previewModal.hidden = false;

  if (previewModalTitle) {
    previewModalTitle.textContent = title || 'Предпросмотр файла';
  }

  const viewer = document.createElement('img');
  viewer.src = url;
  viewer.alt = title || 'Предпросмотр документа';
  previewModalContent.append(viewer);
  updatePreviewSwitchButtons();
};

const renderSelectedFiles = (files) => {
  if (!filePreviewList) {
    return;
  }

  filePreviewList.innerHTML = '';

  files.forEach((file) => {
    const item = document.createElement('div');
    item.className = 'file-preview-item';

    const meta = document.createElement('div');
    meta.className = 'file-preview-item__meta';

    const name = document.createElement('p');
    name.className = 'file-preview-item__name';
    name.textContent = file.name;

    const size = document.createElement('p');
    size.className = 'file-preview-item__size';
    size.textContent = formatFileSize(file.size);

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'file-preview-item__action';
    const actions = document.createElement('div');
    actions.className = 'file-preview-item__actions';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-preview-item__action file-preview-item__action-delete';
    remove.textContent = 'Удалить';

    if (isPreviewableFile(file)) {
      action.textContent = 'Просмотреть';
      action.addEventListener('click', () => openPreviewModal(file));
    } else {
      action.textContent = 'Открыть';
      action.addEventListener('click', () => openFileExternally(file));
    }

    remove.addEventListener('click', () => {
      selectedFiles = selectedFiles.filter((currentFile) => currentFile !== file);
      syncFileInput();
      updateSelectedFilesUI();
      if (!selectedFiles.length) {
        closePreviewModal();
      }
    });

    meta.append(name, size);
    actions.append(action, remove);
    item.append(meta, actions);
    filePreviewList.append(item);
  });
};

const syncFileInput = () => {
  if (!fileInput) {
    return;
  }

  const transfer = new DataTransfer();
  selectedFiles.forEach((file) => transfer.items.add(file));
  fileInput.files = transfer.files;
};

const updateSelectedFilesUI = () => {
  if (!fileUploadText) {
    return;
  }

  if (!selectedFiles.length) {
    fileUploadText.textContent = defaultFileText;
    if (filePreviewList) {
      filePreviewList.innerHTML = '';
    }
    return;
  }

  const fileNames = selectedFiles.map((file) => file.name).join(', ');
  fileUploadText.textContent = fileNames;
  renderSelectedFiles(selectedFiles);
};

if (fileInput && fileUploadText) {
  fileInput.addEventListener('change', () => {
    selectedFiles = Array.from(fileInput.files || []);
    if (!selectedFiles.length) {
      closePreviewModal();
      updateSelectedFilesUI();
      return;
    }

    updateSelectedFilesUI();
  });
}

if (previewModal) {
  previewModal.querySelectorAll('[data-preview-close]').forEach((node) => {
    node.addEventListener('click', closePreviewModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !previewModal.hidden) {
      closePreviewModal();
    }
  });
}

previewBeforeBtn?.addEventListener('click', () => {
  if (previewGalleryItems.length < 2) {
    return;
  }
  previewGalleryIndex = 0;
  renderGalleryImage();
});

previewAfterBtn?.addEventListener('click', () => {
  if (previewGalleryItems.length < 2) {
    return;
  }
  previewGalleryIndex = 1;
  renderGalleryImage();
});

examplePhotoLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!previewModal) {
      return;
    }

    event.preventDefault();
    const image = link.querySelector('img');
    const imageUrl = link.getAttribute('href');
    if (!imageUrl) {
      return;
    }

    const group = link.closest('.example-photos');
    const groupLinks = group ? Array.from(group.querySelectorAll('.example-photo')) : [link];
    const galleryItems = groupLinks
      .map((photoLink) => {
        const src = photoLink.getAttribute('href');
        const photoImage = photoLink.querySelector('img');
        const label = photoLink.querySelector('span')?.textContent?.trim() || '';
        if (!src) {
          return null;
        }
        return {
          url: src,
          title: photoImage?.alt || 'Пример перевода документа',
          label,
        };
      })
      .filter(Boolean);

    const clickedIndex = Math.max(
      0,
      groupLinks.findIndex((photoLink) => photoLink === link)
    );

    if (galleryItems.length) {
      openPreviewGallery(galleryItems, clickedIndex);
      return;
    }

    openPreviewModalByUrl(imageUrl, image?.alt || 'Пример перевода документа');
  });
});

const orderForms = Array.from(document.querySelectorAll('[data-order-form]'));

orderForms.forEach((orderForm) => {
  const formStatus = orderForm.querySelector('[data-form-status]');
  const submitButton = orderForm.querySelector('button[type="submit"]');
  const defaultSubmitText = submitButton?.textContent || 'Отправить заявку';
  const serviceInput = orderForm.querySelector('input[name="service"]');
  const initialServiceValue = serviceInput?.value || '';

  if (!formStatus) {
    return;
  }

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправляем заявку...';
    }

    formStatus.dataset.state = 'pending';
    formStatus.textContent = 'Отправляем заявку и вложения...';

    try {
      const response = await fetch(orderForm.action, {
        method: 'POST',
        body: new FormData(orderForm),
      });

      const result = await response.json();

      formStatus.dataset.state = result.ok ? 'success' : 'error';
      formStatus.textContent =
        result.message ||
        (result.ok
          ? 'Заявка отправлена. Мы свяжемся с вами в рабочее время.'
          : 'Не удалось отправить заявку.');

      if (result.ok) {
        orderForm.reset();
        if (serviceInput && initialServiceValue) {
          serviceInput.value = initialServiceValue;
        }

        if (fileInput && orderForm.contains(fileInput)) {
          selectedFiles = [];
          syncFileInput();
          if (fileUploadText) {
            fileUploadText.textContent = defaultFileText;
          }
          if (filePreviewList) {
            filePreviewList.innerHTML = '';
          }
        }

        closePreviewModal();
      }
    } catch {
      formStatus.dataset.state = 'error';
      formStatus.textContent =
        'Нет соединения с сервером. Попробуйте еще раз или напишите нам в WhatsApp/Telegram.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultSubmitText;
      }
    }
  });
});

const examplesCarousel = document.querySelector('[data-examples-carousel]');

if (examplesCarousel) {
  const exampleSection = examplesCarousel.closest('section');
  const slides = Array.from(examplesCarousel.querySelectorAll('[data-examples-slide]'));
  const track = examplesCarousel.querySelector('[data-examples-track]');
  const dotsRoot = examplesCarousel.querySelector('[data-examples-dots]');
  const nextButton = exampleSection?.querySelector('[data-examples-next]');
  const prevButton = exampleSection?.querySelector('[data-examples-prev]');
  let activeStartIndex = 0;
  let visibleSlides = 3;
  let maxStartIndex = 0;
  let dots = [];

  const getVisibleSlides = () => {
    const width = window.innerWidth;
    if (width <= 760) return 1;
    if (width <= 1200) return 2;
    return 3;
  };

  const renderDots = () => {
    if (!dotsRoot) {
      return;
    }

    dotsRoot.innerHTML = '';
    dots = [];

    for (let index = 0; index <= maxStartIndex; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = index === activeStartIndex ? 'carousel-dot is-active' : 'carousel-dot';
      dot.setAttribute('aria-label', `Показать примеры начиная с карточки ${index + 1}`);
      dot.addEventListener('click', () => setPosition(index));
      dotsRoot.append(dot);
      dots.push(dot);
    }
  };

  function setPosition(index) {
    visibleSlides = getVisibleSlides();
    maxStartIndex = Math.max(0, slides.length - visibleSlides);
    activeStartIndex = Math.min(Math.max(0, index), maxStartIndex);

    const slideOffset = slides[activeStartIndex]?.offsetLeft || 0;
    const trackOffset = slides[0]?.offsetLeft || 0;
    const translateX = slideOffset - trackOffset;

    if (track) {
      track.style.transform = `translateX(-${translateX}px)`;
    }

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeStartIndex);
    });
  }

  const rebuildCarousel = () => {
    visibleSlides = getVisibleSlides();
    maxStartIndex = Math.max(0, slides.length - visibleSlides);
    if (activeStartIndex > maxStartIndex) {
      activeStartIndex = maxStartIndex;
    }
    renderDots();
    setPosition(activeStartIndex);
  };

  prevButton?.addEventListener('click', () => {
    const nextIndex = activeStartIndex <= 0 ? maxStartIndex : activeStartIndex - 1;
    setPosition(nextIndex);
  });

  nextButton?.addEventListener('click', () => {
    const nextIndex = activeStartIndex >= maxStartIndex ? 0 : activeStartIndex + 1;
    setPosition(nextIndex);
  });

  window.addEventListener('resize', rebuildCarousel);
  rebuildCarousel();
}

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const track = carousel.querySelector('[data-carousel-track]');
  const dotsRoot = carousel.querySelector('[data-carousel-dots]');
  const nextButton = document.querySelector('[data-carousel-next]');
  const prevButton = document.querySelector('[data-carousel-prev]');

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === activeIndex ? 'carousel-dot is-active' : 'carousel-dot';
    dot.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
    dot.addEventListener('click', () => setActiveSlide(index));
    dotsRoot?.append(dot);
    return dot;
  });

  function setActiveSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
    if (track) {
      track.style.minHeight = `${slides[activeIndex].offsetHeight}px`;
    }
  }

  prevButton?.addEventListener('click', () => setActiveSlide(activeIndex - 1));
  nextButton?.addEventListener('click', () => setActiveSlide(activeIndex + 1));

  window.addEventListener('resize', () => setActiveSlide(activeIndex));
  setActiveSlide(activeIndex);
}

const mainReviewsCarousel = document.querySelector('[data-main-reviews]');

if (mainReviewsCarousel) {
  const slides = Array.from(mainReviewsCarousel.querySelectorAll('[data-main-reviews-slide]'));
  const track = mainReviewsCarousel.querySelector('[data-main-reviews-track]');
  const dotsRoot = mainReviewsCarousel.querySelector('[data-main-reviews-dots]');
  const nextButton = document.querySelector('[data-main-reviews-next]');
  const prevButton = document.querySelector('[data-main-reviews-prev]');
  let activeIndex = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === activeIndex ? 'carousel-dot is-active' : 'carousel-dot';
    dot.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
    dot.addEventListener('click', () => setActiveSlide(index));
    dotsRoot?.append(dot);
    return dot;
  });

  function setActiveSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
    if (track) {
      track.style.minHeight = `${slides[activeIndex].offsetHeight}px`;
    }
  }

  prevButton?.addEventListener('click', () => setActiveSlide(activeIndex - 1));
  nextButton?.addEventListener('click', () => setActiveSlide(activeIndex + 1));
  window.addEventListener('resize', () => setActiveSlide(activeIndex));
  setActiveSlide(activeIndex);
}
