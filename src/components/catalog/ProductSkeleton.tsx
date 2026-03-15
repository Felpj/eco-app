// Shimmer no tema dark premium
const shimmerClass = `
  relative overflow-hidden bg-[#111] rounded-xl
  before:absolute before:inset-0
  before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent
  before:animate-shimmer before:bg-[length:200%_100%]
`;

const ProductSkeleton = () => {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Image */}
      <div className={`aspect-square w-full ${shimmerClass}`} />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5">
        {/* Brand */}
        <div className={`h-2.5 w-16 rounded ${shimmerClass}`} />
        {/* Name */}
        <div className={`h-4 w-3/4 rounded ${shimmerClass}`} />
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded ${shimmerClass}`} />
          ))}
          <div className={`h-3 w-10 rounded ml-1 ${shimmerClass}`} />
        </div>
        {/* Chip */}
        <div className={`h-6 w-32 rounded-lg ${shimmerClass}`} />
        {/* Price */}
        <div className={`h-6 w-20 rounded ${shimmerClass}`} />
        <div className={`h-2.5 w-24 rounded ${shimmerClass}`} />
        {/* Buttons */}
        <div className="pt-1 flex flex-col gap-2">
          <div className={`h-10 w-full rounded-xl ${shimmerClass}`} />
          <div className="flex gap-2">
            <div className={`h-9 flex-1 rounded-xl ${shimmerClass}`} />
            <div className={`h-9 w-9 rounded-xl ${shimmerClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
