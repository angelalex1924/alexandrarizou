export type HolidayType = 'christmas' | 'newyear' | 'easter' | 'other' | 'summer';

export const HOLIDAY_ROUTE_MAP: Record<HolidayType, `/${string}`> = {
  christmas: '/christmas-hours',
  newyear: '/newyear-hours',
  easter: '/easter-hours',
  other: '/special-hours',
  summer: '/summer-hours',
};

export const HOLIDAY_SLUGS = Object.values(HOLIDAY_ROUTE_MAP);

export const HOLIDAY_ENGLISH_SLUGS = HOLIDAY_SLUGS.map((slug) => `/en${slug}`);

export function getHolidayPathByType(type: HolidayType | string | undefined, locale: 'el' | 'en' = 'el') {
  const basePath = HOLIDAY_ROUTE_MAP[(type as HolidayType) ?? 'other'] ?? HOLIDAY_ROUTE_MAP.other;
  if (locale === 'en') {
    return `/en${basePath}`;
  }
  return basePath;
}


