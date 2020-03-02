const UUID_COUNT= 36;
const SHORT_COUNT = 50;
const MED_COUNT = 255;
const LONG_COUNT = 500;
const XLONG_COUNT = 1500;

const defaultEventSchema = {
  uuid: {type: 'string', maxLength: UUID_COUNT},
  name: {type: 'string', maxLength: MED_COUNT, transform: ['trim']},
  start_date: {type: 'number'}, // UTC
  end_date: {type: 'number'}, // UTC
  venue_uuid: {type: 'string', maxLength: UUID_COUNT},
  org_uuid: {type: 'string', maxLength: UUID_COUNT},
  description: {type: ['string', 'null'], maxLength: XLONG_COUNT, transform: ['trim']},
  email: {type: ['string', 'null'], format: 'email', maxLength: SHORT_COUNT, transform: ['trim']},
  url: {type: ['string', 'null'], maxLength: LONG_COUNT, transform: ['trim']},
  phone: {type: ['string', 'null'], maxLength: SHORT_COUNT, transform: ['trim']},
  hours: {type: ['string', 'null'], maxLength: MED_COUNT, transform: ['trim']},
  ticket_url: {type: ['string', 'null'], maxLength: MED_COUNT, transform: ['trim']},
  ticket_phone: {type: ['string', 'null'], maxLength: SHORT_COUNT, transform: ['trim']},
  ticket_prices: {type: ['string', 'null'], maxLength: MED_COUNT, transform: ['trim']},
  flag_ongoing: {type: ['boolean', 'number']}
};

const eventSchema = Object.assign({venue_uuid: {type: 'string', maxLength: UUID_COUNT}, org_uuid: {type: 'string', maxLength: UUID_COUNT}}, defaultEventSchema);
const pendingEventSchema = Object.assign({venue_uuid: {type: ['string', 'null'], maxLength: UUID_COUNT}, org_uuid: {type: ['string', 'null'], maxLength: UUID_COUNT}}, defaultEventSchema);

const defaultVenueSchema = {
  uuid: {type: 'string', maxLength: UUID_COUNT},
  name: {type: 'string', maxLength: MED_COUNT, transform: ['trim']},
  hood_uuid: {type: 'string', maxLength: UUID_COUNT},
  description: {type: ['string', 'null'], maxLength: XLONG_COUNT, transform: ['trim']},
  email: {type: ['string', 'null'], format: 'email', maxLength: SHORT_COUNT, transform: ['trim']},
  url: {type: ['string', 'null'], maxLength: LONG_COUNT, transform: ['trim']},
  phone: {type: ['string', 'null'], maxLength: SHORT_COUNT, transform: ['trim']},
  address_street: {type: ['string', 'null'], maxLength: MED_COUNT, transform: ['trim']},
  address_city: {type: ['string', 'null'], maxLength: MED_COUNT, transform: ['trim']},
  address_state: {type: ['string', 'null'], maxLength: SHORT_COUNT, transform: ['trim']},
  address_zip: {
    type: ['string', 'number', 'null'],
    minimum: 5,
    maximum: 10,
    transform: ['trim']
  }
};

const venueSchema = Object.assign({hood_uuid: {type: 'string', maxLength: UUID_COUNT}}, defaultVenueSchema);
const pendingVenueSchema = Object.assign({hood_uuid: {type: ['string', 'null'], maxLength: UUID_COUNT}}, defaultVenueSchema);

const defaultOrganizerSchema = {
  uuid: {type: 'string', maxLength: UUID_COUNT},
  name: {type: 'string', maxLength: MED_COUNT, transform: ['trim']},
  description: {type: ['string', 'null'], maxLength: XLONG_COUNT, transform: ['trim']},
  url: {type: ['string', 'null'], maxLength: LONG_COUNT, transform: ['trim']},
  phone: {type: ['string', 'null'], maxLength: SHORT_COUNT, transform: ['trim']}
};

const defaultNeighborhoodSchema = {
  uuid: {type: 'string', maxLength: UUID_COUNT},
  name: {type: 'string', maxLength: MED_COUNT, transform: ['trim']}
};

const defaultTagSchema = {
  uuid: {type: 'string', maxLength: UUID_COUNT},
  name: {type: 'string', maxLength: MED_COUNT, transform: ['trim']}
};

module.exports = {
  'events': {properties: eventSchema},
  'venues': {properties: venueSchema},
  'organizers': {properties: defaultOrganizerSchema},
  'neighborhoods': {properties: defaultNeighborhoodSchema},
  'tags': {properties: defaultTagSchema},
  'pending-events': {properties: pendingEventSchema},
  'pending-venues': {properties: pendingVenueSchema},
  'pending-organizers': {properties: defaultOrganizerSchema},
  'pending-neighborhoods': {properties: defaultNeighborhoodSchema},
  'pending-tags': {properties: defaultTagSchema}
};
