export default function AboutEvent() {
  return (
    <section id="about" className="section-holi relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green mb-6">
          Celebrate the Festival of Colors
        </h2>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
          Join us for <strong className="text-holi-magenta">Neon Holi Event 2026</strong> at JMB Resort, Ballia — a one-of-a-kind neon-themed celebration that brings together music, food, and the spirit of Holi under one roof. Whether you&apos;re here for the live DJ, the neon bands, or the vibrant atmosphere, this is Ballia&apos;s biggest neon celebration you won&apos;t want to miss.
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          Secure your entry for just <strong className="text-holi-magenta">₹99</strong>. Your ticket includes a welcome drink and access to all zones. Come with friends, capture moments at our selfie zone, and enjoy a safe, organised event with dedicated VIP and public areas.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-holi-green" />
            Safe & organised
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-holi-blue" />
            E-ticket on payment
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-holi-orange" />
            Food & drinks available
          </span>
        </div>
      </div>
    </section>
  );
}
