import type { Metadata } from "next";
import { HolidayHoursPage } from "@/components/HolidayHoursPage";

export const metadata: Metadata = {
  title: "Θερινό Ωράριο | Alexandra Rizou",
  description: "Δείτε τις καλοκαιρινές ώρες λειτουργίας και τις περιόδους διακοπών του σαλόνιου.",
};

export default function SummerHoursPage() {
  return <HolidayHoursPage expectedType="summer" />;
}


