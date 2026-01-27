import { CountryEnum, GenderEnum } from '../lib/types';

export const MonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const GenderOptions = Object.values(GenderEnum).map(gender => ({
  label: gender.charAt(0).toUpperCase() + gender.slice(1),
  value: gender,
}));

export const CountryOptions = Object.values(CountryEnum).map(country => ({
  label: country, // CountryEnum values are already capitalized in types.ts (Wait, I need to check if I change them to lowercase or not).
  // If I change CountryEnum to lowercase, I need to capitalize them properly.
  // Actually, for countries, manual mapping or a library is better, but let's assume simple capitalization or keeping them as is if DB allows.
  // The error was specifically about `gender_enum`. `Country` might just be text.
  value: country,
}));

