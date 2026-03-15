import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  rating: number;
  reviewsCount: number;
}

// Mock reviews — substituir por API quando disponível
const MOCK_REVIEWS = [
  { name: "Maria S.", city: "São Paulo, SP", rating: 5, text: "Perfume incrível! A fixação é excelente e o cheiro é exatamente o que eu esperava. Superou minhas expectativas.", date: "Há 2 semanas" },
  { name: "Carlos R.", city: "Rio de Janeiro, RJ", rating: 5, text: "Melhor custo-benefício que já comprei. A entrega foi rápida e o produto veio bem embalado.", date: "Há 1 mês" },
  { name: "Ana P.", city: "Belo Horizonte, MG", rating: 4, text: "Muito bom! O cheiro é sofisticado. Só não dou 5 porque demorou um pouco para chegar.", date: "Há 3 semanas" },
];

// Breakdown: % por estrela (mock baseado no rating)
function getStarBreakdown(rating: number): number[] {
  const r = Math.floor(rating);
  const remainder = rating - r;
  const breakdown = [0, 0, 0, 0, 0];
  for (let i = 0; i < r; i++) breakdown[i] = 100;
  if (remainder > 0 && r < 5) breakdown[r] = Math.round(remainder * 100);
  return breakdown.reverse(); // 5★, 4★, 3★, 2★, 1★
}

export function ProductReviews({ rating, reviewsCount }: ProductReviewsProps) {
  const breakdown = getStarBreakdown(rating);

  return (
    <section className="mt-16 pt-12 border-t border-[var(--glass-border)]">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Avaliações
      </h2>

      {/* Summary + breakdown */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display text-4xl font-bold text-foreground">
              {rating.toFixed(1)}
            </span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < Math.floor(rating) ? "fill-gold text-gold" : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-muted-foreground font-body text-sm">
              {reviewsCount} avaliações
            </span>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars, i) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-xs font-body text-muted-foreground w-6">
                  {stars}★
                </span>
                <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${breakdown[i]}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-gold-muted to-gold rounded-full"
                  />
                </div>
                <span className="text-xs font-body text-muted-foreground w-10">
                  {breakdown[i]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {MOCK_REVIEWS.map((review, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <span className="text-gold font-body font-bold text-sm">
                  {review.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body font-semibold text-foreground">
                    {review.name}
                  </span>
                  <span className="text-muted-foreground text-xs font-body">
                    {review.city} · {review.date}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "w-3.5 h-3.5",
                        j < review.rating ? "fill-gold text-gold" : "text-muted-foreground/20"
                      )}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed text-editorial">
                  {review.text}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
