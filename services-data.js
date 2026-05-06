(() => {
const serviceBaseUrl = '/services/';
const donorBaseUrl = 'https://perevodby.by';

const serviceText = {
  apostille:
    'Поможем подготовить документы для апостиля, легализации и заверения перевода. Проверим требования к подаче, подскажем порядок действий и рассчитаем сроки до начала работы.',
  industry:
    'Выполняем отраслевые переводы с учетом терминологии, назначения документа и требований получателя. Перед стартом уточняем язык, объем, формат, заверение и срочность.',
  language:
    'Переводим документы с сохранением смысла, имен, дат, реквизитов и структуры исходного файла. При необходимости подготовим заверение для нотариуса, посольства, учебного заведения или компании.',
  document:
    'Переводим личные, учебные, корпоративные и справочные документы для подачи в госорганы, посольства, банки, учебные заведения и работодателям.',
  embassy:
    'Готовим переводы документов для подачи в посольство с учетом аккуратного оформления, транслитерации имен, дат, печатей и требований к комплекту документов.',
  localization:
    'Адаптируем сайты, интерфейсы, игры и материалы для другой языковой аудитории. Сохраняем смысл, терминологию, структуру и пользовательский контекст.',
  interpreting:
    'Организуем устный перевод для встреч, переговоров, мероприятий и сопровождения. Формат и языковую пару согласуем заранее.',
};

const serviceDetails = {
  apostille: [
    'Можно отправить скан или фото документа для предварительной оценки. Менеджер проверит, какой вид заверения нужен, какие сроки возможны и как удобнее передать оригиналы.',
    'В заявке укажите страну подачи, тип документа и желаемый срок. Если потребуется перевод, мы подготовим его в одном заказе вместе с заверением.',
  ],
  industry: [
    'Для расчета достаточно приложить файл или фрагмент текста. Мы оценим объем, тематику, сложность терминологии и предложим срок выполнения.',
    'Работаем с договорами, инструкциями, медицинскими, техническими, коммерческими и другими материалами, где важна точность формулировок.',
  ],
  language: [
    'Перевод можно заказать дистанционно: загрузите документ, укажите языковую пару и требования к заверению. Менеджер вернется с расчетом стоимости.',
    'Если документ нужен для официальной подачи, заранее сообщите страну, организацию или посольство, куда он будет направлен.',
  ],
  document: [
    'Сохраняем структуру документа, реквизиты, печати, подписи, номера и даты. Для официальной подачи можно заказать заверение перевода.',
    'После отправки файлов менеджер уточнит язык, срок, способ получения и требования к готовому комплекту.',
  ],
  embassy: [
    'Перед переводом полезно сообщить страну и тип подачи: виза, ВНЖ, учеба, работа, брак или другое основание.',
    'Мы поможем собрать понятный комплект переводов и подскажем, когда может понадобиться нотариальное заверение или апостиль.',
  ],
  localization: [
    'Перед началом работы уточняем формат файлов, объем, целевую аудиторию и стиль текста. Это помогает сохранить смысл и удобство для пользователя.',
    'Можем работать с текстами интерфейса, страницами сайта, описаниями, инструкциями, игровыми репликами и справочными материалами.',
  ],
  interpreting: [
    'Для подготовки укажите дату, место, языковую пару, тематику и формат мероприятия. Так мы сможем подобрать подходящего специалиста.',
    'Если есть программа, тезисы или документы встречи, приложите их к заявке: это ускорит подготовку и повысит точность перевода.',
  ],
};

const serviceRows = [
  ['service-apostille', 'Апостиль документов', 'apostil-dokumentov', 'apostille', '/apostil-dokumentov/'],
  ['service-notarial-statement', 'Перевод с нотариальным заявлением', 'notarialnoe-zavereniye-perevoda', 'apostille', '/notarialnoe-zavereniye-perevoda/'],
  ['service-document-legalization', 'Легализация документов', 'legalizatsiya-dokumentov', 'apostille', '/legalizatsiya-dokumentov/'],
  ['service-stamp-certification', 'Заверение перевода печатями', 'zavereniye-perevoda-pechatyami', 'apostille', '/zavereniye-perevoda-pechatyami/'],
  ['service-certified-translation', 'Перевод с заверением', 'zavereniye-perevoda', 'apostille', '/zavereniye-perevoda/'],
  ['service-economic-translation', 'Экономический перевод', 'ekonomicheskiy-perevod', 'industry', '/ekonomicheskiy-perevod/'],
  ['service-pharma-translation', 'Фармацевтический перевод', 'farmatsevticheskiy-perevod', 'industry', '/farmatsevticheskiy-perevod/'],
  ['service-medical-translation', 'Медицинский перевод', 'meditsinskiy-perevod', 'industry', '/meditsinskiy-perevod/'],
  ['service-tourism-translation', 'Перевод для турагентства', 'perevod-dlya-turagentstv', 'industry', '/perevod-dlya-turagentstv/'],
  ['service-engineering-translation', 'Перевод конструкторской документации', 'perevod-konstruktorskoy-dokumentatsii', 'industry', '/perevod-konstruktorskoy-dokumentatsii/'],
  ['service-commercial-translation', 'Перевод коммерческих документов', 'perevod-kommercheskikh-dokumentov', 'industry', '/perevod-kommercheskikh-dokumentov/'],
  ['service-instruction-translation', 'Перевод инструкций', 'perevod-instruktsiy', 'industry', '/perevod-instruktsiy/'],
  ['service-legal-translation', 'Юридический перевод', 'yuridicheskiy-perevod', 'industry', '/yuridicheskiy-perevod/'],
  ['service-technical-translation', 'Технический перевод', 'tekhnicheskiy-perevod', 'industry', '/tekhnicheskiy-perevod/'],
  ['service-english', 'Перевод с / на английский язык', 'perevod-s-na-angliyskiy-yazyk', 'language', '/perevod-s-na-angliyskiy-yazyk/'],
  ['service-arabic', 'Перевод с / на арабский язык', 'perevod-s-na-arabskiy-yazyk', 'language', '/perevod-s-na-arabskiy-yazyk/'],
  ['service-armenian', 'Перевод с / на армянский язык', 'perevod-s-na-armyanskiy-yazyk', 'language', '/perevod-s-na-armyanskiy-yazyk/'],
  ['service-french', 'Перевод с / на французский язык', 'perevod-s-na-frantsuzskiy-yazyk', 'language', '/perevod-s-na-frantsuzskiy-yazyk/'],
  ['service-greek', 'Перевод с / на греческий язык', 'perevod-s-na-grecheskiy-yazyk', 'language', '/perevod-s-na-grecheskiy-yazyk/'],
  ['service-georgian', 'Перевод с / на грузинский язык', 'perevod-s-na-gruzinskiy-yazyk', 'language', '/perevod-s-na-gruzinskiy-yazyk/'],
  ['service-spanish', 'Перевод с / на испанский язык', 'perevod-s-na-ispanskiy-yazyk', 'language', '/perevod-s-na-ispanskiy-yazyk/'],
  ['service-italian', 'Перевод с / на итальянский язык', 'perevod-s-na-italyanskiy-yazyk', 'language', '/perevod-s-na-italyanskiy-yazyk/'],
  ['service-hebrew', 'Перевод с / на иврит', 'perevod-s-na-ivrit-yazyk', 'language', '/perevod-s-na-ivrit-yazyk/'],
  ['service-kazakh', 'Перевод с / на казахский язык', 'perevod-s-na-kazakhskiy-yazyk', 'language', '/perevod-s-na-kazakhskiy-yazyk/'],
  ['service-chinese', 'Перевод с / на китайский язык', 'perevod-s-na-kitayskiy-yazyk', 'language', '/perevod-s-na-kitayskiy-yazyk/'],
  ['service-latvian', 'Перевод с / на латышский язык', 'perevod-s-na-latyshskiy-yazyk', 'language', '/perevod-s-na-latyshskiy-yazyk/'],
  ['service-lithuanian', 'Перевод с / на литовский язык', 'perevod-s-na-litovskiy-yazyk', 'language', '/perevod-s-na-litovskiy-yazyk/'],
  ['service-german', 'Перевод с / на немецкий язык', 'perevod-s-na-nemetskiy-yazyk', 'language', '/perevod-s-na-nemetskiy-yazyk/'],
  ['service-persian', 'Перевод с / на персидский язык', 'perevod-s-na-persidskiy-yazyk', 'language', '/perevod-s-na-persidskiy-yazyk/'],
  ['service-polish', 'Перевод с / на польский язык', 'perevod-s-na-polskiy-yazyk', 'language', '/perevod-s-na-polskiy-yazyk/'],
  ['service-portuguese', 'Перевод с / на португальский язык', 'perevod-s-na-portugalskiy-yazyk', 'language', '/perevod-s-na-portugalskiy-yazyk/'],
  ['service-romanian', 'Перевод с / на румынский язык', 'perevod-s-na-rumynskiy-yazyk', 'language', '/perevod-s-na-rumynskiy-yazyk/'],
  ['service-serbian', 'Перевод с / на сербский язык', 'perevod-s-na-serbskiy-yazyk', 'language', '/perevod-s-na-serbskiy-yazyk/'],
  ['service-tajik', 'Перевод с / на таджикский язык', 'perevod-s-na-tadzhikskiy-yazyk', 'language', '/perevod-s-na-tadzhikskiy-yazyk/'],
  ['service-turkish', 'Перевод с / на турецкий язык', 'perevod-s-na-turetskiy-yazyk', 'language', '/perevod-s-na-turetskiy-yazyk/'],
  ['service-passport', 'Перевод паспорта', 'perevod-pasportov', 'document', '/perevod-pasportov/'],
  ['service-attestat', 'Перевод аттестата', 'perevod-attestata', 'document', '/perevod-attestata/'],
  ['service-declarations', 'Перевод деклараций', 'perevod-deklaratsiy', 'document', '/perevod-deklaratsiy/'],
  ['service-diploma', 'Перевод диплома', 'perevod-diploma', 'document', '/perevod-diploma/'],
  ['service-contract', 'Перевод договора', 'perevod-dogovorov', 'document', '/perevod-dogovorov/'],
  ['service-certificates-general', 'Перевод свидетельств', 'perevod-svidetelstv', 'document', '/perevod-svidetelstv/'],
  ['service-power-of-attorney', 'Перевод доверенности', 'perevod-doverennosti', 'document', '/perevod-doverennosti/'],
  ['service-other-documents', 'Другие документы', 'perevod-dokumentov', 'document', '/perevod-dokumentov/'],
  ['service-reference-documents', 'Перевод справок', 'perevod-spravok', 'document', '/perevod-spravok/'],
  ['service-travel-consent', 'Перевод согласия на выезд', 'perevod-soglasiya-na-vyezd', 'document', '/perevod-soglasiya-na-vyezd/'],
  ['service-employment-record', 'Перевод трудовой книжки', 'perevod-trudovoy-knizhki', 'document', '/perevod-trudovoy-knizhki/'],
  ['service-drivers-license', 'Перевод водительских прав', 'perevod-voditelskikh-prav', 'document', '/perevod-voditelskikh-prav/'],
  ['service-corporate-documents', 'Перевод учредительных документов', 'perevod-uchreditelnykh-dokumentov', 'document', '/perevod-uchreditelnykh-dokumentov/'],
  ['service-extracts', 'Перевод выписок', 'perevod-vypisok', 'document', '/perevod-vypisok/'],
  ['service-grade-books', 'Перевод зачетных книжек', 'perevod-zachetnykh-knizhek', 'document', '/perevod-zachetnykh-knizhek/'],
  ['service-certificates-translation', 'Перевод сертификатов', 'perevod-sertifikatov', 'document', '/perevod-sertifikatov/'],
  ['service-germany-embassy', 'Посольство Германии', 'perevod-dokumentov-dlya-posolstva-germanii', 'embassy', '/perevod-dokumentov-dlya-posolstva-germanii/'],
  ['service-israel-embassy', 'Посольство Израиля', 'perevod-dokumentov-dlya-posolstva-izrailya', 'embassy', '/perevod-dokumentov-dlya-posolstva-izrailya/'],
  ['service-cyprus-embassy', 'Посольство Кипра', 'perevod-dokumentov-dlya-posolstva-kipra', 'embassy', '/perevod-dokumentov-dlya-posolstva-kipra/'],
  ['service-usa-embassy', 'Посольство США', 'perevod-dokumentov-dlya-posolstva-ssha', 'embassy', '/perevod-dokumentov-dlya-posolstva-ssha/'],
  ['service-thailand-embassy', 'Посольство Таиланда', 'perevod-dokumentov-dlya-posolstva-tailanda', 'embassy', '/perevod-dokumentov-dlya-posolstva-tailanda/'],
  ['service-uk-embassy', 'Посольство Великобритании', 'perevod-dokumentov-dlya-posolstva-velikobritanii', 'embassy', '/perevod-dokumentov-dlya-posolstva-velikobritanii/'],
  ['service-visa-documents', 'Перевод документов для визы', 'perevod-dokumentov-dlya-vizy', 'embassy', '/perevod-dokumentov-dlya-vizy/'],
  ['service-software-localization', 'Локализация программного обеспечения', 'lokalizatsiya-programmnogo-obespecheniya', 'localization', '/lokalizatsiya-programmnogo-obespecheniya/'],
  ['service-game-localization', 'Локализация игр', 'lokalizatsiya-perevod-igr', 'localization', '/lokalizatsiya-perevod-igr/'],
  ['service-website-translation', 'Перевод сайтов', 'lokalizatsiya-perevod-saytov', 'localization', '/lokalizatsiya-perevod-saytov/'],
  ['service-stamp-translation', 'Перевод печати на документе', 'perevod-pechati-na-dokumente', 'document', '/perevod-pechati-na-dokumente/'],
  ['service-interpreting', 'Синхронный и последовательный перевод', 'posledovatelnyy-perevod', 'interpreting', '/posledovatelnyy-perevod/'],
];

const normalizeTitle = (title) =>
  title
    .replace(/^Перевод с \/ на /, '')
    .replace(/^Перевод /, '')
    .replace(/^Посольство /, '')
    .replace(/\s+язык$/, '')
    .trim();

const getLanguageName = (title) => normalizeTitle(title).replace(/^на /, '');

const getDocumentName = (title) => normalizeTitle(title).toLowerCase();

const getIntro = (title, type) => {
  if (type === 'language') {
    const language = getLanguageName(title);
    return `Страница посвящена переводу документов по языковой паре русский — ${language}. Такой перевод нужен для личных документов, учебных бумаг, визовых комплектов, деловой переписки и официальной подачи за рубежом.`;
  }

  if (type === 'document') {
    return `На странице услуги разобран раздел «${title}»: когда такой перевод нужен, как сохранить структуру, реквизиты, печати, подписи и какие требования могут быть у принимающей стороны.`;
  }

  if (type === 'embassy') {
    const country = normalizeTitle(title);
    return `Эта услуга нужна для подготовки переводов в комплект документов для ${country}. Мы учитываем требования к оформлению, написанию имен, датам, печатям и заверению перед подачей.`;
  }

  if (type === 'industry') {
    return `Страница услуги описывает ${title.toLowerCase()} для документов, где важны терминология, единый стиль, точность формулировок и корректная передача профессионального смысла.`;
  }

  if (type === 'apostille') {
    return `Страница посвящена услуге «${title}»: подготовке документов, выбору подходящего способа заверения и проверке требований перед подачей в официальные органы или зарубежные организации.`;
  }

  if (type === 'localization') {
    return `Страница услуги описывает раздел «${title}»: адаптацию текста под целевую аудиторию, интерфейс, продуктовый контекст и требования конкретного рынка.`;
  }

  return 'Страница услуги описывает порядок подготовки, расчета стоимости, сроков и требований к переводу.';
};

const getDetails = (title, type) => {
  if (type === 'language') {
    const language = getLanguageName(title);
    return [
      `Перевод по направлению русский — ${language} выполняется для личных документов, договоров, справок, учебных бумаг и материалов для посольств. При необходимости подготовим заверение перевода.`,
      `Для расчета приложите файл и укажите, куда будет подаваться документ. Менеджер уточнит языковую пару, объем, срочность и требования к оформлению.`,
      'Готовый текст сохраняет структуру исходника: имена, даты, номера, печати, подписи и важные реквизиты передаются аккуратно и последовательно.',
    ];
  }

  if (type === 'document') {
    const documentName = getDocumentName(title);
    return [
      `Перевод документа типа «${documentName}» готовится для официальной подачи, учебы, работы, визы, банка, нотариуса или другой организации.`,
      'Мы сохраняем структуру исходного документа, переносим реквизиты, даты, номера, отметки, печати и подписи, чтобы готовый перевод было удобно проверять.',
      'Если требуется нотариальное заверение, печать бюро или срочное выполнение, укажите это в заявке: менеджер сразу рассчитает подходящий вариант.',
    ];
  }

  if (type === 'embassy') {
    const country = normalizeTitle(title);
    return [
      `Для ${country} важно заранее понимать тип подачи: виза, ВНЖ, учеба, работа, брак, приглашение или другой комплект документов.`,
      'Мы проверяем единообразие написания имен, дат, адресов и реквизитов, чтобы перевод выглядел цельно во всем пакете документов.',
      'В заявке можно приложить сразу весь комплект: менеджер оценит объем, сроки, необходимость заверения и удобный способ выдачи.',
    ];
  }

  if (type === 'industry') {
    return [
      `${title} требует внимания к терминам, контексту и назначению документа. Перед началом работы мы уточняем отрасль, язык, формат и требования получателя.`,
      'Такие переводы часто нужны для договоров, инструкций, коммерческих материалов, медицинских или технических документов, где ошибка в формулировке может изменить смысл.',
      'Для расчета достаточно отправить файл или фрагмент текста. После оценки объема менеджер согласует стоимость, срок и формат готового результата.',
    ];
  }

  if (type === 'apostille') {
    return [
      `Услуга «${title}» помогает подготовить документ для официального использования: в Беларуси, за рубежом, у нотариуса, в госоргане или другой инстанции.`,
      'Перед стартом мы уточняем страну подачи, тип документа, требования к оригиналу и необходимость перевода или дополнительного заверения.',
      'Менеджер подскажет порядок действий, сроки, стоимость и способ передачи документов, чтобы заказ был понятным до начала работы.',
    ];
  }

  if (type === 'localization') {
    return [
      `${title} включает не только перевод текста, но и адаптацию формулировок под продукт, аудиторию, интерфейс и культурный контекст.`,
      'Мы уточняем формат файлов, стиль, терминологию, ограничения интерфейса и целевой рынок, чтобы результат был пригоден к публикации или передаче разработчикам.',
      'К заявке можно приложить тексты, выгрузки, ссылки, таблицы, скриншоты или техническое задание: это помогает точнее оценить объем.',
    ];
  }

  return [
    'Для устного перевода заранее согласуются дата, место, языковая пара, тематика и формат мероприятия.',
    'Если есть повестка, материалы встречи или тезисы выступления, приложите их к заявке: это поможет подготовить переводчика.',
    'Менеджер уточнит длительность, условия работы и подходящий формат: последовательный или синхронный перевод.',
  ];
};

window.PEREVODBY_SERVICES = serviceRows.map(([id, title, slug, type, donorPath]) => ({
  id,
  title,
  slug,
  type,
  url: `${serviceBaseUrl}${slug}`,
  donorUrl: `${donorBaseUrl}${donorPath}`,
  description: getIntro(title, type),
  details: getDetails(title, type),
}));
})();
