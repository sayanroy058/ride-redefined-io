import bcrypt from "bcryptjs";
import { getDb } from "./db";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
  "https://images.unsplash.com/photo-1617814086367-3a4b9d12ac02?w=1200&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
];

const OWNERSHIP = ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"];
const STATES = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "West Bengal",
  "Haryana",
];
const CITIES = [
  "Mumbai",
  "Bengaluru",
  "New Delhi",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Kolkata",
  "Gurugram",
  "Pune",
  "Noida",
];

const SELLERS = [
  "Aarav Sharma",
  "Priya Patel",
  "Rohan Mehta",
  "Sneha Iyer",
  "Vikram Singh",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CARS = [
  {
    brand: "Tesla",
    model: "Model 3",
    variant: "Long Range AWD",
    year: 2022,
    fuelType: "Electric",
    transmission: "Automatic",
    expectedPrice: 4850000,
    bodyType: "Sedan",
  },
  {
    brand: "BMW",
    model: "M340i",
    variant: "xDrive",
    year: 2021,
    fuelType: "Petrol",
    transmission: "Automatic",
    expectedPrice: 5290000,
    bodyType: "Sedan",
  },
  {
    brand: "Porsche",
    model: "Macan",
    variant: "S",
    year: 2020,
    fuelType: "Petrol",
    transmission: "DCT",
    expectedPrice: 6890000,
    bodyType: "SUV",
  },
  {
    brand: "Mercedes-Benz",
    model: "C300",
    variant: "AMG Line",
    year: 2022,
    fuelType: "Petrol",
    transmission: "Automatic",
    expectedPrice: 4990000,
    bodyType: "Sedan",
  },
  {
    brand: "Audi",
    model: "Q5",
    variant: "45 TFSI Premium",
    year: 2021,
    fuelType: "Petrol",
    transmission: "DCT",
    expectedPrice: 4650000,
    bodyType: "SUV",
  },
  {
    brand: "Toyota",
    model: "Camry",
    variant: "XSE Hybrid",
    year: 2023,
    fuelType: "Hybrid",
    transmission: "CVT",
    expectedPrice: 3890000,
    bodyType: "Sedan",
  },
  {
    brand: "Honda",
    model: "Civic",
    variant: "Sport Touring",
    year: 2022,
    fuelType: "Petrol",
    transmission: "CVT",
    expectedPrice: 1850000,
    bodyType: "Hatchback",
  },
  {
    brand: "Polestar",
    model: "2",
    variant: "Long Range Dual",
    year: 2022,
    fuelType: "Electric",
    transmission: "Automatic",
    expectedPrice: 5290000,
    bodyType: "Sedan",
  },
  {
    brand: "Volvo",
    model: "XC60",
    variant: "T8 Recharge",
    year: 2021,
    fuelType: "Hybrid",
    transmission: "Automatic",
    expectedPrice: 5490000,
    bodyType: "SUV",
  },
  {
    brand: "Lexus",
    model: "RX 350",
    variant: "F Sport",
    year: 2020,
    fuelType: "Petrol",
    transmission: "Automatic",
    expectedPrice: 5290000,
    bodyType: "SUV",
  },
  {
    brand: "Hyundai",
    model: "Ioniq 5",
    variant: "Limited AWD",
    year: 2023,
    fuelType: "Electric",
    transmission: "Automatic",
    expectedPrice: 4490000,
    bodyType: "SUV",
  },
  {
    brand: "Kia",
    model: "EV6",
    variant: "GT-Line AWD",
    year: 2022,
    fuelType: "Electric",
    transmission: "Automatic",
    expectedPrice: 4190000,
    bodyType: "SUV",
  },
  {
    brand: "Mazda",
    model: "CX-5",
    variant: "Signature Turbo",
    year: 2021,
    fuelType: "Petrol",
    transmission: "Automatic",
    expectedPrice: 2290000,
    bodyType: "SUV",
  },
  {
    brand: "Volkswagen",
    model: "Golf GTI",
    variant: "Autobahn",
    year: 2022,
    fuelType: "Petrol",
    transmission: "DCT",
    expectedPrice: 2890000,
    bodyType: "Hatchback",
  },
];

export function seed() {
  const db = getDb();

  const count = db.prepare("SELECT COUNT(*) as c FROM listings").get() as {
    c: number;
  };
  if (count.c > 0) return; // already seeded

  // ── Seed admin and agent users ──
  const adminHash = bcrypt.hashSync("admin", 10);
  db.prepare(
    "INSERT OR IGNORE INTO users (id, name, email, phone, role, password) VALUES (?, ?, ?, ?, ?, ?)",
  ).run("admin-1", "Admin", "admin@drivehub.io", null, "admin", adminHash);

  const agentHash = bcrypt.hashSync("agent", 10);
  db.prepare(
    "INSERT OR IGNORE INTO users (id, name, email, phone, role, password) VALUES (?, ?, ?, ?, ?, ?)",
  ).run("agent-1", "Agent Priya", "agent@drivehub.io", null, "agent", agentHash);

  // ── Seed listings ──
  const insertListing = db.prepare(`
    INSERT INTO listings (id, sellerId, sellerName, sellerEmail, sellerPhone, brand, model, variant,
      year, registrationYear, fuelType, transmission, kmDriven, ownership, registrationState,
      registrationCity, vin, insuranceStatus, roadTaxStatus, serviceHistory, accidentHistory,
      keys, exteriorCondition, interiorCondition, engineCondition, tireCondition, batteryCondition,
      defects, modifications, description, expectedPrice, address, preferredContactTime, bodyType,
      images, status, pricing, createdAt, views, featured)
    VALUES (@id, @sellerId, @sellerName, @sellerEmail, @sellerPhone, @brand, @model, @variant,
      @year, @registrationYear, @fuelType, @transmission, @kmDriven, @ownership, @registrationState,
      @registrationCity, @vin, @insuranceStatus, @roadTaxStatus, @serviceHistory, @accidentHistory,
      @keys, @exteriorCondition, @interiorCondition, @engineCondition, @tireCondition, @batteryCondition,
      @defects, @modifications, @description, @expectedPrice, @address, @preferredContactTime, @bodyType,
      @images, @status, @pricing, @createdAt, @views, @featured)
  `);

  const seedListings = db.transaction(() => {
    CARS.forEach((c, i) => {
      const expectedPrice = c.expectedPrice;
      const refurb = Math.round(expectedPrice * 0.04);
      const repair = Math.round(expectedPrice * 0.02);
      const transport = 35000;
      const inspection = 18000;
      const documentation = 12000;
      const commission = Math.round(expectedPrice * 0.05);
      const margin = Math.round(expectedPrice * 0.08);
      const finalPrice =
        expectedPrice +
        refurb +
        repair +
        transport +
        inspection +
        documentation +
        commission +
        margin;

      const startIdx = i % SAMPLE_IMAGES.length;
      const images = [
        ...SAMPLE_IMAGES.slice(startIdx),
        ...SAMPLE_IMAGES.slice(0, startIdx),
      ].slice(0, 10);

      const status =
        i < 8
          ? "listed"
          : i < 11
            ? "approved"
            : i < 13
              ? "pending_review"
              : "under_inspection";

      const pricing =
        i < 8
          ? {
              basePrice: expectedPrice,
              refurbishment: refurb,
              repair,
              transportation: transport,
              inspection,
              documentation,
              commission,
              margin,
              finalPrice,
            }
          : null;

      insertListing.run({
        id: `seed-${i + 1}`,
        sellerId: `seed-seller-${i + 1}`,
        sellerName: SELLERS[i % 5],
        sellerEmail: `seller${i + 1}@example.in`,
        sellerPhone: `+91 98${(2000000 + i * 137)
          .toString()
          .slice(0, 8)}`,
        brand: c.brand,
        model: c.model,
        variant: c.variant,
        year: c.year,
        registrationYear: c.year,
        fuelType: c.fuelType,
        transmission: c.transmission,
        kmDriven: randInt(8000, 75000),
        ownership: rand(OWNERSHIP),
        registrationState: rand(STATES),
        registrationCity: rand(CITIES),
        vin: `VIN${(1000000 + i * 37).toString().padStart(11, "0")}`,
        insuranceStatus: rand(["Active", "Expired", "Expires soon"]),
        roadTaxStatus: "Paid",
        serviceHistory: rand([
          "Complete dealer history",
          "Partial records",
          "Owner serviced",
        ]),
        accidentHistory: rand([
          "No accidents",
          "Minor — repaired",
          "None reported",
        ]),
        keys: rand([1, 2, 2, 2, 3]),
        exteriorCondition: rand(["Excellent", "Very Good", "Good"]),
        interiorCondition: rand(["Excellent", "Very Good", "Good"]),
        engineCondition: rand(["Excellent", "Very Good"]),
        tireCondition: rand(["New (90%+)", "Good (70%+)", "Fair (50%+)"]),
        batteryCondition: rand(["Excellent", "Good"]),
        defects:
          "Minor cosmetic wear on driver-side bolster. Small stone chip on hood.",
        modifications: "None — fully stock",
        description: `Well-maintained ${c.brand} ${c.model} ${c.variant}. Single-family ownership, garage-kept, all service records available.`,
        expectedPrice,
        address: "123 Market Street",
        preferredContactTime: rand([
          "Morning (9-12)",
          "Afternoon (12-5)",
          "Evening (5-8)",
        ]),
        bodyType: c.bodyType,
        images: JSON.stringify(images),
        status,
        pricing: pricing ? JSON.stringify(pricing) : null,
        createdAt: Date.now() - (i + 1) * 86400000,
        views: randInt(120, 2200),
        featured: i < 4 ? 1 : 0,
      });
    });
  });

  // ── Seed tickets ──
  const insertTicket = db.prepare(`
    INSERT INTO tickets (id, name, email, subject, category, message, status, createdAt)
    VALUES (@id, @name, @email, @subject, @category, @message, @status, @createdAt)
  `);

  const seedTickets = db.transaction(() => {
    const tickets = [
      {
        id: "t-1",
        name: "John Lee",
        email: "john@example.com",
        subject: "Financing options for Tesla Model 3",
        category: "Financing",
        message: "Hi, what are the EMI options?",
        status: "open",
        createdAt: Date.now() - 86400000,
      },
      {
        id: "t-2",
        name: "Maria Gomez",
        email: "maria@example.com",
        subject: "Inspection report missing",
        category: "Inspection",
        message: "Can you share the full report?",
        status: "in_progress",
        createdAt: Date.now() - 2 * 86400000,
      },
      {
        id: "t-3",
        name: "Sam Patel",
        email: "sam@example.com",
        subject: "Refund status",
        category: "Purchase",
        message: "Awaiting refund update.",
        status: "waiting_customer",
        createdAt: Date.now() - 4 * 86400000,
      },
      {
        id: "t-4",
        name: "Aisha Khan",
        email: "aisha@example.com",
        subject: "Doc upload error",
        category: "Support",
        message: "Can't upload PDF.",
        status: "resolved",
        createdAt: Date.now() - 7 * 86400000,
      },
    ];
    for (const t of tickets) {
      insertTicket.run(t);
    }
  });

  // ── Seed offers ──
  const insertOffer = db.prepare(`
    INSERT INTO offers (id, listingId, buyerName, amount, message, state, counterAmount, createdAt)
    VALUES (@id, @listingId, @buyerName, @amount, @message, @state, @counterAmount, @createdAt)
  `);

  const seedOffers = db.transaction(() => {
    const offers = [
      {
        id: "o-1",
        listingId: "seed-1",
        buyerName: "Arjun Kapoor",
        amount: 4750000,
        message: "Cash, can pick up this weekend.",
        state: "pending",
        counterAmount: null,
        createdAt: Date.now() - 3 * 3600000,
      },
      {
        id: "o-2",
        listingId: "seed-1",
        buyerName: "Riya N.",
        amount: 4680000,
        message: "Trade-in available.",
        state: "countered",
        counterAmount: 4720000,
        createdAt: Date.now() - 86400000,
      },
    ];
    for (const o of offers) {
      insertOffer.run(o);
    }
  });

  // ── Seed reviews ──
  const REVIEW_AUTHORS = [
    "Aditya R.",
    "Megha S.",
    "Karthik V.",
    "Neha G.",
    "Rahul D.",
    "Pooja M.",
  ];
  const REVIEW_TITLES = [
    "Excellent condition, as described",
    "Smooth buying experience",
    "Great value for money",
    "Worth every rupee",
    "Highly recommend DriveHub",
  ];
  const REVIEW_BODIES = [
    "The 200-point inspection was spot on. Car felt brand new. Paperwork was seamless.",
    "Test drive was easy to book and the advisor was transparent about every detail.",
    "Pricing was fair and the financing options were clearly explained. No hidden charges.",
    "Refurbishment quality is top-notch. Couldn't find a single issue during delivery.",
    "From browsing to delivery, the whole process took 4 days. Very impressed.",
  ];

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, listingId, userId, name, rating, title, body, createdAt)
    VALUES (@id, @listingId, @userId, @name, @rating, @title, @body, @createdAt)
  `);

  const seedReviews = db.transaction(() => {
    for (let idx = 0; idx < 8; idx++) {
      const listingId = `seed-${idx + 1}`;
      const count = (idx % 3) + 1;
      for (let i = 0; i < count; i++) {
        insertReview.run({
          id: `sr-${listingId}-${i}`,
          listingId,
          userId: `seed-reviewer-${idx}-${i}`,
          name: REVIEW_AUTHORS[(idx + i) % REVIEW_AUTHORS.length],
          rating: 4 + ((idx + i) % 2),
          title: REVIEW_TITLES[(idx + i) % REVIEW_TITLES.length],
          body: REVIEW_BODIES[(idx + i) % REVIEW_BODIES.length],
          createdAt: Date.now() - (i + 1) * 86400000 * (idx + 1),
        });
      }
    }
  });

  seedListings();
  seedTickets();
  seedOffers();
  seedReviews();

  console.log("✅ Database seeded: admin, agent, 14 cars, tickets, offers, reviews");
}

// Run directly via: npx tsx server/seed.ts
// Uses process.argv to check if this file is the main entry point
const isMain = process.argv[1] &&
  (process.argv[1].endsWith("/seed.ts") || process.argv[1].endsWith("\\seed.ts"));
if (isMain) {
  console.log("Seeding database...");
  seed();
  console.log("Seed complete.");
}
