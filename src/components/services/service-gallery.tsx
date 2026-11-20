"use client";

import { useState } from "react";
import Image from "next/image";

export function ServiceGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return <div className="aspect-[4/3] rounded-xl bg-secondary" />;
  }

  return (
    <div className="space-y-3">
      {/* বড় ছবি */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
        <Image
          key={active}
          src={images[active]}
          alt={`${alt} - image ${active + 1}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                i === active
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}