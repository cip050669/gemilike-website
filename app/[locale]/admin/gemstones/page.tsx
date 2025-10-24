import { GemstoneManagementSection } from '@/components/admin/GemstoneManagementSection';

export default function GemstonesManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <GemstoneManagementSection />
      </div>
    </div>
  );
}
