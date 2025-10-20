import GemILikeLogo from "@/components/GemILikeLogo";
import { GemButton } from "@/components/GemButton";

export default function Page() {
  return (
    <main className="min-h-dvh grid place-items-center bg-black p-12">
      <div className="space-y-10 text-center">
        <GemILikeLogo animated size={112} tagline="Fine Gems • Light • Precision" />
        <GemILikeLogo size={88} firstIColor="#FF7B7B" />
        <div className="flex items-center justify-center gap-4">
          <GemButton>Explore</GemButton>
          <GemButton>Buy now</GemButton>
        </div>
      </div>
    </main>
  );
}
