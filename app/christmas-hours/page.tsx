import type { Metadata } from "next";
import { HolidayHoursPage } from "@/components/HolidayHoursPage";

export const metadata: Metadata = {
  title: "Χριστουγεννιάτικο Ωράριο | Alexandra Rizou",
  description: "Δείτε αναλυτικά το εορταστικό χριστουγεννιάτικο ωράριο του σαλόνιου Alexandra Rizou.",
};

export default function ChristmasHoursPage() {
  return <HolidayHoursPage expectedType="christmas" />;
}


