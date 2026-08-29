import type { Locale } from "@/lib/i18n";

export type ProjectStatus = "production" | "operational" | "mvp" | "prototype" | "concept";
export type CaseType = "full" | "compact";

type LocalizedText = Record<Locale, string>;

export type ProjectMedia = {
  src: string;
  mobileSrc?: string;
  videoSrc?: string;
  alt: LocalizedText;
  caption: LocalizedText;
  tone: "dark" | "light" | "color";
};

export type ProjectContent = {
  title: string;
  category: string;
  statusLabel: string;
  summary: string;
  problem: string;
  solution: string;
  role: string;
  decisions: Array<{ title: string; text: string }>;
  features: string[];
  limits: string[];
  outcomes: string[];
  seoTitle: string;
  seoDescription: string;
};

export type Project = {
  id: string;
  order: number;
  slug: Record<Locale, string>;
  caseType: CaseType;
  status: ProjectStatus;
  year: string;
  publicUrl: string;
  accent: string;
  technologies: string[];
  media: ProjectMedia[];
  content: Record<Locale, ProjectContent>;
};

export const projects: Project[] = [
  {
    id: "torvena",
    order: 1,
    slug: { es: "torvena", en: "torvena" },
    caseType: "full",
    status: "production",
    year: "2026—",
    publicUrl: "https://torvena.com.ar/",
    accent: "#087484",
    technologies: ["Shopify Hydrogen", "TypeScript", "Storefront API", "Supabase"],
    media: [
      {
        src: "/media/projects/torvena/live-desktop.png",
        mobileSrc: "/media/projects/torvena/live-mobile.png",
        videoSrc: "/media/projects/torvena/page-preview.mp4",
        alt: { es: "Home de Torvena con navegación comercial y presentación de un accesorio tecnológico para el auto", en: "Torvena home page with commercial navigation and a car technology product hero" },
        caption: { es: "Storefront en producción · captura de agosto de 2026", en: "Production storefront · captured August 2026" },
        tone: "dark",
      },
    ],
    content: {
      es: {
        title: "Torvena",
        category: "E-commerce · Negocio propio",
        statusLabel: "Negocio propio · En producción",
        summary: "De cero a un e-commerce argentino operado en primera persona: marca, catálogo, storefront, adquisición, medición y operación conectados en un mismo sistema.",
        problem: "Torvena empezó sin nombre, marca, catálogo, proveedores ni canal de venta. El desafío no era implementar una tienda ya definida, sino construir un negocio alrededor de soluciones tecnológicas útiles para vehículos y aprender desde la operación real.",
        solution: "Definí la categoría, la marca, la oferta y las necesidades comerciales y funcionales del storefront; coordiné la implementación asistida y validé la integración con el catálogo, carrito y checkout de Shopify, junto con contenido, campañas y una capa propia de medición.",
        role: "Fundador y operador de e-commerce",
        decisions: [
          { title: "Navegar por problemas, no solo por categorías", text: "La experiencia prioriza situaciones de uso —cargar, limpiar, ordenar o estar preparado— para acercar el catálogo a necesidades concretas del conductor." },
          { title: "Evolucionar hacia un storefront headless", text: "Después de una primera etapa con Lovable, coordiné la reestructuración de la experiencia con Shopify Hydrogen para tener mayor control sobre contenido, recorrido y sistema visual." },
          { title: "Complementar las plataformas con medición propia", text: "La arquitectura incorpora sesiones anónimas, UTMs, exclusión de tráfico interno y asociación sin datos personales entre adquisición y pedidos pagados." },
        ],
        features: ["Home y navegación orientadas a necesidades", "Colecciones y páginas de producto personalizadas", "Combos, descuentos, upsells y progreso de beneficios", "Carrito y checkout conectados a Shopify", "Búsqueda predictiva, políticas y soporte por WhatsApp", "Analytics first-party y panel administrativo protegido"],
        limits: ["La tienda pública, el carrito y el checkout están operativos. Lo que todavía no está disponible es el acceso privado para que cada cliente inicie sesión y gestione su cuenta.", "El seguimiento first-party de pedidos pagados funciona en producción y forma parte de la operación habitual.", "Google Analytics 4 está activo y su revisión práctica es inicial; todavía no existe historial suficiente para atribución o mejoras causales."],
        outcomes: ["Negocio activo, con pedidos reales y campañas publicitarias en curso.", "Operación nacional que reúne venta, soporte, logística y aprendizaje continuo.", "Experiencia verificable en coordinación y operación de un e-commerce propio."],
        seoTitle: "Torvena — Caso de e-commerce de Alejandro Fink",
        seoDescription: "Cómo Alejandro Fink opera Torvena y coordina su evolución: marca, storefront headless, Shopify, adquisición y medición sin inventar resultados.",
      },
      en: {
        title: "Torvena",
        category: "E-commerce · Owned business",
        statusLabel: "Owned business · In production",
        summary: "From zero to an Argentine e-commerce business operated firsthand: brand, catalog, storefront, acquisition, measurement and operations connected as one system.",
        problem: "Torvena began without a name, brand, catalog, suppliers or sales channel. The challenge was not to implement a predefined store, but to build a business around useful technology for vehicles and learn from real operations.",
        solution: "I defined the storefront’s category, brand, offer, business needs and functional requirements; coordinated assisted implementation; and validated its integration with Shopify’s catalog, cart and checkout, alongside content, campaigns and a first-party measurement layer.",
        role: "Founder and e-commerce operator",
        decisions: [
          { title: "Navigate by problems, not only categories", text: "The experience prioritizes situations —charging, cleaning, organizing or being prepared— to connect the catalog with real driver needs." },
          { title: "Evolve into a headless storefront", text: "After an initial Lovable stage, I coordinated the experience’s restructuring with Shopify Hydrogen to gain greater control over content, journeys and the visual system." },
          { title: "Add a first-party measurement layer", text: "The architecture includes anonymous sessions, UTMs, internal-traffic exclusion and a non-personal link between acquisition and paid orders." },
        ],
        features: ["Need-led home and navigation", "Custom collections and product pages", "Bundles, discounts, upsells and benefit progress", "Shopify cart and checkout", "Predictive search, policies and WhatsApp support", "First-party analytics and a protected admin dashboard"],
        limits: ["The public store, cart and checkout are operational. What is not available yet is private sign-in for customers to access and manage their accounts.", "First-party paid-order tracking runs in production and is part of day-to-day operations.", "Google Analytics 4 is active with initial hands-on review; there is not yet enough history for attribution or causal improvement claims."],
        outcomes: ["An active business with real orders and advertising campaigns underway.", "Nationwide operations combining sales, support, logistics and continuous learning.", "Verifiable experience coordinating and operating an owned e-commerce business."],
        seoTitle: "Torvena — Alejandro Fink e-commerce case study",
        seoDescription: "How Alejandro Fink operates Torvena and coordinates its evolution: brand, headless storefront, Shopify, acquisition and measurement without invented results.",
      },
    },
  },
  {
    id: "brisa-do-mar",
    order: 2,
    slug: { es: "brisa-do-mar", en: "brisa-do-mar" },
    caseType: "full",
    status: "operational",
    year: "2026",
    publicUrl: "https://brisa-do-mar-arraial.alegfink.chatgpt.site/",
    accent: "#08747a",
    technologies: ["React", "TypeScript", "Cloudflare D1", "First-party analytics"],
    media: [
      {
        src: "/media/projects/brisa-do-mar/live-desktop.png",
        mobileSrc: "/media/projects/brisa-do-mar/live-mobile.png",
        alt: { es: "Home multilingüe de Brisa do Mar sobre experiencias turísticas en Arraial do Cabo", en: "Multilingual Brisa do Mar home page for tourism experiences in Arraial do Cabo" },
        caption: { es: "Experiencia pública en ES, PT y EN", en: "Public experience in ES, PT and EN" },
        tone: "color",
      },
    ],
    content: {
      es: {
        title: "Brisa do Mar",
        category: "Business website · Turismo",
        statusLabel: "Solución web · Operativa",
        summary: "De un folleto y conversaciones repetitivas a una experiencia turística multilingüe, administrable y conectada con el cierre humano por WhatsApp.",
        problem: "La oferta se explicaba en la playa con un folleto y luego por WhatsApp. Imágenes, condiciones y precios dependían de conversaciones individuales, y cada idioma agregaba trabajo manual.",
        solution: "Construí una vidriera ES/PT/EN que permite comparar cinco tipos de experiencia, recibir una recomendación y preparar una consulta con contexto. Un panel protegido centraliza precios y muestra el recorrido previo a WhatsApp.",
        role: "Dirigí descubrimiento, arquitectura, copy multilingüe, UX, diseño, frontend, recomendador, asistente de consulta, panel, modelo de datos, analytics, autenticación y publicación. La responsable aportó material, precios e información operativa.",
        decisions: [
          { title: "Mejorar lo que ocurre antes de WhatsApp", text: "La solución preserva el canal humano que cierra la venta, pero entrega una consulta más informada y con contexto estructurado." },
          { title: "Diseñar tres idiomas desde el modelo", text: "Actividades, FAQs, opciones y mensajes viven en una estructura multilingüe, no como traducciones tardías pegadas a la interfaz." },
          { title: "Centralizar precios sin duplicarlos", text: "El panel usa valores fijos, “desde” o “consultar”, y deriva referencias generales para reducir inconsistencias." },
        ],
        features: ["Comparación de barco, buceo, snorkel, buggy y quadriciclo", "Recomendador según preferencias", "Galería, condiciones y preguntas frecuentes", "Asistente que prepara el mensaje de WhatsApp", "Gestión protegida de precios", "Medición anónima de fuentes, actividades y microconversiones"],
        limits: ["La conversión final ocurre en WhatsApp; no existen reserva ni pago online.", "Todavía no hay métricas maduras de consultas o reservas.", "El panel no administra cupos ni disponibilidad por fecha.", "El dominio actual es temporal."],
        outcomes: ["Oferta, imágenes, condiciones y precios centralizados.", "Experiencia pública funcional en español, portugués e inglés.", "La responsable puede mantener precios sin editar código y recibir consultas con más contexto."],
        seoTitle: "Brisa do Mar — Solución web multilingüe",
        seoDescription: "Caso de Alejandro Fink: experiencias turísticas comparables, panel de precios, analytics first-party y contacto contextual por WhatsApp.",
      },
      en: {
        title: "Brisa do Mar",
        category: "Business website · Tourism",
        statusLabel: "Web solution · Operational",
        summary: "From a brochure and repeated explanations to a multilingual, manageable tourism experience connected to a human WhatsApp close.",
        problem: "The offer was explained on the beach with a brochure and then through WhatsApp. Images, conditions and prices depended on one-to-one conversations, while each language added manual work.",
        solution: "I built an ES/PT/EN storefront where visitors can compare five experience types, receive a recommendation and prepare a contextual inquiry. A protected dashboard centralizes prices and reveals the journey before WhatsApp.",
        role: "I led discovery, architecture, multilingual copy, UX, design, frontend, recommendation flow, inquiry assistant, dashboard, data model, analytics, authentication and publication. The owner contributed media, prices and operational information.",
        decisions: [
          { title: "Improve what happens before WhatsApp", text: "The solution preserves the human channel that closes the sale while handing over a more informed, structured inquiry." },
          { title: "Design three languages into the model", text: "Activities, FAQs, options and messages live in a multilingual structure rather than a late translation layer." },
          { title: "Centralize pricing without duplication", text: "The dashboard supports fixed, starting-from or ask-us pricing and derives general references to reduce inconsistencies." },
        ],
        features: ["Comparison across boat, diving, snorkelling, buggy and quad bike", "Preference-based recommendation", "Gallery, conditions and FAQs", "Assistant-generated WhatsApp context", "Protected price management", "Anonymous source, activity and micro-conversion measurement"],
        limits: ["Final conversion happens on WhatsApp; there is no online booking or payment.", "Inquiry and booking metrics are not mature yet.", "The dashboard does not manage capacity or date-based availability.", "The current domain is temporary."],
        outcomes: ["Offer, imagery, conditions and prices centralized.", "A functional public experience in Spanish, Portuguese and English.", "The owner can maintain prices without editing code and receive better-context inquiries."],
        seoTitle: "Brisa do Mar — Multilingual web solution",
        seoDescription: "Alejandro Fink case study: comparable tourism experiences, pricing dashboard, first-party analytics and contextual WhatsApp contact.",
      },
    },
  },
  {
    id: "cuidalo",
    order: 3,
    slug: { es: "cuidalo", en: "cuidalo" },
    caseType: "full",
    status: "mvp",
    year: "2026",
    publicUrl: "https://cuidalo-argentina.alegfink.chatgpt.site/",
    accent: "#a83f32",
    technologies: ["React", "TypeScript", "Cloudflare D1", "Drizzle ORM"],
    media: [
      {
        src: "/media/projects/cuidalo/live-desktop.png",
        mobileSrc: "/media/projects/cuidalo/live-mobile.png",
        alt: { es: "Home del MVP CUIDALO con un localizador compacto y una propuesta centrada en tranquilidad", en: "CUIDALO MVP home with a compact item finder and a peace-of-mind value proposition" },
        caption: { es: "MVP público de validación · no es un e-commerce operativo", en: "Public validation MVP · not an operational e-commerce store" },
        tone: "light",
      },
      {
        src: "/media/projects/cuidalo/uso-llaves.webp",
        alt: { es: "Localizador CUIDALO presentado junto a llaves", en: "CUIDALO item finder shown with keys" },
        caption: { es: "Caso de uso · llaves", en: "Use case · keys" },
        tone: "color",
      },
      {
        src: "/media/projects/cuidalo/uso-equipaje.webp",
        alt: { es: "Localizador CUIDALO presentado en equipaje", en: "CUIDALO item finder shown with luggage" },
        caption: { es: "Caso de uso · equipaje", en: "Use case · luggage" },
        tone: "color",
      },
    ],
    content: {
      es: {
        title: "CUIDALO",
        category: "MVP · Producto de consumo",
        statusLabel: "MVP de validación · Sin lanzamiento comercial",
        summary: "De una oportunidad de producto a una marca y un MVP medible, antes de invertir en pagos, inventario y operación completa.",
        problem: "El proyecto debía probar si una propuesta honesta de localización cotidiana podía resultar comprensible y atractiva en Argentina, sin prometer GPS en tiempo real ni construir primero toda la infraestructura transaccional.",
        solution: "Investigué el mercado, estructuré marca, mensajes, packs y objeciones, y construí un storefront que llega hasta carrito y captura de intención. La instrumentación permite estudiar el funnel sin simular pagos ni pedidos reales.",
        role: "Lideré investigación, marca, posicionamiento, oferta, UX, dirección visual, frontend, backend, instrumentación y panel. Es un proyecto propio en colaboración; el socio participa actualmente en redes sociales.",
        decisions: [
          { title: "Educar antes de vender", text: "La página explica de forma visible que el dispositivo no es un GPS satelital ni ofrece seguimiento continuo en tiempo real." },
          { title: "Validar intención sin fingir una compra", text: "El recorrido permite elegir packs y usar un carrito, pero termina en captura de contacto; no presenta un checkout inexistente." },
          { title: "Instrumentar el MVP desde el inicio", text: "Sesiones, fuentes, packs y pasos del funnel pueden observarse en una infraestructura preparada para validar con comportamiento real." },
        ],
        features: ["Packs por cantidad y situación", "Selector con precio por unidad y beneficios progresivos", "Comparación con Bluetooth básico y GPS con SIM", "Carrito lateral accesible", "Captura de email e intención", "Panel de funnel, fuentes y estado de contactos implementado"],
        limits: ["No tuvo lanzamiento comercial, ventas ni pedidos reales.", "No existen pagos, inventario, fulfillment ni emails transaccionales.", "El producto físico todavía no fue comprado ni probado por el equipo.", "Nombre, símbolo y especificaciones definitivas continúan en validación.", "La activación pública de D1 y del panel todavía debe verificarse."],
        outcomes: ["Propuesta de marca, oferta y MVP funcional construidos.", "Presentaciones exploratorias tuvieron recepción cualitativa favorable, sin equivaler a demanda validada.", "No hay métricas cuantitativas publicables ni resultados comerciales."],
        seoTitle: "CUIDALO — MVP de validación de producto",
        seoDescription: "Investigación, marca, oferta, carrito e instrumentación para validar intención sin simular ventas ni una operación inexistente.",
      },
      en: {
        title: "CUIDALO",
        category: "MVP · Consumer product",
        statusLabel: "Validation MVP · No commercial launch",
        summary: "From a product opportunity to a measurable brand MVP, before investing in payments, inventory and full operations.",
        problem: "The project needed to test whether an honest everyday item-finding proposition could be understood and valued in Argentina without promising real-time GPS or building the full transactional infrastructure first.",
        solution: "I researched the market, structured the brand, messaging, bundles and objections, and built a storefront that reaches cart and intent capture. Instrumentation supports funnel learning without simulating payments or real orders.",
        role: "I led research, brand, positioning, offer, UX, art direction, frontend, backend, instrumentation and dashboard. It is an owned collaborative project; the partner currently focuses on social media.",
        decisions: [
          { title: "Educate before selling", text: "The page states clearly that the device is not satellite GPS and does not provide continuous real-time tracking." },
          { title: "Validate intent without pretending to sell", text: "Visitors can choose bundles and use a cart, but the journey ends in contact capture rather than a fictional checkout." },
          { title: "Instrument the MVP from day one", text: "Sessions, sources, bundles and funnel steps can be observed in infrastructure prepared for behavioral validation." },
        ],
        features: ["Quantity and use-case bundles", "Per-unit pricing and progressive benefits", "Comparison with basic Bluetooth finders and SIM GPS", "Accessible side cart", "Email and intent capture", "Implemented funnel, source and contact-status dashboard"],
        limits: ["There has been no commercial launch, sales or real orders.", "There are no payments, inventory, fulfilment or transactional emails.", "The team has not yet purchased or tested a physical unit.", "Name, symbol and final specifications remain under validation.", "Public D1 and dashboard activation still need verification."],
        outcomes: ["A functional brand proposition, offer and MVP were built.", "Exploratory presentations received positive qualitative feedback, which is not the same as validated demand.", "There are no publishable quantitative metrics or commercial results."],
        seoTitle: "CUIDALO — Product validation MVP",
        seoDescription: "Research, brand, offer, cart and instrumentation designed to validate intent without simulating sales or nonexistent operations.",
      },
    },
  },
  {
    id: "salto-cuantico",
    order: 4,
    slug: { es: "salto-cuantico", en: "salto-cuantico" },
    caseType: "compact",
    status: "prototype",
    year: "2026",
    publicUrl: "https://salto-cuantico-anton.alegfink.chatgpt.site/",
    accent: "#6540d5",
    technologies: ["React", "TypeScript", "Typeform", "dataLayer events"],
    media: [
      {
        src: "/media/projects/salto-cuantico/live-desktop.png",
        mobileSrc: "/media/projects/salto-cuantico/live-mobile.png",
        alt: { es: "Hero oscuro del prototipo Salto Cuántico con explicación del programa y video de Anton", en: "Dark Salto Cuántico prototype hero explaining the program with an Anton video" },
        caption: { es: "Landing funcional · la nueva experiencia no fue adoptada como web operativa", en: "Functional landing · the new experience was not adopted as the operational website" },
        tone: "dark",
      },
    ],
    content: {
      es: {
        title: "Salto Cuántico",
        category: "Conversión · Producto digital",
        statusLabel: "Propuesta estratégica · Prototipo funcional",
        summary: "Convertir experiencia comercial de primera mano en una auditoría de funnel, una arquitectura más clara y dos páginas funcionales para un programa existente.",
        problem: "Después de trabajar como closer para Anton, detecté una brecha entre la riqueza del programa y la forma básica en que su web explicaba método, acompañamiento y comunidad antes de una llamada.",
        solution: "Propuse una landing principal y Mapa del Alma como dos recorridos coordinados, integré Typeforms existentes, transferí UTMs y separé con claridad la experiencia implementada de una plataforma futura conceptual.",
        role: "Detecté la oportunidad, audité fuentes públicas y el funnel, definí estrategia, contenido, UX, dirección visual, medición genérica e implementé el prototipo. Anton y su equipo son autores del programa, el método y sus activos.",
        decisions: [
          { title: "Mostrar más producto antes de pedir una aplicación", text: "La propuesta explica método, fases, prácticas y experiencia antes del formulario." },
          { title: "Separar recorridos por temperatura", text: "La landing atiende a quien ya tiene contexto; Mapa del Alma funciona como entrada breve para tráfico más frío." },
          { title: "Distinguir realidad y visión", text: "La futura plataforma aparece rotulada como conceptual y no como software operativo." },
        ],
        features: ["Landing principal y Mapa del Alma", "Typeform embebido con carga diferida", "Transferencia de UTMs y eventos sin respuestas sensibles", "Video bajo interacción", "Contenido y claims con límites explícitos"],
        limits: ["La nueva experiencia no fue adoptada como web operativa.", "Portal, comunidad propia, CRM y agenda son visión futura, no funcionalidades construidas.", "No existen métricas de conversión atribuibles al prototipo.", "Los Typeforms reales no se promueven desde este portfolio."],
        outcomes: ["Propuesta completada y presentada a un socio de Anton.", "Recepción favorable y autorización para mostrar el trabajo.", "El estado continúa en evaluación y se actualizará si evoluciona."],
        seoTitle: "Salto Cuántico — Propuesta de funnel y prototipo",
        seoDescription: "Auditoría comercial, arquitectura de dos páginas, Typeform y visión de producto, con prototipo y operación real claramente separados.",
      },
      en: {
        title: "Salto Cuántico",
        category: "Conversion · Digital product",
        statusLabel: "Strategic proposal · Functional prototype",
        summary: "Turning firsthand sales experience into a funnel audit, clearer architecture and two functional pages for an existing program.",
        problem: "After working as a closer for Anton, I recognized a gap between the program’s depth and the basic way its website explained method, support and community before a call.",
        solution: "I proposed a main landing page and Mapa del Alma as coordinated journeys, integrated existing Typeforms, passed UTMs and clearly separated the implemented experience from a conceptual future platform.",
        role: "I identified the opportunity, audited public sources and the funnel, defined strategy, content, UX, art direction and generic measurement, and implemented the prototype. Anton and his team own the program, method and original assets.",
        decisions: [
          { title: "Show more of the product before the application", text: "The proposal explains the method, stages, practices and experience before asking for a form submission." },
          { title: "Separate journeys by traffic temperature", text: "The main landing serves people with context; Mapa del Alma offers a shorter entry for colder traffic." },
          { title: "Distinguish reality from vision", text: "The future platform is labelled conceptual rather than presented as operational software." },
        ],
        features: ["Main landing page and Mapa del Alma", "Lazy-loaded embedded Typeform", "UTM transfer and events without sensitive answers", "Interaction-loaded video", "Explicit content and claim boundaries"],
        limits: ["The new experience was not adopted as the operational website.", "Portal, owned community, CRM and scheduling remain future vision, not built functionality.", "There are no conversion metrics attributable to the prototype.", "Real Typeforms are not promoted from this portfolio."],
        outcomes: ["Proposal completed and presented to one of Anton’s partners.", "Positive reception and authorization to show the work.", "The project remains under evaluation and its status will change only if it evolves."],
        seoTitle: "Salto Cuántico — Funnel proposal and prototype",
        seoDescription: "Sales-led audit, two-page architecture, Typeform integration and product vision, with prototype and real operations clearly separated.",
      },
    },
  },
  {
    id: "luca-ds",
    order: 5,
    slug: { es: "luca-ds", en: "luca-ds" },
    caseType: "compact",
    status: "production",
    year: "2026",
    publicUrl: "https://luca-ds-coaching.alegfink.chatgpt.site/",
    accent: "#ed1c24",
    technologies: ["React", "TypeScript", "CSS"],
    media: [
      {
        src: "/media/projects/luca-ds/hero-first-frame.png",
        mobileSrc: "/media/projects/luca-ds/hero-first-frame.png",
        videoSrc: "/media/projects/luca-ds/hero-transition.mp4",
        alt: { es: "Hero de Luca DS con una dirección visual oscura, deportiva y acentos rojos", en: "Luca DS hero with dark athletic art direction and red accents" },
        caption: { es: "Landing en producción · hero cinemático y recorrido editorial", en: "Production landing page · cinematic hero and editorial journey" },
        tone: "dark",
      },
      {
        src: "/media/projects/luca-ds/entrenamiento-disciplina.webp",
        alt: { es: "Luca entrenando con una barra en un gimnasio oscuro", en: "Luca training with a barbell in a dark gym" },
        caption: { es: "Fotografía vertical utilizada en la narrativa de disciplina", en: "Vertical photography used in the discipline narrative" },
        tone: "dark",
      },
    ],
    content: {
      es: {
        title: "Luca DS",
        category: "High-ticket · Marca de coaching",
        statusLabel: "Landing pública · En producción",
        summary: "Con Luca desarrollamos y publicamos una marca de coaching que convierte su experiencia, método y voz directa en una propuesta digital propia.",
        problem: "La propuesta necesitaba hablarle a personas que ya entrenan pero siguen estancadas, ordenar una oferta 1:1 y un futuro producto de entrada, y sostener la voz directa de Luca sin promesas mágicas.",
        solution: "Desarrollé el posicionamiento, la arquitectura de oferta, el copy, la experiencia y una dirección visual deportiva con narrativa de scroll, hero cinemático y cierre comercial en Instagram.",
        role: "Construyo y evoluciono el proyecto junto a Luca. Aporto concepto comercial, mensaje, UX, dirección visual, frontend asistido por IA y publicación; Luca aporta experiencia, servicio, historia, material y validación.",
        decisions: [
          { title: "Hablarle a un público específico", text: "La propuesta se concentra en quienes ya entrenan y no ven reflejado su esfuerzo, en lugar de dirigirse a cualquiera que quiera estar en forma." },
          { title: "Separar dos niveles de oferta", text: "El coaching 1:1 y el protocolo futuro responden a necesidades y compromisos distintos." },
          { title: "Mantener Instagram como cierre", text: "La landing desarrolla método, historia y objeciones, pero deriva la conversación al canal donde Luca ya atiende y valida cada caso." },
        ],
        features: ["Landing pública de una página", "Hero en video y narrativa de scroll", "Método, historia y tratamiento de objeciones", "Oferta 1:1 y lista de espera", "Filtro de afinidad, FAQs y CTAs a Instagram"],
        limits: ["La conversión final todavía ocurre en Instagram; no hay CRM, agenda ni pagos integrados.", "La landing ya está publicada, pero todavía no existen métricas atribuibles suficientes para comunicar resultados.", "La oferta y el contenido seguirán evolucionando junto con la operación real de Luca."],
        outcomes: ["Sistema comercial y visual publicado y acordado entre los socios.", "Recorrido más completo para presentar método, historia, programas y objeciones.", "Nueva base digital preparada para iterar con aprendizaje real, sin inventar resultados."],
        seoTitle: "Luca DS — Marca y landing de coaching",
        seoDescription: "Posicionamiento, oferta high-ticket, dirección verbal y landing en producción de Luca DS, con hero cinemático y narrativa editorial.",
      },
      en: {
        title: "Luca DS",
        category: "High-ticket · Coaching brand",
        statusLabel: "Public landing page · In production",
        summary: "Together with Luca, we developed and published a coaching brand that turns his experience, method and direct voice into an owned digital proposition.",
        problem: "The proposition needed to speak to people who already train but remain stuck, structure a 1:1 offer and future entry product, and retain Luca’s direct voice without magical promises.",
        solution: "I developed positioning, offer architecture, copy, UX and an athletic visual direction with scroll storytelling, a cinematic hero and an Instagram-based commercial close.",
        role: "I build and evolve the project with Luca. I contribute the commercial concept, messaging, UX, art direction, AI-assisted frontend and publishing; Luca contributes expertise, service, story, material and validation.",
        decisions: [
          { title: "Speak to a specific audience", text: "The proposition focuses on people who already train but do not see their effort reflected, rather than anyone who wants to get fit." },
          { title: "Separate two levels of offer", text: "The 1:1 coaching and future protocol serve different levels of need and commitment." },
          { title: "Keep Instagram as the close", text: "The landing develops the method, story and objections, then moves the conversation to the channel where Luca already supports and validates each case." },
        ],
        features: ["Public single-page landing", "Video hero and scroll narrative", "Method, story and objection handling", "1:1 offer and waitlist", "Fit filter, FAQs and Instagram calls to action"],
        limits: ["The final conversion still happens on Instagram; there is no integrated CRM, scheduling or payment flow.", "The landing is live, but there are not yet enough attributable metrics to communicate results.", "The offer and content will keep evolving with Luca’s real operation."],
        outcomes: ["A published commercial and visual system agreed by both partners.", "A more complete journey for presenting the method, story, programs and objections.", "A new digital base ready to iterate with real learning, without invented results."],
        seoTitle: "Luca DS — Coaching brand and landing page",
        seoDescription: "Positioning, high-ticket offer, verbal direction and production landing page for Luca DS, with a cinematic hero and editorial storytelling.",
      },
    },
  },
  {
    id: "lourdes-mirada",
    order: 6,
    slug: { es: "lourdes-mirada", en: "lourdes-mirada" },
    caseType: "compact",
    status: "concept",
    year: "2026",
    publicUrl: "https://lourdes-mirada.alegfink.chatgpt.site/",
    accent: "#98415a",
    technologies: ["React", "TypeScript", "CSS"],
    media: [
      {
        src: "/media/projects/lourdes-mirada/live-desktop.png",
        mobileSrc: "/media/projects/lourdes-mirada/live-mobile.png",
        alt: { es: "Fotografía real seleccionada del archivo creativo de Lourdes", en: "Real photograph selected from Lourdes’s creative archive" },
        caption: { es: "Archivo autorizado · fotografía y curaduría editorial", en: "Authorized archive · photography and editorial curation" },
        tone: "color",
      },
      {
        src: "/media/projects/lourdes-mirada/work-04.jpg",
        alt: { es: "Retrato editorial del trabajo real de Lourdes", en: "Editorial portrait from Lourdes’s real body of work" },
        caption: { es: "Portfolio principal · pieza seleccionada", en: "Main portfolio · selected work" },
        tone: "color",
      },
      {
        src: "/media/projects/lourdes-mirada/work-08.jpg",
        alt: { es: "Imagen lifestyle del archivo real de Lourdes", en: "Lifestyle image from Lourdes’s real archive" },
        caption: { es: "Ritmo editorial adaptado a fotografía y video", en: "Editorial rhythm adapted to photography and video" },
        tone: "color",
      },
    ],
    content: {
      es: {
        title: "Lourdes Mirada",
        category: "Portfolio creativo · Dirección editorial",
        statusLabel: "Portfolio aprobado · Activación pendiente",
        summary: "Convertir una identidad que vivía en Instagram en un portfolio editorial propio, sin volverla una galería genérica ni forzar captación cuando la capacidad es limitada.",
        problem: "Lourdes mostraba trabajos, reels, personalidad y servicios solo en Instagram. La oportunidad era curar ese archivo y traducir una sensibilidad existente a una presencia web propia.",
        solution: "Construí una narrativa con fotografía, reels, manifiesto, servicios y presentación personal, usando composiciones de ritmo variable y manteniendo Instagram como canal de contacto.",
        role: "Realicé conceptualización, arquitectura, curaduría, copy, identidad aplicada, UX, desarrollo asistido por IA y publicación. Lourdes aportó el archivo real, sus servicios, identidad y aprobación.",
        decisions: [
          { title: "Traducir una identidad sin inventar otra", text: "La dirección surge del lenguaje visual y los temas que Lourdes ya expresaba en su trabajo." },
          { title: "Curar como narrativa", text: "Las imágenes se organizan con ritmo editorial, títulos y categorías en lugar de una cuadrícula uniforme." },
          { title: "No forzar una captación que hoy no conviene", text: "La página está aprobada, pero su activación comercial espera una decisión real de capacidad." },
        ],
        features: ["Hero fotográfico", "Manifiesto y galería editorial", "Integración de reels enlazados", "Tres familias de servicios reales", "Presentación personal y CTA a Instagram"],
        limits: ["La página no opera como canal comercial activo.", "No hay formulario, agenda, pagos, CMS ni analytics.", "Los testimonios visibles en la página fuente son ilustrativos y se excluyen de este caso.", "No existen métricas atribuibles."],
        outcomes: ["Nueva presencia web construida desde una identidad y un archivo existentes.", "Propuesta aprobada por Lourdes y lista para activarse cuando su capacidad lo permita.", "Fotografías, reels y servicios reales; sin testimonios ni resultados inventados."],
        seoTitle: "Lourdes Mirada — Portfolio editorial",
        seoDescription: "Curaduría, identidad y experiencia web para transformar el archivo real de Lourdes en un portfolio propio, con activación pendiente.",
      },
      en: {
        title: "Lourdes Mirada",
        category: "Creative portfolio · Editorial direction",
        statusLabel: "Portfolio approved · Activation pending",
        summary: "Turning an identity that lived on Instagram into an owned editorial portfolio, without making it a generic gallery or forcing acquisition while capacity is limited.",
        problem: "Lourdes showed work, reels, personality and services only on Instagram. The opportunity was to curate that archive and translate an existing sensibility into an owned web presence.",
        solution: "I built a narrative across photography, reels, a manifesto, services and a personal introduction, using varied editorial compositions while keeping Instagram as the contact channel.",
        role: "I handled concept, architecture, curation, copy, applied identity, UX, AI-assisted development and publication. Lourdes provided the real archive, services, identity and approval.",
        decisions: [
          { title: "Translate an identity without inventing one", text: "The direction comes from the visual language and themes Lourdes already expressed through her work." },
          { title: "Curate as a narrative", text: "Images are organized with editorial rhythm, titles and categories rather than a uniform grid." },
          { title: "Do not force acquisition when it is not useful", text: "The page is approved, but commercial activation waits for a real capacity decision." },
        ],
        features: ["Photographic hero", "Manifesto and editorial gallery", "Linked reel integration", "Three real service families", "Personal introduction and Instagram call to action"],
        limits: ["The page is not an active commercial channel.", "There is no form, scheduling, payments, CMS or analytics.", "Testimonials visible on the source page are illustrative and excluded from this case.", "There are no attributable metrics."],
        outcomes: ["A new web presence built from an existing identity and archive.", "A proposal approved by Lourdes and ready to activate when her capacity allows.", "Real photography, reels and services, with no invented testimonials or results."],
        seoTitle: "Lourdes Mirada — Editorial portfolio",
        seoDescription: "Curation, identity and web experience turning Lourdes’s real archive into an owned portfolio, with activation pending.",
      },
    },
  },
];

export function getProjectBySlug(locale: Locale, slug: string): Project | undefined {
  return projects.find((project) => project.slug[locale] === slug);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function validateProjects(data: Project[]): string[] {
  const errors: string[] = [];
  if (data.length !== 6) errors.push(`Expected 6 projects, received ${data.length}`);

  const ids = new Set<string>();
  const orders = new Set<number>();
  const slugs: Record<Locale, Set<string>> = { es: new Set(), en: new Set() };

  for (const project of data) {
    if (ids.has(project.id)) errors.push(`Duplicate id: ${project.id}`);
    ids.add(project.id);
    if (orders.has(project.order)) errors.push(`Duplicate order: ${project.order}`);
    orders.add(project.order);

    for (const locale of ["es", "en"] as const) {
      const slug = project.slug[locale];
      if (!slug) errors.push(`Missing ${locale} slug for ${project.id}`);
      if (slugs[locale].has(slug)) errors.push(`Duplicate ${locale} slug: ${slug}`);
      slugs[locale].add(slug);

      const content = project.content[locale];
      const required = [content.title, content.category, content.statusLabel, content.summary, content.problem, content.solution, content.role, content.seoTitle, content.seoDescription];
      if (required.some((value) => !value.trim())) errors.push(`Missing required ${locale} copy for ${project.id}`);
      if (content.decisions.length < 3) errors.push(`Project ${project.id} needs at least three decisions in ${locale}`);
      if (content.limits.length === 0) errors.push(`Project ${project.id} needs a visible limit in ${locale}`);
    }
  }

  return errors;
}

const projectErrors = validateProjects(projects);
if (projectErrors.length > 0) {
  throw new Error(`Invalid project content:\n${projectErrors.join("\n")}`);
}
