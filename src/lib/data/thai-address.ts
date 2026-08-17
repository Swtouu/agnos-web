import data from "@riz007/thai-address-data/data.json";

export interface ThaiAddressRow {
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
}

export const THAI_ADDRESS_DATA = data as ThaiAddressRow[];
