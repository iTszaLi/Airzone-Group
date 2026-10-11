# Footer contact configuration

The public business contact details are centralized in
`artifacts/airzone-group/src/config/business-contacts.ts`. Edit this one file to
update approved division emails, phone links, office addresses, Maps links,
WhatsApp numbers and official social accounts. Footer components consume this
configuration rather than duplicating the details.

- Logistics and Travel must remain separate.
- Logistics phone, office address and Maps URL are deliberately unset until
  confirmed. Display only the country when there is no approved office address.
- The supplied Travel office is not a Logistics office.
- Do not derive WhatsApp availability from a telephone number. Configure a
  WhatsApp number only after the company confirms it.
- Empty social lists should produce no inactive icons.
- The configuration is public information, not a place for credentials.

This footer update does not modify the database or authentication system.
