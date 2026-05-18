const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogcategory.findFirst();
  if (!category) {
    console.error("Please create a category first!");
    return;
  }

  const postId = crypto.randomBytes(4).toString("hex");
  const slug = "จัดโต๊ะทำงานเสริมดวงปี-2569-v2"; // Unique slug

  const post = await prisma.blogpost.create({
    data: {
      id: postId,
      title: "จัดโต๊ะทำงานเสริมดวงปี 2569: เคล็ดลับเพิ่มพลังงานบวกและโฟกัส",
      slug: slug,
      excerpt: "เปลี่ยนมุมทำงานให้น่าอยู่และเสริมดวงด้วยหลักฮวงจุ้ยปี 2569 พร้อมไอเทมแนะนำที่สายมูต้องมี!",
      heroImage: "/images/hero-bg.png",
      authorName: "ทีมบรรณาธิการ MULAMOON",
      authorRole: "ทีมบรรณาธิการ",
      status: "PUBLISHED",
      publishedAt: new Date(),
      updatedAt: new Date(),
      categoryId: category.id,
      tags: ["จัดโต๊ะทำงาน", "ฮวงจุ้ย2569", "เสริมดวง", "ไอเทมสายมู"],
      blogpostsection: {
        create: [
          {
            id: crypto.randomBytes(4).toString("hex"),
            heading: "ทำไมต้องจัดโต๊ะทำงานตามหลักฮวงจุ้ยในปี 2569?",
            paragraphs: [
              "ในปี 2569 นี้ พลังงานของ <b>ธาตุไฟ</b> จะมีความโดดเด่นเป็นพิเศษ การจัดวางโต๊ะทำงานให้มีทิศทางที่เหมาะสมจะช่วยลดความวุ่นวายและเพิ่มสมาธิในการทำงานได้เป็นอย่างดี",
              "หากคุณรู้สึกว่างานติดขัด ลองปรับตำแหน่งของ <span style='color: #4f46e5; fontWeight: bold;'>เครื่องเขียนหรือคอมพิวเตอร์</span> ให้อยู่ในตำแหน่งมังกรเขียว (ด้านซ้ายมือ) เพื่อดึงดูดพลังงานด้านความคิดสร้างสรรค์"
            ],
            sortOrder: 0,
            updatedAt: new Date()
          },
          {
            id: crypto.randomBytes(4).toString("hex"),
            heading: "ไอเทมเสริมดวงที่ควรมีบนโต๊ะ",
            paragraphs: [
              "หนึ่งในไอเทมที่มาแรงที่สุดในปีนี้คือ <b>หินอเมทิสต์</b> ซึ่งช่วยในเรื่องความสงบและสติปัญญา คุณสามารถหาซื้อได้ง่ายๆ ผ่านร้านค้าที่เราแนะนำด้านล่างนี้",
              "ลองเช็ค <a href='https://shopee.co.th' target='_blank' style='color: #ee4d2d; text-decoration: underline;'>โปรโมชั่นหินมงคลใน Shopee</a> เพื่อเลือกชิ้นที่ถูกใจที่สุดมาประดับโต๊ะทำงานของคุณ"
            ],
            sortOrder: 2,
            updatedAt: new Date()
          }
        ]
      },
      blogaffiliateproduct: {
        create: [
          {
            id: crypto.randomBytes(4).toString("hex"),
            title: "หินอเมทิสต์ธรรมชาติ เกรดพรีเมียม",
            platform: "shopee",
            productSlug: "amethyst-stone-001",
            image: "https://images.unsplash.com/photo-1567883111021-396590f0550d?q=80&w=400&auto=format&fit=crop",
            priceLabel: "เริ่มต้น 290.-",
            highlights: ["หินแท้ 100%", "เสริมสมาธิและการตัดสินใจ", "ขนาดกะทัดรัด วางบนโต๊ะได้พอดี"],
            badge: "Best Seller",
            accent: "#a855f7",
            targetUrl: "https://shopee.co.th",
            sortOrder: 1,
            updatedAt: new Date()
          }
        ]
      }
    }
  });

  console.log("Created sample post:", post.title);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
