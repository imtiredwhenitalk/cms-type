import { defaultLocale, type Locale } from "./locale";

type NavLink = {
  label: string;
  href: string;
};

type Metric = {
  label: string;
  value: string;
  detail: string;
};

type WorkflowStep = {
  step: string;
  title: string;
  detail: string;
};

type ContentBlock = {
  title: string;
  detail: string;
  meta: string;
};

type QueueItem = {
  title: string;
  locale: string;
  owner: string;
  status: string;
};

type Signal = {
  label: string;
  value: string;
  detail: string;
};

type CmsCopy = {
  brand: string;
  tagline: string;
  pageTitle: string;
  pageDescription: string;
  primaryAction: string;
  secondaryAction: string;
  nav: NavLink[];
  metrics: Metric[];
  schemaTitle: string;
  schemaDescription: string;
  contentBlocks: ContentBlock[];
  workflowTitle: string;
  workflowDescription: string;
  workflowSteps: WorkflowStep[];
  queueTitle: string;
  queueDescription: string;
  queueItems: QueueItem[];
  localizationTitle: string;
  localizationDescription: string;
  localizationPoints: string[];
  signalsTitle: string;
  signals: Signal[];
  footerNote: string;
};

export const cmsContent: Record<Locale, CmsCopy> = {
  en: {
    brand: "Northstar CMS",
    tagline: "Multilingual content operations for 2026",
    pageTitle: "Ship editorial updates with one structured system.",
    pageDescription:
      "Northstar CMS keeps articles, landing pages, media, and navigation in sync across English and Ukrainian. The interface is designed like a product cockpit: clear ownership, localization by default, and previews that are ready for sign-off.",
    primaryAction: "Open editor",
    secondaryAction: "Inspect schema",
    nav: [
      { label: "Overview", href: "#overview" },
      { label: "Schema", href: "#schema" },
      { label: "Localization", href: "#localization" },
      { label: "Operations", href: "#operations" },
    ],
    metrics: [
      {
        label: "Published assets",
        value: "128",
        detail: "Articles, pages, and campaigns across both locales.",
      },
      {
        label: "Median review time",
        value: "14m",
        detail: "Inline approval keeps release loops short.",
      },
      {
        label: "Localization coverage",
        value: "100%",
        detail: "Every field knows whether it needs translation.",
      },
    ],
    schemaTitle: "Content model",
    schemaDescription:
      "A CMS only scales when structure is explicit. These blocks reflect the objects the system expects to manage.",
    contentBlocks: [
      {
        title: "Articles",
        detail: "Long-form editorial content with reusable blocks.",
        meta: "SEO, author, hero, body",
      },
      {
        title: "Landing pages",
        detail: "Campaign pages that can ship in both languages.",
        meta: "Layouts, CTAs, conversion goals",
      },
      {
        title: "Navigation",
        detail: "Global menus, footers, and locale-specific links.",
        meta: "Primary, secondary, footer",
      },
      {
        title: "Media library",
        detail: "Optimized images, documents, and video variants.",
        meta: "Variants, alt text, ownership",
      },
    ],
    workflowTitle: "Editorial pipeline",
    workflowDescription:
      "The workflow is tuned for product teams, agencies, and in-house editorial squads that want traceability without losing speed.",
    workflowSteps: [
      {
        step: "01",
        title: "Plan",
        detail:
          "Capture briefs, choose the target locale set, and assign owners before any copy is written.",
      },
      {
        step: "02",
        title: "Draft",
        detail:
          "Write in structured fields so headings, metadata, and translation scopes stay isolated.",
      },
      {
        step: "03",
        title: "Review",
        detail:
          "Track comments, approval state, and publishing readiness in a single view.",
      },
      {
        step: "04",
        title: "Publish",
        detail:
          "Ship to preview, production, or scheduled release with audit-friendly history.",
      },
    ],
    queueTitle: "Review queue",
    queueDescription:
      "A high-signal queue keeps the right people focused on the next item that matters.",
    queueItems: [
      {
        title: "Homepage refresh",
        locale: "EN + UK",
        owner: "Editorial",
        status: "Ready for review",
      },
      {
        title: "Product story: analytics",
        locale: "EN",
        owner: "Marta",
        status: "Needs Ukrainian pass",
      },
      {
        title: "Spring campaign navigation",
        locale: "UK",
        owner: "Design Ops",
        status: "Scheduled",
      },
      {
        title: "Media taxonomy cleanup",
        locale: "EN + UK",
        owner: "Content Ops",
        status: "In progress",
      },
    ],
    localizationTitle: "Language system",
    localizationDescription:
      "English is the default operating language. Ukrainian is fully first-class, with routing and content labels that adapt cleanly.",
    localizationPoints: [
      "Locale detection sends visitors to the right language automatically.",
      "Translation scopes stay explicit so teams know what to localize and what to preserve.",
      "The document language updates with the active route for better accessibility and SEO hygiene.",
    ],
    signalsTitle: "Operational signals",
    signals: [
      {
        label: "Audit depth",
        value: "Full",
        detail: "Every state change can be traced later.",
      },
      {
        label: "Preview mode",
        value: "Instant",
        detail: "Reviewers see the exact layout before publishing.",
      },
      {
        label: "API readiness",
        value: "Ready",
        detail: "The content model can feed REST, GraphQL, or server actions.",
      },
    ],
    footerNote:
      "Built as a clean foundation for auth, databases, rich editors, and delivery integrations.",
  },
  uk: {
    brand: "Northstar CMS",
    tagline: "Багатомовні контент-операції для 2026",
    pageTitle: "Запускайте редакційні оновлення в одній структурованій системі.",
    pageDescription:
      "Northstar CMS синхронізує статті, лендинги, медіа та навігацію між англійською й українською. Інтерфейс побудований як продуктова панель: чітка відповідальність, локалізація за замовчуванням і прев’ю, готове до погодження.",
    primaryAction: "Відкрити редактор",
    secondaryAction: "Переглянути схему",
    nav: [
      { label: "Огляд", href: "#overview" },
      { label: "Схема", href: "#schema" },
      { label: "Локалізація", href: "#localization" },
      { label: "Операції", href: "#operations" },
    ],
    metrics: [
      {
        label: "Опубліковані матеріали",
        value: "128",
        detail: "Статті, сторінки та кампанії для обох мов.",
      },
      {
        label: "Медіана рев’ю",
        value: "14 хв",
        detail: "Вбудоване погодження тримає цикл релізів коротким.",
      },
      {
        label: "Покриття локалізації",
        value: "100%",
        detail: "Кожне поле знає, чи потребує перекладу.",
      },
    ],
    schemaTitle: "Модель контенту",
    schemaDescription:
      "CMS масштабується тільки тоді, коли структура явна. Ці блоки показують об’єкти, якими має керувати система.",
    contentBlocks: [
      {
        title: "Статті",
        detail: "Довгі редакційні матеріали з перевикористовуваними блоками.",
        meta: "SEO, автор, hero, body",
      },
      {
        title: "Лендінги",
        detail: "Кампанійні сторінки, які можна запускати двома мовами.",
        meta: "Layouts, CTA, conversion goals",
      },
      {
        title: "Навігація",
        detail: "Глобальні меню, футери та локальні посилання.",
        meta: "Primary, secondary, footer",
      },
      {
        title: "Медіабібліотека",
        detail: "Оптимізовані зображення, документи та відео-варіанти.",
        meta: "Variants, alt text, ownership",
      },
    ],
    workflowTitle: "Редакційний пайплайн",
    workflowDescription:
      "Пайплайн налаштовано для продуктових команд, агенцій і внутрішніх редакцій, яким потрібна прозорість без втрати швидкості.",
    workflowSteps: [
      {
        step: "01",
        title: "План",
        detail:
          "Фіксуйте бриф, вибирайте набір мов і призначайте відповідальних до початку роботи над текстом.",
      },
      {
        step: "02",
        title: "Чернетка",
        detail:
          "Пишіть у структурованих полях, щоб заголовки, метадані та перекладені області не змішувались.",
      },
      {
        step: "03",
        title: "Рев’ю",
        detail:
          "Коментарі, статус погодження та готовність до публікації зібрані в одному вікні.",
      },
      {
        step: "04",
        title: "Публікація",
        detail:
          "Запускайте прев’ю, продакшн або відкладений реліз з історією, яку легко аудіювати.",
      },
    ],
    queueTitle: "Черга на перевірку",
    queueDescription:
      "Сигнальна черга допомагає кожному бачити наступний важливий елемент без зайвого шуму.",
    queueItems: [
      {
        title: "Оновлення головної",
        locale: "EN + UK",
        owner: "Редакція",
        status: "Готово до рев’ю",
      },
      {
        title: "Історія продукту: аналітика",
        locale: "EN",
        owner: "Марта",
        status: "Потрібен український варіант",
      },
      {
        title: "Навігація весняної кампанії",
        locale: "UK",
        owner: "Design Ops",
        status: "Заплановано",
      },
      {
        title: "Очищення медіа-таксономії",
        locale: "EN + UK",
        owner: "Content Ops",
        status: "У роботі",
      },
    ],
    localizationTitle: "Система мов",
    localizationDescription:
      "Англійська є мовою за замовчуванням. Українська теж повністю першокласна, з маршрутизацією та підписами, що адаптуються без зайвих рухів.",
    localizationPoints: [
      "Визначення мови автоматично веде відвідувача у правильну локаль.",
      "Області перекладу описані явно, тому команда знає, що локалізувати, а що зберігати.",
      "Мова документа змінюється разом з активним маршрутом для кращої доступності й SEO-гігієни.",
    ],
    signalsTitle: "Операційні сигнали",
    signals: [
      {
        label: "Глибина аудиту",
        value: "Повна",
        detail: "Кожну зміну стану можна простежити пізніше.",
      },
      {
        label: "Режим прев’ю",
        value: "Миттєво",
        detail: "Рев’юери бачать точний вигляд ще до публікації.",
      },
      {
        label: "Готовність API",
        value: "Готово",
        detail: "Модель контенту може живити REST, GraphQL або server actions.",
      },
    ],
    footerNote:
      "Побудовано як чисту основу для auth, баз даних, rich editor і інтеграцій доставки.",
  },
};

export function getCmsContent(locale: Locale) {
  return cmsContent[locale] ?? cmsContent[defaultLocale];
}