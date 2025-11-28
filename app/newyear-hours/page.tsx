import type { Metadata } from "next";
import { HolidayHoursPage } from "@/components/HolidayHoursPage";

export const metadata: Metadata = {
  title: "Πρωτοχρονιάτικο Ωράριο | Alexandra Rizou",
  description: "Ειδικό ωράριο λειτουργίας για την περίοδο της Πρωτοχρονιάς στο Alexandra Rizou.",
};

export default function NewYearHoursPage() {
  return <HolidayHoursPage expectedType="newyear" />;
}


