"use client";

import { useEffect, useMemo } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024; 

function Thumb({
  src,
  label,
  cover,
  onRemove,
}: {
  src: string;
  label: string;
  cover: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border bg-secondary">
      
      <img src={src} alt={label} className="h-full w-full object-cover" />
      {cover && (
        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          Cover
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface ImagePickerProps {
  existing: string[]; 
  onExistingChange: (urls: string[]) => void;
  files: File[]; 
  onFilesChange: (files: File[]) => void;
}

export function ImagePicker({
  existing,
  onExistingChange,
  files,
  onFilesChange,
}: ImagePickerProps) {
  
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews]
  );

  const total = existing.length + files.length;

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; 

    const valid: File[] = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }
      valid.push(file);
    }

    const room = Math.max(MAX_IMAGES - total, 0);
    if (valid.length > room) {
      toast.error(`You can add up to ${MAX_IMAGES} images`);
    }
    onFilesChange([...files, ...valid.slice(0, room)]);
  }

  return (
    <div className="space-y-2">
      <Label>
        Service images ({total}/{MAX_IMAGES})
      </Label>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {existing.map((src, i) => (
          <Thumb
            key={`e-${src}-${i}`}
            src={src}
            label={`Image ${i + 1}`}
            cover={i === 0}
            onRemove={() => onExistingChange(existing.filter((_, n) => n !== i))}
          />
        ))}

        {previews.map((src, i) => (
          <Thumb
            key={`n-${src}`}
            src={src}
            label={`New image ${i + 1}`}
            cover={existing.length === 0 && i === 0}
            onRemove={() => onFilesChange(files.filter((_, n) => n !== i))}
          />
        ))}

        {total < MAX_IMAGES && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground transition hover:border-primary hover:text-primary focus-within:ring-2 focus-within:ring-ring">
            <ImagePlus className="h-6 w-6" />
            Add
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePick}
              className="sr-only"
            />
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        The first image is used as the cover. JPG or PNG, up to 5MB each.
      </p>
    </div>
  );
}