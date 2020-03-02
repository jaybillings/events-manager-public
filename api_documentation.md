# API Endpoints

## /selectEventsByID

### Query Parameters
| Name | Type | Required? |
| --- | --- | --- |
| eventIDs | Array<int> | Y |

### Returns

Response envelope containing data from all specified events, as well as their linked schema.

Does not error if a given ID does not exist.

## /selectEventsLive

### Query Parameters

| Name | Type | Required? |
| --- | --- | --- |
| lastUpdated | String (date formatted) | N |

### Returns

Live events that have been updated since a given `lastUpdated` date (or all live events if no date given).

**Pagination is enforced.**

## /selectEventsDropped
| Name | Type | Required? |
| --- | --- | --- |
| lastUpdated | String (date formatted) | N |

An array of UUIDs for events that have been dropped since a given `lastUpdated` date.

# Other Endpoints

## /importer

## /exporter
