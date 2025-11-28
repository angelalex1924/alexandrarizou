import type { Metadata } from "next";
import { HolidayHoursPage } from "@/components/HolidayHoursPage";

export const metadata: Metadata = {
  title: "Ειδικό Ωράριο | Alexandra Rizou",
  description: "Προσωρινό πρόγραμμα λειτουργίας για έκτακτες περιόδους στο Alexandra Rizou.",
};

export default function SpecialHoursPage() {
  return <HolidayHoursPage expectedType="other" />;
}


