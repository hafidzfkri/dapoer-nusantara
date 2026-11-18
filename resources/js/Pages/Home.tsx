import React, { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ArrowUpRight } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import VideoScrollStage from '@/components/story/VideoScrollStage';
import CulinaryTicker from '@/components/story/CulinaryTicker';
import MenuCustomizeModal from '@/components/menu/MenuCustomizeModal';
import type { Category, MenuItem, PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

gsap.registerPlugin(ScrollTrigger);

const KineticRibbon3D = lazy(() => import('@/components/3d/KineticRibbon3D'));

interface TableOption {
  id: number;
  table_number: string;
  capacity: number;
}

interface HomeProps {
  categories: Category[];
  menus: MenuItem[];
  signatureMenus: MenuItem[];
  tables: TableOption[];
  activeCategory: string;
  search: string;
}

export default function Home({
  categories,
  menus,
  signatureMenus,
  tables,
  activeCategory: initialCat,
  search: initialSearch,
}: HomeProps) {
  const { auth, errors } = usePage<PageProps>().props;
  const isStaff = !!auth.user && auth.user.role !== 'customer';
  const [activeCategory, setActiveCategory] = useState<string>(initialCat || 'semua');
  const [search, setSearch] = useState<string>(initialSearch || '');
  const [hoveredMenu, setHoveredMenu] = useState<MenuItem | null>(signatureMenus[0] ?? menus[0] ?? null);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  const reservationForm = useForm({
    table_id: tables[0]?.id ? String(tables[0].id) : '',
    customer_name: auth.user?.name ?? '',
    customer_phone: auth.user?.phone ?? '',
    reservation_date: new Date().toISOString().slice(0, 10),
    reservation_time: '19:00',
    guest_count: '2',
    notes: '',
    website: '',
  });

  useGSAP(
    () => {
      // Hero stagger entrance
      gsap.from('.kinfolk-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Animasi 2: Editorial clip-path mask reveal
      gsap.utils.toArray<HTMLElement>('.editorial-mask').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)', y: 20 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });

      // Animasi 4: Continuous photo parallax depth
      gsap.utils.toArray<HTMLElement>('.parallax-photo').forEach((img) => {
        gsap.fromTo(
          img,
          { y: -22, scale: 1.08 },
          {
            y: 22,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement ?? img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: pageRef }
  );

  const filteredMenus = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menus.filter((m) => {
      const matchCat = activeCategory === 'semua' || m.category?.slug === activeCategory;
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.subcategory ?? '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [menus, activeCategory, search]);

  const featuredDish = signatureMenus[0];
  const secondaryDishes = signatureMenus.slice(1, 5);

  const submitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    reservationForm.post('/reservations', {
      preserveScroll: true,
      onSuccess: () => reservationForm.reset('notes'),
    });
  };

  return (
    <MainLayout>
      <Head title="A Journey Through the Taste of Nusantara" />

      <div ref={pageRef}>
        {/* 01 — KINFOLK EDITORIAL HERO + THREE.JS KINETIC RIBBON (IDE B) */}
        <section id="hero" className="relative bg-[#FAF7F2] pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
          <Suspense fallback={null}>
            <KineticRibbon3D />
          </Suspense>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7 space-y-8">
              <p className="kinfolk-reveal text-[11px] uppercase tracking-[0.26em] text-[#575C52]">
                Dapoer Nusantara — Kambang Iwak, Palembang
              </p>

              <h1 className="kinfolk-reveal font-editorial text-5xl sm:text-6xl lg:text-[74px] font-normal leading-[1.02] tracking-tight text-[#1F241C]">
                A quiet celebration of{' '}
                <span className="italic text-[#3D5A2E]">Nusantara</span> spice.
              </h1>

              <p className="kinfolk-reveal text-sm text-[#575C52] max-w-md leading-relaxed">
                Masakan rumahan Indonesia yang diracik dari bumbu segar setiap pagi. Gulir ke bawah untuk menyaksikan perjalanan dapur kami layaknya film pendek.
              </p>

              {/* Animasi 5: Tactile Text-Swap & Expanding Underline */}
              <div className="kinfolk-reveal flex flex-wrap items-center gap-8 pt-2 text-xs font-semibold uppercase tracking-[0.18em]">
                <a
                  href="#explore-menu"
                  className="group relative h-9 px-6 bg-[#1F241C] text-[#FAF7F2] overflow-hidden inline-flex items-start"
                >
                  <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                    <span className="h-9 flex items-center">Explore Menu</span>
                    <span className="h-9 flex items-center text-[#D99B26]">Explore Menu →</span>
                  </span>
                </a>
                <a
                  href="#reservation"
                  className="relative pb-1.5 text-[#C85A32] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-[#C85A32] after:origin-left after:scale-x-50 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  Reserve a Table
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 kinfolk-reveal">
              <div className="aspect-[4/5] overflow-hidden bg-[#EDE5D6]">
                <img
                  src="/images/dapoernusantara.jpg"
                  alt="Hidangan Dapoer Nusantara"
                  className="parallax-photo w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/nasiliwet.jpg';
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#6B7066] mt-3 pt-2.5 border-t border-[#DFD8CA]">
                <span>Dapur Nusantara</span>
                <span className="tabular-nums">{menus.length} Hidangan Tersedia</span>
              </div>
            </div>
          </div>
        </section>

        {/* ANIMASI 1: SCROLL-VELOCITY CULINARY TICKER */}
        <CulinaryTicker />

        {/* 02 — VIDEO-LIKE SCROLL SCRUB SEQUENCE */}
        <VideoScrollStage />

        {/* 03 — SIGNATURE COLLECTION (KINFOLK ASYMMETRIC + CLIP-PATH REVEAL) */}
        <section id="signature-menu" className="bg-[#FAF7F2] py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFD8CA] pb-5">
              <div className="editorial-mask">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#C85A32]">
                  Pilihan Dapur
                </span>
                <h2 className="font-editorial text-4xl font-normal text-[#1F241C] mt-1">
                  Signature Collection
                </h2>
              </div>
              <a href="#explore-menu" className="text-xs uppercase tracking-[0.18em] text-[#3D5A2E] hover:underline">
                Lihat Semua Menu →
              </a>
            </div>

            {featuredDish && (
              <div className="grid lg:grid-cols-12 gap-12 items-start">
                <article className="lg:col-span-6 space-y-5 group">
                  <Link href={`/menu/${featuredDish.slug}`} className="editorial-mask block aspect-[4/3] overflow-hidden bg-[#EDE5D6]">
                    <img
                      src={featuredDish.image_url}
                      alt={featuredDish.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    />
                  </Link>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#DFD8CA] pb-3">
                    <h3 className="font-editorial text-3xl font-normal text-[#1F241C]">{featuredDish.name}</h3>
                    <span className="text-sm font-semibold text-[#3D5A2E] tabular-nums">
                      {formatRupiah(featuredDish.price)}
                    </span>
                  </div>
                  <p className="text-xs text-[#575C52] leading-relaxed">{featuredDish.description}</p>
                  <div className="flex items-center gap-6 pt-1 text-xs font-semibold uppercase tracking-[0.16em]">
                    {!isStaff && (
                      <button
                        type="button"
                        onClick={() => setSelectedMenu(featuredDish)}
                        className="border-b border-[#3D5A2E] pb-1 text-[#3D5A2E] hover:text-[#1F241C] cursor-pointer"
                      >
                        + Add to Cart
                      </button>
                    )}
                    <Link
                      href={`/menu/${featuredDish.slug}`}
                      className="text-[#575C52] hover:text-[#1F241C] inline-flex items-center gap-1"
                    >
                      Detail <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>

                <div className="lg:col-span-6 divide-y divide-[#DFD8CA]">
                  {secondaryDishes.map((dish) => (
                    <div key={dish.id} className="py-6 first:pt-0 flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-5 min-w-0">
                        <Link href={`/menu/${dish.slug}`} className="w-20 h-20 shrink-0 overflow-hidden bg-[#EDE5D6]">
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/menu/${dish.slug}`}>
                            <h4 className="font-editorial text-xl font-normal text-[#1F241C] group-hover:text-[#3D5A2E]">
                              {dish.name}
                            </h4>
                          </Link>
                          <p className="text-xs text-[#6B7066] line-clamp-1 mt-0.5">{dish.description}</p>
                          <span className="inline-block text-xs font-semibold text-[#3D5A2E] tabular-nums mt-1">
                            {formatRupiah(dish.price)}
                          </span>
                        </div>
                      </div>
                      {!isStaff && (
                        <button
                          type="button"
                          onClick={() => setSelectedMenu(dish)}
                          className="text-xs uppercase tracking-wider font-semibold text-[#1F241C] border-b border-transparent hover:border-[#1F241C] pb-0.5 shrink-0 cursor-pointer"
                        >
                          + Pesan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 04 — EXPLORE MENU: SPRING HIGHLIGHT + CROSS-ZOOM PREVIEW */}
        <section id="explore-menu" className="bg-[#F2ECE1] py-24 md:py-28 border-y border-[#DFD8CA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="editorial-mask">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#C85A32]">
                  Buku Menu
                </span>
                <h2 className="font-editorial text-4xl font-normal text-[#1F241C] mt-1">
                  Explore Our Menu
                </h2>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#6B7066] absolute left-0 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama hidangan..."
                  className="w-full pl-7 pr-3 py-2 bg-transparent border-b border-[#BFB6A6] text-xs focus:outline-none focus:border-[#1F241C]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 border-b border-[#DFD8CA] pb-3">
              <button
                type="button"
                onClick={() => setActiveCategory('semua')}
                className={`relative pb-1 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                  activeCategory === 'semua' ? 'text-[#1F241C]' : 'text-[#6B7066]'
                }`}
              >
                Semua ({menus.length})
                {activeCategory === 'semua' && (
                  <motion.span layoutId="kinfolkMenuTab" className="absolute left-0 right-0 -bottom-3 h-px bg-[#1F241C]" />
                )}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`relative pb-1 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                    activeCategory === cat.slug ? 'text-[#1F241C]' : 'text-[#6B7066]'
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.slug && (
                    <motion.span layoutId="kinfolkMenuTab" className="absolute left-0 right-0 -bottom-3 h-px bg-[#1F241C]" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Menu List with Framer Motion Spring Highlight */}
              <div className="lg:col-span-7 divide-y divide-[#DFD8CA]">
                {filteredMenus.length === 0 ? (
                  <div className="py-12 space-y-3">
                    <p className="font-editorial text-xl">Menu tidak ditemukan.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('semua');
                        setSearch('');
                      }}
                      className="text-xs uppercase tracking-wider font-semibold border-b border-[#1F241C] pb-0.5 cursor-pointer"
                    >
                      Tampilkan Semua Menu
                    </button>
                  </div>
                ) : (
                  filteredMenus.map((menu) => {
                    const isHovered = hoveredMenu?.id === menu.id;
                    return (
                      <div
                        key={menu.id}
                        onMouseEnter={() => setHoveredMenu(menu)}
                        className="relative py-4 px-3 flex items-center justify-between gap-4 group"
                      >
                        {isHovered && (
                          <motion.div
                            layoutId="menuHoverHighlight"
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="absolute inset-0 bg-white/80 border-l-2 border-[#C85A32] pointer-events-none"
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-3.5 min-w-0">
                          <Link href={`/menu/${menu.slug}`} className="lg:hidden w-12 h-12 shrink-0 overflow-hidden bg-[#E3DAC9]">
                            <img src={menu.image_url} alt={menu.name} loading="lazy" className="w-full h-full object-cover" />
                          </Link>
                          <div className="min-w-0">
                            <Link href={`/menu/${menu.slug}`}>
                              <h3 className="font-editorial text-lg font-normal text-[#1F241C] group-hover:text-[#C85A32] transition-colors">
                                {menu.name}
                              </h3>
                            </Link>
                            <p className="text-[11px] text-[#6B7066] line-clamp-1">{menu.description}</p>
                          </div>
                        </div>
                        <div className="relative z-10 flex items-center gap-4 shrink-0">
                          <span className="text-xs font-semibold tabular-nums text-[#3D5A2E]">
                            {formatRupiah(menu.price)}
                          </span>
                          {!isStaff && (
                            <button
                              type="button"
                              onClick={() => setSelectedMenu(menu)}
                              className="p-1.5 border border-[#CFC7B8] bg-white hover:bg-[#1F241C] hover:text-white transition-colors cursor-pointer"
                              title="Pesan"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sticky Cross-Zoom Dish Preview */}
              <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
                <AnimatePresence mode="wait">
                  {hoveredMenu && (
                    <motion.div
                      key={hoveredMenu.id}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-3"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#E3DAC9]">
                        <img
                          src={hoveredMenu.image_url}
                          alt={hoveredMenu.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-baseline justify-between border-t border-[#DFD8CA] pt-3">
                        <span className="font-editorial text-xl text-[#1F241C]">{hoveredMenu.name}</span>
                        <span className="text-xs font-semibold text-[#3D5A2E] tabular-nums">
                          {formatRupiah(hoveredMenu.price)}
                        </span>
                      </div>
                      <p className="text-xs text-[#575C52] leading-relaxed">{hoveredMenu.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* 05 & 06 — OUR CRAFT & HONEST GUEST NOTES */}
        <section id="our-craft" className="bg-[#FAF7F2] py-24 md:py-28 border-b border-[#DFD8CA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-12">
            <div className="md:col-span-6 space-y-4 editorial-mask">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#C85A32]">Made with Tradition</span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1F241C]">
                Dimasak Dadakan dari Dapur Terbuka.
              </h2>
              <p className="text-sm text-[#575C52] leading-relaxed">
                Setiap pesanan melalui proses masak 15–30 menit dengan bumbu dasar segar dan terhubung langsung ke sistem dapur kami.
              </p>
            </div>
            <div id="customer-favorites" className="md:col-span-5 md:col-start-8 border-l border-[#DFD8CA] pl-8 space-y-3">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#3D5A2E]">Guest Notes</span>
              <h3 className="font-editorial text-2xl font-normal text-[#1F241C]">Ulasan Pelanggan</h3>
              <p className="text-xs text-[#6B7066] leading-relaxed">
                Belum ada ulasan terverifikasi yang ditampilkan. Kami hanya memuat ulasan asli dari tamu yang telah menyelesaikan pesanan.
              </p>
            </div>
          </div>
        </section>

        {/* 07 & 08 — DINING EXPERIENCE & RESERVATION */}
        <section id="dining-experience" className="bg-[#FAF7F2] py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div className="editorial-mask space-y-3">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#C85A32]">Dining Experience</span>
                <h2 className="font-editorial text-4xl font-normal text-[#1F241C]">Your Table Awaits.</h2>
                <p className="text-sm text-[#575C52] leading-relaxed">
                  Ruang makan yang tenang untuk santap siang, jamuan keluarga, dan makan malam. Reservasi meja Anda langsung dari sini.
                </p>
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-[#EDE5D6]">
                <img
                  src="/images/nasiliwet.jpg"
                  alt="Suasana santap"
                  loading="lazy"
                  className="parallax-photo w-full h-full object-cover"
                />
              </div>
            </div>

            <div id="reservation" className="lg:col-span-6 lg:col-start-7 pt-2">
              {tables.length === 0 ? (
                <p className="text-xs text-[#6B7066]">Daftar meja sedang diperbarui oleh tim restoran.</p>
              ) : (
                <form onSubmit={submitReservation} className="space-y-6 text-xs">
                  {/* Honeypot anti-bot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={reservationForm.data.website}
                    onChange={(e) => reservationForm.setData('website', e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7066] mb-1">Nama</label>
                      <input
                        type="text"
                        value={reservationForm.data.customer_name}
                        onChange={(e) => reservationForm.setData('customer_name', e.target.value)}
                        className="w-full bg-transparent border-b border-[#CFC7B8] py-2 focus:outline-none focus:border-[#1F241C]"
                        required
                      />
                      {errors.customer_name && <p className="text-[#C85A32] mt-1">{errors.customer_name}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7066] mb-1">Telepon</label>
                      <input
                        type="tel"
                        value={reservationForm.data.customer_phone}
                        onChange={(e) => reservationForm.setData('customer_phone', e.target.value)}
                        className="w-full bg-transparent border-b border-[#CFC7B8] py-2 focus:outline-none focus:border-[#1F241C]"
                        required
                      />
                      {errors.customer_phone && <p className="text-[#C85A32] mt-1">{errors.customer_phone}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7066] mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={reservationForm.data.reservation_date}
                        onChange={(e) => reservationForm.setData('reservation_date', e.target.value)}
                        className="w-full bg-transparent border-b border-[#CFC7B8] py-2 focus:outline-none focus:border-[#1F241C]"
                        required
                      />
                      {errors.reservation_date && <p className="text-[#C85A32] mt-1">{errors.reservation_date}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7066] mb-1">Jam</label>
                      <input
                        type="time"
                        value={reservationForm.data.reservation_time}
                        onChange={(e) => reservationForm.setData('reservation_time', e.target.value)}
                        className="w-full bg-transparent border-b border-[#CFC7B8] py-2 focus:outline-none focus:border-[#1F241C]"
                        required
                      />
                      {errors.reservation_time && <p className="text-[#C85A32] mt-1">{errors.reservation_time}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7066] mb-1">Tamu</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={reservationForm.data.guest_count}
                        onChange={(e) => reservationForm.setData('guest_count', e.target.value)}
                        className="w-full bg-transparent border-b border-[#CFC7B8] py-2 focus:outline-none focus:border-[#1F241C]"
                        required
                      />
                      {errors.guest_count && <p className="text-[#C85A32] mt-1">{errors.guest_count}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7066] mb-1">Pilih Meja</label>
                    <select
                      value={reservationForm.data.table_id}
                      onChange={(e) => reservationForm.setData('table_id', e.target.value)}
                      className="w-full bg-transparent border-b border-[#CFC7B8] py-2 focus:outline-none focus:border-[#1F241C]"
                      required
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          Meja {t.table_number} (Maks {t.capacity} orang)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={reservationForm.processing}
                    className="group relative h-11 px-8 bg-[#1F241C] text-[#FAF7F2] text-xs font-semibold uppercase tracking-[0.18em] overflow-hidden inline-flex items-start cursor-pointer"
                  >
                    <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                      <span className="h-11 flex items-center justify-center">
                        {reservationForm.processing ? 'Mengirim...' : 'Reserve a Table'}
                      </span>
                      <span className="h-11 flex items-center justify-center text-[#D99B26]">
                        {reservationForm.processing ? 'Mengirim...' : 'Reserve a Table →'}
                      </span>
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 09 & 10 — LOCATION & FINAL CTA */}
        <section id="location-contact" className="bg-[#F2ECE1] py-16 border-t border-[#DFD8CA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-8 text-xs items-end">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#C85A32] mb-1">Lokasi Palembang</div>
              <p className="text-[#4F544B] leading-relaxed">
                Jl. Jenderal Sudirman No. 88, Kawasan Kambang Iwak, Kec. Ilir Barat I, Kota Palembang 30135
              </p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#3D5A2E] mb-1">Jam Operasional</div>
              <p className="text-[#4F544B] leading-relaxed">
                Senin – Jumat: 10.00 – 22.00 WIB
                <br />
                Sabtu – Minggu: 09.00 – 23.00 WIB
              </p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#1F241C] mb-1">Reservasi &amp; Kontak</div>
              <p className="text-[#4F544B] leading-relaxed">
                (0711) 358-890 • +62 812-7890-4560
                <br />
                reservasi@dapoernusantara.id
              </p>
            </div>
            <div className="md:text-right">
              {isStaff ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center h-10 px-6 bg-[#3D5A2E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2C4221] transition-colors"
                >
                  Buka Admin Dashboard →
                </Link>
              ) : (
                <a
                  href="#explore-menu"
                  className="group relative h-10 px-6 bg-[#C85A32] text-white text-xs font-semibold uppercase tracking-wider overflow-hidden inline-flex items-start"
                >
                  <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                    <span className="h-10 flex items-center">Order Now</span>
                    <span className="h-10 flex items-center">Order Now →</span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      <MenuCustomizeModal menu={selectedMenu} onClose={() => setSelectedMenu(null)} />
    </MainLayout>
  );
}
