import type { Metadata } from "next";
import { HolidayHoursPage } from "@/components/HolidayHoursPage";

export const metadata: Metadata = {
  title: "Πασχαλινό Ωράριο | Alexandra Rizou",
  description: "Δείτε τις πασχαλινές ώρες λειτουργίας και τις ημέρες εξυπηρέτησης του σαλόνιου.",
};

export default function EasterHoursPage() {
  return <HolidayHoursPage expectedType="easter" />;
}


