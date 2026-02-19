const items = [
  { label: 'Live DJ', icon: '🎧', color: 'from-holi-magenta to-holi-pink' },
  { label: 'Food Stalls', icon: '🍜', color: 'from-holi-orange to-holi-yellow' },
  { label: 'Neon Bands', icon: '🎸', color: 'from-holi-blue to-holi-magenta' },
  { label: 'Selfie Zone', icon: '📸', color: 'from-holi-blue to-holi-green' },
  { label: 'Welcome Drink', icon: '🥤', color: 'from-holi-green to-holi-blue' },
  { label: 'VIP & Public Zones', icon: '✨', color: 'from-holi-pink to-holi-magenta' },
];

export default function Highlights() {
  return (
    <section id="highlights" className="section-holi-alt relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green mb-3 sm:mb-4">
          Event Highlights
        </h2>
        <p className="text-center text-gray-700 text-sm sm:text-base max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
          From live music and neon bands to food stalls and a dedicated selfie zone — everything you need for a perfect Holi evening.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`card-holi flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-90 text-white shadow-lg border-2 border-white/30 opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${0.1 + i * 0.08}s`, animationFillMode: 'forwards' }}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 drop-shadow-md transform transition-transform duration-300 hover:scale-110">
                {item.icon}
              </span>
              <span className="font-bold text-sm sm:text-base md:text-lg text-center drop-shadow-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
