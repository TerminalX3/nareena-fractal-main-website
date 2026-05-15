import { ScrollReadingProgress } from "@/components/scroll-reading-progress";

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollReadingProgress />
      {children}
    </>
  );
}
