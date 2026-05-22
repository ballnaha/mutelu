"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Backdrop,
  Drawer,
  IconButton,
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
import { calculateSaju, type AnnualInfluence, type BirthGender, type ElementKey, type Pillar, type SajuReading } from "@/lib/saju-calculator";

// --- Types & Constants ---

type SajuAffiliateProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  url: string;
  platform?: string;
  productSlug?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
};

const elementMeta: Record<ElementKey, { label: string; color: string; desc: string; bg: string }> = {
  Wood: { label: "ไม้", color: "#10b981", desc: "การเติบโตและความเมตตา", bg: "rgba(16, 185, 129, 0.1)" },
  Fire: { label: "ไฟ", color: "#f43f5e", desc: "ความร้อนแรงและพลังงาน", bg: "rgba(244, 63, 94, 0.1)" },
  Earth: { label: "ดิน", color: "#f59e0b", desc: "ความมั่นคงและความเชื่อใจ", bg: "rgba(245, 158, 11, 0.1)" },
  Metal: { label: "ทอง", color: "#94a3b8", desc: "ความเด็ดขาดและความยุติธรรม", bg: "rgba(148, 163, 184, 0.1)" },
  Water: { label: "น้ำ", color: "#3b82f6", desc: "ความฉลาดและการปรับตัว", bg: "rgba(59, 130, 246, 0.1)" },
};

const luckyElementAdvice: Record<ElementKey, string> = {
  Wood: "ธาตุไม้ช่วยเสริมการเติบโต ความคิดสร้างสรรค์ และโอกาสใหม่ ๆ เหมาะกับการอยู่ใกล้ธรรมชาติ ใช้สีเขียว หรือเริ่มสิ่งที่ต้องค่อย ๆ สะสมผล",
  Fire: "ธาตุไฟช่วยเสริมความมั่นใจ เสน่ห์ และแรงผลักดัน เหมาะกับการใช้สีแดงหรือชมพู ออกกำลังกาย และทำกิจกรรมที่ทำให้รู้สึกมีชีวิตชีวา",
  Earth: "ธาตุดินช่วยเสริมความมั่นคง วินัย และการตัดสินใจที่หนักแน่น เหมาะกับการจัดบ้าน วางแผนเงิน ใช้โทนเหลือง น้ำตาล หรือของที่ให้ความรู้สึกมั่นคง",
  Metal: "ธาตุทองช่วยเสริมความชัดเจน มาตรฐาน และความน่าเชื่อถือ เหมาะกับสีขาว เทา เงิน เครื่องประดับโลหะ หรือการจัดระเบียบชีวิตให้เรียบง่ายขึ้น",
  Water: "ธาตุน้ำช่วยเสริมสติ ไหวพริบ และการสื่อสาร เหมาะกับสีฟ้า น้ำเงิน การดื่มน้ำให้พอ หรืออยู่ใกล้บรรยากาศที่สงบและไหลลื่น",
};

const timeOptions = [
  { label: "ไม่ระบุเวลา", value: "none", helper: "คำนวณ 3 เสา" },
  { label: "01:00 - 02:59", value: "02:00", helper: "ยามโฉ่ว" },
  { label: "03:00 - 04:59", value: "04:00", helper: "ยามอิ๋น" },
  { label: "05:00 - 06:59", value: "06:00", helper: "ยามเหมี่ยว" },
  { label: "07:00 - 08:59", value: "08:00", helper: "ยามเฉิน" },
  { label: "09:00 - 10:59", value: "10:00", helper: "ยามซื่อ" },
  { label: "11:00 - 12:59", value: "12:00", helper: "ยามอู่" },
  { label: "13:00 - 14:59", value: "14:00", helper: "ยามเวย" },
  { label: "15:00 - 16:59", value: "16:00", helper: "ยามเซิน" },
  { label: "17:00 - 18:59", value: "18:00", helper: "ยามโหย่ว" },
  { label: "19:00 - 20:59", value: "20:00", helper: "ยามซวี" },
  { label: "21:00 - 22:59", value: "22:00", helper: "ยามไห่" },
  { label: "23:00 - 23:59", value: "23:00", helper: "ยามจื้อ (ต้น)" },
  { label: "00:00 - 00:59", value: "00:00", helper: "ยามจื้อ (ปลาย)" },
];

const genderOptions: Array<{ label: string; value: BirthGender; symbol: string; helper: string }> = [
  { label: "ชาย", value: "male", symbol: "♂", helper: "อ่านเรื่องคู่แบบชาย" },
  { label: "หญิง", value: "female", symbol: "♀", helper: "อ่านเรื่องคู่แบบหญิง" },
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

const readableElementProfiles: Record<ElementKey, Record<"+" | "-", string>> = {
  Wood: {
    "+": "คุณเป็นคนมีหลัก มีความรับผิดชอบ และชอบปกป้องคนรอบตัว จุดแข็งคือความหนักแน่นและความเป็นผู้นำ แต่ควรระวังการยึดความคิดตัวเองมากเกินไป",
    "-": "คุณเป็นคนยืดหยุ่น ปรับตัวเก่ง และเข้าใจผู้คนได้ดี จุดแข็งคือการประสานงานและการมองหาทางออก แต่ควรระวังการตามใจคนอื่นจนลืมความต้องการของตัวเอง",
  },
  Fire: {
    "+": "คุณเป็นคนเปิดเผย มีพลัง และทำให้คนรอบตัวรู้สึกมีแรงตาม จุดแข็งคือความชัดเจนและความกล้าเริ่มต้น แต่ควรระวังการใจร้อนหรือตัดสินใจเร็วเกินไป",
    "-": "คุณเป็นคนละเอียด ช่างสังเกต และเข้าใจความรู้สึกคนอื่น จุดแข็งคือความลึกซึ้งและการคิดรอบด้าน แต่ควรระวังการเก็บความกังวลไว้คนเดียว",
  },
  Earth: {
    "+": "คุณเป็นคนมั่นคง น่าเชื่อถือ และเป็นที่พึ่งให้คนอื่นได้ จุดแข็งคือความอดทนและความรับผิดชอบ แต่ควรระวังการแบกภาระมากเกินไป",
    "-": "คุณเป็นคนใจเย็น ดูแลคนเก่ง และใส่ใจรายละเอียด จุดแข็งคือความอ่อนโยนและความรอบคอบ แต่ควรระวังการลังเลหรือไม่กล้าปฏิเสธ",
  },
  Metal: {
    "+": "คุณเป็นคนเด็ดขาด รักความถูกต้อง และมีมาตรฐานสูง จุดแข็งคือการตัดสินใจและความยุติธรรม แต่ควรระวังคำพูดที่ตรงเกินไป",
    "-": "คุณเป็นคนมีรสนิยม ละเอียด และเห็นคุณค่าในคุณภาพ จุดแข็งคือความประณีตและความคิดเป็นระบบ แต่ควรระวังการคาดหวังกับตัวเองสูงเกินไป",
  },
  Water: {
    "+": "คุณเป็นคนคิดกว้าง เรียนรู้เร็ว และรับมือสถานการณ์เปลี่ยนแปลงได้ดี จุดแข็งคือไหวพริบและการมองภาพใหญ่ แต่ควรระวังการคิดหลายทางจนตัดสินใจช้า",
    "-": "คุณเป็นคนอ่อนโยน ลึกซึ้ง และเข้าใจความรู้สึกคนอื่น จุดแข็งคือการสื่อสารและสัญชาตญาณ แต่ควรระวังการเก็บเรื่องไว้ในใจนานเกินไป",
  },
};

const localGeneratingElement: Record<ElementKey, ElementKey> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const localControllingElement: Record<ElementKey, ElementKey> = {
  Wood: "Earth",
  Fire: "Metal",
  Earth: "Water",
  Metal: "Wood",
  Water: "Fire",
};

function getElementThatGenerates(element: ElementKey) {
  return (Object.entries(localGeneratingElement) as Array<[ElementKey, ElementKey]>).find(([, target]) => target === element)?.[0] ?? element;
}

function getElementThatControls(element: ElementKey) {
  return (Object.entries(localControllingElement) as Array<[ElementKey, ElementKey]>).find(([, target]) => target === element)?.[0] ?? element;
}

function getTenGodScore(reading: SajuReading, keys: string[]) {
  return reading.tenGodSummary.filter((god) => keys.includes(god.key)).reduce((sum, god) => sum + god.count, 0);
}

function getElementLevel(score: number) {
  if (score >= 28) return "เด่นมาก";
  if (score >= 20) return "พอมีแรง";
  if (score >= 12) return "ค่อนข้างบาง";
  return "อ่อนมาก";
}

function getRelationshipAdvice(reading: SajuReading, spouseElement: ElementKey, spouseScore: number, wealthScore: number, officerScore: number, outputScore: number) {
  if (spouseScore >= 28) {
    return reading.gender === "male"
      ? "ดาวคู่ขึ้นชัดแบบนี้มักดึงดูดความสัมพันธ์ที่มาพร้อมภาระหรือความรับผิดชอบ ควรดูว่าอีกฝ่ายพร้อมเดินชีวิตจริงร่วมกันไหม ไม่ใช่ดูแค่ความถูกใจ"
      : "ดาวคู่ขึ้นชัดแบบนี้มักดึงดูดคนจริงจังหรือความสัมพันธ์ที่มีเงื่อนไขชัด ควรค่อย ๆ ดูว่าเขาทำให้ชีวิตมั่นคงขึ้นหรือทำให้รู้สึกถูกกดดันเกินไป";
  }

  if (spouseScore <= 11) {
    return "ดาวคู่ค่อนข้างบาง ความรักจึงไม่ควรรีบเร่งหรือวัดจากสัญญาณช่วงสั้น ๆ คนที่เหมาะมักค่อย ๆ เข้ามาผ่านความสม่ำเสมอและความไว้ใจ";
  }

  if (reading.isStrong && outputScore >= 1.4) {
    return "ดวงมีแรงแสดงออกชัด เวลารักใครจึงควรระวังพูดเร็ว ตัดสินเร็ว หรือเผลอนำความสัมพันธ์มากเกินไป เว้นพื้นที่ให้อีกฝ่ายเดินเข้ามาเองบ้างจะดีกว่า";
  }

  if (!reading.isStrong && officerScore >= 1.2) {
    return "ดวงนี้ไวต่อความคาดหวังจากคู่หรือคนรัก ถ้าความสัมพันธ์ทำให้ต้องเกร็งตลอดเวลา แปลว่าพลังคู่กด Day Master มากไป ควรมองหาความสัมพันธ์ที่ให้ความมั่นคงโดยไม่บีบตัวตน";
  }

  if (wealthScore >= 1.4) {
    return "ดาวทรัพย์มีแรง ความรักมักโยงกับการดูแลกัน เรื่องงาน เงิน หรือการสร้างอนาคต ถ้าคุยเรื่องเป้าหมายชีวิตและการใช้ทรัพยากรไปทางเดียวกัน ความสัมพันธ์จะเดินง่าย";
  }

  return `ความรักของดวงนี้ควรเติมคุณภาพของธาตุ${elementMeta[spouseElement].label}: ${spouseElement === "Wood" ? "ให้เวลากันเติบโตและไม่เร่งให้อีกฝ่ายเปลี่ยนเร็วเกินไป" : spouseElement === "Fire" ? "เปิดเผยความรู้สึกให้ชัด แต่อย่าใช้อารมณ์นำทุกครั้ง" : spouseElement === "Earth" ? "พิสูจน์ด้วยความสม่ำเสมอและความรับผิดชอบในชีวิตจริง" : spouseElement === "Metal" ? "ตั้งขอบเขตและความคาดหวังให้ชัดโดยไม่ทำให้ความรักแข็งเกินไป" : "สื่อสารให้ลึกและยืดหยุ่น อย่าปล่อยให้ความลังเลสะสม"}`;
}

function pickStrongestSignal(signals: Array<{ text: string; score: number }>) {
  return signals.sort((a, b) => b.score - a.score)[0]?.text ?? "ดวงนี้ต้องอ่านแบบผสมหลายปัจจัย ไม่มีดาวใดฟันธงเดี่ยวได้ชัด";
}

function getCoreSajuAnalysis(reading: SajuReading, focus: string) {
  const { dayMaster } = reading;
  const profile = readableElementProfiles[dayMaster.element][dayMaster.polarity];
  const ranked = (Object.entries(reading.scores) as Array<[ElementKey, number]>).sort((a, b) => b[1] - a[1]);
  const [strongestElement, strongestScore] = ranked[0];
  const [weakestElement, weakestScore] = ranked[ranked.length - 1];
  const wealthElement = localControllingElement[dayMaster.element];
  const officerElement = getElementThatControls(dayMaster.element);
  const outputElement = localGeneratingElement[dayMaster.element];
  const resourceElement = getElementThatGenerates(dayMaster.element);
  const wealthScore = getTenGodScore(reading, ["PYEON_JAE", "JEONG_JAE"]);
  const officerScore = getTenGodScore(reading, ["PYEON_GWAN", "JEONG_GWAN"]);
  const outputScore = getTenGodScore(reading, ["SIK_SIN", "SANG_GWAN"]);
  const resourceScore = getTenGodScore(reading, ["PYEON_IN", "JEONG_IN"]);
  const peerScore = getTenGodScore(reading, ["DAY_MASTER", "BI_GYEON", "GEOP_JAE"]);
  const topGod = reading.tenGodSummary[0];
  const strengthText = reading.isStrong
    ? "Day Master ค่อนข้างมีแรง จึงรับบทบาทใหญ่ แข่งขัน หรือจัดการเรื่องยากได้ดี แต่ต้องระวังใช้พลังมากจนแข็งเกินไป"
    : "Day Master ยังต้องการแรงหนุน จึงควรเดินแบบมีระบบ มีคนช่วย และค่อย ๆ สะสมผลมากกว่าฝืนลุยคนเดียว";
  const balanceText = `ธาตุที่เด่นคือ${elementMeta[strongestElement].label} (${strongestScore}%) ส่วนธาตุที่บางคือ${elementMeta[weakestElement].label} (${weakestScore}%) ภาพรวมจึงควรใช้จุดแข็งให้ถูกทางและเติมธาตุ${elementMeta[reading.luckyElement].label}เพื่อปรับสมดุล`;

  if (focus === "ความรัก") {
    const spouseElement = reading.relationshipElement;
    const spouseScore = reading.scores[spouseElement];
    const spouseLens = reading.gender === "male" ? "ผู้ชายจะอ่านคู่จากดาวทรัพย์ เพราะคู่สัมพันธ์กับสิ่งที่ Day Master เข้าไปดูแลและรับผิดชอบ" : "ผู้หญิงจะอ่านคู่จากดาวอำนาจ/คู่ครอง เพราะคู่สัมพันธ์กับพลังที่เข้ามาจัดระเบียบชีวิตและสร้างความมั่นคง";
    const relationshipPace = spouseScore >= 22 ? "เรื่องความรักมีตัวกระตุ้นค่อนข้างชัด เจอคนที่จริงจังหรือสถานการณ์ความสัมพันธ์มาให้ตัดสินใจได้ง่าย" : "เรื่องความรักไม่ได้พุ่งแรงตลอดเวลา ต้องใช้การค่อย ๆ สร้างความไว้ใจและสื่อสารให้ชัด";
    const relationshipAdvice = getRelationshipAdvice(reading, spouseElement, spouseScore, wealthScore, officerScore, outputScore);
    const verdict = pickStrongestSignal([
      { text: "ฟันธง: ความรักมีเกณฑ์จริงจังสูง แต่ต้องเลือกคนที่ทำให้ชีวิตนิ่งขึ้น ไม่ใช่คนที่ทำให้เหนื่อยกว่าเดิม", score: spouseScore + officerScore * 8 },
      { text: "ฟันธง: ความรักมาแบบช้าแต่คัดคนได้ดี ยิ่งรีบยิ่งพลาดจังหวะของดวง", score: 34 - spouseScore },
      { text: "ฟันธง: เสน่ห์มาจากการแสดงออก แต่ต้องระวังพูดนำหรือคุมเกมความสัมพันธ์มากเกินไป", score: outputScore * 10 + (reading.isStrong ? 8 : 0) },
      { text: "ฟันธง: ความรักผูกกับอนาคตและความรับผิดชอบ คุยเรื่องเป้าหมายชีวิตให้ชัดตั้งแต่ต้นจะดีที่สุด", score: wealthScore * 10 },
    ]);
    return { verdict, detail: `${profile} ${spouseLens} สำหรับดวงนี้ธาตุคู่คือธาตุ${elementMeta[spouseElement].label} ซึ่งอยู่ในระดับ${getElementLevel(spouseScore)} (${spouseScore}%) ${relationshipPace} ${relationshipAdvice}` };
  }

  if (focus === "การงาน") {
    const careerBase = officerScore >= outputScore
      ? "ดาวงาน/วินัยเด่นกว่าดาวการแสดงออก งานที่มีระบบ เป้าหมายชัด ความรับผิดชอบ หรือมาตรฐานสูงจะส่งผลดีกับคุณ"
      : "ดาวการแสดงออกเด่น งานที่ใช้ไอเดีย การสื่อสาร การขาย ความคิดสร้างสรรค์ หรือการทำผลงานให้คนเห็นจะเปิดทางได้ดี";
    const support = resourceScore >= 1 ? "ดวงยังมีแรงหนุนจากดาวความรู้/ผู้ช่วย จึงเหมาะกับการสะสมความเชี่ยวชาญและมี mentor หรือระบบสนับสนุน" : "ควรสร้างฐานความรู้และคนช่วยให้มากขึ้น เพราะถ้ารับงานหนักโดยไม่มีแรงหนุนจะเหนื่อยง่าย";
    const verdict = pickStrongestSignal([
      { text: "ฟันธง: งานสายระบบ เป้าหมายชัด และมีความรับผิดชอบจริง เหมาะกับดวงนี้มากกว่างานที่เปลี่ยนไปมาทุกวัน", score: officerScore * 10 + reading.scores[officerElement] / 3 },
      { text: "ฟันธง: งานที่ต้องขายไอเดีย สื่อสาร ทำคอนเทนต์ หรือสร้างผลงานให้คนเห็น คือทางเปิดของดวงนี้", score: outputScore * 10 + reading.scores[outputElement] / 3 },
      { text: "ฟันธง: ต้องโตจากความเชี่ยวชาญและผู้ใหญ่สนับสนุน อย่ากระโดดรับงานใหญ่ก่อนฐานความรู้แน่น", score: resourceScore * 10 + (!reading.isStrong ? 8 : 0) },
      { text: "ฟันธง: ดวงนี้เหมาะเป็นคนตัดสินใจ/รับบทนำได้ แต่ต้องมีสนามที่ชัด ไม่งั้นพลังจะกระจาย", score: peerScore * 8 + (reading.isStrong ? 10 : 0) },
    ]);
    return { verdict, detail: `${profile} ในหลักซาจูเรื่องงานดูจากดาวอำนาจ/วินัย ธาตุงานของคุณคือธาตุ${elementMeta[officerElement].label} และดูร่วมกับดาวผลงานธาตุ${elementMeta[outputElement].label} ${careerBase} ${support} ${strengthText}` };
  }

  if (focus === "การเงิน") {
    const moneyStyle = wealthScore >= 1.4
      ? "ดาวทรัพย์ค่อนข้างชัด คุณมองเห็นโอกาสหาเงินและจัดการทรัพยากรได้ดี"
      : "ดาวทรัพย์ไม่ได้เด่นแบบพุ่งแรง การเงินจึงเหมาะกับการวางระบบ สะสม และทำให้รายได้มั่นคงก่อนขยาย";
    const strengthAdvice = reading.isStrong
      ? "เมื่อ Day Master มีแรงพอ สามารถรับโอกาสเงินที่ใหญ่ขึ้นได้ แต่ควรมีแผนและขอบเขตความเสี่ยง"
      : "เมื่อ Day Master ต้องการแรงหนุน ไม่ควรเสี่ยงหนักหรือรับภาระเงินเร็วเกินไป ควรเริ่มจากรายได้ที่ควบคุมได้";
    const verdict = pickStrongestSignal([
      { text: "ฟันธง: ดวงนี้หาเงินจากโอกาสและเครือข่ายได้ แต่ต้องมีวินัยคุมเงิน ไม่งั้นเงินเข้าไวออกไว", score: wealthScore * 10 + reading.scores[wealthElement] / 3 },
      { text: "ฟันธง: การเงินควรสร้างฐานมั่นคงก่อนเสี่ยงหนัก รายได้ประจำหรือระบบเก็บเงินสำคัญกว่าการลุยเร็ว", score: (34 - reading.scores[wealthElement]) + (!reading.isStrong ? 8 : 0) },
      { text: "ฟันธง: ถ้าจะขยายรายได้ ต้องทำผ่านความสามารถที่จับต้องได้ ไม่ใช่หวังโชคหรือจังหวะสั้นอย่างเดียว", score: outputScore * 9 + resourceScore * 5 },
      { text: "ฟันธง: รับเงินก้อนหรือดีลใหญ่ได้ แต่ต้องตั้งเพดานความเสี่ยงก่อนตัดสินใจ", score: reading.isStrong ? wealthScore * 8 + 8 : wealthScore * 5 },
    ]);
    return { verdict, detail: `${profile} ในซาจูเรื่องเงินดูจากดาวทรัพย์ ซึ่งสัมพันธ์กับธาตุ${elementMeta[wealthElement].label} ของดวงนี้ธาตุทรัพย์อยู่ระดับ${getElementLevel(reading.scores[wealthElement])} (${reading.scores[wealthElement]}%) ${moneyStyle} ${strengthAdvice}` };
  }

  if (focus === "สุขภาพ") {
    const verdict = pickStrongestSignal([
      { text: `ฟันธง: จุดที่ต้องคุมคือพลังธาตุ${elementMeta[strongestElement].label}ที่ล้นง่าย อย่าปล่อยให้ชีวิตเอียงไปทางเดิมซ้ำ ๆ`, score: strongestScore },
      { text: `ฟันธง: ร่างกายและใจต้องการธาตุ${elementMeta[weakestElement].label}เพิ่ม ถ้าไม่เติมสมดุลจะเหนื่อยสะสมง่าย`, score: 34 - weakestScore },
      { text: "ฟันธง: สุขภาพของดวงนี้ดีขึ้นชัดเมื่อจัดเวลานอน กิน และพักให้เป็นระบบ", score: resourceScore * 8 + (!reading.isStrong ? 8 : 0) },
    ]);
    return { verdict, detail: `${profile} มุมสุขภาพในซาจูอ่านจากสมดุลธาตุ ไม่ใช่การวินิจฉัยโรค ดวงนี้ธาตุ${elementMeta[strongestElement].label}เด่นและธาตุ${elementMeta[weakestElement].label}ค่อนข้างบาง จึงควรดูแลจังหวะชีวิตไม่ให้เอียงไปทางเดิมมากเกินไป ถ้าเครียดหรือพักไม่พอ พลังที่เด่นอยู่แล้วจะล้นง่าย วิธีดูแลที่เหมาะคือเติมธาตุ${elementMeta[reading.luckyElement].label}ผ่านการพัก การกิน การจัดสภาพแวดล้อม และกิจวัตรที่ทำซ้ำได้จริง` };
  }

  if (focus === "การเรียน") {
    const learningStyle = resourceScore >= outputScore
      ? "ดาวความรู้เด่นกว่า เหมาะกับการเรียนแบบเข้าใจหลักการ อ่านลึก มีครูหรือแหล่งข้อมูลที่น่าเชื่อถือ"
      : "ดาวผลงานเด่นกว่า เหมาะกับการเรียนด้วยการลงมือทำ สรุปออกมาเป็นภาษาตัวเอง และสอนกลับ";
    const verdict = pickStrongestSignal([
      { text: "ฟันธง: เรียนแบบมีครู มีโครงสร้าง และทบทวนเป็นระบบจะขึ้นที่สุด", score: resourceScore * 10 + reading.scores[resourceElement] / 3 },
      { text: "ฟันธง: อ่านอย่างเดียวไม่พอ ดวงนี้ต้องลงมือทำ สรุป และสอนกลับ ถึงจะจำได้จริง", score: outputScore * 10 + reading.scores[outputElement] / 3 },
      { text: "ฟันธง: ถ้าเร่งเรียนหลายเรื่องพร้อมกันจะหลุดง่าย ควรเลือกแกนหลักแล้วทำซ้ำให้ชัด", score: peerScore * 5 + (!reading.isStrong ? 8 : 0) },
    ]);
    return { verdict, detail: `${profile} ในซาจูการเรียนดูจากดาวความรู้และดาวผลงาน ธาตุความรู้ของคุณคือ${elementMeta[resourceElement].label} ส่วนธาตุผลงานคือ${elementMeta[outputElement].label} ${learningStyle} ถ้าอยากเรียนได้ไว ควรจัดระบบทบทวนให้ชัด แล้วเปลี่ยนความรู้เป็นงานหรือแบบฝึกหัดทันที` };
  }

  if (focus === "ครอบครัว") {
    const familyRole = resourceScore >= peerScore
      ? "คุณมักเป็นคนให้ความดูแล ให้คำปรึกษา หรือคอยประคองบรรยากาศของบ้าน"
      : "คุณมีพลังตัวตน/คนรอบตัวเด่น จึงมักมีบทบาทชัดในบ้าน และอาจเป็นคนที่คนอื่นคาดหวังหรือเข้ามาพึ่งพา";
    const verdict = pickStrongestSignal([
      { text: "ฟันธง: คุณเป็นคนประคองบ้าน แต่ต้องระวังกลายเป็นคนแบกทุกเรื่องแทนคนอื่น", score: resourceScore * 10 + (!reading.isStrong ? 6 : 0) },
      { text: "ฟันธง: คุณมีบทบาทชัดในบ้าน พูดหรือเลือกอะไรคนรอบตัวจะรับแรงกระเพื่อมง่าย", score: peerScore * 9 + (reading.isStrong ? 8 : 0) },
      { text: "ฟันธง: บ้านจะสมดุลเมื่อมีกติกาและขอบเขตชัด ไม่ใช่ปล่อยให้ทุกคนเดากันเอง", score: officerScore * 9 },
    ]);
    return { verdict, detail: `${profile} เรื่องครอบครัวในซาจูอ่านจากดาวสนับสนุน คนรอบตัว และสมดุลธาตุ ${familyRole} จุดที่ควรระวังคืออย่าแบกทุกอย่างไว้คนเดียวหรือใช้เหตุผลแข็งเกินไป การคุยให้ชัดแต่ยังรักษาน้ำใจจะทำให้บ้านสมดุลขึ้น` };
  }

  const dominantPattern = topGod ? `พลังที่เด่นในดวงคือ “${topGod.thaiLabel}” ซึ่งหมายถึง${topGod.description}` : "พลังในดวงค่อนข้างกระจายตัว ไม่มีดาวใดเด่นจนกลบทั้งหมด";
  const verdict = pickStrongestSignal([
    { text: topGod ? `ฟันธง: แกนดวงนี้เด่นที่ “${topGod.thaiLabel}” ใช้พลังนี้ถูกทางแล้วชีวิตจะเปิดเร็วที่สุด` : "ฟันธง: ดวงนี้ต้องชนะด้วยความสมดุล ไม่ใช่พึ่งพลังด้านเดียว", score: topGod?.count ? topGod.count * 12 : 4 },
    { text: "ฟันธง: ดวงนี้ควรรับบทนำและเลือกสนามที่ชัด เพราะพลังตัวตนมีแรงพอจะผลักชีวิตเอง", score: reading.isStrong ? peerScore * 8 + 10 : peerScore * 5 },
    { text: "ฟันธง: ดวงนี้ต้องมีระบบสนับสนุนก่อนลุยใหญ่ ยิ่งฝืนคนเดียวยิ่งเหนื่อย", score: !reading.isStrong ? resourceScore * 8 + 10 : resourceScore * 4 },
    { text: `ฟันธง: จุดเปลี่ยนของดวงคือการเติมธาตุ${elementMeta[reading.luckyElement].label}ให้สม่ำเสมอ`, score: 34 - reading.scores[reading.luckyElement] },
  ]);
  return { verdict, detail: `${profile} ${dominantPattern} ${strengthText} ${balanceText}` };
}

type SajuAnalysis = {
  verdict: string;
  detail: string;
  why: string;
  trend: string;
  advice: string;
  caution: string;
  summary: string[];
};

function buildReaderFocusedAnalysis(reading: SajuReading, focus: string, core: { verdict: string; detail: string }): SajuAnalysis {
  const { dayMaster } = reading;
  const ranked = (Object.entries(reading.scores) as Array<[ElementKey, number]>).sort((a, b) => b[1] - a[1]);
  const [strongestElement, strongestScore] = ranked[0];
  const [weakestElement, weakestScore] = ranked[ranked.length - 1];
  const wealthElement = localControllingElement[dayMaster.element];
  const officerElement = getElementThatControls(dayMaster.element);
  const outputElement = localGeneratingElement[dayMaster.element];
  const resourceElement = getElementThatGenerates(dayMaster.element);
  const wealthScore = getTenGodScore(reading, ["PYEON_JAE", "JEONG_JAE"]);
  const officerScore = getTenGodScore(reading, ["PYEON_GWAN", "JEONG_GWAN"]);
  const outputScore = getTenGodScore(reading, ["SIK_SIN", "SANG_GWAN"]);
  const resourceScore = getTenGodScore(reading, ["PYEON_IN", "JEONG_IN"]);
  const topGod = reading.tenGodSummary[0];
  const strengthLabel = reading.isStrong ? "Day Master มีแรง" : "Day Master ต้องการแรงหนุน";
  const balanceLabel = `ธาตุเด่นคือ${elementMeta[strongestElement].label} ${strongestScore}% และธาตุอ่อนคือ${elementMeta[weakestElement].label} ${weakestScore}%`;
  const luckyLabel = `ธาตุที่ควรเติมคือ${elementMeta[reading.luckyElement].label}`;

  if (focus === "ความรัก") {
    const spouseScore = reading.scores[reading.relationshipElement];
    const status = spouseScore >= 22 ? "ความรักมีสัญญาณชัดและจริงจังง่าย" : "ความรักต้องใช้เวลาและความสม่ำเสมอมากกว่าการเร่งคำตอบ";
    return {
      ...core,
      why: `อ่านจากดาวคู่ของดวงนี้คือธาตุ${elementMeta[reading.relationshipElement].label} ระดับ ${spouseScore}% ร่วมกับ ${strengthLabel} และรูปแบบการแสดงออกของดาวผลงาน`,
      trend: `${status} คนที่เข้ามามักสะท้อนเรื่องความรับผิดชอบ อนาคต หรือขอบเขตในความสัมพันธ์`,
      advice: "ให้คุยเป้าหมายชีวิต ความคาดหวัง และพื้นที่ส่วนตัวตั้งแต่ต้น คนที่เหมาะจะทำให้ชีวิตนิ่งขึ้น ไม่ใช่ทำให้ต้องพิสูจน์ตัวเองตลอดเวลา",
      caution: outputScore >= 1.4 ? "ระวังพูดเร็ว ตัดสินเร็ว หรือคุมเกมความสัมพันธ์มากเกินไป" : "ระวังตีความความเงียบเป็นคำตอบทั้งหมด ความรักของดวงนี้ต้องดูจากความสม่ำเสมอ",
      summary: [
        `ดาวคู่: ธาตุ${elementMeta[reading.relationshipElement].label} ${getElementLevel(spouseScore)}`,
        spouseScore >= 22 ? "รักจริงจังง่าย" : "รักค่อยเป็นค่อยไป",
        "คำตอบอยู่ที่ความชัดเจนและความสม่ำเสมอ",
      ],
    };
  }

  if (focus === "การงาน") {
    const workMode = officerScore >= outputScore ? "งานระบบ เป้าหมายชัด และความรับผิดชอบสูง" : "งานสื่อสาร ไอเดีย คอนเทนต์ การขาย หรือผลงานที่คนเห็น";
    return {
      ...core,
      why: `ดูจากดาวงานธาตุ${elementMeta[officerElement].label} คะแนนดาวอำนาจ ${officerScore.toFixed(1)} เทียบกับดาวผลงาน ${outputScore.toFixed(1)} และ ${strengthLabel}`,
      trend: `เส้นทางงานเปิดผ่าน${workMode} ช่วงที่งานหนักขึ้นมักเป็นช่วงที่ดวงกำลังดันให้บทบาทชัดขึ้น`,
      advice: "เลือกสนามที่วัดผลได้ ตั้งขอบเขตงานให้ชัด และสะสมผลงานที่อธิบายคุณค่าของตัวเองได้",
      caution: reading.isStrong ? "ระวังรับบทนำหลายทางจนพลังแตก หรือปะทะกับคนที่ทำงานไม่เป็นระบบ" : "ระวังรับงานใหญ่ก่อนมีคนช่วยหรือระบบรองรับ จะเหนื่อยเร็วกว่าที่ควร",
      summary: [
        `ทางงานเด่น: ${workMode}`,
        topGod ? `พลังสนับสนุนหลัก: ${topGod.thaiLabel}` : "พลังงานกระจาย ต้องจัดลำดับ",
        "โตจากงานที่มีผลงานจับต้องได้",
      ],
    };
  }

  if (focus === "การเงิน") {
    const moneyMode = wealthScore >= 1.4 ? "หาเงินจากโอกาส เครือข่าย ดีล หรือการขยับหลายช่องทางได้" : "ควรสร้างฐานรายได้ให้มั่นคงก่อนขยายความเสี่ยง";
    return {
      ...core,
      why: `อ่านจากดาวทรัพย์ธาตุ${elementMeta[wealthElement].label} ซึ่งอยู่ที่ ${reading.scores[wealthElement]}% และคะแนนดาวทรัพย์รวม ${wealthScore.toFixed(1)}`,
      trend: `${moneyMode} เงินจะดีขึ้นเมื่อรายได้ผูกกับทักษะจริงและมีระบบเก็บ ไม่ใช่หวังจังหวะสั้นอย่างเดียว`,
      advice: "แยกเงินเก็บก่อนใช้ ตั้งงบรายสัปดาห์ และเลือกลงทุนเฉพาะเรื่องที่เข้าใจจริงหรือมีข้อมูลพอ",
      caution: reading.isStrong ? "ระวังมั่นใจเกินไปกับดีลใหญ่หรือการใช้เงินเพื่อขยายภาพลักษณ์" : "ระวังเงินรั่วจากรายจ่ายเล็ก ๆ และการตัดสินใจเพราะกลัวพลาดโอกาส",
      summary: [
        `ดาวทรัพย์: ธาตุ${elementMeta[wealthElement].label} ${getElementLevel(reading.scores[wealthElement])}`,
        wealthScore >= 1.4 ? "มีช่องทางหาเงินได้" : "ต้องจัดฐานเงินให้แน่น",
        "เงินดีเมื่อมีระบบ ไม่ใช่แค่อาศัยโชค",
      ],
    };
  }

  if (focus === "สุขภาพ") {
    return {
      ...core,
      why: `อ่านจากสมดุลธาตุในดวง ${balanceLabel} โดยไม่ได้ใช้แทนการวินิจฉัยโรค`,
      trend: `พลังธาตุ${elementMeta[strongestElement].label}ที่เด่นอาจล้นเมื่อเครียดหรือพักไม่พอ ส่วนธาตุ${elementMeta[weakestElement].label}ที่บางคือจุดที่ควรเติมผ่านกิจวัตร`,
      advice: `จัดเวลานอน กิน และพักให้เป็นระบบ พร้อมเติมพฤติกรรมของธาตุ${elementMeta[reading.luckyElement].label}แบบทำซ้ำได้จริง`,
      caution: "ระวังฝืนร่างกายเพื่อให้เสร็จทุกอย่างในวันเดียว ถ้ามีอาการผิดปกติควรปรึกษาผู้เชี่ยวชาญด้านสุขภาพ",
      summary: [
        `ธาตุเด่น: ${elementMeta[strongestElement].label}`,
        `ธาตุควรเติม: ${elementMeta[weakestElement].label}`,
        "สุขภาพดีขึ้นจาก routine มากกว่าการแก้เฉพาะหน้า",
      ],
    };
  }

  if (focus === "การเรียน") {
    const learningMode = resourceScore >= outputScore ? "เรียนแบบมีครู โครงสร้าง และการทบทวนเป็นระบบ" : "เรียนด้วยการลงมือทำ สรุป และสอนกลับ";
    return {
      ...core,
      why: `ดูจากดาวความรู้ธาตุ${elementMeta[resourceElement].label} เทียบกับดาวผลงานธาตุ${elementMeta[outputElement].label}`,
      trend: `ดวงนี้เหมาะกับ${learningMode} ถ้าเรียนหลายเรื่องพร้อมกันโดยไม่มีแกนหลักจะหลุดง่าย`,
      advice: "เลือกหัวข้อหลัก 1 เรื่อง ทำโน้ตสั้น ทบทวนเป็นรอบ และเปลี่ยนความรู้เป็นแบบฝึกหัดหรือผลงานทันที",
      caution: "ระวังอ่านเยอะจนไม่ได้ทดสอบความเข้าใจ หรือรอให้พร้อมทั้งหมดก่อนลงมือ",
      summary: [
        `วิธีเรียนเด่น: ${learningMode}`,
        `ดาวความรู้: ${resourceScore.toFixed(1)}`,
        "จำได้ดีเมื่อสรุปและใช้จริง",
      ],
    };
  }

  if (focus === "ครอบครัว") {
    return {
      ...core,
      why: `อ่านจากดาวสนับสนุน ${resourceScore.toFixed(1)} พลังตัวตน และสมดุลธาตุที่ส่งผลต่อบทบาทในบ้าน`,
      trend: resourceScore >= 1 ? "คุณมักเป็นคนประคองบรรยากาศ ให้คำแนะนำ หรือเป็นที่พึ่งทางใจของบ้าน" : "คุณมักมีบทบาทชัดในบ้าน แต่ต้องสร้างระบบสื่อสารให้คนอื่นไม่คาดเดากันเอง",
      advice: "คุยเรื่องเล็กให้ตกลงกันได้ก่อน แล้วค่อยขยับไปเรื่องละเอียดอ่อน ตั้งขอบเขตความช่วยเหลือให้ชัด",
      caution: "ระวังแบกทุกเรื่องไว้คนเดียว หรือใช้เหตุผลแข็งเกินไปจนคนในบ้านไม่กล้าพูดความรู้สึก",
      summary: [
        resourceScore >= 1 ? "บทบาทเด่น: ผู้ประคองบ้าน" : "บทบาทเด่น: คนกำหนดทิศทาง",
        "บ้านสมดุลเมื่อมีกติกาชัด",
        "ช่วยได้ แต่อย่าแบกแทนทุกคน",
      ],
    };
  }

  return {
    ...core,
    why: `พื้นดวงอ่านจาก Day Master ธาตุ${elementMeta[dayMaster.element].label}${dayMaster.polarity === "+" ? "หยาง" : "หยิน"} ร่วมกับ ${balanceLabel} และดาวเด่น${topGod ? ` ${topGod.thaiLabel}` : "ที่กระจายตัว"}`,
    trend: `${reading.isStrong ? "ชีวิตมักเปิดเมื่อกล้ารับบทนำและเลือกสนามให้ชัด" : "ชีวิตมักดีขึ้นเมื่อมีระบบสนับสนุนและค่อย ๆ สะสมผล"} ปีนี้เด่นที่ ${reading.annualInfluence.tenGod.thaiLabel}: ${reading.annualInfluence.themeTitle}`,
    advice: `${luckyLabel}ให้สม่ำเสมอ เลือกเป้าหมายหลัก 1 เรื่อง และทำให้เห็นผลเป็นรูปธรรมก่อนขยับเรื่องถัดไป`,
    caution: `${reading.isStrong ? "ระวังใช้พลังมากจนแข็งหรือปะทะง่าย" : "ระวังฝืนลุยคนเดียวจนหมดแรง"} และอย่าปล่อยให้ธาตุ${elementMeta[strongestElement].label}ล้นซ้ำ ๆ`,
    summary: [
      `ตัวตนหลัก: ธาตุ${elementMeta[dayMaster.element].label}${dayMaster.polarity === "+" ? "หยาง" : "หยิน"}`,
      topGod ? `ดาวเด่น: ${topGod.thaiLabel}` : "ดวงต้องชนะด้วยสมดุล",
      luckyLabel,
    ],
  };
}

function getReadableSajuAnalysis(reading: SajuReading, focus: string) {
  return buildReaderFocusedAnalysis(reading, focus, getCoreSajuAnalysis(reading, focus));
}

type QuickSummaryItem = {
  label: string;
  text: string;
  color: string;
  icon?: React.ElementType;
  iconColor?: string;
  variant?: "hero" | "core" | "remedy" | "lucky";
};

function buildQuickSummary(reading: SajuReading): QuickSummaryItem[] {
  const overview = getReadableSajuAnalysis(reading, "ภาพรวม");
  const love = getReadableSajuAnalysis(reading, "ความรัก");
  const career = getReadableSajuAnalysis(reading, "การงาน");
  const money = getReadableSajuAnalysis(reading, "การเงิน");
  const topGod = reading.tenGodSummary[0];
  const strongestElement = reading.rankedElements[0];
  const weakestElement = reading.rankedElements[reading.rankedElements.length - 1];

  return [
    {
      label: "ช่วงนี้เด่นเรื่องอะไร",
      text: topGod
        ? `เด่นเรื่อง${topGod.thaiLabel} และจังหวะปีนี้คือ ${reading.annualInfluence.themeTitle}`
        : overview.trend,
      color: "#8b5cf6",
      icon: MagicStar,
      iconColor: "#c084fc",
      variant: "hero",
    },
    {
      label: "ความรัก",
      text: love.trend,
      color: "#f43f5e",
      icon: Heart,
      iconColor: "#f43f5e",
      variant: "core",
    },
    {
      label: "การงาน",
      text: career.trend,
      color: "#10b981",
      icon: Briefcase,
      iconColor: "#10b981",
      variant: "core",
    },
    {
      label: "การเงิน",
      text: money.trend,
      color: "#f59e0b",
      icon: MoneySend,
      iconColor: "#f59e0b",
      variant: "core",
    },
    {
      label: "ต้องระวังอะไร",
      text: `${overview.caution} จุดที่ล้นง่ายคือธาตุ${elementMeta[strongestElement].label} ส่วนจุดที่ต้องเติมคือธาตุ${elementMeta[weakestElement].label}`,
      color: "#f43f5e",
      icon: InfoCircle,
      iconColor: "#fb7185",
      variant: "remedy",
    },
    {
      label: "ควรทำอะไรตอนนี้",
      text: `${overview.advice} โฟกัสเป้าหมายหลัก 1 เรื่องก่อน แล้วค่อยขยายเรื่องอื่น`,
      color: "#06b6d4",
      icon: Flash,
      iconColor: "#22d3ee",
      variant: "remedy",
    },
    {
      label: "ธาตุเสริมดวงชะตา",
      text: `ควรเติมธาตุ${elementMeta[reading.luckyElement].label}: ${luckyElementAdvice[reading.luckyElement]}`,
      color: elementMeta[reading.luckyElement].color,
      icon: Element4,
      iconColor: elementMeta[reading.luckyElement].color,
      variant: "lucky",
    },
  ];
}

const focusRemedies: Record<string, { caution: string; action: string; avoid: string }> = {
  ภาพรวม: {
    caution: "อย่าพยายามแก้ทุกเรื่องพร้อมกัน เพราะจะทำให้พลังแตกและเหนื่อยง่าย",
    action: "เลือกเป้าหมายหลัก 1 เรื่องในช่วงนี้ แล้วทำต่อเนื่องให้เห็นผลก่อนขยับเรื่องถัดไป",
    avoid: "เลี่ยงการเปลี่ยนแผนเพราะอารมณ์ชั่ววูบหรือคำพูดของคนอื่น",
  },
  ความรัก: {
    caution: "ความสัมพันธ์จะติดขัดเมื่อคาดหวังให้อีกฝ่ายเข้าใจเองโดยไม่พูดให้ชัด",
    action: "พูดความต้องการของตัวเองตรง ๆ แต่ใช้น้ำเสียงนุ่มลง และให้พื้นที่อีกฝ่ายตอบกลับ",
    avoid: "เลี่ยงการทดสอบใจ เงียบใส่ หรือเก็บความไม่พอใจไว้นานเกินไป",
  },
  การงาน: {
    caution: "งานจะสะดุดเมื่อรับหลายบทบาทเกินไปหรือไม่มีขอบเขตที่ชัดเจน",
    action: "จัดลำดับงานเป็น 3 ระดับ: ด่วน สำคัญ และรอได้ แล้วเริ่มจากงานที่สร้างผลลัพธ์จริง",
    avoid: "เลี่ยงการรับปากเร็วเพราะเกรงใจ โดยยังไม่เช็กเวลาและพลังของตัวเอง",
  },
  การเงิน: {
    caution: "การเงินจะรั่วจากรายจ่ายเล็ก ๆ ที่ไม่รู้ตัว หรือการตัดสินใจตามความอยากทันที",
    action: "ตั้งงบรายสัปดาห์ แยกเงินเก็บก่อนใช้ และจดรายจ่ายที่เกิดซ้ำอย่างน้อย 14 วัน",
    avoid: "เลี่ยงการลงทุนหรือซื้อของใหญ่ในวันที่อารมณ์ไม่นิ่ง",
  },
  สุขภาพ: {
    caution: "ร่างกายจะอ่อนลงเมื่อพักไม่พอ เครียดสะสม หรือใช้ชีวิตไม่เป็นเวลา",
    action: "เริ่มจากนอนให้ตรงเวลา ดื่มน้ำให้พอ และขยับร่างกายเบา ๆ วันละ 15 นาที",
    avoid: "เลี่ยงการฝืนร่างกายเพื่อให้เสร็จทุกอย่างในวันเดียว",
  },
  การเรียน: {
    caution: "การเรียนจะช้าลงเมื่อพยายามจำทุกอย่างโดยไม่เข้าใจภาพรวม",
    action: "สรุปบทเรียนเป็นภาษาของตัวเอง แล้วทวนด้วยการสอนกลับหรือทำโจทย์สั้น ๆ",
    avoid: "เลี่ยงการอ่านยาว ๆ โดยไม่พักและไม่ทดสอบความเข้าใจ",
  },
  ครอบครัว: {
    caution: "ความสัมพันธ์ในบ้านจะตึงเมื่อทุกคนคาดเดากันเองมากกว่าคุยกันตรง ๆ",
    action: "เริ่มจากคุยเรื่องเล็กที่ตกลงกันได้ก่อน แล้วค่อยขยับไปเรื่องที่ละเอียดอ่อนกว่า",
    avoid: "เลี่ยงการขุดเรื่องเก่าขึ้นมารวมกับปัญหาปัจจุบัน",
  },
};

const elementRemedies: Record<ElementKey, { title: string; items: string[] }> = {
  Wood: {
    title: "เสริมธาตุไม้",
    items: ["เพิ่มพื้นที่สีเขียวบนโต๊ะทำงานหรือในห้อง", "เริ่มโปรเจกต์ที่ค่อย ๆ เติบโต เช่น เรียนทักษะใหม่", "ใช้โทนเขียวหรือกิจกรรมกลางแจ้งช่วยเปิดพลัง"],
  },
  Fire: {
    title: "เสริมธาตุไฟ",
    items: ["ขยับร่างกายให้เหงื่อออกเล็กน้อย", "ใช้แสงสว่าง สีแดง ชมพู หรือส้มในวันที่ต้องการความมั่นใจ", "ทำสิ่งที่ต้องพรีเซนต์หรือแสดงออกในช่วงที่พลังดี"],
  },
  Earth: {
    title: "เสริมธาตุดิน",
    items: ["จัดห้อง โต๊ะ หรือกระเป๋าให้เป็นระเบียบ", "วางแผนเงินและเวลาล่วงหน้าแบบจับต้องได้", "ใช้โทนเหลือง น้ำตาล หรือของที่ให้ความรู้สึกมั่นคง"],
  },
  Metal: {
    title: "เสริมธาตุทอง",
    items: ["ลดสิ่งรก ๆ รอบตัวและจัดระบบชีวิตให้ชัด", "ใช้สีขาว เทา เงิน หรือเครื่องประดับโลหะ", "เขียนกติกา เป้าหมาย หรือขอบเขตของตัวเองให้ชัดเจน"],
  },
  Water: {
    title: "เสริมธาตุน้ำ",
    items: ["ดื่มน้ำให้พอและอยู่กับบรรยากาศที่สงบขึ้น", "ใช้สีฟ้า น้ำเงิน หรือเสียงน้ำช่วยให้ใจนิ่ง", "เขียนความคิดออกมาเพื่อลดความฟุ้งและตัดสินใจง่ายขึ้น"],
  },
};

function getRemedyPlan(focus: string, luckyElement: ElementKey, dayMaster: { element: ElementKey }, isStrong: boolean) {
  const focusPlan = focusRemedies[focus] ?? focusRemedies["ภาพรวม"];
  const elementPlan = elementRemedies[luckyElement];
  const balanceTip = isStrong
    ? "ดวงนี้มีแรงขับค่อนข้างชัด ควรใช้พลังให้เป็นทิศทาง ลดการปะทะ และเลือกสนามที่คุ้มค่า"
    : "ดวงนี้ควรเสริมแรงใจและความสม่ำเสมอ อย่ากดดันตัวเองเกินไป ให้เริ่มจากก้าวเล็ก ๆ ที่ทำได้ทุกวัน";

  return {
    caution: focusPlan.caution,
    action: focusPlan.action,
    avoid: focusPlan.avoid,
    balanceTip,
    elementTitle: elementPlan.title,
    elementItems: elementPlan.items,
    dayMasterTip:
      dayMaster.element === luckyElement
        ? "ธาตุเสริมตรงกับแกนตัวตนของคุณ จึงเหมาะกับการกลับมาอยู่กับจุดแข็งเดิมและใช้มันให้ชัดขึ้น"
        : "ธาตุเสริมนี้ช่วยเติมส่วนที่ดวงต้องการ จึงควรใช้เป็นพฤติกรรมเล็ก ๆ ที่ทำซ้ำได้ในชีวิตประจำวัน",
  };
}

type RemedyPlan = ReturnType<typeof getRemedyPlan> & { basis: string[] };

type DynamicRemedyInput = {
  focus: string;
  luckyElement: ElementKey;
  dayMaster: { element: ElementKey };
  isStrong: boolean;
  scores: Record<ElementKey, number>;
  annualInfluence: AnnualInfluence;
};

const elementDeficitRemedies: Record<ElementKey, { caution: string; action: string; avoid: string; items: string[] }> = {
  Wood: {
    caution: "พลังการเริ่มต้นและการเติบโตยังบาง จึงอาจลังเลหรือเปลี่ยนเป้าหมายง่าย",
    action: "เลือกเป้าหมายเล็ก ๆ หนึ่งเรื่อง แล้วทำต่อเนื่อง 14 วันให้เห็นความคืบหน้า",
    avoid: "อย่าเริ่มหลายเรื่องพร้อมกันจนพลังแตกและไม่มีเรื่องไหนไปสุด",
    items: ["เพิ่มต้นไม้หรือพื้นที่สีเขียวในจุดที่ใช้ประจำ", "ทำกิจกรรมที่ค่อย ๆ โต เช่น เรียนทักษะใหม่หรือวางแผนงานระยะยาว", "เดินกลางแจ้งช่วงเช้าหรืออยู่กับธรรมชาติให้บ่อยขึ้น"],
  },
  Fire: {
    caution: "ไฟในดวงยังไม่เด่นพอ ทำให้ความมั่นใจ แรงผลักดัน หรือการแสดงออกอาจติดขัด",
    action: "ตั้งเวลาทำเรื่องที่ต้องใช้ความกล้าในช่วงที่พลังดีที่สุดของวัน แล้วทำให้จบทีละขั้น",
    avoid: "อย่าเก็บตัวเงียบเกินไปจนโอกาสดี ๆ ผ่านไปโดยไม่ได้แสดงตัว",
    items: ["ใช้แสงสว่าง สีแดง ชมพู หรือส้มในวันที่ต้องการความมั่นใจ", "ขยับร่างกายให้เหงื่อออกเล็กน้อยก่อนงานสำคัญ", "ฝึกพูด นำเสนอ หรือประกาศความตั้งใจแบบสั้นและชัด"],
  },
  Earth: {
    caution: "ฐานดินยังไม่แน่น จึงอาจรู้สึกไม่มั่นคง จัดการเวลา/เงินยาก หรือรับภาระแล้วรวน",
    action: "ทำระบบพื้นฐานให้ชัด เช่น ตารางเวลา งบประมาณ รายการงาน และขอบเขตความรับผิดชอบ",
    avoid: "อย่าตัดสินใจเรื่องใหญ่ตอนใจแกว่งหรือข้อมูลยังไม่ครบ",
    items: ["จัดโต๊ะ ห้อง หรือกระเป๋าให้เป็นระเบียบ", "วางแผนเงินและเวลาล่วงหน้าแบบจับต้องได้", "ใช้โทนเหลือง น้ำตาล หรือของที่ให้ความรู้สึกมั่นคง"],
  },
  Metal: {
    caution: "พลังทองยังอ่อน ทำให้ขอบเขต มาตรฐาน และการตัดสินใจอาจไม่คมพอ",
    action: "เขียนกติกาให้ตัวเองว่าอะไรรับได้ อะไรไม่รับ แล้วสื่อสารให้ชัดแบบสุภาพ",
    avoid: "อย่าตอบตกลงเพราะเกรงใจ ทั้งที่รู้ว่าทำแล้วเสียสมดุลชีวิต",
    items: ["ลดของรกและจัดระบบไฟล์/งานให้หาง่าย", "ใช้สีขาว เทา เงิน หรือเครื่องประดับโลหะอย่างพอดี", "ทำ checklist ก่อนตัดสินใจเรื่องสำคัญ"],
  },
  Water: {
    caution: "พลังน้ำยังน้อย ทำให้พักไม่พอ คิดไม่ลื่น หรือปรับตัวกับสถานการณ์เร็ว ๆ ได้ยาก",
    action: "เพิ่มช่วงพักจริงจังในวัน และให้เวลาตัวเองคิดก่อนตอบเรื่องสำคัญ",
    avoid: "อย่าฝืนทำทุกอย่างด้วยแรงอย่างเดียวจนร่างกายและใจแห้งเกินไป",
    items: ["ดื่มน้ำให้พอและอยู่ในบรรยากาศที่สงบขึ้น", "ใช้สีฟ้า น้ำเงิน หรือเสียงน้ำช่วยให้ใจนิ่ง", "เขียนความคิดออกมาก่อนตัดสินใจเพื่อลดความฟุ้ง"],
  },
};

const elementExcessCautions: Record<ElementKey, string> = {
  Wood: "ธาตุไม้เด่นมาก ระวังดื้อกับเป้าหมายเดิมหรือกดดันตัวเองให้โตเร็วเกินไป",
  Fire: "ธาตุไฟเด่นมาก ระวังใจร้อน พูดไว หรือใช้พลังหมดเร็ว",
  Earth: "ธาตุดินเด่นมาก ระวังแบกทุกอย่างไว้เอง ยึดติดกับความมั่นคงจนไม่กล้าขยับ",
  Metal: "ธาตุทองเด่นมาก ระวังเข้มงวดกับตัวเอง/คนอื่นเกินไป หรือใช้เหตุผลจนความสัมพันธ์ตึง",
  Water: "ธาตุน้ำเด่นมาก ระวังคิดเยอะ ลังเล หรือปล่อยเรื่องค้างนานเกินไป",
};

function getAnnualRemedy(annualInfluence: AnnualInfluence) {
  const tags = new Set(annualInfluence.tags);

  if (tags.has("career_pressure") || tags.has("pressure")) {
    return "ปีนี้มีแรงกดดันเรื่องหน้าที่และความคาดหวัง ควรตั้งขอบเขตงานให้ชัด แบ่งงานเป็นรอบสั้น ๆ และอย่ารับปากเกินกำลัง";
  }

  if (tags.has("money_opportunity") || tags.has("wealth")) {
    return "ปีนี้เปิดจังหวะเรื่องเงินและโอกาส ควรวางแผนก่อนรับดีลใหญ่ ตรวจความเสี่ยง และแยกเงินใช้ เงินเก็บ เงินลงทุนให้ชัด";
  }

  if (tags.has("communication") || tags.has("expression")) {
    return "ปีนี้เด่นเรื่องการสื่อสารและการแสดงตัว ควรพูดให้ชัด เขียนให้เป็นระบบ และตรวจอารมณ์ก่อนส่งข้อความสำคัญ";
  }

  if (tags.has("support") || tags.has("learning") || tags.has("study")) {
    return "ปีนี้เหมาะกับการเรียนรู้และหาคนช่วยหนุน ควรมี mentor แหล่งข้อมูลที่ไว้ใจได้ และทบทวนบทเรียนเป็นระยะ";
  }

  return annualInfluence.themeAdvice;
}

function getDynamicRemedyPlan(input: DynamicRemedyInput): RemedyPlan {
  const basePlan = getRemedyPlan(input.focus, input.luckyElement, input.dayMaster, input.isStrong);
  const rankedScores = (Object.entries(input.scores) as Array<[ElementKey, number]>).sort((a, b) => a[1] - b[1]);
  const [lowestElement, lowestScore] = rankedScores[0];
  const [highestElement, highestScore] = rankedScores[rankedScores.length - 1];
  const deficitPlan = elementDeficitRemedies[lowestElement];
  const excessCaution = highestScore >= 32 ? elementExcessCautions[highestElement] : "";
  const annualAdvice = getAnnualRemedy(input.annualInfluence);

  const basis = [
    `ธาตุอ่อน: ${elementMeta[lowestElement].label}`,
    `ธาตุเด่น: ${elementMeta[highestElement].label}`,
    `ธาตุเสริม: ${elementMeta[input.luckyElement].label}`,
    input.isStrong ? "ดวงค่อนข้างแข็ง" : "ดวงควรเติมแรง",
  ];

  const cautionParts = [deficitPlan.caution];
  if (excessCaution) cautionParts.push(excessCaution);
  cautionParts.push(basePlan.caution);

  return {
    ...basePlan,
    basis,
    caution: cautionParts.join(" / "),
    action: `${deficitPlan.action} จากนั้นเสริมเรื่อง${input.focus}ด้วยวิธีนี้: ${basePlan.action}`,
    avoid: `${basePlan.avoid} และอย่าฝืนใช้ธาตุ${elementMeta[highestElement].label}มากเกินไปในวันที่รู้สึกตึง`,
    balanceTip: `${input.isStrong ? "ดวงนี้มีแรงขับชัด จึงควรใช้พลังแบบมีทิศทางและพักให้เป็น" : "ดวงนี้ควรเติมแรงแบบสม่ำเสมอ เริ่มจากเรื่องเล็กที่ทำซ้ำได้จริง"} คะแนนธาตุอ่อนสุดคือ${elementMeta[lowestElement].label} (${lowestScore}) ส่วนธาตุเด่นสุดคือ${elementMeta[highestElement].label} (${highestScore}) จึงควรเติมสิ่งที่ขาดและลดพลังที่ล้นไปพร้อมกัน`,
    elementTitle: `วิธีเติมธาตุ${elementMeta[lowestElement].label} และใช้ธาตุ${elementMeta[input.luckyElement].label}ให้ถูกทาง`,
    elementItems: [...deficitPlan.items, ...basePlan.elementItems.slice(0, 2), annualAdvice],
    dayMasterTip:
      input.dayMaster.element === input.luckyElement
        ? "ธาตุเสริมตรงกับแกนตัวตนของคุณ แปลว่าการปรับดวงควรเริ่มจากการกลับมาใช้จุดแข็งเดิมให้ชัด ไม่ต้องฝืนเป็นคนละแบบ"
        : "ธาตุเสริมไม่ใช่แกนตัวตนหลัก จึงควรเติมผ่านพฤติกรรมและสภาพแวดล้อมทีละน้อย จะได้ช่วยสมดุลโดยไม่ฝืนธรรมชาติของตัวเอง",
  };
}

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
  const stemMeta = elementMeta[pillar.stem.element];

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "0" },
        p: 2.8,
        borderRadius: "20px",
        bgcolor: isDayMaster ? "rgba(79, 70, 229, 0.04)" : "#fff",
        border: isDayMaster ? "2.5px solid #4f46e5" : "1.5px solid #e2e8f0",
        boxShadow: isDayMaster ? "0 20px 40px -20px rgba(79, 70, 229, 0.15), inset 0 1px 1px rgba(255,255,255,0.8)" : "0 10px 25px -20px rgba(15,23,42,0.06)",
        textAlign: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDayMaster ? "0 25px 45px -15px rgba(79, 70, 229, 0.22)" : "0 15px 30px -15px rgba(15,23,42,0.12)",
        }
      }}
    >
      {isDayMaster && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #4f46e5 0%, #db2777 100%)",
          }}
        />
      )}
      {isDayMaster && (
        <Chip
          label="⭐ DAY MASTER"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            color: "#fff",
            fontSize: "0.58rem",
            fontWeight: 900,
            height: 18,
            boxShadow: "0 4px 8px rgba(79,70,229,0.25)"
          }}
        />
      )}
      <Typography sx={{ color: isDayMaster ? "#4f46e5" : "#64748b", fontSize: "0.75rem", fontWeight: 800, mt: isDayMaster ? 1.2 : 0, mb: 1.5, letterSpacing: "0.06rem", textTransform: "uppercase" }}>
        {pillar.label === "ปี" ? "ปี (년)" : pillar.label === "เดือน" ? "เดือน (월)" : pillar.label === "วัน" ? "วัน (일)" : "เวลา (시)"}
      </Typography>
      <Box sx={{ mb: 1.8 }}>
        <Typography sx={{ color: "#0f172a", fontSize: "2.1rem", fontWeight: 900, lineHeight: 1, mb: 0.5, letterSpacing: "-0.03em" }}>{pillar.stem.korean}{pillar.branch.korean}</Typography>
        <Typography sx={{ color: "#475569", fontSize: "0.82rem", fontWeight: 700 }}>({pillar.stem.name}{pillar.branch.name})</Typography>
      </Box>
      <Stack direction="column" spacing={0.8} sx={{ alignItems: "center" }}>
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "8px", bgcolor: stemMeta.bg, border: "1px solid " + stemMeta.color + "20" }}>
          <Typography sx={{ color: stemMeta.color, fontSize: "0.68rem", fontWeight: 900 }}>{stemMeta.label} ({pillar.stem.polarity === "+" ? "หยาง" : "หยิน"})</Typography>
        </Box>
        <Chip label={pillar.stem.tenGod.thaiLabel} size="small" sx={{ height: 21, bgcolor: isDayMaster ? "rgba(79, 70, 229, 0.12)" : "#f1f5f9", color: isDayMaster ? "#4f46e5" : "#475569", fontSize: "0.65rem", fontWeight: 800, borderRadius: "6px" }} />
        <Typography sx={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 600 }}>{pillar.branch.animal}</Typography>
      </Stack>
      {pillar.hiddenStems.length > 0 && (
        <Box sx={{ mt: 1.8, pt: 1.8, borderTop: "1.5px dashed #edf2f7" }}>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.62rem", fontWeight: 800, mb: 1, letterSpacing: "0.04em", textTransform: "uppercase" }}>ธาตุซ่อนในเสา</Typography>
          <Stack direction="row" spacing={0.6} sx={{ justifyContent: "center", flexWrap: "wrap", rowGap: 0.6 }}>
            {pillar.hiddenStems.map((stem) => (
              <Chip
                key={pillar.label + "-" + stem.korean + "-" + stem.tenGod.key}
                label={elementMeta[stem.element].label + " " + stem.tenGod.thaiLabel}
                size="small"
                sx={{ height: 21, bgcolor: elementMeta[stem.element].bg, color: elementMeta[stem.element].color, fontSize: "0.62rem", fontWeight: 800, borderRadius: "6px", border: "1px solid " + elementMeta[stem.element].color + "12" }}
              />
            ))}
          </Stack>
        </Box>
      )}
      {nickname && (
        <Box sx={{ mt: 1.8, pt: 1.5, borderTop: "1px solid #f1f5f9" }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.68rem", fontWeight: 700, lineHeight: 1.4 }}>
            💡 {nickname.split(" - ")[0]}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function AnalysisReading({ analysis, color }: { analysis: SajuAnalysis | null; color: string }) {
  if (!analysis) return null;

  const sections = [
    { label: "อ่านจากอะไร", text: analysis.why, tone: "#4f46e5" },
    { label: "แนวโน้ม", text: analysis.trend, tone: "#0891b2" },
    { label: "ควรทำ", text: analysis.advice, tone: "#059669" },
    { label: "ควรระวัง", text: analysis.caution, tone: "#d97706" },
  ];

  return (
    <Stack spacing={2.2} sx={{ pt: 2, borderTop: `1px dashed ${color}30` }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5 }}>
        {sections.map((section) => (
          <Box key={section.label} sx={{ p: 2, borderRadius: "14px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: `4px solid ${section.tone}` }}>
            <Typography sx={{ color: section.tone, fontSize: "0.76rem", fontWeight: 900, mb: 0.6 }}>{section.label}</Typography>
            <Typography sx={{ color: "#334155", fontSize: "0.84rem", lineHeight: 1.65, fontWeight: 600 }}>{section.text}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#fff7ed", border: "1px solid #fed7aa" }}>
        <Typography sx={{ color: "#9a3412", fontSize: "0.78rem", fontWeight: 900, mb: 1 }}>สรุปจำง่าย</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          {analysis.summary.map((item) => (
            <Chip key={item} label={item} size="small" sx={{ bgcolor: "#fff", color: "#7c2d12", border: "1px solid #fdba74", fontWeight: 800, borderRadius: "8px", height: "auto", py: 0.6, "& .MuiChip-label": { whiteSpace: "normal" } }} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function QuickSummaryPanel({ items }: { items: QuickSummaryItem[] }) {
  const heroItem = items.find((item) => item.variant === "hero") || items[0];
  const luckyItem = items.find((item) => item.variant === "lucky") || items[6];
  const coreItems = items.filter((item) => item.variant === "core");
  const remedyItems = items.filter((item) => item.variant === "remedy");

  return (
    <Box
      sx={{
        mb: 5,
        p: { xs: 2.5, sm: 3.5, md: 4.5 },
        borderRadius: "24px",
        background: "linear-gradient(135deg, #FFEBEF 0%, #FFFDF9 50%, #EAF0FF 100%)",
        color: "#2D2520",
        boxShadow: "8px 8px 0px #2D2520",
        border: "3.5px solid #2D2520",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header section with Ghibli badges */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 4,
          position: "relative",
          zIndex: 2,
          pb: 3,
          borderBottom: "2.5px solid #2D2520",
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1, flexWrap: "wrap", rowGap: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.6,
                borderRadius: "99px",
                bgcolor: "rgba(255, 142, 158, 0.15)",
                border: "2px solid #2D2520",
                color: "#FF8E9E",
              }}
            >
              <MagicStar size={14} color="#FF8E9E" variant="Bulk" className="pulse-slow" />
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                QUICK SUMMARY
              </Typography>
            </Box>
            <Chip
              label="สรุปดวง 30 วินาที"
              size="small"
              sx={{
                bgcolor: "#FAF8F2",
                color: "#2D2520",
                border: "2px solid #2D2520",
                fontWeight: 800,
                fontSize: "0.68rem",
                fontFamily: "var(--font-prompt), sans-serif"
              }}
            />
          </Stack>
          <Typography
            sx={{
              color: "#2D2520",
              fontSize: { xs: "1.4rem", md: "1.75rem" },
              fontWeight: 800,
              fontFamily: "var(--font-prompt), sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            สรุปชะตาชีวิตด่วน 30 วินาที
          </Typography>
          <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 500, mt: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
            ถอดรหัสและสรุปหัวข้อที่สำคัญที่สุดของดวงชะตาคุณเพื่อให้พร้อมประยุกต์ใช้งานได้ทันที
          </Typography>
        </Box>
      </Stack>

      {/* Main Grid Layout */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.1fr) minmax(0, 2fr)" }, gap: 3.5, position: "relative", zIndex: 2 }}>

        {/* Left Column: Hero Focus & Lucky Element (1/3 Width) */}
        <Stack spacing={3.5} sx={{ justifyContent: "stretch" }}>

          {/* Hero Trend Card */}
          {heroItem && (
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "#FFFDF9",
                border: "2.5px solid #2D2520",
                boxShadow: "3px 3px 0px #2D2520",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "4px 4px 0px #2D2520",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    bgcolor: "rgba(255, 142, 158, 0.15)",
                    border: "2px solid #2D2520",
                    display: "grid",
                    placeItems: "center",
                    color: "#FF8E9E",
                  }}
                >
                  <MagicStar size={22} variant="Bulk" color="currentColor" />
                </Box>
                <Box>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                    CORE FOCUS
                  </Typography>
                  <Typography sx={{ color: "#2D2520", fontSize: "1.05rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {heroItem.label}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: "#2D2520", fontSize: "0.92rem", lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                {heroItem.text}
              </Typography>
            </Box>
          )}

          {/* Lucky Element Card */}
          {luckyItem && (
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "#FFFDF9",
                border: "2.5px solid #2D2520",
                borderLeft: `8px solid ${luckyItem.color}`,
                boxShadow: "3px 3px 0px #2D2520",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "4px 4px 0px #2D2520",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    bgcolor: "#FFFDF9",
                    border: "2px solid #2D2520",
                    display: "grid",
                    placeItems: "center",
                    color: luckyItem.color,
                  }}
                >
                  <Element4 size={22} variant="Bulk" color="currentColor" />
                </Box>
                <Box>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                    LUCKY ELEMENT
                  </Typography>
                  <Typography sx={{ color: "#2D2520", fontSize: "1.05rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {luckyItem.label}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: "#2D2520", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                {luckyItem.text}
              </Typography>
            </Box>
          )}

        </Stack>

        {/* Right Column: 3 Core Pillars + 2 Remedies (2/3 Width) */}
        <Stack spacing={3.5} sx={{ justifyContent: "space-between" }}>

          {/* Three Core Cards Row (Love, Career, Money) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2.2,
            }}
          >
            {coreItems.map((item) => {
              const IconComp = item.icon || Heart;
              return (
                <Box
                  key={item.label}
                  sx={{
                    p: 2.6,
                    borderRadius: "16px",
                    bgcolor: "#FFFDF9",
                    border: `2px solid #2D2520`,
                    borderTop: `6px solid ${item.color}`,
                    boxShadow: "3px 3px 0px #2D2520",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 160,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "4px 4px 0px #2D2520",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 1.8 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        bgcolor: "#FFFDF9",
                        border: "2px solid #2D2520",
                        display: "grid",
                        placeItems: "center",
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={18} variant="Bulk" color="currentColor" />
                    </Box>
                    <Typography sx={{ color: "#2D2520", fontSize: "0.95rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.86rem", lineHeight: 1.6, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {item.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Two Remedies Row (Action, Caution) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2.5,
            }}
          >
            {remedyItems.map((item) => {
              const IconComp = item.icon || InfoCircle;
              const isCaution = item.label === "ต้องระวังอะไร";
              return (
                <Box
                  key={item.label}
                  sx={{
                    p: 2.8,
                    borderRadius: "16px",
                    bgcolor: "#FFFDF9",
                    border: "2.5px solid #2D2520",
                    borderLeft: isCaution ? "8px solid #FF8E9E" : "8px solid #7296F8",
                    boxShadow: "3px 3px 0px #2D2520",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "4px 4px 0px #2D2520",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        bgcolor: "#FFFDF9",
                        border: "2px solid #2D2520",
                        display: "grid",
                        placeItems: "center",
                        color: item.color,
                      }}
                    >
                      <IconComp size={20} variant="Bulk" color="currentColor" />
                    </Box>
                    <Typography sx={{ color: "#2D2520", fontSize: "0.95rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", lineHeight: 1.65, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {item.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>

        </Stack>

      </Box>
    </Box>
  );
}

const celestialElements = [
  { label: "木", name: "ไม้", color: "#10b981", bg: "rgba(16, 185, 129, 0.2)", top: "10%", left: "50%" },
  { label: "火", name: "ไฟ", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.2)", top: "37.6%", left: "88%" },
  { label: "土", name: "ดิน", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.2)", top: "82.4%", left: "73.6%" },
  { label: "金", name: "ทอง", color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.2)", top: "82.4%", left: "26.4%" },
  { label: "水", name: "น้ำ", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.2)", top: "37.6%", left: "12%" },
];

const stepsData = [
  {
    id: 1,
    title: "วิเคราะห์ 4 เสาหลักชีวิต (Four Pillars)",
    desc: "ถอดรหัสปี เดือน วัน และยามเกิดจากปฏิทินสุริยคติเกาหลี",
  },
  {
    id: 2,
    title: "สแกนธาตุเจ้าเรือน (Day Master)",
    desc: "วิเคราะห์จิตวิญญาณแห่งแกนกลางและพลังหยินหยางประจำตัว",
  },
  {
    id: 3,
    title: "คำนวณปฏิสัมพันธ์ห้าธาตุ (Five Elements Balance)",
    desc: "ประเมินสัดส่วนและกำลังของธาตุ ไม้ ไฟ ดิน ทอง น้ำ",
  },
  {
    id: 4,
    title: "ประกอบผังเทพผู้ปกปักษ์ (Ten Gods Chart)",
    desc: "เรียบเรียงตำแหน่งดาวประจำตัว สรุปคำทำนายรายวันเฉพาะคุณ",
  },
];

const cosmicParticles = Array.from({ length: 30 }, (_, i) => {
  const value = (salt: number) => {
    const raw = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  };
  const size = value(1) * 4 + 1;

  return {
    id: i,
    size,
    top: `${value(2) * 100}%`,
    left: `${value(3) * 100}%`,
    opacity: value(4) * 0.5 + 0.15,
    animationDuration: `${value(5) * 8 + 6}s`,
    animationDelay: `${value(6) * 5}s`,
  };
});

function SajuLoaderOverlay({ step }: { step: number }) {
  const percentComplete = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 98;

  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: 99999,
        bgcolor: "rgba(250, 248, 242, 0.96)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#2D2520",
        p: 3,
        overflow: "hidden",
      }}
    >
      {/* Cozy watercolor particles */}
      {cosmicParticles.map((particle) => (
        <Box
          key={particle.id}
          className="cosmic-particle"
          sx={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            bgcolor: particle.id % 3 === 0 ? "#FF8E9E" : particle.id % 3 === 1 ? "#7296F8" : "#fbbf24",
            borderRadius: "50%",
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity * 0.7,
            animation: `cosmicFloat ${particle.animationDuration} ease-in-out infinite`,
            animationDelay: particle.animationDelay,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Astro-Wheel Container */}
      <Box
        sx={{
          position: "relative",
          width: { xs: 240, sm: 280 },
          height: { xs: 240, sm: 280 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        {/* Outer pastel watercolor glow */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 142, 158, 0.15) 0%, rgba(250, 248, 242, 0) 70%)",
            filter: "blur(15px)",
            animation: "pulseGlow 3s ease-in-out infinite",
          }}
        />

        {/* Outer rotating dashed ring */}
        <Box
          sx={{
            position: "absolute",
            inset: 15,
            borderRadius: "50%",
            border: "2px dashed #2D2520",
            animation: "spin 20s linear infinite",
          }}
        />

        {/* Inner reverse rotating ring with markers */}
        <Box
          sx={{
            position: "absolute",
            inset: 45,
            borderRadius: "50%",
            border: "2px solid rgba(45, 37, 32, 0.2)",
            animation: "spin-reverse 25s linear infinite",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#FF8E9E",
              border: "2px solid #2D2520",
              transform: "translateX(-50%)",
            }
          }}
        />

        {/* Center organic Yin-Yang */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "#FFFDF9",
            border: "2.5px solid #2D2520",
            boxShadow: "4px 4px 0px #2D2520",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 100 100" style={{ animation: "spin 12s linear infinite" }}>
            <path d="M 50 0 A 50 50 0 0 0 50 100 A 25 25 0 0 0 50 50 A 25 25 0 0 1 50 0 Z" fill="#FF8E9E" />
            <path d="M 50 0 A 50 50 0 0 1 50 100 A 25 25 0 0 1 50 50 A 25 25 0 0 0 50 0 Z" fill="#7296F8" />
            <circle cx="50" cy="25" r="8" fill="#7296F8" />
            <circle cx="50" cy="75" r="8" fill="#FF8E9E" />
            <circle cx="50" cy="50" r="49" fill="none" stroke="#2D2520" strokeWidth="2" />
          </svg>
        </Box>

        {/* 5 Element Floating Nodes */}
        {celestialElements.map((el, idx) => {
          const isGlowing = step >= 3 || (step === 2 && idx === 2);

          return (
            <Box
              key={el.name}
              sx={{
                position: "absolute",
                top: el.top,
                left: el.left,
                transform: "translate(-50%, -50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "#FFFDF9",
                border: "2px solid #2D2520",
                boxShadow: isGlowing ? `3px 3px 0px #2D2520` : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 3,
                transition: "all 0.5s ease",
              }}
            >
              <Typography sx={{ color: isGlowing ? el.color : "#94a3b8", fontSize: "0.95rem", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                {el.label}
              </Typography>
              <Typography sx={{ color: isGlowing ? "#2D2520" : "#94a3b8", fontSize: "0.55rem", fontWeight: 700, mt: 0.1, fontFamily: "var(--font-prompt), sans-serif" }}>
                {el.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Main Ghibli progress card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          bgcolor: "#FFFDF9",
          border: "3px solid #2D2520",
          borderRadius: "20px",
          p: { xs: 3, sm: 3.5 },
          boxShadow: "6px 6px 0px #2D2520",
          textAlign: "left",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, justifyContent: "center" }}>
          <Box className="pulse-slow" sx={{ display: "flex", alignItems: "center" }}>
            <MagicStar size={22} color="#FF8E9E" variant="Bulk" />
          </Box>
          <Typography sx={{ color: "#2D2520", fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
            กำลังเปิดมิติทำนายดวงซาจู
          </Typography>
        </Stack>

        {/* Steps List */}
        <Stack spacing={2.2} sx={{ mb: 3.5 }}>
          {stepsData.map((s) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;

            return (
              <Stack
                key={s.id}
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "flex-start",
                  opacity: isActive || isCompleted ? 1 : 0.35,
                  transition: "opacity 0.4s ease",
                }}
              >
                {/* Step indicator circle */}
                <Box sx={{ mt: 0.3, flexShrink: 0 }}>
                  {isCompleted ? (
                    <Box sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: "rgba(16, 185, 129, 0.15)",
                      border: "2px solid #2D2520",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                    }}>
                      ✓
                    </Box>
                  ) : isActive ? (
                    <Box sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 142, 158, 0.15)",
                      border: "2px solid #2D2520",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "pulse 1.4s infinite"
                    }}>
                      <Box sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: "#FF8E9E",
                      }} />
                    </Box>
                  ) : (
                    <Box sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: "transparent",
                      border: "2px solid #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                    </Box>
                  )}
                </Box>

                {/* Step details */}
                <Box>
                  <Typography
                    sx={{
                      color: isActive ? "#FF8E9E" : isCompleted ? "#2D2520" : "#94a3b8",
                      fontSize: "0.92rem",
                      fontWeight: 800,
                      lineHeight: 1.25,
                      fontFamily: "var(--font-prompt), sans-serif",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {s.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: isActive ? "#5A4D43" : isCompleted ? "#5A4D43" : "#94a3b8",
                      fontSize: "0.78rem",
                      lineHeight: 1.4,
                      fontWeight: 500,
                      mt: 0.4,
                      fontFamily: "var(--font-prompt), sans-serif",
                    }}
                  >
                    {s.desc}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
        </Stack>

        {/* Progress Bar */}
        <Box>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ color: "#7296F8", fontSize: "0.75rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              {step === 4 ? "วิเคราะห์ลุล่วง 98%" : "กำลังประมวลผล..."}
            </Typography>
            <Typography sx={{ color: "#FF8E9E", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              {percentComplete}%
            </Typography>
          </Stack>
          <Box sx={{ height: 10, borderRadius: "999px", bgcolor: "#FAF8F2", border: "2px solid #2D2520", overflow: "hidden" }}>
            <Box
              sx={{
                height: "100%",
                width: `${percentComplete}%`,
                background: "linear-gradient(90deg, #7296F8 0%, #FF8E9E 100%)",
                borderRadius: "999px",
                transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Backdrop>
  );
}

// --- Main Page Component ---

export function SajuClient() {
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs("1995-05-15"));
  const [birthTime, setBirthTime] = useState("none");
  const [usesCustomTime, setUsesCustomTime] = useState(false);
  const [customBirthTime] = useState("12:00");
  const [birthGender, setBirthGender] = useState<BirthGender>("female");
  const [focus, setFocus] = useState("ภาพรวม");
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationStep, setCalculationStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [affiliateProducts, setAffiliateProducts] = useState<SajuAffiliateProduct[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [analysisTab, setAnalysisTab] = useState(0);
  const [showQuickSummary, setShowQuickSummary] = useState(true);
  const [showBirthTimePicker, setShowBirthTimePicker] = useState(false);


  const reading = useMemo(() => {
    if (!birthDate || !birthDate.isValid()) return null;
    try {
      return calculateSaju(birthDate, birthTime, usesCustomTime, customBirthTime, birthGender);
    } catch (e) {
      console.error("Saju Calculation Error:", e);
      return null;
    }
  }, [birthDate, birthTime, usesCustomTime, customBirthTime, birthGender]);
  const luckyElement = reading?.luckyElement;
  const elementMaxScore = reading ? Math.max(...Object.values(reading.scores), 1) : 1;
  const activeSajuAnalysis = reading ? getReadableSajuAnalysis(reading, focus) : null;
  const baseSajuAnalysis = reading ? getReadableSajuAnalysis(reading, "ภาพรวม") : null;
  const quickSummaryItems = reading ? buildQuickSummary(reading) : [];
  const selectedTimeOption = timeOptions.find((option) => option.value === birthTime) ?? timeOptions[0];

  const activeFocus = useMemo(() => {
    return focusOptions.find((opt) => opt.label === focus) || focusOptions[0];
  }, [focus]);
  const remedyPlan = reading
    ? getDynamicRemedyPlan({
        focus,
        luckyElement: reading.luckyElement,
        dayMaster: reading.dayMaster,
        isStrong: reading.isStrong,
        scores: reading.scores,
        annualInfluence: reading.annualInfluence,
      })
    : null;


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
    setCalculationStep(1);

    // Dynamic timer sequence for loading steps
    setTimeout(() => setCalculationStep(2), 900);
    setTimeout(() => setCalculationStep(3), 1800);
    setTimeout(() => setCalculationStep(4), 2700);

    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
      setShowQuickSummary(true);
      setAnalysisTab(0);
      setTimeout(() => {
        const resultSection = document.getElementById("saju-reveal");
        if (resultSection) resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 3600);
  };

  useEffect(() => {
    queueMicrotask(() => {
      setShowResults(false);
      setShowQuickSummary(true);
    });
  }, [birthDate, birthTime, usesCustomTime, customBirthTime, birthGender, focus]);
return (
    <Box
      sx={{
        pt: { xs: 11, md: 13 },
        pb: 8,
        bgcolor: "#FAF8F2",
        backgroundImage: 'radial-gradient(rgba(45, 37, 32, 0.04) 1.5px, transparent 1.5px), radial-gradient(rgba(255, 142, 158, 0.05) 1.5px, transparent 1.5px)',
        backgroundSize: "48px 48px",
        backgroundPosition: "0 0, 24px 24px",
        fontFamily: "var(--font-prompt), sans-serif"
      }}
    >
      {isCalculating && <SajuLoaderOverlay step={calculationStep} />}
      <Container maxWidth="xl">


        <Box
          sx={{
            mb: { xs: 2, md: 4 },
            p: { xs: 2, sm: 4, md: 4.5 },
            borderRadius: { xs: "18px", md: "24px" },
            border: "2.5px solid #2D2520",
            bgcolor: "#FFFDF9",
            boxShadow: "4px 4px 0px #2D2520",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.8,
              py: 0.75,
              borderRadius: "12px",
              bgcolor: "rgba(255, 142, 158, 0.15)",
              color: "#FF8E9E",
              border: "2px solid #2D2520",
              fontWeight: 800,
              mb: { xs: 1.5, md: 2.5 },
            }}
          >
            <MagicStar size={16} color="#FF8E9E" variant="Bulk" className="pulse-slow" />
            <Typography component="span" sx={{ color: "#2D2520", fontSize: { xs: "0.72rem", md: "0.82rem" }, fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
              KOREAN DESTINY ANALYSIS
            </Typography>
          </Box>

          <Typography sx={{ display: { xs: "none", md: "block" }, color: "#FF8E9E", fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
            ซาจูเกาหลี
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: "#2D2520",
              fontSize: { xs: "1.45rem", sm: "2.35rem", md: "3rem" },
              lineHeight: 1.08,
              fontWeight: 800,
              mb: { xs: 0, md: 2 },
              fontFamily: "var(--font-prompt), sans-serif",
            }}
          >
            <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>ดูดวงซาจู</Box>
            <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>วิเคราะห์พื้นดวงชะตา Saju</Box>
          </Typography>
          <Typography sx={{ display: { xs: "none", md: "block" }, color: "#5A4D43", fontSize: "1rem", maxWidth: 720, lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
            ถอดรหัสความลับ 4 เสาหลักชีวิต (ปี เดือน วัน เวลาเกิด) ตามศาสตร์แห่งพลังงานเกาหลีโบราณ ค้นพบความสมดุลธาตุประจำกาย และแนวโน้มชีวิตรอบตัวคุณ
          </Typography>
        </Box>
{/* Input Card */}
        <Box
          sx={{
            bgcolor: "#FFFDF9",
            borderRadius: { xs: "18px", md: "24px" },
            p: { xs: 2, sm: 4, md: 4.5 },
            boxShadow: { xs: "4px 4px 0px #2D2520", md: "6px 6px 0px #2D2520" },
            border: "2.5px solid #2D2520",
            mb: { xs: 3, md: 5 },
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: { xs: 2.25, lg: 6 }, mb: { xs: 2.25, md: 4 }, position: "relative", zIndex: 1, minWidth: 0 }}>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: { xs: 1.5, md: 3 } }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(114, 150, 248, 0.15)", border: "2.5px solid #2D2520", display: "grid", placeItems: "center" }}>
                  <Calendar size={20} color="#7296F8" variant="Bulk" />
                </Box>
                <Typography sx={{ color: "#2D2520", fontSize: { xs: "1rem", md: "1.2rem" }, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>วันและเวลาเกิด</Typography>
              </Stack>
              <Stack spacing={{ xs: 2, md: 3 }}>
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
                          width: "100%",
                          maxWidth: "100%",
                          minWidth: 0,
                          boxSizing: "border-box",
                          "& .MuiInputBase-root": {
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                            boxSizing: "border-box",
                          },
                          "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#FFFDF9", border: "2.5px solid #2D2520", fontFamily: "var(--font-prompt), sans-serif", fontWeight: 600, "&.Mui-focused": { borderColor: "#7296F8" } },
                          "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
                <Box>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 800, mb: 1, ml: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>เวลาเกิด</Typography>
                  <Button
                    type="button"
                    onClick={() => setShowBirthTimePicker(true)}
                    sx={{
                      display: { xs: "flex", md: "none" },
                      justifyContent: "space-between",
                      minHeight: 48,
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      borderRadius: "12px",
                      border: "1.75px solid #2D2520",
                      bgcolor: "#FFFDF9",
                      color: "#2D2520",
                      px: 1.5,
                      textTransform: "none",
                      fontWeight: 900,
                      fontFamily: "var(--font-prompt), sans-serif",
                      boxShadow: "2px 2px 0px rgba(45,37,32,0.12)",
                    }}
                  >
                    <Box sx={{ textAlign: "left", minWidth: 0, overflow: "hidden" }}>
                      <Box sx={{ fontSize: "0.88rem", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedTimeOption.label}</Box>
                      <Box sx={{ fontSize: "0.7rem", color: "#5A4D43", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedTimeOption.helper}</Box>
                    </Box>
                    <Calendar size={18} variant="Bulk" color="#7296F8" style={{ flexShrink: 0 }} />
                  </Button>
                  <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: { md: "repeat(3, 1fr)" }, gap: 1 }}>
                    {timeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        onClick={() => { setUsesCustomTime(false); setBirthTime(opt.value); }}
                        sx={{
                          borderRadius: "12px",
                          border: "2.5px solid #2D2520",
                          bgcolor: (!usesCustomTime && birthTime === opt.value) ? "#FF8E9E" : "#FFFDF9",
                          color: (!usesCustomTime && birthTime === opt.value) ? "#FFFDF9" : "#2D2520",
                          p: 1.2,
                          minHeight: 56,
                          flexDirection: "column",
                          textTransform: "none",
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          lineHeight: 1.2,
                          fontFamily: "var(--font-prompt), sans-serif",
                          boxShadow: (!usesCustomTime && birthTime === opt.value) ? "2px 2px 0px #2D2520" : "none",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: (!usesCustomTime && birthTime === opt.value) ? "#FF8E9E" : "#FAF8F2",
                            borderColor: "#2D2520",
                            transform: "translateY(-1px)"
                          }
                        }}
                      >
                        <Box>{opt.label.split(" (")[0]}</Box>
                        <Box sx={{ fontSize: "0.6rem", opacity: 0.8, fontWeight: 700 }}>{opt.helper}</Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 800, mb: 1, ml: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>เพศ</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: { xs: 1, md: 1.5 }, minWidth: 0 }}>
                    {genderOptions.map((opt) => {
                      const isActive = birthGender === opt.value;
                      const activeBg = opt.value === "male" ? "#7296F8" : "#FF8E9E";
                      return (
                        <Button
                          key={opt.value}
                          onClick={() => setBirthGender(opt.value)}
                          sx={{
                            borderRadius: "12px",
                            border: { xs: "2px solid #2D2520", md: "2.5px solid #2D2520" },
                            bgcolor: isActive ? activeBg : "#FFFDF9",
                            color: isActive ? "#FFFDF9" : "#2D2520",
                            boxShadow: { xs: "none", md: isActive ? "3px 3px 0px #2D2520" : "none" },
                            p: { xs: 1.1, md: 1.6 },
                            minHeight: { xs: 48, md: 68 },
                            minWidth: 0,
                            width: "100%",
                            boxSizing: "border-box",
                            flexDirection: "column",
                            textTransform: "none",
                            fontSize: "0.92rem",
                            fontWeight: 800,
                            lineHeight: 1.25,
                            fontFamily: "var(--font-prompt), sans-serif",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              bgcolor: isActive ? activeBg : "#FAF8F2",
                              borderColor: "#2D2520",
                              transform: "translateY(-2px)"
                            },
                          }}
                        >
                          <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                            <Box sx={{ fontSize: "1.25rem", lineHeight: 1, color: isActive ? "#FFFDF9" : "#5A4D43" }}>{opt.symbol}</Box>
                            <Box>{opt.label}</Box>
                          </Stack>
                          <Box sx={{ display: { xs: "none", md: "block" }, fontSize: "0.66rem", opacity: 0.8, fontWeight: 700 }}>{opt.helper}</Box>
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: { xs: 1.5, md: 3 } }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(245, 158, 11, 0.15)", border: "2.5px solid #2D2520", display: "grid", placeItems: "center" }}>
                  <Flash size={20} color="#f59e0b" variant="Bulk" />
                </Box>
                <Typography sx={{ color: "#2D2520", fontSize: { xs: "1rem", md: "1.2rem" }, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                  <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>เลือกเรื่องที่จะดู</Box>
                  <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>วิเคราะห์เรื่องที่ต้องการเน้น</Box>
                </Typography>
              </Stack>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(2, minmax(0, 1fr))" },
                  gap: { xs: 1, md: 1.5 },
                  minWidth: 0,
                }}
              >
                {focusOptions.map((opt) => (
                  <Button
                    key={opt.label}
                    onClick={() => setFocus(opt.label)}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: { xs: 0.75, md: 2 },
                      p: { xs: 1, md: 2.2 },
                      minWidth: 0,
                      width: "100%",
                      minHeight: { xs: 42, md: "auto" },
                      borderRadius: "12px",
                      border: { xs: "2px solid #2D2520", md: "2.5px solid #2D2520" },
                      bgcolor: focus === opt.label ? "rgba(255, 142, 158, 0.15)" : "#FFFDF9",
                      color: "#2D2520",
                      boxShadow: { xs: "none", md: focus === opt.label ? "3px 3px 0px #2D2520" : "none" },
                      transition: "all 0.2s ease-in-out",
                      textAlign: "left",
                      fontFamily: "var(--font-prompt), sans-serif",
                      "&:hover": {
                        borderColor: "#2D2520",
                        bgcolor: "rgba(255, 142, 158, 0.08)",
                        transform: "translateY(-2px)"
                      }
                    }}
                  >
                    <opt.icon
                      size={20}
                      variant="Bulk"
                      color={focus === opt.label ? "#FF8E9E" : "#5A4D43"}
                      style={{ transition: "all 0.3s" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: { xs: "0.84rem", md: "0.94rem" }, fontWeight: 800, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.label}</Typography>
                      <Typography sx={{ display: { xs: "none", md: "block" }, fontSize: "0.68rem", opacity: 0.8, fontWeight: 700 }}>{opt.helper}</Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: { xs: "none", md: "block" }, mt: 3, p: 2.5, borderRadius: "12px", bgcolor: "rgba(114, 150, 248, 0.1)", border: "2px solid #2D2520" }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <InfoCircle size={20} color="#7296F8" />
                  <Typography sx={{ color: "#2D2520", fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>ระบบ Saju (Four Pillars of Destiny)</Typography>
                </Stack>
                <Typography sx={{ color: "#5A4D43", fontSize: "0.8rem", mt: 1, lineHeight: 1.5, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>เป็นการทำนาย &quot;พื้นดวงชะตาชีวิต&quot; ที่ติดตัวมาแต่เกิด เพื่อใช้วางแผนชีวิตในระยะยาวครับ</Typography>
              </Box>
            </Box>
          </Box>
          <Button
            fullWidth
            onClick={handlePredict}
            disabled={isCalculating || !birthDate}
            sx={{
              height: { xs: 56, md: 72 },
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2D2520 0%, #FF8E9E 50%, #7296F8 100%)",
              color: "#FFFDF9",
              fontSize: { xs: "0.98rem", md: "1.2rem" },
              fontWeight: 800,
              textTransform: "none",
              boxShadow: { xs: "none", md: "4px 4px 0px #2D2520" },
              border: { xs: "2px solid #2D2520", md: "2.5px solid #2D2520" },
              fontFamily: "var(--font-prompt), sans-serif",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                background: "linear-gradient(135deg, #1A1513 0%, #E07D8B 50%, #5E7ECC 100%)",
                transform: "translateY(-3px)",
                boxShadow: "6px 6px 0px #2D2520"
              },
              "&.Mui-disabled": {
                background: "#cbd5e1",
                color: "#94a3b8",
                boxShadow: "none",
                borderColor: "#94a3b8",
                opacity: 0.8
              },
              "&:active": {
                transform: "translateY(-1px)"
              }
            }}
          >
            {isCalculating ? (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", width: "100%", minWidth: 0 }}>
                <Box sx={{ width: 22, height: 22, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <Typography sx={{ fontWeight: 800, fontSize: "inherit", letterSpacing: "0.02em", fontFamily: "var(--font-prompt), sans-serif" }}>กำลังวิเคราะห์...</Typography>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", justifyContent: "center", width: "100%", minWidth: 0 }}>
                <Gemini size={22} variant="Bulk" color="#FFFDF9" style={{ flexShrink: 0 }} />
                <Typography sx={{ fontWeight: 800, fontSize: "inherit", letterSpacing: "0.02em", fontFamily: "var(--font-prompt), sans-serif" }}>
                  <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>เริ่มทำนายซาจู</Box>
                  <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>ทำนายดวงชะตาชีวิต (Read My Destiny)</Box>
                </Typography>
              </Stack>
            )}
          </Button>
        </Box>
        <Drawer
          anchor="bottom"
          open={showBirthTimePicker}
          onClose={() => setShowBirthTimePicker(false)}
          sx={{ display: { xs: "block", md: "none" } }}
          slotProps={{
            paper: {
              sx: {
                m: 0,
                width: "100%",
                maxHeight: "78vh",
                borderRadius: "22px 22px 0 0",
                border: "2.5px solid #2D2520",
                borderBottom: 0,
                bgcolor: "#FFFDF9",
                p: 2,
                boxShadow: "0 -8px 28px rgba(45,37,32,0.18)",
              }
            }
          }}
        >
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <Box sx={{ width: 42, height: 4, borderRadius: "999px", bgcolor: "rgba(45,37,32,0.28)" }} />
            </Box>
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#2D2520", fontWeight: 950, fontSize: "1rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                เวลาเกิด
              </Typography>
              <IconButton onClick={() => setShowBirthTimePicker(false)} sx={{ color: "#2D2520" }}>
                ×
              </IconButton>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, overflowY: "auto", pb: 1 }}>
              {timeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setUsesCustomTime(false);
                    setBirthTime(opt.value);
                    setShowBirthTimePicker(false);
                  }}
                  sx={{
                    borderRadius: "12px",
                    border: "2px solid #2D2520",
                    bgcolor: (!usesCustomTime && birthTime === opt.value) ? "#FF8E9E" : "#FFFDF9",
                    color: (!usesCustomTime && birthTime === opt.value) ? "#FFFDF9" : "#2D2520",
                    p: 1.1,
                    minHeight: 56,
                    flexDirection: "column",
                    textTransform: "none",
                    fontSize: "0.78rem",
                    fontWeight: 850,
                    lineHeight: 1.2,
                    fontFamily: "var(--font-prompt), sans-serif",
                    boxShadow: (!usesCustomTime && birthTime === opt.value) ? "2px 2px 0px #2D2520" : "none",
                  }}
                >
                  <Box>{opt.label.split(" (")[0]}</Box>
                  <Box sx={{ fontSize: "0.62rem", opacity: 0.82, fontWeight: 750 }}>{opt.helper}</Box>
                </Button>
              ))}
            </Box>
          </Stack>
        </Drawer>
        {/* Results */}
        {showResults && reading ? (
          <Box id="saju-reveal" sx={{ animation: "resultFadeIn 1s cubic-bezier(0.2, 0, 0.2, 1)", fontFamily: "var(--font-prompt), sans-serif" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ color: "#2D2520", fontSize: { xs: "1.2rem", md: "1.45rem" }, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>คำทำนายของคุณ</Typography>
                <Typography sx={{ color: "#5A4D43", fontSize: "0.86rem", fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>เริ่มจากสรุปสั้น ๆ หรือเลื่อนอ่านรายละเอียดเต็มได้เลย</Typography>
              </Box>
              <Button
                onClick={() => setShowQuickSummary((value) => !value)}
                startIcon={<MagicStar size={18} variant="Bulk" color="currentColor" />}
                sx={{
                  borderRadius: "12px",
                  px: 2.2,
                  py: 1.2,
                  bgcolor: showQuickSummary ? "#2D2520" : "#FFFDF9",
                  color: showQuickSummary ? "#FFFDF9" : "#2D2520",
                  border: "2.5px solid #2D2520",
                  boxShadow: showQuickSummary ? "2px 2px 0px #2D2520" : "none",
                  fontWeight: 800,
                  textTransform: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: showQuickSummary ? "#1A1513" : "#FAF8F2",
                    borderColor: "#2D2520"
                  },
                }}
              >
                {showQuickSummary ? "ซ่อนสรุปดวง 30 วินาที" : "สรุปดวง 30 วินาที"}
              </Button>
            </Stack>

            {showQuickSummary && <QuickSummaryPanel items={quickSummaryItems} />}

            {/* ========================================================================= */}
            {/* SECTION 1: Unified Destiny Identity & 4 Pillars Chart (Full Width Card)   */}
            {/* ========================================================================= */}
            <Box
              sx={{
                mb: 4,
                bgcolor: "#FFFDF9",
                borderRadius: "24px",
                border: "2.5px solid #2D2520",
                boxShadow: "5px 5px 0px #2D2520",
                p: { xs: 3, sm: 4, md: 4.5 },
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Stack direction={{ xs: "column", lg: "row" }} spacing={5} sx={{ alignItems: "stretch" }}>

                {/* Day Master (Identity Panel) */}
                <Box sx={{ flex: { xs: "1", lg: "0.9" }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: "10px", bgcolor: elementMeta[reading.dayMaster.element].bg, display: "grid", placeItems: "center", color: elementMeta[reading.dayMaster.element].color, border: "2px solid #2D2520" }}>
                      <Personalcard size={18} variant="Bulk" color="currentColor" />
                    </Box>
                    <Typography sx={{ color: elementMeta[reading.dayMaster.element].color, fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>ธาตุเจ้าเรือนประจำตัว (DAY MASTER)</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2.5} sx={{ alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "16px",
                        bgcolor: elementMeta[reading.dayMaster.element].color,
                        display: "grid",
                        placeItems: "center",
                        color: "#FFFDF9",
                        border: "2.5px solid #2D2520",
                        boxShadow: "3px 3px 0px #2D2520",
                        flexShrink: 0
                      }}
                    >
                      <Typography sx={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>
                        {reading.dayMaster.korean}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#2D2520",
                          fontSize: { xs: "1.4rem", md: "1.6rem" },
                          fontWeight: 800,
                          fontFamily: "var(--font-prompt), sans-serif",
                          mb: 0.5
                        }}
                      >
                        คุณคือ &quot;{reading.dayMaster.name}&quot; ({elementMeta[reading.dayMaster.element].label}{reading.dayMaster.polarity === "+" ? "หยาง" : "หยิน"})
                      </Typography>
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                        ผู้อารักขาด้วยพลัง {elementMeta[reading.dayMaster.element].desc}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography sx={{ color: "#2D2520", fontSize: "0.92rem", lineHeight: 1.65, fontWeight: 500, mb: 3, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {DM_DETAILS[reading.dayMaster.korean] ? DM_DETAILS[reading.dayMaster.korean]["ภาพรวม"] : "พลังแห่งธาตุนี้แสดงถึงลักษณะนิสัยและศักยภาพหลักที่คอยขับเคลื่อนการตัดสินใจและความสำเร็จของตัวตนที่แท้จริงของคุณ"}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    <Chip label={reading.isStrong ? "💪 พลังดวงแข็งแรง (Strong)" : "🌱 พลังดวงอ่อนกำลัง (Weak)"} color={reading.isStrong ? "success" : "warning"} variant="outlined" sx={{ fontWeight: 800, borderRadius: "10px", border: "2px solid #2D2520", color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }} />
                    <Chip label={`🧭 ทิศมงคลหลัก: ${reading.majorLuckDirectionLabel}`} variant="outlined" sx={{ color: "#2D2520", borderColor: "#2D2520", bgcolor: "rgba(114, 150, 248, 0.15)", fontWeight: 800, borderRadius: "10px", border: "2px solid #2D2520", fontFamily: "var(--font-prompt), sans-serif" }} />
                  </Stack>
                </Box>

                {/* Vertical Divider for larger screens */}
                <Box sx={{ display: { xs: "none", lg: "block" }, width: "2px", bgcolor: "#2D2520" }} />

                {/* The 4 Pillars (Four Pillars grid) */}
                <Box sx={{ flex: { xs: "1", lg: "1.1" }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Typography sx={{ color: "#2D2520", fontSize: "1.05rem", fontWeight: 800, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>แผนผังเสาหลักชะตาชีวิต (The 4 Pillars)</Typography>
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.82rem", fontWeight: 500, mb: 3.5, fontFamily: "var(--font-prompt), sans-serif" }}>ปูมหลังเสาหลักกาลเวลาลิขิตพลังงานกำเนิด</Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.8 }}>
                    {reading.pillars.map((p, i) => (<PillarItem key={p.label} pillar={p} isDayMaster={i === 2} />))}
                    {!reading.hasBirthTime && (
                      <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "0" }, bgcolor: "#FAF8F2", borderRadius: "16px", border: "2.5px dashed #2D2520", display: "grid", placeItems: "center", p: 2 }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.75rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>ยามว่างเปล่า (Hour Pillar Empty)</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

              </Stack>
            </Box>

            {/* ========================================================================= */}
            {/* SECTION 2: Cosmic Balance & Daily Fortune (Balanced 2-Column Grid)         */}
            {/* ========================================================================= */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, gap: 3, mb: 4 }}>

              {/* Element Balance Panel */}
              <Box
                sx={{
                  bgcolor: "#FFFDF9",
                  p: { xs: 3, sm: 4 },
                  borderRadius: "24px",
                  border: "2.5px solid #2D2520",
                  boxShadow: "4px 4px 0px #2D2520",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Box>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3.2 }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: "10px", bgcolor: "rgba(16, 185, 129, 0.15)", border: "2px solid #2D2520", display: "grid", placeItems: "center", color: "#10b981" }}>
                      <Element4 size={18} variant="Bulk" color="currentColor" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>สมดุลพลังงานเบญจธาตุ</Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#5A4D43", fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>อัตราส่วนกำลังของธาตุสะสมในเรือนชะตา</Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={2.2}>
                    {reading.rankedElements.map((el) => {
                      const meta = elementMeta[el];
                      const score = reading.scores[el];
                      const elementKorean: Record<ElementKey, string> = {
                        Wood: "목",
                        Fire: "화",
                        Earth: "토",
                        Metal: "금",
                        Water: "수",
                      };

                      return (
                        <Box key={el}>
                          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <ElementIcon element={el} size={13} />
                              <Typography sx={{ fontSize: "0.84rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>ธาตุ{meta.label} ({elementKorean[el]})</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: meta.color, fontFamily: "var(--font-prompt), sans-serif" }}>{score}%</Typography>
                          </Stack>
                          <Box sx={{ height: 10, borderRadius: "999px", bgcolor: "#FAF8F2", border: "2px solid #2D2520", overflow: "hidden" }}>
                            <Box sx={{ height: "100%", width: `${(score / elementMaxScore) * 100}%`, bgcolor: meta.color, borderRadius: "999px", transition: "width 1s ease-out" }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                <Box sx={{ mt: 3, pt: 2.2, borderTop: "2px solid #2D2520" }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>ธาตุปรับสมดุลพึ่งพิงตลอดชีพ</Typography>
                      <Typography sx={{ color: elementMeta[reading.luckyElement].color, fontSize: "0.95rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                        ธาตุส่งเสริมหลัก: ธาตุ{elementMeta[reading.luckyElement].label}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "inline-flex", px: 1.5, py: 0.65, borderRadius: "10px", bgcolor: elementMeta[reading.luckyElement].bg, border: `2px solid #2D2520` }}>
                      <Typography sx={{ color: elementMeta[reading.luckyElement].color, fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>ธาตุคู่บุญ</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              {/* Daily Horoscope Panel */}
              <Box
                sx={{
                  bgcolor: "#FFFDF9",
                  p: { xs: 3, sm: 4 },
                  borderRadius: "24px",
                  border: "2.5px solid #2D2520",
                  borderTop: "8px solid #f59e0b",
                  boxShadow: "4px 4px 0px #2D2520",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Box>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: "10px", bgcolor: "rgba(245, 158, 11, 0.15)", border: "2px solid #2D2520", display: "grid", placeItems: "center", color: "#f59e0b" }}><Sun1 size={20} color="#f59e0b" variant="Bulk" /></Box>
                    <Box>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>ดวงรายวันเฉพาะตัวคุณ</Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: "#5A4D43", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>อัปเดตคำนวณอิงดาวจร ณ วันที่ {dayjs().format("D MMMM YYYY")}</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: "inline-flex", px: 2, py: 0.8, borderRadius: "12px", mb: 2.2, bgcolor: reading.dailyLuckStatus === "ดีมาก" ? "#dcfce7" : reading.dailyLuckStatus === "ควรระวัง" ? "#fee2e2" : "#fef3c7", border: `2px solid #2D2520` }}>
                    <Typography sx={{ fontSize: "0.98rem", fontWeight: 800, color: reading.dailyLuckStatus === "ดีมาก" ? "#166534" : reading.dailyLuckStatus === "ควรระวัง" ? "#991b1b" : "#92400e", fontFamily: "var(--font-prompt), sans-serif" }}>
                      พลังงานดวงวันนี้: {reading.dailyLuckStatus}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: "0.96rem", color: "#2D2520", lineHeight: 1.8, fontWeight: 500, mb: 3, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {reading.dailyAdvice}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(245,158,11,0.06)", border: "2px dashed #2D2520" }}>
                  <Typography sx={{ color: "#2D2520", fontSize: "0.75rem", fontWeight: 800, lineHeight: 1.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                    💡 คำชี้แนะประจำวัน: คลื่นพลังงานชีวิตเกื้อหนุนตามจังหวะซาจูรายวัน ให้คุณใช้วางแผนการตัดสินใจสำคัญในชีวิตประจำวันเพื่อความราบรื่นสูงสุด
                  </Typography>
                </Box>
              </Box>

            </Box>

            {/* ========================================================================= */}
            {/* SECTION 3: Deep Readings & Action Plans (2-Column Grid)                  */}
            {/* ========================================================================= */}

            {/* Quick Indicator Banner */}
            <Box
              sx={{
                mb: 4,
                p: { xs: 3, md: 3.5 },
                borderRadius: "20px",
                bgcolor: "#2D2520",
                border: "2.5px solid #2D2520",
                boxShadow: "4px 4px 0px #2D2520",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                overflow: "hidden",
                position: "relative"
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: "15px", bgcolor: activeFocus.color, display: "grid", placeItems: "center", border: "2px solid #FFFDF9", boxShadow: '0 6px 12px rgba(0,0,0,0.2)' }}>
                  <activeFocus.icon size={24} color="#FFFDF9" variant="Bulk" />
                </Box>
                <Box>
                  <Typography sx={{ color: "#FAF8F2", opacity: 0.8, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>หัวข้อหลักที่เจาะลึก</Typography>
                  <Typography sx={{ color: "#FFFDF9", fontSize: { xs: "1.3rem", md: "1.52rem" }, fontWeight: 800, lineHeight: 1.25, fontFamily: "var(--font-prompt), sans-serif" }}>วิเคราะห์เรื่อง{focus}</Typography>
                </Box>
              </Stack>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.2, py: 1, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.08)", border: "2px solid #FFFDF9", position: "relative", zIndex: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981", animation: "pulse 2s infinite" }} />
                <Typography sx={{ color: "#FFFDF9", fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>สรุปผลแบบพร้อมใช้</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.4fr) minmax(300px, 0.6fr)" }, gap: 3, alignItems: "start" }}>

              {/* LEFT Column: Detailed Fortune Text Analysis */}
              <Box>

                {/* Main Tab Analysis */}
                <Box sx={{ bgcolor: "#FFFDF9", borderRadius: "20px", border: "2.5px solid #2D2520", mb: 4, overflow: "hidden", boxShadow: "4px 4px 0px #2D2520" }}>
                  {focus !== "ภาพรวม" ? (
                    <Box sx={{ borderBottom: "2.5px solid #2D2520", background: "#FAF8F2" }}>
                      <Tabs
                        value={analysisTab}
                        onChange={(_, v) => setAnalysisTab(v)}
                        variant="fullWidth"
                        sx={{
                          '& .MuiTab-root': { py: 2.5, fontWeight: 800, fontSize: '0.95rem', color: '#5A4D43', fontFamily: 'var(--font-prompt), sans-serif' },
                          '& .Mui-selected': { color: '#FF8E9E !important' },
                          '& .MuiTabs-indicator': { height: 4, bgcolor: '#FF8E9E', borderRadius: '4px 4px 0 0' }
                        }}
                      >
                        <Tab
                          icon={<activeFocus.icon size={20} color={analysisTab === 0 ? "#FF8E9E" : "#5A4D43"} variant="Bulk" />}
                          iconPosition="start"
                          label={`วิเคราะห์เรื่อง${focus}`}
                        />
                        <Tab
                          icon={<Profile2User size={20} color={analysisTab === 1 ? "#FF8E9E" : "#5A4D43"} variant="Bulk" />}
                          iconPosition="start"
                          label="ตัวตนพื้นฐาน (ถาวร)"
                        />
                      </Tabs>
                    </Box>
                  ) : (
                    <Box sx={{ p: 3, borderBottom: "2.5px solid #2D2520", background: "#FAF8F2" }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "rgba(255, 142, 158, 0.15)", border: "2px solid #2D2520", display: "grid", placeItems: "center" }}>
                          <MagicStar size={24} color="#FF8E9E" variant="Bulk" />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>เจาะลึกคำทำนาย</Typography>
                          <Typography sx={{ fontSize: "0.88rem", color: "#5A4D43", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>วิเคราะห์ภาพรวมพื้นดวงชะตาชีวิต</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  <Box sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column" }}>
                    {(analysisTab === 0 || focus === "ภาพรวม") ? (
                      <Box sx={{ animation: "resultFadeIn 0.5s ease" }}>
                        <Box sx={{ p: { xs: 2.5, md: 3.2 }, borderRadius: "16px", bgcolor: "#FFFDF9", border: "2px solid #2D2520", borderLeft: `8px solid ${activeFocus.color}`, position: "relative", overflow: "hidden", boxShadow: "2px 2px 0px rgba(0,0,0,0.05)" }}>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5, position: "relative" }}>
                            <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: activeFocus.color, display: "grid", placeItems: "center", border: "2px solid #2D2520", boxShadow: "2px 2px 0px #2D2520" }}>
                              <activeFocus.icon size={24} color="#FFFDF9" variant="Bulk" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>บทวิเคราะห์เรื่อง{focus}</Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: "#5A4D43", fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>{focus === "ภาพรวม" ? "ศักยภาพและพื้นฐานชีวิตในทุกด้าน" : "เจาะลึกตามหัวข้อที่คุณเลือกเน้นเป็นพิเศษ"}</Typography>
                            </Box>
                          </Stack>
                          {activeSajuAnalysis && (
                            <Box sx={{ mb: 2, px: 2, py: 1.4, borderRadius: "12px", bgcolor: "#FAF8F2", border: "2px solid #2D2520", borderLeft: `6px solid ${activeFocus.color}`, position: "relative" }}>
                              <Typography sx={{ color: activeFocus.color, fontSize: "0.78rem", fontWeight: 800, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>คำฟันธงจากดวง</Typography>
                              <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.98rem", md: "1.04rem" }, lineHeight: 1.65, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>{activeSajuAnalysis.verdict}</Typography>
                            </Box>
                          )}
                          <Typography sx={{ color: "#2D2520", fontSize: { xs: "1rem", md: "1.08rem" }, lineHeight: 1.9, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif", position: "relative" }}>
                            {activeSajuAnalysis?.detail}
                          </Typography>
                          <Box sx={{ mt: 2.5 }}>
                            <AnalysisReading analysis={activeSajuAnalysis} color={activeFocus.color} />
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ animation: "resultFadeIn 0.5s ease" }}>
                        <Box sx={{ p: { xs: 2.5, md: 3.2 }, borderRadius: "16px", bgcolor: "#FFFDF9", border: "2px solid #2D2520", borderLeft: "8px solid #64748b" }}>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: "#FFFDF9", border: "2px solid #2D2520", display: "grid", placeItems: "center" }}>
                              <Profile2User size={24} color="#64748b" variant="Bulk" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>ลักษณะนิสัยพื้นฐาน (ถาวร)</Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: "#5A4D43", fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>ตัวตนที่แท้จริงตามวันเกิดของคุณ</Typography>
                            </Box>
                          </Stack>
                          {baseSajuAnalysis && (
                            <Box sx={{ mb: 2, px: 2, py: 1.4, borderRadius: "12px", bgcolor: "#FAF8F2", border: "2px solid #2D2520", borderLeft: "6px solid #64748b" }}>
                              <Typography sx={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 800, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>คำฟันธงจากดวง</Typography>
                              <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.98rem", md: "1.04rem" }, lineHeight: 1.65, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>{baseSajuAnalysis.verdict}</Typography>
                            </Box>
                          )}
                          <Typography sx={{ color: "#2D2520", fontSize: "1.08rem", lineHeight: 2, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                            {baseSajuAnalysis?.detail}
                          </Typography>
                          <Box sx={{ mt: 2.5 }}>
                            <AnalysisReading analysis={baseSajuAnalysis} color="#64748b" />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Gender insight bar inside analysis card */}
                    <Box sx={{ mt: 3, p: 2.5, borderRadius: "14px", bgcolor: "#FAF8F2", border: "2.5px solid #2D2520" }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}>
                        <Box>
                          <Typography sx={{ color: "#2D2520", fontSize: "0.92rem", fontWeight: 800, mb: 0.6, fontFamily: "var(--font-prompt), sans-serif" }}>มุมมองตามเพศในการอ่านดวง</Typography>
                          <Typography sx={{ color: "#5A4D43", fontSize: "0.86rem", lineHeight: 1.65, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>{reading.genderInsight}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                          <Chip label={reading.gender === "male" ? "♂ เพศชาย" : "♀ เพศหญิง"} size="small" sx={{ bgcolor: "#FFFDF9", color: "#2D2520", border: "1.5px solid #2D2520", fontWeight: 800, borderRadius: "8px", fontFamily: "var(--font-prompt), sans-serif" }} />
                          <Chip label={elementMeta[reading.relationshipElement].label} size="small" sx={{ bgcolor: elementMeta[reading.relationshipElement].bg, color: elementMeta[reading.relationshipElement].color, border: `1.5px solid #2D2520`, fontWeight: 800, borderRadius: "8px", fontFamily: "var(--font-prompt), sans-serif" }} />
                        </Stack>
                      </Stack>
                    </Box>

                  </Box>
                </Box>

                {/* Life Ten Gods breakdown (Pragmatic Talent Nodes) */}
                {reading.tenGodSummary.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "rgba(255, 142, 158, 0.15)", border: "2px solid #2D2520", display: "grid", placeItems: "center" }}><Personalcard size={20} color="#FF8E9E" variant="Bulk" /></Box>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>โครงสร้างพลังเด่นในชะตาชีวิต (Ten Gods)</Typography>
                      <Chip label="พรสวรรค์หลัก" size="small" sx={{ bgcolor: "rgba(255, 142, 158, 0.15)", color: "#FF8E9E", border: "1.5px solid #2D2520", fontWeight: 800, fontSize: "0.7rem", fontFamily: "var(--font-prompt), sans-serif" }} />
                    </Stack>

                    <Box sx={{ bgcolor: "#FFFDF9", p: { xs: 3, sm: 4 }, borderRadius: "20px", border: "2.5px solid #2D2520", boxShadow: "4px 4px 0px #2D2520" }}>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 3 }}>
                        <Box sx={{ maxWidth: 520 }}>
                          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#2D2520", mb: 0.6, fontFamily: "var(--font-prompt), sans-serif" }}>พลังดวงดาวสนับสนุนหลัก</Typography>
                          <Typography sx={{ fontSize: "0.86rem", color: "#5A4D43", lineHeight: 1.6, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                            สิบผู้ปกปักษ์สะท้อนถึงแรงขับเคลื่อน โอกาสการงาน และช่องทางดึงดูดทรัพย์ที่ง่ายที่สุดของดวงชะตาคุณ
                          </Typography>
                        </Box>
                        <Chip label={`เด่นสุด: ${reading.tenGodSummary[0].thaiLabel}`} sx={{ bgcolor: "#FF8E9E", color: "#FFFDF9", border: "2px solid #2D2520", fontSize: "0.88rem", fontWeight: 800, borderRadius: "10px", height: 36, px: 2, fontFamily: "var(--font-prompt), sans-serif" }} />
                      </Stack>

                      <Box sx={{ p: 2.8, mb: 3, borderRadius: "16px", bgcolor: "#FAF8F2", border: "2.5px solid #2D2520", borderLeft: "8px solid #FF8E9E", boxShadow: "2px 2px 0px rgba(0,0,0,0.05)" }}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
                          <Box sx={{ minWidth: 140 }}>
                            <Typography sx={{ color: "#FF8E9E", fontSize: "1.24rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>{reading.tenGodSummary[0].thaiLabel}</Typography>
                            <Typography sx={{ color: "#5A4D43", fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>{reading.tenGodSummary[0].label}</Typography>
                          </Box>
                          <Typography sx={{ color: "#2D2520", fontSize: "0.96rem", lineHeight: 1.8, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>{reading.tenGodSummary[0].description}</Typography>
                        </Stack>
                      </Box>

                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                        {reading.tenGodSummary.slice(1, 5).map((god) => (
                          <Box key={god.key} sx={{ p: 2, borderRadius: "12px", bgcolor: "#FFFDF9", border: "2px solid #2D2520" }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                              <Typography sx={{ color: "#2D2520", fontSize: "0.96rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>{god.thaiLabel}</Typography>
                              <Chip label={getTenGodLevel(god.count)} size="small" sx={{ height: 24, bgcolor: "#FAF8F2", border: "1.5px solid #2D2520", color: "#2D2520", fontSize: "0.76rem", fontWeight: 800, borderRadius: "7px", fontFamily: "var(--font-prompt), sans-serif" }} />
                            </Stack>
                            <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", lineHeight: 1.65, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>{god.description}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Annual Influence Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ p: 3, borderRadius: "20px", bgcolor: "#FFFDF9", border: "2.5px solid #2D2520", borderLeft: "8px solid #7296F8", boxShadow: "3px 3px 0px #2D2520" }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 2 }}>
                      <Stack direction="row" spacing={1.4} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: "rgba(114, 150, 248, 0.15)", border: "2.5px solid #2D2520", display: "grid", placeItems: "center" }}>
                          <Calendar size={22} color="#7296F8" variant="Bulk" />
                        </Box>
                        <Box>
                          <Typography sx={{ color: "#2D2520", fontSize: "1.06rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>จังหวะชีวิตภาพรวมปีนี้ของคุณ</Typography>
                          <Typography sx={{ color: "#7296F8", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                            ปีคำนวณ {reading.annualInfluence.year} · {reading.annualInfluence.tenGod.thaiLabel}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        label={`${reading.annualInfluence.stem.korean}${reading.annualInfluence.branch.korean} ${reading.annualInfluence.branch.animal}`}
                        size="small"
                        sx={{ bgcolor: "#FAF8F2", color: "#2D2520", border: "1.5px solid #2D2520", fontWeight: 800, borderRadius: "8px", fontFamily: "var(--font-prompt), sans-serif" }}
                      />
                    </Stack>
                    <Typography sx={{ color: "#2D2520", fontSize: "1rem", fontWeight: 800, mb: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                      {reading.annualInfluence.themeTitle}
                    </Typography>
                    <Typography sx={{ color: "#5A4D43", fontSize: "0.94rem", lineHeight: 1.75, fontWeight: 500, mb: 1.4, fontFamily: "var(--font-prompt), sans-serif" }}>
                      {reading.annualInfluence.themeSummary}
                    </Typography>
                    <Typography sx={{ color: "#7296F8", fontSize: "0.88rem", lineHeight: 1.65, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                      📌 ข้อแนะนำประจำปี: {reading.annualInfluence.themeAdvice}
                    </Typography>
                  </Box>
                </Box>

              </Box>

              {/* RIGHT Column: Remedy Action Plan & Lucky Products */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                {/* Lifelong Lucky Element permanent card */}
                <Box sx={{ p: 3, bgcolor: "#FFFDF9", borderRadius: "16px", border: "2.5px solid #2D2520", borderLeft: `8px solid ${elementMeta[reading.luckyElement].color}`, boxShadow: "3px 3px 0px #2D2520" }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "#FFFDF9", border: "2px solid #2D2520", display: "grid", placeItems: "center", color: elementMeta[reading.luckyElement].color }}>
                      <Element4 size={24} variant="Bulk" color="currentColor" />
                    </Box>
                    <Box>
                      <Typography sx={{ color: "#2D2520", fontSize: "1.05rem", fontWeight: 800, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>ธาตุเสริมดวงชะตาตลอดชีพ</Typography>
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.92rem", lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                        ดวงนี้ควรเพิ่มพลังงาน **ธาตุ{elementMeta[reading.luckyElement].label}**: {luckyElementAdvice[reading.luckyElement]}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Affiliate Products Card (Moved immediately below Lucky Element for higher CTR/conversion) */}
                <Box
                  sx={{
                    bgcolor: "#FFFDF9",
                    p: 3,
                    borderRadius: "20px",
                    border: "2.5px solid #2D2520",
                    borderTop: `8px solid ${elementMeta[reading.luckyElement].color}`,
                    boxShadow: "4px 4px 0px #2D2520"
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: `${elementMeta[reading.luckyElement].color}22`, border: "2px solid #2D2520", display: "grid", placeItems: "center", color: elementMeta[reading.luckyElement].color }}>
                      <Shop size={20} variant="Bulk" color="currentColor" />
                    </Box>
                    <Typography sx={{ fontSize: "1.02rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>
                      ของมงคลนำโชคแนะนำ (เสริมธาตุ{elementMeta[reading.luckyElement].label})
                    </Typography>
                  </Stack>

                  {isProductsLoading ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <CircularProgress size={24} sx={{ color: elementMeta[reading.luckyElement].color }} />
                      <Typography sx={{ mt: 1, fontSize: "0.8rem", color: "#5A4D43", fontFamily: "var(--font-prompt), sans-serif" }}>กำลังค้นหาสินค้าเสริมพลังชีวิต...</Typography>
                    </Box>
                  ) : affiliateProducts.length > 0 ? (
                    <Stack spacing={2.2}>
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
                          rating={product.rating}
                          reviewCount={product.reviewCount}
                          originalPrice={product.originalPrice}
                          variant="sidebar"
                          accentColor={elementMeta[reading.luckyElement].color}
                          badge={`แนะนำเสริมธาตุ${elementMeta[reading.luckyElement].label}`}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box
                      sx={{
                        minHeight: 150,
                        borderRadius: "16px",
                        border: `2px dashed ${elementMeta[reading.luckyElement].color}`,
                        bgcolor: "#FAF8F2",
                        display: "grid",
                        placeItems: "center",
                        px: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "#5A4D43", fontFamily: "var(--font-prompt), sans-serif" }}>
                        ยังไม่มีสินค้า
                      </Typography>
                    </Box>
                  )}

                  {affiliateProducts.length > 0 ? (
                    <Typography sx={{ color: "#5A4D43", fontSize: "0.65rem", textAlign: "center", mt: 2.5, fontStyle: "italic", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                      * แนะนำของมงคลตามพลังงานธาตุ{elementMeta[reading.luckyElement].label} เพื่อปรับหนุนและเสริมจุดบกพร่องของชะตาชีวิตคุณ
                    </Typography>
                  ) : null}
                </Box>

                {/* Remedy Action Plan Card */}
                {remedyPlan && (
                  <Box sx={{ bgcolor: "#FFFDF9", borderRadius: "20px", border: "2.5px solid #2D2520", boxShadow: "4px 4px 0px #2D2520", overflow: "hidden" }}>
                    <Box sx={{ p: 3, bgcolor: "#FAF8F2", borderBottom: "2.5px solid #2D2520" }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: "#FFFDF9", border: "2px solid #2D2520", display: "grid", placeItems: "center" }}>
                          <MagicStar size={18} color="#FF8E9E" variant="Bulk" />
                        </Box>
                        <Box>
                          <Typography sx={{ color: "#2D2520", fontSize: "1.05rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>คัมภีร์แก้ชะตาชีวิต (Action Plan)</Typography>
                          <Typography sx={{ color: "#5A4D43", fontSize: "0.78rem", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>คำแนะนำการปรับและแก้จุดติดขัดในชีวิต</Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box sx={{ p: 3 }}>

                      {/* Basis chips */}
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, mb: 2.5 }}>
                        {remedyPlan.basis.map((item) => (
                          <Chip key={item} label={item} size="small" sx={{ bgcolor: "#FFFDF9", color: "#2D2520", border: "1.5px solid #2D2520", fontWeight: 800, fontSize: "0.7rem", fontFamily: "var(--font-prompt), sans-serif" }} />
                        ))}
                      </Stack>

                      {/* Warning, Action, Avoid grids */}
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {[
                          { label: "⚠️ สิ่งที่ควรระมัดระวัง (Caution)", text: remedyPlan.caution, color: "#d97706", bg: "#FFFDF9", border: "#2D2520" },
                          { label: "✅ สิ่งที่ควรปฏิบัติ (Action)", text: remedyPlan.action, color: "#059669", bg: "#FFFDF9", border: "#2D2520" },
                          { label: "❌ สิ่งที่ควรหลีกเลี่ยง (Avoid)", text: remedyPlan.avoid, color: "#e11d48", bg: "#FFFDF9", border: "#2D2520" },
                        ].map((item) => (
                          <Box
                            key={item.label}
                            sx={{
                              p: 2.2,
                              borderRadius: "12px",
                              bgcolor: item.bg,
                              border: "2px solid " + item.border,
                              borderLeft: "8px solid " + item.color,
                            }}
                          >
                            <Typography sx={{ color: item.color, fontSize: "0.78rem", fontWeight: 800, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>{item.label}</Typography>
                            <Typography sx={{ color: "#2D2520", fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>{item.text}</Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* Specific Element Remedy Bullets */}
                      <Box sx={{ p: 2.2, borderRadius: "12px", bgcolor: "#FFFDF9", border: `2px solid #2D2520`, borderLeft: `8px solid ${elementMeta[reading.luckyElement].color}`, mb: 2.5 }}>
                        <Typography sx={{ color: "#2D2520", fontSize: "0.88rem", fontWeight: 800, mb: 1, fontFamily: "var(--font-prompt), sans-serif" }}>{remedyPlan.elementTitle}</Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2, color: "#2D2520" }}>
                          {remedyPlan.elementItems.map((item, index) => (
                            <Typography key={`${item}-${index}`} component="li" sx={{ fontSize: "0.84rem", lineHeight: 1.7, fontWeight: 500, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                              {item}
                            </Typography>
                          ))}
                        </Box>
                      </Box>

                      {/* Extra tips */}
                      <Stack spacing={1.5} sx={{ p: 1, borderTop: "2px solid #2D2520", mt: 1 }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.82rem", lineHeight: 1.6, fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>{remedyPlan.balanceTip}</Typography>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.78rem", lineHeight: 1.55, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>{remedyPlan.dayMasterTip}</Typography>
                      </Stack>

                    </Box>
                  </Box>
                )}



              </Box>

            </Box>

          </Box>
        ) : (
          <Box sx={{ py: 10, bgcolor: "#FFFDF9", border: "2.5px dashed #2D2520", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.02)" }}>
            <SearchNormal size={56} color="#5A4D43" variant="TwoTone" />
            <Typography sx={{ color: "#2D2520", fontSize: "1.1rem", mt: 2.5, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>รอการวิเคราะห์ข้อมูลพื้นดวงชะตาชีวิต</Typography>
          </Box>
        )}
      </Container>
      <style jsx global>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes resultFadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.8; } }
        @keyframes cosmicFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-30px) translateX(15px) scale(1.3); opacity: 0.6; }
          100% { transform: translateY(-60px) translateX(0) scale(1); opacity: 0.15; }
        }
        @keyframes elementGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); filter: drop-shadow(0 0 2px currentColor); }
          50% { transform: translate(-50%, -50%) scale(1.08); filter: drop-shadow(0 0 12px currentColor); }
        }
        .pulse-slow {
          animation: pulse 2.5s infinite ease-in-out;
        }
      `}</style>
    </Box>
  );
}
