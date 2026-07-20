// src/components/ServiceCategoriesGrid.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Paintbrush, Hammer, ThermometerSun, ChevronLeft, ChevronRight } from 'lucide-react';

const SERVICE_CATEGORIES = [
  {
    slug: 'mechanic',
    title: 'Mechanic',
    icon: Wrench,
    description: 'Engine repair, diagnostics, general service',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    slug: 'painting',
    title: 'Car Painting',
    icon: Paintbrush,
    description: 'Full repaint, touch-ups, color change',
    gradient: 'from-red-500 to-rose-600',
  },
  // {
  //   slug: 'panel-beater',
  //   title: 'Panel Beater',
  //   icon: Hammer,
  //   description: 'Dent removal, body straightening, accident repair',
  //   gradient: 'from-amber-500 to-orange-600',
  // },
  {
    slug: 'ac-repair',
    title: 'AC Repair',
    icon: ThermometerSun,
    description: 'Air conditioning fix, gas refill, cooling issues',
    gradient: 'from-cyan-500 to-teal-600',
  },
];

const ServiceCategoriesGrid = () => {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollerRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scrollByAmount = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-card]')?.offsetWidth || 300;
    el.scrollBy({ left: direction * (cardWidth + 20), behavior: 'smooth' });
  };

  const handleCategoryClick = (slug) => {
    // Navigate to external site using the env variable
    const externalBase = import.meta.env.VITE_ECARS;
    if (!externalBase) {
      console.error('VITE_ECARS is not defined in .env');
      return;
    }

    // window.location.href = `${externalBase}/service-providers`;
    window.location.href = `${externalBase}/providers/category/${slug}`;
    // Alternative: if you want to open in new tab:
    // window.open(`${externalBase}/providers/category/${slug}`, '_blank');
  };

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Find Auto Service Providers
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Click a category to see verified professionals on our partner platform
          </p>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll categories left"
            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 hover:border-indigo-400 text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll categories right"
            className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 hover:border-indigo-400 text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Horizontal scrollable cards */}
          <div
            ref={scrollerRef}
            className="flex overflow-x-auto gap-5 pb-6 snap-x snap-mandatory scrollbar-hide"
          >
            {SERVICE_CATEGORIES.map((service) => (
              <div
                key={service.slug}
                data-card
                onClick={() => handleCategoryClick(service.slug)}
                className="min-w-[260px] sm:min-w-[300px] flex-shrink-0 snap-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>

                <div className="p-6 md:p-8 flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <service.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    {service.description}
                  </p>

                  <div className="mt-6 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    View Providers →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hint for mobile */}
        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400 md:hidden">
          ← Scroll horizontally to see all categories →
        </p>
      </div>
    </div>
  );
};


export default ServiceCategoriesGrid;