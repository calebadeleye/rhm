import type { Programme } from "@/types/content";

/**
 * Editable programme catalogue. This is the source of truth for the public
 * broadcast schedule — it is intentionally decoupled from AzuraCast, since
 * playlist/song-history data does not represent the programme grid.
 * Replace this file with a database-backed loader when the admin backend
 * ships; consuming components only depend on the exported shape.
 */
export const programmes: Programme[] = [
  {
    id: "morning-devotion",
    slug: "morning-devotion",
    title: "Morning Devotion",
    shortDescription: "A short daily devotion to anchor your morning in Scripture and prayer.",
    description:
      "Morning Devotion opens each broadcast day with a brief reading, a moment of reflection and a short prayer. Pastor Eric Johnson walks through a passage of Scripture in five minutes or less, giving listeners a steady, unhurried start before the day begins.",
    presenterId: "eric-johnson",
    category: "teaching",
    coverImageUrl: "",
    schedule: [
      { day: "mon", startTime: "05:30", endTime: "06:00" },
      { day: "tue", startTime: "05:30", endTime: "06:00" },
      { day: "wed", startTime: "05:30", endTime: "06:00" },
      { day: "thu", startTime: "05:30", endTime: "06:00" },
      { day: "fri", startTime: "05:30", endTime: "06:00" },
      { day: "sat", startTime: "05:30", endTime: "06:00" },
      { day: "sun", startTime: "05:30", endTime: "06:00" },
    ],
  },
  {
    id: "redemption-word",
    slug: "redemption-word",
    title: "Redemption Word",
    shortDescription: "Bible teaching that transforms lives, twice each weekday.",
    description:
      "Redemption Word is our flagship teaching programme. Pastor Eric Johnson opens the Scriptures verse by verse, addressing real questions of faith and life with clarity and compassion. Broadcast twice daily so listeners can catch it on their morning commute or in the evening.",
    presenterId: "eric-johnson",
    category: "teaching",
    coverImageUrl: "",
    schedule: [
      { day: "mon", startTime: "06:00", endTime: "07:00" },
      { day: "mon", startTime: "18:00", endTime: "19:00" },
      { day: "tue", startTime: "06:00", endTime: "07:00" },
      { day: "tue", startTime: "18:00", endTime: "19:00" },
      { day: "wed", startTime: "06:00", endTime: "07:00" },
      { day: "wed", startTime: "18:00", endTime: "19:00" },
      { day: "thu", startTime: "06:00", endTime: "07:00" },
      { day: "thu", startTime: "18:00", endTime: "19:00" },
      { day: "fri", startTime: "06:00", endTime: "07:00" },
      { day: "fri", startTime: "18:00", endTime: "19:00" },
    ],
  },
  {
    id: "worship-flow",
    slug: "worship-flow",
    title: "Worship Flow",
    shortDescription: "Continuous worship music to uplift your spirit throughout the day.",
    description:
      "Worship Flow fills the gaps between our live programmes with a curated rotation of contemporary and classic worship music, selected by the Redemption Worship Team to keep your heart set on Jesus wherever you are.",
    presenterId: "worship-team",
    category: "worship",
    coverImageUrl: "",
    schedule: [
      { day: "mon", startTime: "09:00", endTime: "12:00" },
      { day: "mon", startTime: "13:00", endTime: "18:00" },
      { day: "tue", startTime: "09:00", endTime: "12:00" },
      { day: "tue", startTime: "13:00", endTime: "18:00" },
      { day: "wed", startTime: "09:00", endTime: "12:00" },
      { day: "wed", startTime: "13:00", endTime: "18:00" },
      { day: "thu", startTime: "09:00", endTime: "12:00" },
      { day: "thu", startTime: "13:00", endTime: "18:00" },
      { day: "fri", startTime: "09:00", endTime: "12:00" },
      { day: "fri", startTime: "13:00", endTime: "18:00" },
      { day: "fri", startTime: "19:00", endTime: "21:00" },
      { day: "sat", startTime: "09:00", endTime: "20:00" },
      { day: "sun", startTime: "13:00", endTime: "22:00" },
    ],
  },
  {
    id: "real-talk-live",
    slug: "real-talk-live",
    title: "Real Talk Live",
    shortDescription: "Real conversations. Real faith. Real life. Every Tuesday night.",
    description:
      "Real Talk Live is an open, honest conversation about the questions Christians actually wrestle with — work, relationships, doubt, culture and calling — hosted by Jonathan Hayes with guests and listener call-ins.",
    presenterId: "jonathan-hayes",
    category: "talk",
    coverImageUrl: "",
    schedule: [{ day: "tue", startTime: "19:00", endTime: "20:00" }],
  },
  {
    id: "victory-in-prayer",
    slug: "victory-in-prayer",
    title: "Victory in Prayer",
    shortDescription: "Powerful prayer. Real breakthroughs. Every Saturday morning.",
    description:
      "The Redemption Prayer Team leads listeners in focused, Scripture-grounded prayer over the needs submitted through our prayer request line, believing together for breakthrough.",
    presenterId: "prayer-team",
    category: "prayer",
    coverImageUrl: "",
    schedule: [{ day: "sat", startTime: "08:00", endTime: "09:00" }],
  },
  {
    id: "sermons-and-messages",
    slug: "sermons-and-messages",
    title: "Sermons and Messages",
    shortDescription: "Our Sunday teaching, broadcast live from the Redemption Radio studio.",
    description:
      "Sermons and Messages carries our Sunday teaching service live, followed throughout the week by highlights from recent messages. A full library of past sermons is available on the Messages page.",
    presenterId: "eric-johnson",
    category: "teaching",
    coverImageUrl: "",
    schedule: [{ day: "sun", startTime: "10:00", endTime: "11:30" }],
  },
  {
    id: "testimonies-programme",
    slug: "testimonies",
    title: "Testimonies",
    shortDescription: "Stories of God's faithfulness from listeners like you.",
    description:
      "Every Wednesday, Sarah Collins shares testimonies submitted by Redemption Radio listeners — stories of healing, provision, deliverance and hope — as encouragement that God is still moving.",
    presenterId: "sarah-collins",
    category: "testimony",
    coverImageUrl: "",
    schedule: [{ day: "wed", startTime: "12:00", endTime: "12:30" }],
  },
  {
    id: "overnight-worship",
    slug: "overnight-worship",
    title: "Overnight Worship",
    shortDescription: "Soaking worship music through the night, every night.",
    description:
      "From midnight to dawn, Overnight Worship plays instrumental and soaking worship music — a peaceful soundtrack for prayer, rest or the night shift.",
    presenterId: "worship-team",
    category: "overnight",
    coverImageUrl: "",
    schedule: [
      { day: "mon", startTime: "00:00", endTime: "05:30" },
      { day: "tue", startTime: "00:00", endTime: "05:30" },
      { day: "wed", startTime: "00:00", endTime: "05:30" },
      { day: "thu", startTime: "00:00", endTime: "05:30" },
      { day: "fri", startTime: "00:00", endTime: "05:30" },
      { day: "sat", startTime: "00:00", endTime: "05:30" },
      { day: "sun", startTime: "00:00", endTime: "05:30" },
    ],
  },
];

export function getProgrammeBySlug(slug: string): Programme | undefined {
  return programmes.find((programme) => programme.slug === slug);
}
