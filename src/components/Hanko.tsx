/** Shu seal carved with 円 (circle) — stamps in on load, turns over on hover. */
export function Hanko() {
  return (
    <span aria-hidden className="scene inline-block">
      <span className="animate-stamp preserve-3d inline-block" style={{ animationDelay: "200ms" }}>
        <span className="hanko preserve-3d flex h-8 w-8 items-center justify-center rounded-[3px] border-2 border-shu font-serif text-lg font-bold leading-none text-shu">
          円
        </span>
      </span>
    </span>
  );
}
