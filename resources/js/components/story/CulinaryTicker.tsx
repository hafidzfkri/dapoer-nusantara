import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  'Nasi Liwet Solo',
  'Rendang Padang',
  'Ayam Kalasan',
  'Ikan Bakar Arang',
  'Kunyit & Serai',
  'Sambal Bajak',
  'Es Teler Tropis',
];

export default function CulinaryTicker() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: 'none',
      });

      const clampVelocity = gsap.utils.clamp(-4, 4);
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const vel = clampVelocity(self.getVelocity() / 450);
          const targetScale = 1 + Math.abs(vel) * 1.4;
          gsap.to(tween, {
            timeScale: vel < -0.2 ? -targetScale : targetScale,
            duration: 0.35,
            overwrite: true,
            onComplete: () => {
              gsap.to(tween, { timeScale: 1, duration: 0.9 });
            },
          });
        },
      });

      return () => {
        st.kill();
        tween.kill();
      };
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="border-y border-[#DFD8CA] bg-[#FAF7F2] py-3.5 overflow-hidden select-none">
      <div ref={trackRef} className="flex w-max items-center gap-8 text-[11px] uppercase tracking-[0.28em] font-semibold text-[#3D5A2E]">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((label, idx) => (
          <React.Fragment key={`${label}-${idx}`}>
            <span>{label}</span>
            <span className="text-[#C85A32]">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
