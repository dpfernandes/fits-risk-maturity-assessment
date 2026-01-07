export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#14213D]">
      <div className="relative z-10 px-4 py-20 md:py-28 text-center font-grotesk">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
          FITS - Risk Maturity Assessment
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Evaluate the maturity of your risk management framework and receive personalized insights
        </p>
      </div>
    </section>
  );
}
