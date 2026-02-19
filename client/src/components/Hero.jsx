import CountdownTicker from './CountdownTicker';

export default function Hero({ onBookClick }) {
  return (
    <section id="hero" className="hero-with-image relative min-h-[100dvh] min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Hero background image – neon.jpg */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/neon.jpg)' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-holi-magenta/70 via-black/50 to-holi-green/60 pointer-events-none" />

      {/* Moving Holi vibes: watercolor blobs + sprinkles + flowers */}
      <div className="holi-vibes absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="holi-orb holi-orb--pink w-32 sm:w-48 md:w-64 top-[10%] left-[5%] sm:left-[10%]" />
        <div className="holi-orb holi-orb--blue w-24 sm:w-40 md:w-52 top-[60%] right-[8%] sm:right-[12%]" />
        <div className="holi-orb holi-orb--yellow w-28 sm:w-44 top-[25%] right-[15%] sm:right-[20%]" />
        <div className="holi-orb holi-orb--purple w-20 sm:w-36 bottom-[20%] left-[10%] sm:left-[15%]" />
        <div className="holi-orb holi-orb--green w-16 sm:w-28 bottom-[35%] right-[5%]" />
        <div className="holi-orb holi-orb--orange w-22 sm:w-32 top-[70%] left-[20%]" />
        {/* Watercolor sprinkles */}
        <div className="sprinkle sprinkle--1" />
        <div className="sprinkle sprinkle--2" />
        <div className="sprinkle sprinkle--3" />
        <div className="sprinkle sprinkle--4" />
        <div className="sprinkle sprinkle--5" />
        <div className="sprinkle sprinkle--6" />
        <div className="sprinkle sprinkle--7" />
        <div className="sprinkle sprinkle--8" />
        <div className="sprinkle sprinkle--9" />
        <div className="sprinkle sprinkle--10" />
        {/* Floating flowers */}
        <div className="holi-flower holi-flower--1">🌸</div>
        <div className="holi-flower holi-flower--2">🌺</div>
        <div className="holi-flower holi-flower--3">💮</div>
        <div className="holi-flower holi-flower--4">🪷</div>
        <div className="holi-flower holi-flower--5">🌼</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green drop-shadow-hero animate-fade-in-up"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          NEON HOLI
        </h1>
        <p
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2 sm:mt-3 tracking-widest drop-shadow-hero animate-fade-in-up"
          style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}
        >
          EVENT 2026 – BALLIA
        </p>
        <p
          className="text-base sm:text-lg md:text-xl text-holi-yellow font-semibold mt-4 sm:mt-5 drop-shadow-md animate-fade-in-up"
          style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Ballia&apos;s Biggest Neon Celebration
        </p>
        <p
          className="max-w-xl mx-auto text-sm sm:text-base text-white/95 mt-3 sm:mt-4 drop-shadow-md animate-fade-in-up"
          style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Music • Colors • Food • Neon vibes. One ticket, unlimited memories.
        </p>

        <CountdownTicker />

        <div
          className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base animate-fade-in-up"
          style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/90 text-gray-800 font-bold shadow-lg backdrop-blur-sm border border-white/50 hover:scale-105 transition-transform">
            Entry: <span className="text-holi-magenta">₹99</span>
          </span>
          <span className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/90 text-gray-800 font-bold shadow-lg backdrop-blur-sm border border-white/50 hover:scale-105 transition-transform">
            28th Feb 2026
          </span>
          <span className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/90 text-gray-800 font-bold shadow-lg backdrop-blur-sm border border-white/50 hover:scale-105 transition-transform">
            02:00 PM
          </span>
          <span className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/90 text-gray-800 font-bold shadow-lg backdrop-blur-sm border border-white/50 hover:scale-105 transition-transform">
            JMB Resort, Ballia
          </span>
        </div>

        <div
          className="mt-8 sm:mt-10 md:mt-12 animate-fade-in-up"
          style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <button
            onClick={onBookClick}
            className="btn-holi px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-bold rounded-2xl bg-gradient-to-r from-holi-magenta to-holi-green text-white shadow-xl neon-border touch-target min-h-[48px] sm:min-h-0"
          >
            Book Ticket Now
          </button>
        </div>
      </div>

      {/* Scroll hint on larger screens */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:block animate-pulse-soft">
        <span className="text-white/90 text-sm font-medium drop-shadow-md">Scroll to register</span>
        <div className="w-6 h-10 mx-auto mt-1 rounded-full border-2 border-white/70 flex justify-center pt-1">
          <span className="w-1 h-2 rounded-full bg-white/90 animate-bounce" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>
    </section>
  );
}
