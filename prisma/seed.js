const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const zodiacSigns = [
  { id: 1, slug: "aries", name: "Aries", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: "Fire" },
  { id: 2, slug: "taurus", name: "Taurus", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: "Earth" },
  { id: 3, slug: "gemini", name: "Gemini", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, element: "Air" },
  { id: 4, slug: "cancer", name: "Cancer", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, element: "Water" },
  { id: 5, slug: "leo", name: "Leo", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: "Fire" },
  { id: 6, slug: "virgo", name: "Virgo", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: "Earth" },
  { id: 7, slug: "libra", name: "Libra", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, element: "Air" },
  { id: 8, slug: "scorpio", name: "Scorpio", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, element: "Water" },
  { id: 9, slug: "sagittarius", name: "Sagittarius", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, element: "Fire" },
  { id: 10, slug: "capricorn", name: "Capricorn", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: "Earth" },
  { id: 11, slug: "aquarius", name: "Aquarius", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: "Air" },
  { id: 12, slug: "pisces", name: "Pisces", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: "Water" },
];

const weeklyHoroscopes = [
  {
    zodiacSignId: 1,
    title: "วางแผนใหม่แล้วผลลัพธ์จะชัด",
    summary: "เรื่องงานและเป้าหมายส่วนตัวเริ่มเข้าที่ หากจัดลำดับความสำคัญให้ดีจะเห็นความคืบหน้าเด่นชัด",
    content: "สัปดาห์นี้ราศีมังกรควรใช้ความนิ่งและระเบียบในการรับมือเรื่องงาน การตัดสิ่งรบกวนออกไปจะทำให้ทุกอย่างเดินเร็วขึ้น",
    luckyColor: "กรมท่า",
    luckyNumber: 82,
  },
  {
    zodiacSignId: 4,
    title: "จังหวะเริ่มต้นใหม่กำลังเปิด",
    summary: "เหมาะกับการเดินหน้าโปรเจกต์หรือคุยเรื่องสำคัญที่เลื่อนมานาน เพราะคนรอบตัวพร้อมรับฟังมากขึ้น",
    content: "ราศีเมษมีพลังในการเริ่มต้นสูงในสัปดาห์นี้ ถ้ากล้าตัดสินใจในเรื่องที่ค้างไว้ จะมีแรงส่งที่ดีตามมา",
    luckyColor: "แดงทับทิม",
    luckyNumber: 91,
  },
  {
    zodiacSignId: 7,
    title: "ความสัมพันธ์กลับมาสมดุลขึ้น",
    summary: "การพูดคุยอย่างตรงไปตรงมาจะช่วยเคลียร์ความไม่สบายใจ และทำให้ความสัมพันธ์เดินหน้าอย่างนุ่มนวล",
    content: "ราศีตุลย์โดดเด่นเรื่องการประสานใจ เหมาะกับการเริ่มบทสนทนาที่ต้องใช้ความเข้าใจและการรับฟัง",
    luckyColor: "ชมพูโรสควอตซ์",
    luckyNumber: 88,
  },
  {
    zodiacSignId: 6,
    title: "จัดระบบแล้วเงินจะไหลลื่น",
    summary: "โอกาสด้านรายได้หรือการออมจะดีขึ้น หากคุณตรวจรายละเอียดและทำแผนค่าใช้จ่ายให้ชัดเจน",
    content: "ราศีกันย์มีจังหวะดีด้านการบริหารทรัพยากร ยิ่งจัดระบบไวเท่าไร ยิ่งเห็นผลเร็วเท่านั้น",
    luckyColor: "เขียวมะกอก",
    luckyNumber: 85,
  },
  {
    zodiacSignId: 12,
    title: "พักให้พอแล้วคำตอบจะมาเอง",
    summary: "อารมณ์และสัญชาตญาณทำงานได้ดีมากในสัปดาห์นี้ เหมาะกับการทบทวนเส้นทางที่อยากเลือกจริง ๆ",
    content: "ราศีมีนควรให้เวลาตัวเองกับความเงียบและการพัก เพราะคำตอบสำคัญจะชัดขึ้นเมื่อใจนิ่งลง",
    luckyColor: "ฟ้านิลกาฬ",
    luckyNumber: 84,
  },
];

function getCurrentWeekRange() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diffToMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

async function main() {
  for (const sign of zodiacSigns) {
    await prisma.zodiacSign.upsert({
      where: { id: sign.id },
      update: sign,
      create: sign,
    });
  }

  const { weekStart, weekEnd } = getCurrentWeekRange();

  for (const item of weeklyHoroscopes) {
    await prisma.horoscope.upsert({
      where: {
        zodiacSignId_scope_publishDate: {
          zodiacSignId: item.zodiacSignId,
          scope: "WEEKLY",
          publishDate: weekStart,
        },
      },
      update: {
        ...item,
        scope: "WEEKLY",
        publishDate: weekStart,
        weekStart,
        weekEnd,
        status: "PUBLISHED",
      },
      create: {
        ...item,
        scope: "WEEKLY",
        publishDate: weekStart,
        weekStart,
        weekEnd,
        status: "PUBLISHED",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
