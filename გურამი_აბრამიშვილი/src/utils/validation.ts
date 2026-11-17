import type { ProfileForm } from "@/types/user";
import { isValidExpiry, isValidLuhn } from "./luhn";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s-]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

// 9-15 digits; a leading "+" and spaces/dashes are allowed.
export function isValidPhone(value: string): boolean {
  const v = value.trim();
  if (!PHONE_CHARS_RE.test(v)) return false;
  const digits = v.replace(/\D/g, "").length;
  return digits >= 9 && digits <= 15;
}

// ---------- Checkout ----------
export interface CheckoutFormValues extends Record<string, string> {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string; // "MM/YY"
  cardCvc: string;
}

export function validateCheckout(v: CheckoutFormValues): FieldErrors<CheckoutFormValues> {
  const errors: FieldErrors<CheckoutFormValues> = {};
  if (v.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters";
  if (!isValidEmail(v.email)) errors.email = "Please enter a valid email address";
  if (v.address.trim().length < 5) errors.address = "Address must be at least 5 characters";
  if (v.city.trim() === "") errors.city = "City is required";
  // Optional (FULL) delivery details: validated only when filled in.
  if (v.phone.trim() !== "" && !isValidPhone(v.phone)) errors.phone = "Please enter a valid phone number";
  if (v.postalCode.trim() !== "" && !/^\d{4,10}$/.test(v.postalCode.trim())) {
    errors.postalCode = "Postal code must be 4-10 digits";
  }
  if (v.country.trim() === "") errors.country = "Please select a country";

  // Payment card: length first, then the Luhn checksum catches typos (one wrong or two swapped digits).
  const card = v.cardNumber.replace(/[\s-]/g, "");
  if (card === "") errors.cardNumber = "Card number is required";
  else if (!/^\d{13,19}$/.test(card)) errors.cardNumber = "Card number must be 13-19 digits";
  else if (!isValidLuhn(card)) errors.cardNumber = "Card number is invalid, please check the digits";
  if (v.cardExpiry.trim() === "") errors.cardExpiry = "Expiry date is required";
  else if (!isValidExpiry(v.cardExpiry)) errors.cardExpiry = "Enter a valid future date as MM/YY";
  if (!/^\d{3,4}$/.test(v.cardCvc.trim())) errors.cardCvc = "CVC must be 3 or 4 digits";
  return errors;
}

// ---------- Profile ----------
export interface ProfileFormValues extends Record<string, string>, ProfileForm {}

export function validateProfile(v: ProfileFormValues): FieldErrors<ProfileFormValues> {
  const errors: FieldErrors<ProfileFormValues> = {};
  if (v.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (v.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
  if (!isValidEmail(v.email)) errors.email = "Please enter a valid email address";
  if (v.phone.trim() !== "" && !isValidPhone(v.phone)) errors.phone = "Please enter a valid phone number";
  return errors;
}

// ---------- Review ----------
export interface ReviewFormValues extends Record<string, string> {
  rating: string; // "" until a star is picked, then "1".."5"
  comment: string;
}

export function validateReview(v: ReviewFormValues): FieldErrors<ReviewFormValues> {
  const errors: FieldErrors<ReviewFormValues> = {};
  const rating = Number(v.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Please select a rating";
  if (v.comment.trim().length < 10) errors.comment = "Comment must be at least 10 characters";
  return errors;
}
