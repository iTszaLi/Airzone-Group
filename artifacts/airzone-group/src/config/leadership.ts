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
    en: "At Airzone Group, our aim is to make business cargo movements and important journeys easier to plan and manage. Through Airzone Logistics Services Est and Airzone Travel & Tourism, we focus on understanding each customer's requirement, coordinating customs, transport, storage and travel details carefully, and building relationships founded on clear communication and realistic commitments.",
    ar: 'في مجموعة إيرزون، نهدف إلى جعل حركة البضائع التجارية والرحلات المهمة أيسر في التخطيط والإدارة. ومن خلال مؤسسة إيرزون للخدمات اللوجستية وإيرزون للسفر والسياحة، نحرص على فهم احتياج كل عميل، وتنسيق تفاصيل الجمارك والنقل والتخزين والسفر بعناية، وبناء علاقات قائمة على التواصل الواضح والالتزامات الواقعية.',
  },
};
