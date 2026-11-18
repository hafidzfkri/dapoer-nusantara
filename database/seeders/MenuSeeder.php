<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $nasiId    = Category::where('slug', 'menu-nasi')->value('id');
        $laukId    = Category::where('slug', 'lauk-pauk')->value('id');
        $minumanId = Category::where('slug', 'minuman')->value('id');
        $dessertId = Category::where('slug', 'dessert')->value('id');

        $menus = [
            // ── MENU NASI ──
            [
                'category_id' => $nasiId, 'subcategory' => 'Nasi Goreng',
                'name' => 'Nasi Goreng Kampung', 'price' => 25000, 'cook_time' => 20,
                'description' => 'Nasi Goreng Kampung adalah hidangan khas Indonesia yang menghadirkan cita rasa autentik dengan bumbu sederhana namun kaya rasa, dimasak dengan perpaduan bawang putih, bawang merah, cabai, dan kecap yang menghasilkan aroma khas menggugah selera.',
                'image' => 'nasigorengkampung.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Nasi Goreng',
                'name' => 'Nasi Goreng Seafood', 'price' => 30000, 'cook_time' => 25,
                'description' => 'Nasi goreng spesial dengan campuran udang, cumi, dan kerang segar yang dimasak dengan bumbu istimewa menghasilkan cita rasa laut yang kaya.',
                'image' => 'nasigorengseafood.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Nasi Goreng',
                'name' => 'Nasi Goreng Ayam', 'price' => 27000, 'cook_time' => 20,
                'description' => 'Nasi goreng dengan potongan ayam pilihan yang lembut, dipadukan dengan bumbu rempah tradisional yang menggugah selera.',
                'image' => 'nasigorengayam.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Nasi Tradisional',
                'name' => 'Nasi Liwet', 'price' => 28000, 'cook_time' => 30,
                'description' => 'Nasi liwet Solo yang khas dengan santan gurih, labu siam, dan ayam suwir. Disajikan dengan telur pindang dan sambal bajak yang lezat.',
                'image' => 'nasiliwet.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Nasi Tradisional',
                'name' => 'Nasi Uduk', 'price' => 24000, 'cook_time' => 25,
                'description' => 'Nasi uduk Betawi yang harum dengan santan dan rempah-rempah pilihan. Disajikan dengan lauk pelengkap seperti tempe orek dan kerupuk.',
                'image' => 'nasiuduk.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Nasi Tradisional',
                'name' => 'Nasi Kuning', 'price' => 26000, 'cook_time' => 25,
                'description' => 'Nasi kuning dengan pewarna alami dari kunyit, dimasak dengan santan dan rempah pilihan. Disajikan lengkap dengan lauk pauk tradisional.',
                'image' => 'nasikuning.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Paket Nasi + Lauk',
                'name' => 'Nasi + Ayam Kalasan', 'price' => 32000, 'cook_time' => 25,
                'description' => 'Paket hemat nasi putih pulen dengan ayam kalasan khas Jawa yang digoreng sempurna hingga kecokelatan. Disajikan dengan sambal bawang dan lalapan segar.',
                'image' => 'nasiayamkalasan.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Paket Nasi + Lauk',
                'name' => 'Nasi + Rendang', 'price' => 35000, 'cook_time' => 30,
                'description' => 'Paket nasi dengan rendang daging sapi Padang yang telah dimasak berjam-jam dengan rempah-rempah pilihan hingga menghasilkan cita rasa kaya.',
                'image' => 'nasirendang.jpg',
            ],
            [
                'category_id' => $nasiId, 'subcategory' => 'Paket Nasi + Lauk',
                'name' => 'Nasi + Ikan Bakar', 'price' => 33000, 'cook_time' => 30,
                'description' => 'Nasi putih pulen dengan ikan bakar segar yang dilumuri bumbu kecap dan rempah pilihan. Disajikan dengan sambal matah dan lalapan segar.',
                'image' => 'nasiikanbakar.jpg',
            ],
            // ── LAUK PAUK ──
            [
                'category_id' => $laukId, 'subcategory' => 'Ayam',
                'name' => 'Ayam Goreng', 'price' => 20000, 'cook_time' => 30,
                'description' => 'Ayam kampung ungkep bumbu kuning rempah serai dan lengkuas, digoreng hingga kulit keemasan renyah dan daging tetap empuk.',
                'image' => 'ayamgoreng.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Ayam',
                'name' => 'Ayam Bakar', 'price' => 22000, 'cook_time' => 20,
                'description' => 'Ayam bakar di atas arang dengan olesan kecap manis, bawang putih, dan ketumbar yang menghasilkan aroma smokey menggugah selera.',
                'image' => 'ayambakar.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Ayam',
                'name' => 'Ayam Kalasan', 'price' => 23000, 'cook_time' => 20,
                'description' => 'Ayam goreng khas Yogyakarta yang diungkep dengan air kelapa dan gula jawa, disajikan hangat bersama sambal bawang dan lalapan.',
                'image' => 'ayamkalasan.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Daging',
                'name' => 'Rendang', 'price' => 28000, 'cook_time' => 25,
                'description' => 'Potongan daging sapi pilihan yang dimasak perlahan bersama santan kental, lengkuas, serai, dan daun jeruk khas Minang.',
                'image' => 'rendang.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Daging',
                'name' => 'Dendeng Balado', 'price' => 27000, 'cook_time' => 25,
                'description' => 'Dendeng sapi renyah yang disiram dengan sambal balado merah khas Minang yang pedas dan segar.',
                'image' => 'dendengbalado.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Daging',
                'name' => 'Semur Daging', 'price' => 25000, 'cook_time' => 25,
                'description' => 'Daging sapi empuk yang dimasak perlahan dalam kuah kecap manis rempah yang kaya rasa dan aromatik.',
                'image' => 'semurdaging.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Ikan & Seafood',
                'name' => 'Ikan Bakar', 'price' => 26000, 'cook_time' => 15,
                'description' => 'Ikan segar yang dibakar di atas arang dengan olesan bumbu kecap pedas, disajikan dengan sambal kecap.',
                'image' => 'ikanbakar.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Ikan & Seafood',
                'name' => 'Ikan Goreng', 'price' => 24000, 'cook_time' => 15,
                'description' => 'Ikan goreng garing dengan bumbu kunyit dan bawang yang gurih, disajikan hangat dengan sambal terasi.',
                'image' => 'ikangoreng.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Ikan & Seafood',
                'name' => 'Udang Saus Padang', 'price' => 30000, 'cook_time' => 15,
                'description' => 'Udang segar pilihan yang dimasak dengan saus Padang kental yang pedas, manis, dan sedikit asam.',
                'image' => 'udangsauspadang.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Pelengkap',
                'name' => 'Tahu Goreng', 'price' => 10000, 'cook_time' => 10,
                'description' => 'Tahu putih lembut yang digoreng hingga kuning keemasan, pelengkap sempurna untuk setiap hidangan.',
                'image' => 'tahugoreng.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Pelengkap',
                'name' => 'Tempe Goreng', 'price' => 10000, 'cook_time' => 10,
                'description' => 'Tempe kedelai kualitas terbaik yang dibumbui bawang putih dan ketumbar, digoreng renyah.',
                'image' => 'tempegoreng.jpg',
            ],
            [
                'category_id' => $laukId, 'subcategory' => 'Pelengkap',
                'name' => 'Telur Balado', 'price' => 12000, 'cook_time' => 15,
                'description' => 'Telur rebus yang digoreng dan dibumbui dengan sambal balado merah yang pedas dan gurih khas Minang.',
                'image' => 'telurbalado.jpg',
            ],
            // ── MINUMAN ──
[
                'category_id' => $minumanId, 'subcategory' => 'Jus & Fresh Drink',
                'name' => 'Jus Alpukat', 'price' => 15000, 'cook_time' => 5,
                'description' => 'Jus alpukat mentega yang kental dan creamy, disajikan dengan topping susu cokelat yang nikmat.',
                'image' => 'jusalpukat.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Jus & Fresh Drink',
                'name' => 'Jus Mangga', 'price' => 14000, 'cook_time' => 5,
                'description' => 'Ekstrak buah mangga harum manis segar yang kaya vitamin, pas untuk melepas dahaga.',
                'image' => 'jusmangga.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Jus & Fresh Drink',
                'name' => 'Jus Jeruk', 'price' => 12000, 'cook_time' => 5,
                'description' => 'Perasan jeruk murni pilihan yang memberikan kesegaran alami dengan rasa manis dan sedikit asam.',
                'image' => 'jusjeruk.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Minuman Hangat',
                'name' => 'Teh Hangat', 'price' => 6000, 'cook_time' => 10,
                'description' => 'Seduhan teh berkualitas dengan aroma melati yang menenangkan, disajikan hangat sesuai selera.',
                'image' => 'tehhangat.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Minuman Hangat',
                'name' => 'Kopi Hitam', 'price' => 10000, 'cook_time' => 10,
                'description' => 'Kopi hitam pilihan dengan cita rasa mantap dan aroma kuat yang membangkitkan semangat.',
                'image' => 'kopihitam.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Minuman Hangat',
                'name' => 'Jahe Hangat', 'price' => 12000, 'cook_time' => 10,
                'description' => 'Minuman rempah jahe asli yang memberikan sensasi hangat di tenggorokan dan menyehatkan tubuh.',
                'image' => 'jahehangat.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Minuman Dingin',
                'name' => 'Es Teh Manis', 'price' => 8000, 'cook_time' => 10,
                'description' => 'Teh manis dingin yang menyegarkan, diseduh dari teh pilihan dengan kemanisan yang pas.',
                'image' => 'estehmanis.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Minuman Dingin',
                'name' => 'Es Jeruk', 'price' => 10000, 'cook_time' => 10,
                'description' => 'Perasan jeruk segar dengan tambahan es batu, teman sempurna setelah menyantap makanan pedas.',
                'image' => 'esjeruk.jpg',
            ],
            [
                'category_id' => $minumanId, 'subcategory' => 'Minuman Dingin',
                'name' => 'Es Campur', 'price' => 18000, 'cook_time' => 10,
                'description' => 'Es campur dengan berbagai isian segar seperti cincau, kolang-kaling, jelly, dan buah-buahan yang disiram santan dan sirup merah.',
                'image' => 'escampur.jpg',
            ],
            // ── DESSERT ──
            [
                'category_id' => $dessertId, 'subcategory' => 'Gorengan Manis',
                'name' => 'Pisang Madu', 'price' => 14000, 'cook_time' => 20,
                'description' => 'Pisang madu yang lezat dan kenyal, disajikan dengan sirihan gula jawa yang manis.',
                'image' => 'pisangmadu.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Gorengan Manis',
                'name' => 'Pisang Goreng', 'price' => 12000, 'cook_time' => 20,
                'description' => 'Pisang goreng yang renyah di luar dan lembut di dalam, disajikan dengan sirihan gula jawa yang manis.',
                'image' => 'pisanggoreng.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Gorengan Manis',
                'name' => 'Tape Goreng', 'price' => 13000, 'cook_time' => 20,
                'description' => 'Tape goreng yang lezat dan kenyal, disajikan dengan sirihan gula jawa yang manis.',
                'image' => 'tapegoreng.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Dessert Tradisional',
                'name' => 'Klepon', 'price' => 12000, 'cook_time' => 15,
                'description' => 'Bola ketan pandan lembut berisi gula merah cair yang lumer di mulut, disajikan dengan balutan kelapa parut segar.',
                'image' => 'klepon.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Dessert Tradisional',
                'name' => 'Dadar Gulung', 'price' => 12000, 'cook_time' => 15,
                'description' => 'Kue dadar pandan tipis berisi unti kelapa parut dan gula jawa manis yang harum dan lembut.',
                'image' => 'dadargulung.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Dessert Tradisional',
                'name' => 'Kue Lapis', 'price' => 10000, 'cook_time' => 15,
                'description' => 'Kue basah tradisional berlapis-lapis dengan tekstur kenyal, perpaduan santan gurih dan aroma pandan.',
                'image' => 'kuelapis.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Dessert Dingin',
                'name' => 'Es Teler', 'price' => 18000, 'cook_time' => 5,
                'description' => 'Perpaduan alpukat mentega, nangka manis, kelapa muda, dan susu kental manis di atas es serut yang menyegarkan.',
                'image' => 'esteler.jpg',
            ],
            [
                'category_id' => $dessertId, 'subcategory' => 'Dessert Dingin',
                'name' => 'Puding', 'price' => 10000, 'cook_time' => 5,
                'description' => 'Puding lembut rasa pandan dan santan dengan saus gula aren cair yang manis pas sebagai penutup.',
                'image' => 'puding.jpg',
            ],
        ];

        foreach ($menus as $menu) {
            $existing = Menu::where('name', $menu['name'])->first();
            if ($existing) {
                $existing->update([
                    'description' => $menu['description'],
                    'subcategory' => $menu['subcategory'],
                    'price'       => $menu['price'],
                    'cook_time'   => $menu['cook_time'],
                ]);
            } else {
                $menu['slug'] = Str::slug($menu['name']);
                if (Menu::where('slug', $menu['slug'])->exists()) {
                    $menu['slug'] .= '-' . rand(100, 999);
                }
                Menu::create($menu);
            }
        }
    }
}
