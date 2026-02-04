import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ραντεβού | Alexandra Rizou Salon",
    description: "Κλείστε το ραντεβού σας online στο Alexandra Rizou Salon - Κομμωτήριο στο Χαλάνδρι",
}

export default function RantevouLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
