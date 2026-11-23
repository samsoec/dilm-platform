export const PROVINCES = [
  { code: "ID-AC", name: "Aceh" },
  { code: "ID-SU", name: "Sumatera Utara" },
  { code: "ID-SB", name: "Sumatera Barat" },
  { code: "ID-RI", name: "Riau" },
  { code: "ID-KR", name: "Kepulauan Riau" },
  { code: "ID-JA", name: "Jambi" },
  { code: "ID-SS", name: "Sumatera Selatan" },
  { code: "ID-BB", name: "Kepulauan Bangka Belitung" },
  { code: "ID-BE", name: "Bengkulu" },
  { code: "ID-LA", name: "Lampung" },
  { code: "ID-JK", name: "DKI Jakarta" },
  { code: "ID-JB", name: "Jawa Barat" },
  { code: "ID-BT", name: "Banten" },
  { code: "ID-JT", name: "Jawa Tengah" },
  { code: "ID-YO", name: "DI Yogyakarta" },
  { code: "ID-JI", name: "Jawa Timur" },
  { code: "ID-BA", name: "Bali" },
  { code: "ID-NB", name: "Nusa Tenggara Barat" },
  { code: "ID-NT", name: "Nusa Tenggara Timur" },
  { code: "ID-KB", name: "Kalimantan Barat" },
  { code: "ID-KT", name: "Kalimantan Tengah" },
  { code: "ID-KS", name: "Kalimantan Selatan" },
  { code: "ID-KI", name: "Kalimantan Timur" },
  { code: "ID-KU", name: "Kalimantan Utara" },
  { code: "ID-SA", name: "Sulawesi Utara" },
  { code: "ID-GO", name: "Gorontalo" },
  { code: "ID-ST", name: "Sulawesi Tengah" },
  { code: "ID-SR", name: "Sulawesi Barat" },
  { code: "ID-SN", name: "Sulawesi Selatan" },
  { code: "ID-SG", name: "Sulawesi Tenggara" },
  { code: "ID-MA", name: "Maluku" },
  { code: "ID-MU", name: "Maluku Utara" },
  { code: "ID-PB", name: "Papua Barat" },
  { code: "ID-PD", name: "Papua Barat Daya" },
  { code: "ID-PA", name: "Papua" },
  { code: "ID-PT", name: "Papua Tengah" },
  { code: "ID-PE", name: "Papua Pegunungan" },
  { code: "ID-PS", name: "Papua Selatan" },
] as const;

export type ProvinceCode = (typeof PROVINCES)[number]["code"];

export const PROVINCE_CODES = PROVINCES.map((p) => p.code);

export const MAP_CARD_POSITIONS = ["left", "right", "bottom"] as const;

export type MapCardPosition = (typeof MAP_CARD_POSITIONS)[number];

export const MAX_MAP_CARD_BADGES = 10;
