export interface Testimony {
  id: string;
  name: string | "Anonymous";
  text: string;
  audioUrl: string | null;
  date: string; // ISO date
}

/**
 * Only moderator-approved testimonies belong in this file. The public
 * submission form (see PrayerRequest/Testimonies pages) never writes here
 * directly — submissions go to the backend for review before anyone adds
 * them to this list.
 */
export const approvedTestimonies: Testimony[] = [
  {
    id: "t1",
    name: "Grace O.",
    text: "I started listening to Redemption Word on my drive to work during the hardest year of my life. I don't think I've missed a morning since. This station has walked with me through more than I can explain.",
    audioUrl: null,
    date: "2026-06-02",
  },
  {
    id: "t2",
    name: "Anonymous",
    text: "The prayer team prayed with me over the phone when I called in during Victory in Prayer. I felt peace for the first time in weeks. Thank you for taking the time to actually listen.",
    audioUrl: null,
    date: "2026-05-20",
  },
  {
    id: "t3",
    name: "Marcus D.",
    text: "Real Talk Live gave me language for doubts I'd been carrying quietly for years. Hearing Jonathan talk about it so honestly made me feel less alone in my faith.",
    audioUrl: null,
    date: "2026-04-30",
  },
];
