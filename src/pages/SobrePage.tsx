import { motion } from "framer-motion";
import CTASection from "@/components/CTASection";

const SobrePage = () => {
  return (
    <div className="min-h-screen bg-background">

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-20 bg-gradient-dark">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Nossa <span className="text-gradient-gold">História</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">
                Nascemos da paixão por perfumaria e da missão de democratizar o acesso 
                às melhores fragrâncias do mundo. Acreditamos que todos merecem 
                experimentar o luxo sem pagar fortunas por isso.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                  Qualidade que você <span className="text-gradient-gold">sente</span>
                </h2>
                <div className="space-y-4 text-foreground/80 font-body leading-relaxed">
                  <p>
                    Nossos perfumes são desenvolvidos por perfumistas experientes, 
                    utilizando matérias-primas de alta qualidade importadas diretamente 
                    do Oriente Médio.
                  </p>
                  <p>
                    Cada fragrância passa por um rigoroso processo de desenvolvimento 
                    para garantir a máxima similaridade olfativa com os originais, 
                    mantendo fixação e projeção excepcionais.
                  </p>
                  <p>
                    Não vendemos cópias baratas. Oferecemos alternativas premium 
                    que honram a arte da perfumaria árabe tradicional.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: "15k+", label: "Clientes Satisfeitos" },
                    { value: "4.9", label: "Avaliação Média" },
                    { value: "98%", label: "Taxa de Satisfação" },
                    { value: "50+", label: "Fragrâncias" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-display text-3xl font-bold text-gradient-gold mb-2">
                        {stat.value}
                      </p>
                      <p className="text-muted-foreground text-sm font-body">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold text-foreground text-center mb-12"
            >
              Nossos <span className="text-gradient-gold">Valores</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Transparência",
                  description: "Somos honestos sobre nossas inspirações. Você sabe exatamente o que está comprando.",
                },
                {
                  title: "Qualidade",
                  description: "Não economizamos em matérias-primas. Cada frasco representa nosso compromisso com a excelência.",
                },
                {
                  title: "Acessibilidade",
                  description: "Luxo não precisa custar uma fortuna. Oferecemos o melhor pelo preço justo.",
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-2xl p-6 border border-border text-center"
                >
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>

    </div>
  );
};

export default SobrePage;
