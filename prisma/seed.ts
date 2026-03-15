import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Safe known-good unsplash URLs
const img = {
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80",
  desktop: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=400&q=80",
  monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80",
  network: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
  server: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
  camera: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
  drive: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80",
  keyboard: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
  printer: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
  misc: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
};

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@orbittech.rw' },
    update: {},
    create: {
      email: 'admin@orbittech.rw',
      name: 'Admin User',
      password_hash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.product.deleteMany();

  const mockProducts = [
    // Category 1 - Computers
    {
      name: "Desktop (Basic)", category: "computers", brand: "HP", sku: "DT-BAS-01",
      description: "Intel Core i3/i5, 8GB RAM, 500GB HDD, Windows 11 Home",
      specifications: { CPU: "Intel Core i3/i5", RAM: "8GB", Storage: "500GB HDD" },
      price_rwf: 350000, price_usd: 270, images: [img.desktop], in_stock: true, featured: false,
    },
    {
      name: "Desktop (Gaming/Pro)", category: "computers", brand: "Dell", sku: "DT-PRO-01",
      description: "Core i7/i9 or Ryzen 7, 16-32GB RAM, 1TB SSD, RTX GPU",
      specifications: { CPU: "Core i7/Ryzen 7", RAM: "16GB", Storage: "1TB SSD", GPU: "RTX Series" },
      price_rwf: 900000, price_usd: 690, images: [img.desktop], in_stock: true, featured: true,
    },
    {
      name: "Laptop (Entry Level)", category: "computers", brand: "Lenovo", sku: "LP-ENT-01",
      description: "Intel Celeron, 4GB RAM, 256GB SSD, 14 inch screen",
      specifications: { CPU: "Intel Celeron", RAM: "4GB", Storage: "256GB SSD" },
      price_rwf: 250000, price_usd: 190, images: [img.laptop], in_stock: true, featured: false,
    },
    {
      name: "Laptop (Mid Range)", category: "computers", brand: "Asus", sku: "LP-MID-01",
      description: "Intel Core i5/i7, 8-16GB RAM, 512GB SSD, 15.6 FHD",
      specifications: { CPU: "Core i5", RAM: "8GB", Storage: "512GB SSD" },
      price_rwf: 500000, price_usd: 385, images: [img.laptop], in_stock: true, featured: true,
    },
    {
      name: "Laptop (High End)", category: "computers", brand: "Apple", sku: "LP-HI-01",
      description: "Core i7/i9, 16-32GB RAM, 1TB SSD, Thunderbolt 4",
      specifications: { CPU: "Core i7", RAM: "16GB", Storage: "1TB M.2 SSD" },
      price_rwf: 1000000, price_usd: 770, images: [img.laptop], in_stock: true, featured: true,
    },
    {
      name: "Workstation", category: "computers", brand: "HP", sku: "WK-01",
      description: "Xeon/Ryzen Threadripper, 32-128GB ECC RAM, Professional GPU",
      specifications: { CPU: "Xeon", RAM: "32GB ECC", GPU: "Quadro" },
      price_rwf: 2500000, price_usd: 1920, images: [img.desktop], in_stock: true, featured: false,
    },
    {
      name: "Mini PC", category: "computers", brand: "Intel", sku: "MPC-01",
      description: "Intel NUC or similar, Core i3/i5, 8GB RAM, 256GB SSD",
      specifications: { CPU: "Core i5", RAM: "8GB", Storage: "256GB SSD" },
      price_rwf: 300000, price_usd: 230, images: [img.desktop], in_stock: true, featured: false,
    },
    {
      name: "Tablet (Android)", category: "computers", brand: "Samsung", sku: "TAB-A-01",
      description: "8-11 inch screen, 4-8GB RAM, 64-128GB, Wi-Fi/4G, Android 13+",
      specifications: { Screen: "8-11 inch", OS: "Android", RAM: "4GB" },
      price_rwf: 150000, price_usd: 115, images: [img.tablet], in_stock: true, featured: false,
    },
    {
      name: "Server (Tower)", category: "computers", brand: "Dell", sku: "SRV-T-01",
      description: "Xeon/EPYC CPU, 32-256GB ECC RAM, RAID storage",
      specifications: { CPU: "Xeon EPYC", RAM: "32GB ECC", Storage: "RAID HDD" },
      price_rwf: 3000000, price_usd: 2300, images: [img.server], in_stock: true, featured: false,
    },

    // Category 2 - Displays
    {
      name: "Monitor 24 inch FHD", category: "displays", brand: "LG", sku: "MON-24-01",
      description: "1920x1080, IPS panel, HDMI+VGA, 60-75Hz",
      specifications: { Size: "24 inch", Resolution: "1920x1080", Panel: "IPS" },
      price_rwf: 120000, price_usd: 92, images: [img.monitor], in_stock: true, featured: false,
    },
    {
      name: "Monitor 27 inch QHD", category: "displays", brand: "Dell", sku: "MON-27-QHD",
      description: "2560x1440, IPS, HDMI+DisplayPort, 75-144Hz",
      specifications: { Size: "27 inch", Resolution: "2560x1440", Panel: "IPS" },
      price_rwf: 300000, price_usd: 230, images: [img.monitor], in_stock: true, featured: true,
    },
    {
      name: "Projector (Basic)", category: "displays", brand: "Epson", sku: "PRJ-BAS-01",
      description: "3000-4000 lumens, HDMI, 1080p, portable",
      specifications: { Lumens: "3000", Resolution: "1080p HD" },
      price_rwf: 300000, price_usd: 230, images: [img.misc], in_stock: true, featured: false,
    },
    {
      name: "Printer (Laser B&W)", category: "displays", brand: "HP", sku: "PRN-LBW-01",
      description: "35ppm, 1200dpi, USB+Ethernet+Wi-Fi, duplex",
      specifications: { Type: "Laser Monochrome", Speed: "35ppm" },
      price_rwf: 150000, price_usd: 115, images: [img.printer], in_stock: true, featured: false,
    },

    // Category 3 - Input
    {
      name: "Keyboard (Wired USB)", category: "accessories", brand: "Logitech", sku: "KB-WR-01",
      description: "Standard 104-key, USB, spill resistant, quiet keys",
      specifications: { Interface: "Wired USB", Layout: "104 Keys" },
      price_rwf: 100000, price_usd: 8, images: [img.keyboard], in_stock: true, featured: false,
    },
    {
      name: "Keyboard (Mechanical)", category: "accessories", brand: "Corsair", sku: "KB-MECH-01",
      description: "Cherry MX or Gateron switches, RGB backlight",
      specifications: { Type: "Mechanical", Backlight: "RGB" },
      price_rwf: 80000, price_usd: 62, images: [img.keyboard], in_stock: true, featured: false,
    },
    {
      name: "Scanner (Flatbed)", category: "accessories", brand: "Canon", sku: "SCN-FB-01",
      description: "600-1200dpi, A4, USB, color scanning",
      specifications: { Type: "Flatbed", Resolution: "1200dpi" },
      price_rwf: 80000, price_usd: 62, images: [img.printer], in_stock: true, featured: false,
    },

    // Category 4 - Networking
    {
      name: "Router (Business)", category: "networking", brand: "Cisco", sku: "RT-BIZ-01",
      description: "Wi-Fi 6, tri-band, VPN, firewall, 8x LAN",
      specifications: { Standard: "Wi-Fi 6", Ports: "8x LAN Gigabit" },
      price_rwf: 250000, price_usd: 192, images: [img.network], in_stock: true, featured: true,
    },
    {
      name: "Network Switch 24-port", category: "networking", brand: "Ubiquiti", sku: "SW-24-01",
      description: "24x 1Gbps, managed/unmanaged, rack-mount 1U",
      specifications: { Ports: "24-port Gigabit", Mount: "1U Rack-mount" },
      price_rwf: 150000, price_usd: 115, images: [img.network], in_stock: true, featured: false,
    },
    {
      name: "Wi-Fi Access Point", category: "networking", brand: "Ubiquiti", sku: "AP-WF-01",
      description: "802.11ac/ax, dual-band, PoE-powered, ceiling-mount",
      specifications: { Type: "Ceiling Mount", Tech: "802.11ax" },
      price_rwf: 80000, price_usd: 62, images: [img.network], in_stock: true, featured: false,
    },
    {
      name: "Ethernet Cable Cat6 305m", category: "networking", brand: "Generic", sku: "CBL-C6-305",
      description: "Cat6 UTP solid, 1000Mbps, 305m pull box",
      specifications: { Length: "305m", Speed: "1000Mbps" },
      price_rwf: 60000, price_usd: 46, images: [img.network], in_stock: true, featured: false,
    },

    // Category 5 - Storage
    {
      name: "External HDD 1TB", category: "storage", brand: "Seagate", sku: "HDD-EXT-1T",
      description: "1TB, USB 3.0, 2.5 inch, 5400RPM",
      specifications: { Capacity: "1TB", Type: "External HDD 2.5" },
      price_rwf: 60000, price_usd: 46, images: [img.drive], in_stock: true, featured: true,
    },
    {
      name: "External SSD 1TB", category: "storage", brand: "Samsung", sku: "SSD-EXT-1T",
      description: "1TB, USB-C, 1050MB/s read, pocket size",
      specifications: { Capacity: "1TB", Type: "External NVMe" },
      price_rwf: 150000, price_usd: 115, images: [img.drive], in_stock: true, featured: true,
    },
    {
      name: "NAS (2-Bay)", category: "storage", brand: "Synology", sku: "NAS-2B-01",
      description: "2-bay enclosure, Gigabit LAN, RAID 0/1/JBOD",
      specifications: { Bays: "2-Bay", Interface: "Gigabit LAN" },
      price_rwf: 200000, price_usd: 154, images: [img.server], in_stock: true, featured: false,
    },

    // Category 6 - Power
    {
      name: "UPS 1000VA", category: "accessories", brand: "APC", sku: "UPS-1K-01",
      description: "1000VA/600W, line-interactive, AVR, 4-6 outlets",
      specifications: { Capacity: "1000VA", Outlets: "6 Outlets" },
      price_rwf: 150000, price_usd: 115, images: [img.desktop], in_stock: true, featured: false,
    },

    // Category 8 - CCTV
    {
      name: "Dome Camera (Indoor)", category: "security", brand: "Hikvision", sku: "CAM-DM-01",
      description: "2MP or 5MP, 2.8mm lens, IR 20m night vision",
      specifications: { Type: "Indoor Dome", Resolution: "5MP" },
      price_rwf: 40000, price_usd: 31, images: [img.camera], in_stock: true, featured: true,
    },
    {
      name: "DVR 8-Channel", category: "security", brand: "Dahua", sku: "DVR-8C-01",
      description: "8-ch AHD, 5MP Lite, H.265+, 2x SATA bays",
      specifications: { Channels: "8", Storage: "2x SATA bays" },
      price_rwf: 150000, price_usd: 115, images: [img.server], in_stock: true, featured: false,
    },
    {
      name: "IP Camera (Wi-Fi)", category: "security", brand: "Reolink", sku: "CAM-IP-01",
      description: "2MP or 4MP, 2.8mm, two-way audio, motion detection",
      specifications: { Type: "Wi-Fi Camera", Features: "Motion Audio" },
      price_rwf: 60000, price_usd: 46, images: [img.camera], in_stock: true, featured: false,
    },

    // Category 9 - Access Control
    {
      name: "Access Control (Fingerprint)", category: "security", brand: "ZK", sku: "ACC-FP-01",
      description: "Fingerprint + card + PIN, 3000 fingerprints, TCP/IP",
      specifications: { Type: "Biometric Access", Verify: "Fingerprint/Card" },
      price_rwf: 150000, price_usd: 115, images: [img.tablet], in_stock: true, featured: false,
    }
  ];

  for (const product of mockProducts) {
    await prisma.product.create({
      data: {
        name: product.name,
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        description: product.description,
        specifications: product.specifications,
        price_rwf: product.price_rwf,
        price_usd: product.price_usd,
        images: product.images,
        in_stock: product.in_stock,
        featured: product.featured,
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Successfully seeded database with reliable images and precise products.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
