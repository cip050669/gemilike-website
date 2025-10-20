export function GemButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="rounded-xl px-5 py-3 font-bold text-[#001B1E]
                 bg-gem-gradient hover:brightness-105 active:brightness-95
                 transition-all duration-150 shadow-lg"
    >
      {children}
    </button>
  );
}
