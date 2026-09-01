// VehicleBanner.jsx
import React from "react";

/*  -------------------------------------------------
    You only need to replace the `bg-[url(...)]` value
    with an image that matches your brand (e.g. a car,
    a registration desk, or a road‑scene). The image is
    lazy‑loaded by the browser and dark‑overlay keeps
    text readable.
    ------------------------------------------------- */
const VehicleBanner = () => {
  return (
    <section className="relative flex h-[28rem] w-full items-center justify-center overflow-hidden bg-gray-900 md:h-[36rem]">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1600&q=80"
        alt="Car registration desk"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay so text stands out */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4 text-center text-white md:px-0">
        <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
       Register and renew all your vehicle documents
        </h1>

        <p className="mb-8 text-base md:text-lg">
          Fast, secure, and fully digital. No more long queues—just a few clicks
          and you’re ready to hit the road.
        </p>

        <a
          href="https://edrivers.ng/login"
          className="inline-block rounded-full bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          Register Now
        </a>
      </div>
    </section>
  );
};

export default VehicleBanner;