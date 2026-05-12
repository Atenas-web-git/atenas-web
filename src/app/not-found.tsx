import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { NotFoundContent } from "./not-found-content";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundContent />
      <FooterCTA />
    </>
  );
}
