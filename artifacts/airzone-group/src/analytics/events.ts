export type FormType = 'logistics' | 'travel' | 'contact' | 'callback' | 'tracking';
export type Division = 'logistics' | 'travel' | 'group';
export const serviceCategories = ['customs-clearance', 'ata-carnet', 'exhibition-event-logistics', 'freight-forwarding', 'import-export', 'air-freight', 'sea-freight'] as const;
export function serviceCategory(value: string) {
  const key = value.toLowerCase().trim().replace(/&/g, '').replace(/\s+/g, '-');
  const aliases: Record<string, typeof serviceCategories[number]> = {
    'ata-carnet-assistance': 'ata-carnet', 'customs-clearance-support': 'customs-clearance',
    'exhibition-and-event-logistics': 'exhibition-event-logistics', 'exhibition-logistics': 'exhibition-event-logistics',
    'event-logistics': 'exhibition-event-logistics', 'import-and-export': 'import-export',
    'import-and-export-support': 'import-export', 'air-freight-coordination': 'air-freight', 'sea-freight-coordination': 'sea-freight',
  };
  return serviceCategories.find(s => s === key) || (Object.hasOwn(aliases, key) ? aliases[key] : 'general-logistics');
}
export function departmentDivision(value: string): Division {
  return ['Travel & Tourism', 'Corporate Travel'].includes(value) ? 'travel' : ['Logistics', 'Customs Clearance'].includes(value) ? 'logistics' : 'group';
}
export function leadEvents(type: Exclude<FormType, 'tracking'>, division: Division, category?: string) {
  const parameters = { form_type: type, business_division: division, ...(category ? { service_category: serviceCategory(category) } : {}) };
  return ['form_submit', 'generate_lead', ...(type === 'travel' ? ['travel_enquiry_submit'] : type === 'callback' ? ['callback_request_submit'] : [])].map(name => ({ name, parameters }));
}
