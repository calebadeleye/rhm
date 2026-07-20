import type { Presenter } from "@/types/content";

export const presenters: Presenter[] = [
  {
    id: "eric-johnson",
    name: "Pastor Eric Johnson",
    bio: "Senior pastor and founder of Redemption Hour Ministries. Eric has taught the Word for over twenty years, with a focus on grace, discipleship and everyday application of Scripture.",
    photoUrl: null,
  },
  {
    id: "jonathan-hayes",
    name: "Jonathan Hayes",
    bio: "Host of Real Talk Live and worship leader. Jonathan brings honest conversation about faith, culture and life to Redemption Radio's Tuesday night slot.",
    photoUrl: null,
  },
  {
    id: "sarah-collins",
    name: "Sarah Collins",
    bio: "Sarah shepherds our midweek testimony programme, gathering stories of God's faithfulness from listeners across the world.",
    photoUrl: null,
  },
  {
    id: "prayer-team",
    name: "Redemption Prayer Team",
    bio: "A rotating team of intercessors who lead Victory in Prayer and stand with listeners in prayer every Saturday morning.",
    photoUrl: null,
  },
  {
    id: "worship-team",
    name: "Redemption Worship Team",
    bio: "Curators of Redemption Radio's continuous worship rotation, playing music that points listeners to Jesus around the clock.",
    photoUrl: null,
  },
];

export function getPresenterById(id: string): Presenter | undefined {
  return presenters.find((presenter) => presenter.id === id);
}
