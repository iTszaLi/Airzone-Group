/**
 * Public leadership statement. A neutral company message, not a verified quotation.
 * Set `name` and `approvedPortrait` ONLY after the person and image have been approved.
 */
export const leadership: {
  name: string | null;
  approvedPortrait: string | null;
  attribution: { en: string; ar: string };
  eyebrow: { en: string; ar: string };
  headline: { en: string; ar: string };
  message: { en: string; ar: string };
} = {
  name: null,
  approvedPortrait: null,
  attribution: { en: 'Airzone Group Leadership', ar: 'قيادة مجموعة إيرزون' },
  eyebrow: { en: 'A MESSAGE FROM OUR LEADERSHIP', ar: 'رسالة من قيادتنا' },
  headline: { en: 'Built on trust. Focused on what comes next.', ar: 'نبني على الثقة. ونتطلع إلى ما هو آتٍ.' },
  message: {
    en: "At Airzone Group, our aim is to make important journeys and business movements easier to navigate. Through our specialist Logistics and Travel & Tourism businesses, we focus on understanding each customer's needs, coordinating the details carefully and building relationships that last.",
    ar: 'في مجموعة إيرزون، نهدف إلى جعل الرحلات المهمة وحركة الأعمال أيسر وأوضح. ومن خلال أعمالنا المتخصصة في الخدمات اللوجستية والسفر والسياحة، نحرص على فهم احتياج كل عميل، وتنسيق التفاصيل بعناية، وبناء علاقات تدوم.',
  },
};
