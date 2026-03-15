import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { useMouseTilt } from "@/hooks/useMouseTilt";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  overlay?: React.ReactNode;
}

export function ProductGallery({ images, alt, overlay }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentImage = images[selectedIndex] ?? images[0];
  const { ref: tiltRef, style: tiltStyle } = useMouseTilt({ maxTilt: 6 });

  const goPrev = () => setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const goNext = () => setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <>
      <div className="space-y-3">
        {/* Imagem principal */}
        <div
          ref={tiltRef}
          role="button"
          tabIndex={0}
          onClick={() => setIsFullscreen(true)}
          onKeyDown={(e) => e.key === "Enter" && setIsFullscreen(true)}
          className="relative w-full aspect-square glass-gold rounded-3xl overflow-hidden
            transition-all duration-500 hover:shadow-gold-md group cursor-zoom-in
            [transform-style:preserve-3d]"
          style={tiltStyle}
        >
          {overlay}
          <ProductImage
            src={currentImage}
            alt={alt}
            width={600}
            height={600}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200",
                  i === selectedIndex
                    ? "border-gold ring-2 ring-gold/30"
                    : "border-transparent hover:border-[var(--glass-border)]"
                )}
              >
                <ProductImage
                  src={src}
                  alt={`${alt} - foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 border-0 bg-black/95 overflow-hidden">
          <div className="relative aspect-square max-h-[90vh] flex items-center justify-center">
            <ProductImage
              src={currentImage}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                    glass flex items-center justify-center text-white hover:text-gold
                    transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                    glass flex items-center justify-center text-white hover:text-gold
                    transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        i === selectedIndex ? "bg-gold scale-125" : "bg-white/40 hover:bg-white/60"
                      )}
                      aria-label={`Ir para foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
