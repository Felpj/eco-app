import { PLACEHOLDER } from "@/data/productImages";
import { cn } from "@/lib/utils";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt, className, ...props }: ProductImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      onError={(e) => {
        e.currentTarget.src = PLACEHOLDER;
      }}
      {...props}
    />
  );
}
