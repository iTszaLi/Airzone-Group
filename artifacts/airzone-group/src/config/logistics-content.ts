/**
 * Bilingual service content for primary Airzone Logistics routes.
 * Cautious by design: no prices, timelines, guarantees, licences, fleet or office claims.
 * Requirements are assessed shipment by shipment.
 */
import { coreLogisticsContent } from './logistics-content-core';
import { assertSamePaths, logisticsContentPaths } from './route-paths';

export const logisticsContentUpdatedAt = '2026-10-11';

export type ServiceLang = {
  title: string; intro: string; includes: string[]; customers: string[];
  process: { title: string; text: string }[]; documents: string[]; coverage: string;
  /** Overrides the "Documents to prepare" heading/note, e.g. for transport services. */
  prepareTitle?: string; prepareNote?: string;
  faqs: { question: string; answer: string }[]; related: string[];
  sources: { title: string; url: string }[];
};
export type ServiceContent = { updatedAt: string; en: ServiceLang; ar: ServiceLang };

const u = logisticsContentUpdatedAt;

const coverEn = 'Enquiries are welcome for shipments connected with Saudi Arabia, including Riyadh as a delivery or coordination point. Routes, partners and modes are confirmed in the quotation. Airzone does not state coverage beyond what is confirmed for your shipment.';
const coverAr = 'نرحب باستفسارات الشحنات المرتبطة بالمملكة العربية السعودية، بما في ذلك الرياض كنقطة تسليم أو تنسيق. تُؤكَّد المسارات والشركاء ووسائل النقل ضمن عرض السعر، ولا نذكر تغطية تتجاوز ما يُؤكَّد لشحنتك.';

export const logisticsContent: Record<string, ServiceContent> = {
  '/logistics/freight-forwarding': {
    updatedAt: u,
    en: {
      title: 'Freight forwarding for cargo to and from Saudi Arabia',
      intro: 'Freight forwarding coordinates a shipment from origin to destination across one or more modes. Tell us what is moving, where and when, and we confirm the route and partners in the quotation.',
      includes: ['Routing options by air, sea or road, coordinated directly or with third-party carriers', 'Booking and shipment coordination', 'Documentation support alongside customs steps', 'Status updates at key points'],
      customers: ['Companies shipping regularly or one-off cargo', 'Buyers working with overseas suppliers', 'Teams needing one point of contact for a multi-leg move'],
      process: [{ title: 'Define the move', text: 'Cargo type, dimensions, weight, origin, destination and target dates.' }, { title: 'Confirm route and mode', text: 'Options are reviewed and the mode and carriers are confirmed in the quotation.' }, { title: 'Book and document', text: 'Booking and shipping documents are prepared with you.' }, { title: 'Follow through', text: 'The shipment is followed to hand-over and you receive updates.' }],
      documents: ['Commercial invoice and packing list', 'Cargo dimensions and gross weight', 'Pickup and delivery addresses', 'Incoterms agreed with the supplier', 'Special handling notes'],
      coverage: coverEn,
      faqs: [{ question: 'Do you own the vehicles or aircraft?', answer: 'No. Cargo is coordinated directly or through third-party carriers, confirmed in the quotation.' }, { question: 'Can I track my shipment?', answer: 'Use the tracking page with your reference number where tracking is available for your shipment.' }, { question: 'What helps me get an accurate quote?', answer: 'Dimensions, weight, origin, destination, cargo description and required dates.' }],
      related: ['/logistics/air-freight', '/logistics/sea-freight', '/logistics/customs-clearance'], sources: [],
    },
    ar: {
      title: 'الشحن والتوريد للبضائع من المملكة العربية السعودية وإليها',
      intro: 'ينسّق الشحن والتوريد حركة الشحنة من المنشأ إلى الوجهة عبر وسيلة نقل أو أكثر. أخبرنا بما تنقله ومن أين وإلى أين ومتى، ونؤكد المسار والشركاء في عرض السعر.',
      includes: ['خيارات المسار جواً أو بحراً أو براً، تُنسَّق مباشرة أو عبر ناقلين من الأطراف الأخرى', 'الحجز وتنسيق الشحنة', 'دعم المستندات بالتوازي مع الخطوات الجمركية', 'تحديثات عند المراحل الرئيسية'],
      customers: ['الشركات التي تشحن بانتظام أو لمرة واحدة', 'المشترون الذين يتعاملون مع موردين في الخارج', 'الفرق التي تحتاج جهة اتصال واحدة لرحلة متعددة المراحل'],
      process: [{ title: 'حدد الشحنة', text: 'نوع البضاعة وأبعادها ووزنها والمنشأ والوجهة والمواعيد المستهدفة.' }, { title: 'تأكيد المسار والوسيلة', text: 'تُراجَع الخيارات وتُؤكَّد الوسيلة والناقلون في عرض السعر.' }, { title: 'الحجز والمستندات', text: 'يجري إعداد الحجز ومستندات الشحن معك.' }, { title: 'المتابعة', text: 'تُتابَع الشحنة حتى التسليم وتصلك التحديثات.' }],
      documents: ['الفاتورة التجارية وقائمة التعبئة', 'أبعاد البضاعة والوزن الإجمالي', 'عناوين الاستلام والتسليم', 'شروط الإنكوترمز المتفق عليها مع المورد', 'ملاحظات المناولة الخاصة'],
      coverage: coverAr,
      faqs: [{ question: 'هل تملكون المركبات أو الطائرات؟', answer: 'لا. تُنسَّق الشحنات مباشرة أو عبر ناقلين من الأطراف الأخرى، ويُؤكَّد ذلك في عرض السعر.' }, { question: 'هل يمكنني تتبع شحنتي؟', answer: 'استخدم صفحة التتبع مع رقمك المرجعي حيثما كان التتبع متاحاً لشحنتك.' }, { question: 'ما الذي يساعد على عرض سعر دقيق؟', answer: 'الأبعاد والوزن والمنشأ والوجهة ووصف البضاعة والمواعيد المطلوبة.' }],
      related: ['/logistics/air-freight', '/logistics/sea-freight', '/logistics/customs-clearance'], sources: [],
    },
  },
  '/logistics/import-export': {
    updatedAt: u,
    en: {
      title: 'Import and export support for Saudi businesses',
      intro: 'Import and export support brings documents, customs and freight together for one shipment. Share what you are buying or selling and where it moves, and the team outlines what needs confirming.',
      includes: ['Documentation review for imports and exports', 'Customs coordination', 'Freight coordination by air, sea or road', 'Guidance on information suppliers and buyers should provide'],
      customers: ['Saudi importers and exporters', 'Businesses starting to trade internationally', 'Companies coordinating several suppliers'],
      process: [{ title: 'Describe the trade', text: 'Goods, parties, origin, destination and Incoterms.' }, { title: 'Assess requirements', text: 'Documents and approvals are reviewed for the shipment.' }, { title: 'Quote and plan', text: 'Scope, freight and clearance steps are set out.' }, { title: 'Move and update', text: 'The shipment is coordinated with updates at key stages.' }],
      documents: ['Commercial invoice and packing list', 'Transport document', 'Certificate of origin, where relevant', 'Licences or approvals required for the goods', 'Supplier and consignee details'],
      coverage: coverEn,
      faqs: [{ question: 'Can you tell me the duty before I order?', answer: 'Duty depends on classification, value and origin. Send the product details and we can discuss what to confirm, without quoting a figure in advance.' }, { question: 'Do you support both imports and exports?', answer: 'Yes, enquiries for both are welcome; scope is confirmed per shipment.' }],
      related: ['/logistics/customs-clearance', '/logistics/freight-forwarding', '/logistics/sea-freight'], sources: [],
    },
    ar: {
      title: 'دعم الاستيراد والتصدير للأعمال السعودية',
      intro: 'يجمع دعم الاستيراد والتصدير المستندات والجمارك والشحن في شحنة واحدة. شاركنا ما تشتريه أو تبيعه ووجهته، ويحدد الفريق ما يلزم تأكيده.',
      includes: ['مراجعة مستندات الاستيراد والتصدير', 'تنسيق الجمارك', 'تنسيق الشحن جواً أو بحراً أو براً', 'إرشاد بشأن المعلومات التي ينبغي أن يقدمها الموردون والمشترون'],
      customers: ['المستوردون والمصدّرون السعوديون', 'الأعمال التي تبدأ التجارة الدولية', 'الشركات التي تنسق بين عدة موردين'],
      process: [{ title: 'صف الصفقة', text: 'البضائع والأطراف والمنشأ والوجهة وشروط الإنكوترمز.' }, { title: 'تقييم المتطلبات', text: 'تُراجَع المستندات والموافقات للشحنة.' }, { title: 'التسعير والتخطيط', text: 'يُوضَّح النطاق وخطوات الشحن والتخليص.' }, { title: 'النقل والتحديث', text: 'تُنسَّق الشحنة مع تحديثات في المراحل الرئيسية.' }],
      documents: ['الفاتورة التجارية وقائمة التعبئة', 'مستند النقل', 'شهادة المنشأ عند الحاجة', 'التراخيص أو الموافقات التي تتطلبها البضاعة', 'بيانات المورد والمستلم'],
      coverage: coverAr,
      faqs: [{ question: 'هل تخبرونني بالرسوم قبل الطلب؟', answer: 'تعتمد الرسوم على التصنيف والقيمة والمنشأ. أرسل بيانات المنتج ونناقش ما يلزم تأكيده دون ذكر رقم مسبقاً.' }, { question: 'هل تدعمون الاستيراد والتصدير معاً؟', answer: 'نعم، نرحب باستفسارات الاثنين، ويُؤكَّد النطاق لكل شحنة.' }],
      related: ['/logistics/customs-clearance', '/logistics/freight-forwarding', '/logistics/sea-freight'], sources: [],
    },
  },
};

// Core services (transport, Dayana, warehousing) are maintained in their own module.
Object.assign(logisticsContent, coreLogisticsContent);

export const logisticsContentRoutes = Object.keys(logisticsContent);
assertSamePaths('logisticsContentPaths (config/route-paths.ts)', logisticsContentPaths, logisticsContentRoutes);

// Primary government guidance; shipment-specific requirements still need confirmation.
for (const route of ['/logistics/import-export'] as const) {
  logisticsContent[route].en.sources.push({ title: 'ZATCA — Import instructions', url: 'https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx' });
  logisticsContent[route].ar.sources.push({ title: 'هيئة الزكاة والضريبة والجمارك — تعليمات الاستيراد', url: 'https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx' });
}
