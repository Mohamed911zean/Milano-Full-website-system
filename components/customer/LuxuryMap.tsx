"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import { MapPin, Navigation, Phone, Clock3 } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LuxuryMap() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <section className="relative py-16 bg-[#0B0B0B] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[140px] rounded-full" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-sm backdrop-blur-md mb-5">
            <MapPin className="w-4 h-4" />
            Visit Our Branch
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Discover Our <span className="text-yellow-400">Luxury Location</span>
          </h2>

          <p className="text-white/60 text-lg leading-relaxed">
            Experience elegance and premium desserts in a refined atmosphere crafted for unforgettable moments.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,215,0,0.08)]">
          {/* Floating Glass Card */}
          <div className="absolute z-20 top-5 left-5 md:top-8 md:left-8 w-[280px] backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  Milano Sweets
                </h3>

                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-yellow-400" />
                    <span>Mansoura, Egypt</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-yellow-400" />
                    <span>Open Daily • 9AM - 12AM</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-yellow-400" />
                    <span>+20 100 000 0000</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute w-14 h-14 bg-yellow-400/20 rounded-full animate-ping" />
                <div className="relative w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>

            <button className="mt-5 w-full h-12 rounded-2xl bg-yellow-400 text-black font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/30 flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10 pointer-events-none" />

          {/* Map */}
          <Map
            initialViewState={{
              longitude: 31.3785,
              latitude: 31.0409,
              zoom: 13,
            }}
            style={{
              width: "100%",
              height: "650px",
            }}
            mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
            dragRotate={false}
            touchZoomRotate={false}
            attributionControl={false}
          >
            <NavigationControl position="bottom-right" />

            {/* Luxury Marker */}
            <Marker longitude={31.3785} latitude={31.0409} anchor="bottom">
              <button
                onClick={() => setShowPopup(true)}
                className="relative group"
              >
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />

                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-white shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="w-7 h-7 text-black" />
                </div>
              </button>
            </Marker>

            {/* Popup */}
            {showPopup && (
              <Popup
                longitude={31.3785}
                latitude={31.0409}
                anchor="top"
                closeButton={false}
                onClose={() => setShowPopup(false)}
                offset={30}
              >
                <div className="min-w-[220px] rounded-2xl overflow-hidden bg-[#111111] text-white">
                  <div className="h-28 bg-gradient-to-r from-yellow-500/20 to-yellow-300/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2">
                      Luxury Dessert Lounge
                    </h4>

                    <p className="text-sm text-white/60 leading-relaxed mb-4">
                      Premium handcrafted desserts with an elegant atmosphere.
                    </p>

                    <button className="w-full h-11 rounded-xl bg-yellow-400 text-black font-semibold hover:opacity-90 transition-opacity">
                      Open In Maps
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </section>
  );
}
