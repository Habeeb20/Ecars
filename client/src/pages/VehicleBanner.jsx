// // VehicleBanner.jsx
// import React from "react";

// /*  -------------------------------------------------
//     You only need to replace the `bg-[url(...)]` value
//     with an image that matches your brand (e.g. a car,
//     a registration desk, or a road‑scene). The image is
//     lazy‑loaded by the browser and dark‑overlay keeps
//     text readable.
//     ------------------------------------------------- */
// const VehicleBanner = () => {
//   return (
//     <section className="relative flex h-[28rem] w-full items-center justify-center overflow-hidden bg-gray-900 md:h-[36rem]">
//       {/* Background image */}
//       <img
//         src="https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1600&q=80"
//         alt="Car registration desk"
//         className="absolute inset-0 h-full w-full object-cover"
//       />

//       {/* Dark overlay so text stands out */}
//       <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

//       {/* Content */}
//       <div className="relative z-10 max-w-2xl px-4 text-center text-white md:px-0">
//         <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
//        Register and renew all your vehicle documents
//         </h1>

//         <p className="mb-8 text-base md:text-lg">
//           Fast, secure, and fully digital. No more long queues—just a few clicks
//           and you’re ready to hit the road.
//         </p>

//         <a
//           href="https://edrivers.ng/login"
//           className="inline-block rounded-full bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
//         >
//           Register Now
//         </a>
//       </div>
//     </section>
//   );
// };

// export default VehicleBanner;







// VehicleBanner.jsx
import { useState } from "react";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL;
const REGISTRATION_FEE = 20000; // ₦20,000

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  make: "",
  model: "",
  year: "",
  plateNumber: "",
};

const VehicleBanner = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [wantsToPay, setWantsToPay] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetAndClose = () => {
    setShowForm(false);
    setForm(initialForm);
    setWantsToPay(true);
    setSubmitted(false);
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email";
    if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, "")))
      return "Please enter a valid phone number";
    if (!form.make.trim()) return "Please enter your vehicle make";
    if (!form.model.trim()) return "Please enter your vehicle model";
    if (!form.year.trim()) return "Please enter your vehicle year";
    if (!form.plateNumber.trim()) return "Please enter your plate number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Save the registration request regardless of payment choice
      const res = await fetch(`${API_BASE}/vehicle-registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ ...form, wantsToPay, amount: wantsToPay ? REGISTRATION_FEE : 0 }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      if (!wantsToPay) {
        setSubmitted(true);
        setSubmitting(false);
        return;
      }

      // 2. If they chose to pay, ask the backend to initialize Paystack
      // and redirect to the hosted checkout (same pattern as other Paystack flows)
      const payRes = await fetch(
        `${API_BASE}/vehicle-registrations/${data.registrationId}/initialize-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ email: form.email, amount: REGISTRATION_FEE }),
        }
      );
      const payData = await payRes.json();

      if (payRes.ok && payData.authorization_url) {
        window.location.href = payData.authorization_url;
        return; // browser is navigating away, nothing more to do here
      }

      toast.error(payData.message || "Could not start payment. Please try again.");
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  };

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

        <button
          onClick={() => setShowForm(true)}
          className="inline-block rounded-full bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          Register Now
        </button>
      </div>

      {/* Registration modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 text-left text-gray-900 shadow-2xl">
            <button
              onClick={resetAndClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <h3 className="mb-2 text-xl font-bold">Request received 🎉</h3>
                <p className="text-sm text-gray-600">
                  Thanks, {form.fullName.split(" ")[0]}! We've got your details and
                  someone from our team will get back to you shortly.
                </p>
                <button
                  onClick={resetAndClose}
                  className="mt-6 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="mb-1 text-xl font-bold">Vehicle document registration</h3>
                <p className="mb-6 text-sm text-gray-500">
                  Fill in your details below and we'll take it from there.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <fieldset className="space-y-3">
                    <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Your details
                    </legend>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3">
                    <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Vehicle details
                    </legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        name="make"
                        value={form.make}
                        onChange={handleChange}
                        placeholder="Make (e.g. Toyota)"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <input
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        placeholder="Model (e.g. Camry)"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        placeholder="Year"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <input
                        name="plateNumber"
                        value={form.plateNumber}
                        onChange={handleChange}
                        placeholder="Plate number e.g Epe 123 AB"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </fieldset>

                  <fieldset className="rounded-xl border border-gray-200 p-4">
                    <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Payment
                    </legend>
                    <label className="mb-2 flex items-start gap-2.5 text-sm">
                      <input
                        type="radio"
                        name="wantsToPay"
                        checked={wantsToPay}
                        onChange={() => setWantsToPay(true)}
                        className="mt-0.5"
                      />
                      <span>
                        Pay ₦{REGISTRATION_FEE.toLocaleString()} now to fast-track my
                        registration (via Paystack)
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 text-sm">
                      <input
                        type="radio"
                        name="wantsToPay"
                        checked={!wantsToPay}
                        onChange={() => setWantsToPay(false)}
                        className="mt-0.5"
                      />
                      <span>I'll pay later — just submit my details for now</span>
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-700 disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {submitting
                      ? "Please wait…"
                      : wantsToPay
                      ? `Pay ₦${REGISTRATION_FEE.toLocaleString()} & submit`
                      : "Submit request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default VehicleBanner;