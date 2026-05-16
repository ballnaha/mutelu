"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import {
  MagicStar,
  SearchNormal,
  Profile2User,
  Heart,
  Briefcase,
  MoneySend,
  Calendar,
  Element4,
  Flash,
  Command,
  InfoCircle,
  Gemini,
  Sun1,
  Personalcard,
  Shop,
} from "iconsax-react";
import { AffiliateCard } from "../components/affiliate-card";
import { calculateSaju, type ElementKey, type Pillar } from "@/lib/saju-calculator";

// --- Types & Constants ---

type SajuAffiliateProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  url: string;
  platform?: string;
  productSlug?: string | null;
};

const elementMeta: Record<ElementKey, { label: string; color: string; desc: string; bg: string }> = {
  Wood: { label: "ไม้", color: "#10b981", desc: "การเติบโตและความเมตตา", bg: "rgba(16, 185, 129, 0.1)" },
  Fire: { label: "ไฟ", color: "#f43f5e", desc: "ความร้อนแรงและพลังงาน", bg: "rgba(244, 63, 94, 0.1)" },
  Earth: { label: "ดิน", color: "#f59e0b", desc: "ความมั่นคงและความเชื่อใจ", bg: "rgba(245, 158, 11, 0.1)" },
  Metal: { label: "ทอง", color: "#94a3b8", desc: "ความเด็ดขาดและความยุติธรรม", bg: "rgba(148, 163, 184, 0.1)" },
  Water: { label: "น้ำ", color: "#3b82f6", desc: "ความฉลาดและการปรับตัว", bg: "rgba(59, 130, 246, 0.1)" },
};

const timeOptions = [
  { label: "ไม่ระบุเวลา", value: "none", helper: "คำนวณ 3 เสา" },
  { label: "01:00 - 03:00", value: "02:00", helper: "ยามโฉ่ว" },
  { label: "03:00 - 05:00", value: "04:00", helper: "ยามอิ๋น" },
  { label: "05:00 - 07:00", value: "06:00", helper: "ยามเหมี่ยว" },
  { label: "07:00 - 09:00", value: "08:00", helper: "ยามเฉิน" },
  { label: "09:00 - 11:00", value: "10:00", helper: "ยามซื่อ" },
  { label: "11:00 - 13:00", value: "12:00", helper: "ยามอู่" },
  { label: "13:00 - 15:00", value: "14:00", helper: "ยามเวย" },
  { label: "15:00 - 17:00", value: "16:00", helper: "ยามเซิน" },
  { label: "17:00 - 19:00", value: "18:00", helper: "ยามโหย่ว" },
  { label: "19:00 - 21:00", value: "20:00", helper: "ยามซวี" },
  { label: "21:00 - 23:00", value: "22:00", helper: "ยามไห่" },
  { label: "23:00 - 01:00", value: "00:00", helper: "ยามจื้อ" },
];

const focusOptions = [
  { label: "ภาพรวม", icon: Profile2User, color: "#6366f1", helper: "พื้นดวงชะตา" },
  { label: "ความรัก", icon: Heart, color: "#f43f5e", helper: "เสน่ห์และเนื้อคู่" },
  { label: "การงาน", icon: Briefcase, color: "#10b981", helper: "อาชีพและความสำเร็จ" },
  { label: "การเงิน", icon: MoneySend, color: "#f59e0b", helper: "โชคลาภและความรวย" },
  { label: "สุขภาพ", icon: Flash, color: "#ec4899", helper: "พลังกายและจุดอ่อน" },
  { label: "การเรียน", icon: Command, color: "#8b5cf6", helper: "สติปัญญาและทางสอบ" },
  { label: "ครอบครัว", icon: Profile2User, color: "#06b6d4", helper: "ความสัมพันธ์และบุตร" },
];

const DM_DETAILS: Record<string, Record<string, string>> = {
  "กะ": {
    ภาพรวม: "คุณคือไม้ใหญ่ (Yang Wood) ที่สง่างาม แข็งแกร่งและปกป้องผู้อื่นได้ดี มีความเป็นผู้นำสูงแต่บางครั้งก็ดื้อรั้นไม่ยอมก้มหัวให้ใคร",
    ความรัก: "คุณต้องการความรักที่มีความซื่อสัตย์และหยั่งรากลึกเหมือนต้นไม้ใหญ่ เป็นคนรักที่พึ่งพาได้แต่ต้องการความเคารพเป็นสำคัญ",
    การงาน: "เหมาะกับงานระดับบริหารหรืองานที่ต้องใช้ความเด็ดขาด การเริ่มต้นโปรเจกต์ใหม่ๆ คือความถนัดของคุณ",
    การเงิน: "มีโชคจากการสะสมทรัพย์ระยะยาว การเงินจะเติบโตแบบทวีคูณเมื่อเวลาผ่านไป ไม่ควรลงทุนแบบฉาบฉวย",
    สุขภาพ: "ระวังปัญหาเรื่องตับและสายตา ควรหลีกเลี่ยงความเครียดที่เกิดจากการแบกรับภาระมากเกินไป",
    การเรียน: "เรียนรู้ได้ดีในวิชาเชิงกลยุทธ์และการจัดการ มีความสามารถในการวิเคราะห์ภาพรวมได้อย่างแม่นยำ",
    ครอบครัว: "คุณคือร่มโพธิ์ร่มไทรของบ้าน ความรับผิดชอบต่อครอบครัวเป็นสิ่งที่คุณให้ความสำคัญสูงสุด",
  },
  "อึล": {
    ภาพรวม: "คุณคือไม้ดอกหรือเถาวัลย์ (Yin Wood) ที่ยืดหยุ่นและปรับตัวเก่ง มีไหวพริบปฏิภาณดีและมีเสน่ห์ดึงดูดผู้คน",
    ความรัก: "ความรักของคุณต้องการความอ่อนหวานและการเอาใจใส่ คุณชอบการสื่อสารที่ละมุนละไมและคู่ครองที่ให้เกียรติ",
    การงาน: "โดดเด่นในงานด้านการประสานงาน ศิลปะ หรือการทูต ความยืดหยุ่นทำให้คุณรอดพ้นจากวิกฤตได้เสมอ",
    การเงิน: "มีโชคจากการติดต่อสื่อสารและการเข้าสังคม เงินทองมักจะมาจากหลายช่องทางพร้อมๆ กัน",
    สุขภาพ: "ระวังปัญหาเรื่องระบบประสาทและผิวพรรณ ควรหมั่นทำกิจกรรมที่ช่วยผ่อนคลายจิตใจ",
    การเรียน: "ฉลาดหัวไวและชอบการเรียนรู้ที่หลากหลาย วิชาด้านภาษาและนิเทศศาสตร์จะทำได้โดดเด่น",
    ครอบครัว: "คุณคือสายใยที่เชื่อมความสัมพันธ์ในบ้าน ความอ่อนน้อมทำให้คุณเป็นที่รักของทุกคน",
  },
  "พยอง": {
    ภาพรวม: "คุณคือพระอาทิตย์ (Yang Fire) ที่สว่างไสว ใจกว้างและเปิดเผย คุณชอบความโปร่งใสและมีความกระตือรือร้นสูง",
    ความรัก: "รักที่ร้อนแรงและเปิดเผย คุณไม่ชอบความคลุมเครือและต้องการคู่ครองที่มีความชัดเจนในความรู้สึก",
    การงาน: "เหมาะกับงานเบื้องหน้า งานขาย หรืองานที่ต้องใช้ความเชื่อมั่น พลังงานของคุณดึงดูดโอกาสดีๆ ได้เสมอ",
    การเงิน: "หาเงินเก่งแต่ใช้เงินเก่งเช่นกัน การวางแผนการเงินที่เป็นระบบจะช่วยให้คุณมั่งคั่งได้อย่างรวดเร็ว",
    สุขภาพ: "ระวังปัญหาเรื่องระบบเลือดและหัวใจ การลดความใจร้อนจะช่วยส่งเสริมสุขภาพในระยะยาว",
    การเรียน: "มีความคิดสร้างสรรค์และชอบการนำเสนอผลงาน จะทำได้ดีในวิชาที่ต้องใช้การสื่อสารและการแสดงออก",
    ครอบครัว: "คุณคือพลังงานบวกของบ้าน ความอบอุ่นของคุณทำให้คนรอบข้างรู้สึกมีพลัง",
  },
  "จอง": {
    ภาพรวม: "คุณคือเปลวเทียนหรือแสงตะเกียง (Yin Fire) ที่นุ่มนวลและช่างสังเกต มีความลึกซึ้งและมีจริยธรรมสูง",
    ความรัก: "ความรักที่อบอุ่นและใส่ใจรายละเอียด คุณเป็นที่ปรึกษาและคนรักที่เข้าใจจิตใจผู้อื่นได้อย่างดีเยี่ยม",
    การงาน: "เก่งในงานเบื้องหลัง งานวิเคราะห์ หรือวิชาชีพเฉพาะทาง ความละเอียดอ่อนทำให้งานของคุณโดดเด่น",
    การเงิน: "มีการวางแผนการเงินที่ดีและรอบคอบ มีโชคจากการใช้ความรู้เฉพาะทางในการหาเงิน",
    สุขภาพ: "ระวังปัญหาเรื่องสายตาและการพักผ่อนไม่เพียงพอ ความกังวลใจอาจส่งผลต่อสุขภาพได้",
    การเรียน: "เรียนรู้ได้ลึกซึ้งและมีสมาธิดีมาก จะประสบความสำเร็จในวิชาที่ต้องใช้ความเพียรและสติปัญญา",
    ครอบครัว: "คุณคือคนที่คอยดูแลความรู้สึกของคนในบ้านอย่างเงียบๆ ความรักของคุณแสดงออกผ่านการกระทำ",
  },
  "มู": {
    ภาพรวม: "คุณคือขุนเขาที่ยิ่งใหญ่ (Yang Earth) มีความหนักแน่น มั่นคง และเป็นที่พึ่งพาได้อย่างดีเยี่ยม",
    ความรัก: "ความรักที่ซื่อสัตย์และยั่งยืน คุณมองหาความสัมพันธ์ระยะยาวและเป็นคู่ครองที่มั่นคงที่สุด",
    การงาน: "เหมาะกับงานที่ต้องใช้ความรับผิดชอบสูงหรืองานด้านการจัดการโครงสร้าง ความนิ่งคือความได้เปรียบของคุณ",
    การเงิน: "การเงินมีความมั่นคงและมีเกณฑ์เป็นเจ้าของทรัพย์สินขนาดใหญ่ ความมั่งคั่งจะมาจากการสะสมที่ต่อเนื่อง",
    สุขภาพ: "ระวังปัญหาเรื่องกระเพาะอาหารและระบบย่อยอาหาร การกินอยู่ให้เป็นเวลาจะช่วยให้สุขภาพดี",
    การเรียน: "มีความอดทนสูงในการเรียนรู้ วิชาเชิงประวัติศาสตร์หรือการบริหารจะทำได้ดีเป็นพิเศษ",
    ครอบครัว: "คุณคือรากฐานที่สำคัญที่สุดของบ้าน ความเชื่อใจคือสิ่งที่คุณมอบให้และต้องการจากครอบครัว",
  },
  "กี": {
    ภาพรวม: "คุณคือดินสวนที่อุดมสมบูรณ์ (Yin Earth) มีความเมตตา โอบอ้อมอารี และมีความละเอียดอ่อนสูง",
    ความรัก: "ความรักที่เต็มไปด้วยการดูแลและใส่ใจ คุณต้องการคู่ครองที่พร้อมจะสร้างครอบครัวที่อุดมสมบูรณ์ไปพร้อมกัน",
    การงาน: "โดดเด่นในงานบริการ การศึกษา หรือจิตวิทยา ความใจเย็นของคุณทำให้คนรอบข้างไว้ใจ",
    การเงิน: "การเงินมีความงอกเงยแบบธรรมชาติ การลงทุนในสิ่งที่ช่วยพัฒนาคนจะนำพาโชคลาภมาให้",
    สุขภาพ: "ระวังปัญหาเรื่องระบบช่องท้องและม้าม ควรเลือกทานอาหารที่ย่อยง่ายและรักษาสุขภาพจิตให้แจ่มใส",
    การเรียน: "เรียนรู้ได้ดีจากการปฏิบัติจริง คุณมีพรสวรรค์ในการถ่ายทอดความรู้และเข้าใจความรู้สึกผู้อื่น",
    ครอบครัว: "คุณคือผู้ที่ทำให้บ้านร่มเย็น ความใส่ใจของคุณคือสิ่งที่คนในครอบครัวขาดไม่ได้",
  },
  "คยอง": {
    ภาพรวม: "คุณคือแร่เหล็กหรือดาบที่คมกริบ (Yang Metal) มีความเด็ดขาด ยุติธรรม และรักความถูกต้องเหนือสิ่งอื่นใด",
    ความรัก: "รักที่ตรงไปตรงมาและมีความรับผิดชอบ คุณต้องการคนรักที่มีความกล้าหาญและชัดเจนเหมือนคุณ",
    การงาน: "เหมาะกับงานด้านกฎหมาย การตรวจสอบ หรือตำแหน่งบริหารที่ต้องใช้การตัดสินใจที่เด็ดขาด",
    การเงิน: "บริหารเงินก้อนใหญ่ได้ดี มีโชคจากการทำธุรกิจที่ต้องใช้ความกล้าและการแข่งขัน",
    สุขภาพ: "ระวังปัญหาเรื่องปอดและระบบทางเดินหายใจ การออกกำลังกายเสริมความแข็งแกร่งจะดีมาก",
    การเรียน: "มีความคิดเป็นตรรกะและเด็ดขาด วิชาคำนวณหรืองานวิจัยเชิงลึกคือสิ่งที่ถนัด",
    ครอบครัว: "คุณเป็นผู้ปกป้องครอบครัวที่ดีเยี่ยม แต่อาจจะต้องระวังคำพูดที่อาจจะดูขวานผ่าซากไปบ้าง",
  },
  "ซิน": {
    ภาพรวม: "คุณคืออัญมณีหรือทองคำขาว (Yin Metal) ที่ประณีต ล้ำค่า และมีความเป็นตัวของตัวเองสูง",
    ความรัก: "ความรักที่มีรสนิยมและต้องการความเข้าใจ คุณชอบคู่ครองที่ให้เกียรติและเห็นคุณค่าในตัวคุณ",
    การงาน: "โดดเด่นในงานออกแบบ ความสวยงาม หรืองานที่ต้องใช้ความประณีตสูง ไสตล์ของคุณคือจุดขาย",
    การเงิน: "มีโชคจากการใช้รสนิยมดึงดูดทรัพย์สิน มีเกณฑ์มีฐานะดีจากการใช้ความคิดสร้างสรรค์",
    สุขภาพ: "ระวังปัญหาเรื่องผิวพรรณและการขับถ่าย การดูแลตัวเองให้ดูดีเสมอคือการเสริมพลังธาตุ",
    การเรียน: "ฉลาดหลักแหลมและมีความคิดที่ซับซ้อน จะทำได้ดีในวิชาด้านศิลปะหรือนวัตกรรมสมัยใหม่",
    ครอบครัว: "คุณคือความภูมิใจของบ้าน ความสำเร็จของคุณมักจะนำชื่อเสียงมาสู่ครอบครัวเสมอ",
  },
  "อิม": {
    ภาพรวม: "คุณคือมหาสมุทร (Yang Water) ที่กว้างขวาง มีปัญญาเฉลียวฉลาดและมีความยืดหยุ่นสูงสุด",
    ความรัก: "ความรักที่ยิ่งใหญ่และเปิดกว้าง คุณต้องการคนรักที่เป็นเพื่อนคู่คิดและร่วมเดินทางไปกับคุณได้",
    การงาน: "เหมาะกับงานต่างประเทศ งานขนส่ง หรือธุรกิจที่มีความหลากหลาย การรับมือกับวิกฤตคือความถนัด",
    การเงิน: "เงินทองไหลเวียนคล่องตัว มีโชคจากการเดินทางและการติดต่อธุรกิจข้ามแดน",
    สุขภาพ: "ระวังปัญหาเรื่องระบบทางเดินปัสสาวะและไต การดื่มน้ำที่สะอาดสม่ำเสมอจะช่วยส่งเสริมธาตุ",
    การเรียน: "เรียนรู้เร็วและเข้าใจภาพรวมได้กว้างขวาง มีพรสวรรค์ในวิชาเชิงสังคมศาสตร์และการเจรจา",
    ครอบครัว: "คุณเป็นคนที่นำพาความก้าวหน้ามาสู่บ้าน ความคิดของคุณมักจะนำหน้าผู้อื่นอยู่เสมอ",
  },
  "คเย": {
    ภาพรวม: "คุณคือหยาดน้ำฝนหรือน้ำค้าง (Yin Water) ที่ฉลาด มีไหวพริบ และมีความเมตตาที่ละเอียดอ่อน",
    ความรัก: "ความรักที่นุ่มนวลและลึกซึ้ง คุณต้องการคู่ครองที่มีความอ่อนโยนและเข้าใจอารมณ์ของคุณได้ดี",
    การงาน: "โดดเด่นในงานวิชาการ การวางแผน หรือการให้คำปรึกษา ไหวพริบที่นุ่มนวลทำให้คุณสำเร็จได้เงียบๆ",
    การเงิน: "มีการวางแผนการเงินที่แยบคาย มีโชคลาภเล็กๆ น้อยๆ เข้ามาสม่ำเสมอจากการวางแผนที่ดี",
    สุขภาพ: "ระวังปัญหาเรื่องอารมณ์และระบบหมุนเวียนเลือด การรักษาสภาวะจิตให้สงบจะช่วยให้สุขภาพดี",
    การเรียน: "มีความจำดีเยี่ยมและเรียนรู้ด้วยความเข้าใจที่ลึกซึ้ง จะโดดเด่นในวิชาด้านจินตนาการและภาษา",
    ครอบครัว: "คุณคือคนที่คอยประสานความเข้าใจในบ้าน ความละเอียดอ่อนของคุณทำให้ทุกคนรู้สึกสบายใจ",
  },
};

const PILLAR_IMAGES: Record<string, string> = {
  "갑자": "หนูไม้ (Green Rat) - ผู้บุกเบิกที่มีไหวพริบ",
  "을축": "วัวไม้ (Green Ox) - ความเพียรที่งอกเงย",
  "병인": "เสือไฟ (Red Tiger) - พลังอำนาจที่เจิดจรัส",
  "정묘": "กระต่ายไฟ (Red Rabbit) - เสน่ห์ที่นุ่มนวล",
  "무진": "มังกรดิน (Yellow Dragon) - ความยิ่งใหญ่ที่มั่นคง",
  "기사": "งูไฟ (Yellow Snake) - ความฉลาดที่ล้ำลึก",
  "경โอ": "ม้าทอง (White Horse) - ความเร็วที่ทรงพลัง",
  "신미": "แพะทอง (White Goat) - ความงามที่สูงค่า",
  "임신": "ลิงน้ำ (Black Monkey) - ไหวพริบที่ไหลลื่น",
  "계유": "ไก่น้ำ (Black Rooster) - ความแม่นยำที่นุ่มนวล",
  "갑술": "สุนัขไม้ (Green Dog) - ความซื่อสัตย์ที่ปกป้อง",
  "을해": "หมูไม้ (Green Pig) - ความสุขที่ยั่งยืน",
  "병자": "หนูไฟ (Red Rat) - ความฉลาดที่ร้อนแรง",
  "정축": "วัวไฟ (Red Ox) - ความอดทนที่มีพลัง",
  "무인": "เสือดิน (Yellow Tiger) - ความน่าเกรงขามที่มั่นคง",
  "기묘": "กระต่ายดิน (Yellow Rabbit) - ความเมตตาที่อุดมสมบูรณ์",
  "경진": "มังกรทอง (White Dragon) - ความสำเร็จที่เจิดจ้า",
  "신사": "งูทอง (White Snake) - ความลับที่ล้ำค่า",
  "임โอ": "ม้าน้ำ (Black Horse) - อิสระที่กว้างไกล",
  "계มิ": "แพะน้ำ (Black Goat) - ความคิดสร้างสรรค์ที่หลั่งไหล",
  "갑신": "ลิงไม้ (Green Monkey) - ความคล่องแคล่วที่ฉลาด",
  "계해": "หมูน้ำ (Black Pig) - ความสงบที่ล้ำลึก",
  "갑โอ": "ม้าไม้ (Green Horse) - อิสระที่มาพร้อมวินัย",
  "을미": "แพะไม้ (Green Goat) - ความคิดสร้างสรรค์ที่สงบ",
  "병신": "ลิงไฟ (Red Monkey) - ไหวพริบที่เฉียบคม",
  "정ยู": "ไก่ไฟ (Red Rooster) - ความสง่างามที่ขยัน",
  "무술": "สุนัขดิน (Yellow Dog) - ความน่าเชื่อถือที่ซื่อสัตย์",
  "기해": "หมูดิน (Yellow Pig) - ความสมบูรณ์ที่ใจกว้าง",
  "경자": "หนูทอง (White Rat) - ความฉลาดที่เด็ดขาด",
  "신축": "วัวทอง (White Ox) - ความพยายามที่มีคุณค่า",
  "신ยู": "ไก่ทอง (White Rooster) - ความประณีตและรสนิยม",
  "임술": "สุนัขน้ำ (Black Dog) - มิตรภาพที่ลึกซึ้ง",
  "경신": "ลิงทอง (White Monkey) - ความฉลาดที่คมกริบ",
};

// --- UI Components ---

function ElementIcon({ element, size = 20 }: { element: ElementKey; size?: number }) {
  const meta = elementMeta[element];
  return (
    <Box sx={{ width: size + 10, height: size + 10, borderRadius: "50%", bgcolor: meta.bg, display: "grid", placeItems: "center", color: meta.color }}>
      <Element4 size={size} variant="Bulk" color="currentColor" />
    </Box>
  );
}

function getTenGodLevel(count: number) {
  if (count >= 2) return "เด่นมาก";
  if (count >= 1.4) return "เด่น";
  if (count >= 0.8) return "มีผล";
  return "เสริมเล็กน้อย";
}

function PillarItem({ pillar, isDayMaster }: { pillar: Pillar; isDayMaster?: boolean }) {
  const pillarKey = pillar.stem.korean + pillar.branch.korean;
  const nickname = PILLAR_IMAGES[pillarKey];

  return (
    <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "0" }, p: 2.5, borderRadius: "16px", bgcolor: isDayMaster ? "#f5f3ff" : "transparent", border: isDayMaster ? "2px solid #4f46e5" : "1px solid #f1f5f9", textAlign: "center", transition: "all 0.2s ease", position: "relative" }}>
      {isDayMaster && (
        <Chip label="DAY MASTER" size="small" sx={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", bgcolor: "#4f46e5", color: "#fff", fontSize: "0.6rem", fontWeight: 900, height: 20 }} />
      )}
      <Typography sx={{ color: "#4f46e5", fontSize: "0.85rem", fontWeight: 600, mb: 1.5, letterSpacing: "0.02em" }}>
        {pillar.label === "ปี" ? "ปี (년)" : pillar.label === "เดือน" ? "เดือน (월)" : pillar.label === "วัน" ? "วัน (일)" : "เวลา (시)"}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ color: "#0f172a", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.1, mb: 0.5, letterSpacing: "-0.02em" }}>{pillar.stem.korean}{pillar.branch.korean}</Typography>
        <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>({pillar.stem.name}{pillar.branch.name})</Typography>
      </Box>
      <Stack direction="column" spacing={0.8} sx={{ alignItems: "center" }}>
        <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: elementMeta[pillar.stem.element].bg }}>
          <Typography sx={{ color: elementMeta[pillar.stem.element].color, fontSize: "0.72rem", fontWeight: 800 }}>{elementMeta[pillar.stem.element].label} ({pillar.stem.polarity})</Typography>
        </Box>
        <Chip label={pillar.stem.tenGod.thaiLabel} size="small" sx={{ height: 20, bgcolor: isDayMaster ? "#4f46e5" : "#f8fafc", color: isDayMaster ? "#fff" : "#475569", fontSize: "0.62rem", fontWeight: 800, borderRadius: "6px" }} />
        <Typography sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 600 }}>{pillar.branch.animal}</Typography>
      </Stack>
      {pillar.hiddenStems.length > 0 && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #e2e8f0" }}>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.62rem", fontWeight: 800, mb: 0.8 }}>ธาตุซ่อนในเสา</Typography>
          <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center", flexWrap: "wrap", rowGap: 0.6 }}>
            {pillar.hiddenStems.map((stem) => (
              <Chip
                key={`${pillar.label}-${stem.korean}-${stem.tenGod.key}`}
                label={`${elementMeta[stem.element].label} ${stem.tenGod.thaiLabel}`}
                size="small"
                sx={{ height: 21, bgcolor: elementMeta[stem.element].bg, color: elementMeta[stem.element].color, fontSize: "0.62rem", fontWeight: 800, borderRadius: "6px" }}
              />
            ))}
          </Stack>
        </Box>
      )}
      {nickname && <Typography sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #e2e8f0", color: "#64748b", fontSize: "0.65rem", fontWeight: 700, lineHeight: 1.4 }}>{nickname.split(" - ")[0]}</Typography>}
    </Box>
  );
}

// --- Main Page Component ---

export function SajuClient() {
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs("1995-05-15"));
  const [birthTime, setBirthTime] = useState("none");
  const [usesCustomTime, setUsesCustomTime] = useState(false);
  const [customBirthTime] = useState("12:00");
  const [focus, setFocus] = useState("ภาพรวม");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [affiliateProducts, setAffiliateProducts] = useState<SajuAffiliateProduct[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [analysisTab, setAnalysisTab] = useState(0);


  const reading = useMemo(() => {
    if (!birthDate || !birthDate.isValid()) return null;
    try {
      return calculateSaju(birthDate, birthTime, usesCustomTime, customBirthTime);
    } catch (e) {
      console.error("Saju Calculation Error:", e);
      return null;
    }
  }, [birthDate, birthTime, usesCustomTime, customBirthTime]);
  const luckyElement = reading?.luckyElement;

  const activeFocus = useMemo(() => {
    return focusOptions.find((opt) => opt.label === focus) || focusOptions[0];
  }, [focus]);


  // Fetch Affiliate Products from DB based on Lucky Element
  useEffect(() => {
    if (showResults && luckyElement) {
      const fetchAffiliates = async () => {
        setIsProductsLoading(true);
        try {
          const elementEnum = luckyElement.toUpperCase();
          const res = await fetch(`/api/affiliate?element=${elementEnum}`);
          const data = await res.json();
          setAffiliateProducts(data);
        } catch (error) {
          console.error("Failed to fetch affiliates:", error);
        } finally {
          setIsProductsLoading(false);
        }
      };
      fetchAffiliates();
    }
  }, [showResults, luckyElement]);

  const handlePredict = () => {
    if (!birthDate) return;
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
      setAnalysisTab(0);
      setTimeout(() => {
        const resultSection = document.getElementById("saju-reveal");
        if (resultSection) resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1800);
  };

  useEffect(() => {
    queueMicrotask(() => setShowResults(false));
  }, [birthDate, birthTime, usesCustomTime, customBirthTime, focus]);

  return (
    <Box sx={{ pt: { xs: 8, md: 10 }, pb: 8, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 1.5 }}>
            <MagicStar size={20} color="#4f46e5" variant="Bulk" />
            <Typography sx={{ color: "#4f46e5", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.1em" }}>KOREAN DESTINY ANALYSIS</Typography>
          </Stack>
          <Typography component="h1" sx={{ color: "#0f172a", fontSize: { xs: "2.2rem", md: "3rem" }, fontWeight: 800, mb: 1.5 }}>วิเคราะห์พื้นดวงชะตาชีวิต</Typography>
          <Typography sx={{ color: "#64748b", fontSize: "1rem", maxWidth: 650, mx: "auto" }}>ถอดรหัสพลังงาน 4 เสาหลักประจำตัว พร้อมวิเคราะห์ความแข็งแกร่งของดวงและคำแนะนำรายวัน</Typography>
        </Box>

        {/* Input Card */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "28px", p: { xs: 3, md: 5 }, boxShadow: "0 40px 100px -20px rgba(15,23,42,0.08)", border: "1px solid #f1f5f9", mb: 5, position: "relative", overflow: "hidden" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: { xs: 4, lg: 6 }, mb: 4 }}>
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#f5f3ff", display: "grid", placeItems: "center" }}><Calendar size={20} color="#4f46e5" variant="Bulk" /></Box>
                <Typography sx={{ color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>วันและเวลาเกิด</Typography>
              </Stack>
              <Stack spacing={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                  <DatePicker 
                    label="วัน เดือน ปีเกิด" 
                    value={birthDate} 
                    onChange={setBirthDate} 
                    maxDate={dayjs()} 
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        sx: { 
                          "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#f8fafc", border: "none" }, 
                          "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #e2e8f0" } 
                        } 
                      } 
                    }} 
                  />
                </LocalizationProvider>
                <Box>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, mb: 1.5, ml: 0.5 }}>ระบุเวลาเกิด (Yam)</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                    {timeOptions.map((opt) => (
                      <Button 
                        key={opt.value} 
                        onClick={() => { setUsesCustomTime(false); setBirthTime(opt.value); }} 
                        sx={{ 
                          borderRadius: "12px", 
                          border: (!usesCustomTime && birthTime === opt.value) ? "1.5px solid #4f46e5" : "1.5px solid #f1f5f9", 
                          bgcolor: (!usesCustomTime && birthTime === opt.value) ? "#f5f3ff" : "transparent", 
                          color: (!usesCustomTime && birthTime === opt.value) ? "#4f46e5" : "#64748b", 
                          p: 1.2, 
                          minHeight: 56, 
                          flexDirection: "column", 
                          textTransform: "none", 
                          fontSize: "0.8rem", 
                          fontWeight: 700, 
                          lineHeight: 1.2, 
                          transition: "all 0.2s", 
                          "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" } 
                        }}
                      >
                        <Box>{opt.label.split(" (")[0]}</Box>
                        <Box sx={{ fontSize: "0.6rem", opacity: 0.7, fontWeight: 600 }}>{opt.helper}</Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#fff7ed", display: "grid", placeItems: "center" }}><Flash size={20} color="#f59e0b" variant="Bulk" /></Box>
                <Typography sx={{ color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>วิเคราะห์เรื่องที่ต้องการเน้น</Typography>
              </Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
                {focusOptions.map((opt) => (
                  <Button 
                    key={opt.label} 
                    onClick={() => setFocus(opt.label)} 
                    sx={{ 
                      display: "flex", 
                      flexDirection: "row", 
                      justifyContent: "flex-start", 
                      alignItems: "center", 
                      gap: 1.5, 
                      p: 2, 
                      borderRadius: "14px", 
                      border: focus === opt.label ? `2px solid ${opt.color}` : "1.5px solid #f1f5f9", 
                      bgcolor: focus === opt.label ? `${opt.color}08` : "transparent", 
                      color: focus === opt.label ? opt.color : "#64748b", 
                      transition: "all 0.2s", 
                      textAlign: "left", 
                      "&:hover": { borderColor: opt.color, bgcolor: `${opt.color}05` } 
                    }}
                  >
                    <opt.icon size={24} variant={focus === opt.label ? "Bulk" : "Outline"} color="currentColor" />
                    <Box>
                      <Typography sx={{ fontSize: "0.94rem", fontWeight: 700, lineHeight: 1.2 }}>{opt.label}</Typography>
                      <Typography sx={{ fontSize: "0.68rem", opacity: 0.8, fontWeight: 600 }}>{opt.helper}</Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
              <Box sx={{ mt: 3, p: 2.5, borderRadius: "16px", bgcolor: "#f0fdf4", border: "1px solid #bae6fd" }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <InfoCircle size={20} color="#0284c7" />
                  <Typography sx={{ color: "#0284c7", fontSize: "0.85rem", fontWeight: 700 }}>ระบบ Saju (Four Pillars of Destiny)</Typography>
                </Stack>
                <Typography sx={{ color: "#0369a1", fontSize: "0.8rem", mt: 1, lineHeight: 1.5 }}>เป็นการทำนาย &quot;พื้นดวงชะตาชีวิต&quot; ที่ติดตัวมาแต่เกิด เพื่อใช้วางแผนชีวิตในระยะยาวครับ</Typography>
              </Box>
            </Box>
          </Box>
          <Button 
            fullWidth 
            onClick={handlePredict} 
            disabled={isCalculating || !birthDate} 
            sx={{ 
              height: 68, 
              borderRadius: "18px", 
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
              color: "#fff", 
              fontSize: "1.15rem", 
              fontWeight: 800, 
              textTransform: "none", 
              boxShadow: "0 15px 30px -10px rgba(15,23,42,0.3)", 
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
              "&:hover": { background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", transform: "translateY(-2px)", boxShadow: "0 20px 35px -10px rgba(15,23,42,0.4)" }, 
              "&.Mui-disabled": { background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "rgba(255,255,255,0.5)", opacity: 0.8 }, 
              "&:active": { transform: "translateY(0)" } 
            }}
          >
            {isCalculating ? (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Box sx={{ width: 22, height: 22, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <Typography sx={{ fontWeight: 800, fontSize: "inherit", letterSpacing: "0.02em" }}>กำลังวิเคราะห์พื้นดวงชะตา...</Typography>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Gemini size={24} variant="Bulk" color="#fbbf24" />
                <Typography sx={{ fontWeight: 800, fontSize: "inherit", letterSpacing: "0.02em" }}>ทำนายดวงชะตาชีวิต (Read My Destiny)</Typography>
              </Stack>
            )}
          </Button>
        </Box>

        {/* Results */}
        {showResults && reading ? (
          <Box id="saju-reveal" sx={{ animation: "resultFadeIn 1s cubic-bezier(0.2, 0, 0.2, 1)" }}>
            {/* Focus Indicator Header */}
            <Box sx={{ mb: 4, p: 2.5, borderRadius: "20px", bgcolor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "14px", bgcolor: activeFocus.color, display: "grid", placeItems: "center", boxShadow: `0 8px 16px -4px ${activeFocus.color}40` }}>
                  <activeFocus.icon size={24} color="#fff" variant="Bulk" />
                </Box>
                <Box>
                  <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>หัวข้อที่กำลังวิเคราะห์</Typography>
                  <Typography sx={{ color: "#0f172a", fontSize: "1.25rem", fontWeight: 800 }}>วิเคราะห์เรื่อง{focus}</Typography>
                </Box>
              </Stack>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981", animation: "pulse 2s infinite" }} />
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>การวิเคราะห์มีความแม่นยำสูง</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.25fr 0.75fr" }, gap: 3 }}>
              <Box>
                {/* Main Analysis Section with Tabs */}
                <Box sx={{ bgcolor: "#fff", p: 0, borderRadius: "28px", border: "1px solid #eef2f7", mb: 4, overflow: "hidden", boxShadow: "0 20px 50px -15px rgba(0,0,0,0.05)" }}>
                  {focus !== "ภาพรวม" ? (
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafc' }}>
                      <Tabs 
                        value={analysisTab} 
                        onChange={(_, v) => setAnalysisTab(v)} 
                        variant="fullWidth"
                        sx={{ 
                          '& .MuiTab-root': { py: 2.5, fontWeight: 800, fontSize: '0.95rem' },
                          '& .Mui-selected': { color: '#4f46e5 !important' },
                          '& .MuiTabs-indicator': { height: 3, bgcolor: '#4f46e5', borderRadius: '3px 3px 0 0' }
                        }}
                      >
                        <Tab 
                          icon={<activeFocus.icon size={20} variant="Bulk" />} 
                          iconPosition="start" 
                          label={`วิเคราะห์เรื่อง${focus}`} 
                        />
                        <Tab 
                          icon={<Profile2User size={20} variant="Bulk" />} 
                          iconPosition="start" 
                          label="ตัวตนพื้นฐาน (ถาวร)" 
                        />
                      </Tabs>
                    </Box>
                  ) : (
                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafc' }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "#f5f3ff", display: "grid", placeItems: "center" }}>
                          <MagicStar size={24} color="#4f46e5" variant="Bulk" />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a" }}>เจาะลึกคำทำนาย</Typography>
                          <Typography sx={{ fontSize: "0.88rem", color: "#64748b", fontWeight: 600 }}>วิเคราะห์ภาพรวมพื้นดวงชะตาชีวิต</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  <Box sx={{ p: { xs: 3, md: 4 } }}>
                    {/* Tab Content */}
                    {(analysisTab === 0 || focus === "ภาพรวม") ? (
                      <Box sx={{ animation: "resultFadeIn 0.5s ease" }}>
                        <Box sx={{ p: 3, borderRadius: "20px", bgcolor: `${activeFocus.color}08`, border: `1px solid ${activeFocus.color}20`, position: "relative", overflow: "hidden" }}>
                          <Box sx={{ position: "absolute", top: -10, right: -10, opacity: 0.05, transform: "rotate(-15deg)" }}>
                            <activeFocus.icon size={120} color={activeFocus.color} variant="Bulk" />
                          </Box>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5, position: "relative" }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: activeFocus.color, display: "grid", placeItems: "center", boxShadow: `0 4px 12px ${activeFocus.color}40` }}>
                              <activeFocus.icon size={24} color="#fff" variant="Bulk" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: activeFocus.color }}>บทวิเคราะห์เรื่อง{focus}</Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>{focus === "ภาพรวม" ? "ศักยภาพและพื้นฐานชีวิตในทุกด้าน" : "เจาะลึกตามหัวข้อที่คุณเลือกเน้นเป็นพิเศษ"}</Typography>
                            </Box>
                          </Stack>
                          <Typography sx={{ color: "#1e293b", fontSize: "1.1rem", lineHeight: 2, fontWeight: 500, position: "relative" }}>
                            {DM_DETAILS[reading.dayMaster.name][focus] || DM_DETAILS[reading.dayMaster.name]["ภาพรวม"]}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ animation: "resultFadeIn 0.5s ease" }}>
                        <Box sx={{ p: 3, borderRadius: "20px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e2e8f0", display: "grid", placeItems: "center" }}>
                              <Profile2User size={24} color="#64748b" variant="Bulk" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: "#334155" }}>ลักษณะนิสัยพื้นฐาน (ถาวร)</Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ตัวตนที่แท้จริงตามวันเกิดของคุณ</Typography>
                            </Box>
                          </Stack>
                          <Typography sx={{ color: "#334155", fontSize: "1.1rem", lineHeight: 2 }}>
                            {DM_DETAILS[reading.dayMaster.name]["ภาพรวม"]}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ mt: 4, p: 3, bgcolor: "#f0fdf4", borderRadius: "20px", border: "1px solid #bbf7d0" }}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "#fff", display: "grid", placeItems: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                          <Element4 size={24} color="#10b981" variant="Bulk" />
                        </Box>
                        <Box>
                          <Typography sx={{ color: "#065f46", fontSize: "1.05rem", fontWeight: 800, mb: 0.5 }}>ธาตุเสริมดวงตลอดชีพ (Lucky Element)</Typography>
                          <Typography sx={{ color: "#047857", fontSize: "0.95rem", lineHeight: 1.7 }}>
                            แนะนำให้เสริมด้วย **ธาตุ{elementMeta[reading.luckyElement].label}** {reading.luckyElement === "Wood" ? "โดยการเน้นโทนสีเขียวหรือความใกล้ชิดธรรมชาติ" : reading.luckyElement === "Fire" ? "โดยการเน้นโทนสีแดงหรือกิจกรรมที่ให้พลังงาน" : reading.luckyElement === "Earth" ? "โดยการเน้นโทนสีเหลืองหรือความมั่นคงเป็นหลัก" : reading.luckyElement === "Metal" ? "โดยการเน้นโทนสีขาวหรือเครื่องประดับโลหะ" : "โดยการเน้นโทนสีน้ำเงินหรือการปรับสมดุลด้วยน้ำ"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                {/* Daily Horoscope Section */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#fff7ed", display: "grid", placeItems: "center" }}><Sun1 size={20} color="#f59e0b" variant="Bulk" /></Box>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#0f172a" }}>ดวงรายวันเฉพาะคุณ (Daily Insight)</Typography>
                    <Chip label="อัปเดตทุกวัน" size="small" sx={{ bgcolor: "#fff7ed", color: "#c2410c", fontWeight: 600, fontSize: "0.7rem" }} />
                  </Stack>
                  <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: "24px", border: "1px solid #fed7aa", display: "flex", flexWrap: { xs: "wrap", md: "nowrap" }, alignItems: "center", gap: 3, background: "linear-gradient(90deg, #fff 0%, #fff7ed 100%)", boxShadow: "0 10px 30px -15px rgba(245,158,11,0.15)" }}>
                    <Box sx={{ textAlign: "center", minWidth: 100 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: "#9a3412", fontWeight: 700, mb: 1 }}>สถานะพลังงาน</Typography>
                      <Box sx={{ display: "inline-flex", px: 2, py: 1, borderRadius: "12px", bgcolor: reading.dailyLuckStatus === "ดีมาก" ? "#dcfce7" : reading.dailyLuckStatus === "ควรระวัง" ? "#fee2e2" : "#fef3c7" }}>
                        <Typography sx={{ fontSize: "1.2rem", fontWeight: 900, color: reading.dailyLuckStatus === "ดีมาก" ? "#166534" : reading.dailyLuckStatus === "ควรระวัง" ? "#991b1b" : "#92400e" }}>
                          {reading.dailyLuckStatus}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" }, bgcolor: "#fdba74" }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: "0.85rem", color: "#9a3412", fontWeight: 700, mb: 0.5 }}>คำแนะนำสำหรับวันที่ {dayjs().format("D MMM YYYY")}</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#431407", lineHeight: 1.6, fontWeight: 500 }}>
                        {reading.dailyAdvice}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Life Path Section */}
                <Box>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#f5f3ff", display: "grid", placeItems: "center" }}><Personalcard size={20} color="#4f46e5" variant="Bulk" /></Box>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#0f172a" }}>พื้นดวงชะตาชีวิต (Life Path Foundation)</Typography>
                    <Chip label="ข้อมูลตลอดชีวิต" size="small" sx={{ bgcolor: "#f5f3ff", color: "#4338ca", fontWeight: 600, fontSize: "0.7rem" }} />
                  </Stack>
                  
                  <Box sx={{ bgcolor: "#fff", p: 3.5, borderRadius: "24px", border: "1px solid #eef2f7", mb: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Box><Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>แผนผังเสาหลักชีวิต (The 4 Pillars)</Typography><Typography sx={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>โครงสร้างพลังงานที่กำหนดตัวตนของคุณ</Typography></Box>
                      <Chip label={reading.isStrong ? "ธาตุแข็งแรง" : "ธาตุอ่อนกำลัง"} color={reading.isStrong ? "success" : "warning"} variant="outlined" sx={{ fontWeight: 800, borderRadius: "8px" }} />
                    </Stack>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {reading.pillars.map((p, i) => (<PillarItem key={p.label} pillar={p} isDayMaster={i === 2} />))}
                      {!reading.hasBirthTime && (<Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "0" }, bgcolor: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1", display: "grid", placeItems: "center", p: 2 }}><Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700 }}>ยามว่างเปล่า</Typography></Box>)}
                    </Box>
                    {reading.tenGodSummary.length > 0 && (
                      <Box sx={{ mt: 3, p: 3, borderRadius: "20px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 2.5 }}>
                          <Box sx={{ maxWidth: 520 }}>
                            <Typography sx={{ fontSize: { xs: "1.06rem", md: "1.12rem" }, fontWeight: 800, color: "#0f172a", mb: 0.8 }}>พลังชีวิตเด่นในดวง</Typography>
                            <Typography sx={{ fontSize: { xs: "0.92rem", md: "0.96rem" }, color: "#64748b", lineHeight: 1.7 }}>
                              ส่วนนี้สรุปว่าพลังแบบไหนส่งผลกับชีวิตคุณมากที่สุด เช่น งาน เงิน พรสวรรค์ คนช่วยเหลือ หรือแรงผลักดันจากการแข่งขัน
                            </Typography>
                          </Box>
                          <Chip label={`เด่นสุด: ${reading.tenGodSummary[0].thaiLabel}`} sx={{ bgcolor: "#4f46e5", color: "#fff", fontSize: "0.88rem", fontWeight: 800, borderRadius: "10px", height: 36 }} />
                        </Stack>
                        <Box sx={{ p: 2.5, mb: 2, borderRadius: "16px", bgcolor: "#fff", border: "1px solid #e2e8f0" }}>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
                            <Box sx={{ minWidth: 120 }}>
                              <Typography sx={{ color: "#4f46e5", fontSize: { xs: "1.18rem", md: "1.24rem" }, fontWeight: 900 }}>{reading.tenGodSummary[0].thaiLabel}</Typography>
                              <Typography sx={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 700 }}>{reading.tenGodSummary[0].label}</Typography>
                            </Box>
                            <Typography sx={{ color: "#334155", fontSize: { xs: "0.96rem", md: "1rem" }, lineHeight: 1.8, fontWeight: 500 }}>{reading.tenGodSummary[0].description}</Typography>
                          </Stack>
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.2 }}>
                          {reading.tenGodSummary.slice(1, 5).map((god) => (
                            <Box key={god.key} sx={{ p: 1.8, borderRadius: "14px", bgcolor: "#fff", border: "1px solid #edf2f7" }}>
                              <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
                                <Typography sx={{ color: "#0f172a", fontSize: "0.96rem", fontWeight: 800 }}>{god.thaiLabel}</Typography>
                                <Chip label={getTenGodLevel(god.count)} size="small" sx={{ height: 24, bgcolor: "#f1f5f9", color: "#64748b", fontSize: "0.76rem", fontWeight: 800, borderRadius: "7px" }} />
                              </Stack>
                              <Typography sx={{ color: "#64748b", fontSize: "0.86rem", lineHeight: 1.6 }}>{god.description}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Stack spacing={3} sx={{ position: "sticky", top: 100 }}>
                  {/* Element Balance */}
                  <Box sx={{ bgcolor: "#fff", p: 4, borderRadius: "28px", border: "1px solid #f1f5f9", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.03)" }}>
                    <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 4 }}><Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#f8fafc", display: "grid", placeItems: "center" }}><Element4 size={18} color="#0f172a" variant="Bulk" /></Box><Typography sx={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>สมดุลธาตุพื้นดวง</Typography></Stack>
                    <Stack spacing={3}>{reading.rankedElements.map((el) => { const meta = elementMeta[el]; const score = reading.scores[el]; const max = Math.max(...Object.values(reading.scores)); return (<Box key={el}><Stack direction="row" sx={{ justifyContent: "space-between", mb: 1.2 }}><Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}><ElementIcon element={el} size={14} /><Typography sx={{ fontSize: "0.94rem", fontWeight: 600, color: "#334155" }}>ธาตุ{meta.label}</Typography></Stack><Typography sx={{ fontSize: "0.94rem", fontWeight: 700, color: meta.color }}>{score}%</Typography></Stack><Box sx={{ height: 10, borderRadius: "10px", bgcolor: "#f1f5f9", overflow: "hidden" }}><Box sx={{ height: "100%", width: `${(score / max) * 100}%`, bgcolor: meta.color, borderRadius: "10px", transition: "width 1s ease-out" }} /></Box></Box>); })}</Stack>
                    <Box sx={{ mt: 5, p: 3, borderRadius: "20px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9", textAlign: "center" }}>
                      <Typography sx={{ color: "#0f172a", fontSize: "0.94rem", fontWeight: 700, mb: 1 }}>ธาตุเจ้าเรือน (Day Master)</Typography>
                      <Box sx={{ display: "inline-flex", px: 2, py: 0.8, borderRadius: "10px", bgcolor: elementMeta[reading.dayMaster.element].bg, border: `1px solid ${elementMeta[reading.dayMaster.element].color}33` }}><Typography sx={{ color: elementMeta[reading.dayMaster.element].color, fontSize: "1.1rem", fontWeight: 800 }}>{reading.dayMaster.name} ({elementMeta[reading.dayMaster.element].label}{reading.dayMaster.polarity})</Typography></Box>
                    </Box>
                  </Box>

                  {/* Affiliate Product Section in Sidebar */}
                  <Box sx={{ bgcolor: "#fff", p: 3.5, borderRadius: "28px", border: "1px solid #f1f5f9", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.03)" }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#ecfdf5", display: "grid", placeItems: "center" }}><Shop size={20} color="#10b981" variant="Bulk" /></Box>
                      <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>ของมงคลแนะนำ</Typography>
                    </Stack>
                    
                    {isProductsLoading ? (
                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <CircularProgress size={24} sx={{ color: "#10b981" }} />
                        <Typography sx={{ mt: 1, fontSize: "0.8rem", color: "#64748b" }}>กำลังค้นหาสินค้าเสริมดวง...</Typography>
                      </Box>
                    ) : affiliateProducts.length > 0 ? (
                      <Stack spacing={2}>
                        {affiliateProducts.map((product) => (
                          <AffiliateCard
                            key={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.image}
                            link={product.url}
                            platform={product.platform}
                            platformLabel={product.platform}
                            productSlug={product.productSlug}
                            variant="sidebar"
                            accentColor={elementMeta[reading.luckyElement].color}
                            badge="เสริมดวง"
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>ยังไม่มีสินค้าแนะนำสำหรับธาตุนี้</Typography>
                      </Box>
                    )}
                    
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.65rem", textAlign: "center", mt: 2.5, fontStyle: "italic" }}>* เสริมพลังธาตุ {elementMeta[reading.luckyElement].label} เพื่อปรับสมดุลชีวิต</Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 10, border: "2px dashed #e2e8f0", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <SearchNormal size={56} color="#cbd5e1" variant="TwoTone" />
            <Typography sx={{ color: "#94a3b8", fontSize: "1.1rem", mt: 2.5, fontWeight: 600 }}>รอการวิเคราะห์ข้อมูลพื้นดวงชะตาชีวิต</Typography>
          </Box>
        )}
      </Container>
      <style jsx global>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes resultFadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </Box>
  );
}
