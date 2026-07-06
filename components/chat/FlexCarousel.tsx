import type { ReactNode } from 'react';

/**
 * Horizontal flex-message carousel (LINE Messaging API style).
 * Cards intentionally scroll off-screen — that constraint is part of the
 * Q03 demo (side-by-side comparison does not fit a chat surface).
 */
export default function FlexCarousel({ children }: { children: ReactNode }) {
  return (
    <div className="slim-scroll flex snap-x gap-2 overflow-x-auto pb-1 pr-3">
      {children}
    </div>
  );
}
