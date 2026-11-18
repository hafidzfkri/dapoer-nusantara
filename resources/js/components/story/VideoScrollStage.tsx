import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface FrameChapter {
  src: string;
  timecode: string;
  chapter: string;
  title: string;
  caption: string;
}

const CHAPTERS: FrameChapter[] = [
  {
    src: '/images/dapoernusantara.jpg',
    timecode: '00:01',
    chapter: 'Pembuka',
    title: 'Meja Nusantara',
    caption: 'Sajian hangat yang lahir dari rempah utuh setiap pagi.',
  },
  {
    src: '/images/nasiliwet.jpg',
    timecode: '00:02',
    chapter: 'Aroma',
    title: 'Nasi Liwet & Santan Peras',
    caption: 'Dimasak perlahan bersama serai, daun salam, dan ayam suwir.',
  },
  {
    src: '/images/nasirendang.jpg',
    timecode: '00:03',
    chapter: 'Dapur',
    title: 'Rendang Rempah Pekat',
    caption: 'Karamerisasi santan dan lengkuas yang meresap sempurna.',
  },
  {
    src: '/images/ayamkalasan.jpg',
    timecode: '00:04',
    chapter: 'Kriya',
    title: 'Ayam Kalasan Ungkep',
    caption: 'Air kelapa dan bawang putih menghasilkan kulit keemasan renyah.',
  },
  {
    src: '/images/ikanbakar.jpg',
    timecode: '00:05',
    chapter: 'Bara',
    title: 'Ikan Bakar Arang',
    caption: 'Olesan kecap manis dan sambal matah segar di atas bara.',
  },
  {
    src: '/images/esteler.jpg',
    timecode: '00:06',
    chapter: 'Penutup',
    title: 'Kesegaran Tropis',
    caption: 'Es teler alpukat mentega dan nangka manis sebagai penutup.',
  },
];

export default function VideoScrollStage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<number>(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrubPct, setScrubPct] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(!!reduced);

    const loaded: HTMLImageElement[] = CHAPTERS.map((ch) => {
      const img = new Image();
      img.src = ch.src;
      return img;
    });
    imagesRef.current = loaded;

    let rafId = 0;

    const renderFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        rafId = requestAnimationFrame(renderFrame);
        return;
      }

      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }

      const w = canvas.width;
      const h = canvas.height;
      const total = CHAPTERS.length - 1;
      const exact = progressRef.current * total;
      const idxA = Math.min(total, Math.floor(exact));
      const idxB = Math.min(total, idxA + 1);
      const blend = exact - idxA;

      ctx.clearRect(0, 0, w, h);

      const drawImageCover = (img: HTMLImageElement | undefined, alpha: number, zoom: number, panX: number) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = w / h;
        let drawW = w;
        let drawH = h;
        if (imgRatio > canvasRatio) {
          drawH = h * zoom;
          drawW = drawH * imgRatio;
        } else {
          drawW = w * zoom;
          drawH = drawW / imgRatio;
        }
        const x = (w - drawW) / 2 + panX;
        const y = (h - drawH) / 2;
        ctx.drawImage(img, x, y, drawW, drawH);
        ctx.restore();
      };

      const zoomA = 1.04 + blend * 0.08;
      const panA = -blend * 24 * dpr;
      drawImageCover(imagesRef.current[idxA], 1 - blend, zoomA, panA);

      if (blend > 0.001 && idxB !== idxA) {
        const zoomB = 1.12 - blend * 0.08;
        const panB = (1 - blend) * 24 * dpr;
        drawImageCover(imagesRef.current[idxB], blend, zoomB, panB);
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      const bindScroll = (endDistance: string) =>
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: endDistance,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            const nextIdx = Math.min(
              CHAPTERS.length - 1,
              Math.floor(self.progress * CHAPTERS.length * 0.999)
            );
            setActiveIndex(nextIdx);
            setScrubPct(Math.round(self.progress * 100));
          },
        });

      mm.add('(min-width: 768px)', () => {
        const st = bindScroll('+=2400');
        return () => st.kill();
      });

      mm.add('(max-width: 767px)', () => {
        const st = bindScroll('+=1100');
        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const current = CHAPTERS[activeIndex];

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#141712] text-[#FAF7F2]"
    >
      {/* 60FPS Video-Like Scrub Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Subtle Vignette for Editorial Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141712]/85 via-[#141712]/25 to-[#141712]/55 pointer-events-none" />

      {/* Editorial Overlay */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.26em] text-[#D8DDD1]">
          <span>The Soul of Nusantara</span>
          <span className="font-mono tabular-nums text-[#D99B26]">
            {current.timecode} / 00:06
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-end pb-4">
          <div className="md:col-span-7 space-y-3">
            <span className="inline-block text-[11px] uppercase tracking-[0.24em] text-[#D99B26]">
              {current.chapter}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.06] text-[#FAF7F2]">
              {current.title}
            </h2>
            <p className="text-sm text-[#D8DDD1] max-w-md leading-relaxed">{current.caption}</p>
          </div>

          <div className="md:col-span-5 flex flex-col md:items-end gap-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#C6CBB9]">
              Gulir untuk memutar sekuens ({scrubPct}%)
            </div>
            <div className="w-full md:w-56 h-px bg-white/25 relative">
              <div
                style={{ width: `${scrubPct}%` }}
                className="h-0.5 bg-[#D99B26] -top-[0.5px] relative transition-[width] duration-75"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
