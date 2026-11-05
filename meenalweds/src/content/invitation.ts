import coupleHaldi from "@/assets/phoolon-ki-haldi.jpg";
import coupleAnandKaraj from "@/assets/couple-anand-karaj.webp";
import coupleCarnival from "@/assets/couple-carnival.webp";
import coupleSagan from "@/assets/couple-sagan.webp";
import groomSehra from "@/assets/groom-sehra.webp";

/**
 * All invitation wording lives here. Sections with no data (null / empty list / empty string)
 * are hidden on the page instead of showing placeholder content.
 */

const directions = (place: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export type InvitationEvent = {
  title: string;
  date: string;
  /** Each line is a time/detail row, e.g. "1:00 PM". */
  times: string[];
  venue?: string;
  host?: string;
  note?: string;
  directionsUrl?: string;
  /** Illustration shown under the event details. */
  image?: string;
};

export type FamilyCard = {
  lead: string;
  name: string;
  partner?: { name: string; parents: string };
  details?: string[];
};

export const invitation = {
  meta: {
    title: "Gurjyot & Meenal - Wedding Invitation, 9-10 January 2027, Raipur",
    description: "Gurjyot & Meenal - Wedding Invitation, 9-10 January 2027, Raipur",
  },

  couple: { groom: "Gurjyot", bride: "Meenal", initials: ["G", "M"] as const },

  /** Gurmukhi shabad from Sri Guru Granth Sahib Ji, shown under ੴ at the opening. Leave empty to hide. Use new lines for each tuk. */
  shabad: "",

  cover: {
    place: "Raipur, Chhattisgarh",
    heading: "A Celebration of Love",
    tagline: "An unforgettable journey begins here.",
    button: "Tap to Open Invitation",
    hint: "Best enjoyed with sound on",
  },

  welcome: {
    kicker: "The Wait Is Finally Over",
    dates: "9th & 10th January 2027",
    venue: "Myra Resort",
    city: "Raipur (Chhattisgarh)",
  },

  countdown: {
    /** 10 January 2027, 11:30 AM India time (Anand Karaj). */
    target: "2027-01-10T11:30:00+05:30",
    heading: "The Countdown to Forever",
    subtitle: "Every passing moment brings us closer to the celebration.",
  },

  families: {
    heading: "With Blessings of Our Families",
    cards: [
      {
        lead: "Srn. Balwant Kaur Oberoi & S. Mohinder Singh Oberoi and Srn. Paramjeet Kaur Dhody & S. Kuldeep Singh Dhody await your gracious presence for the wedding ceremonies of their grandson",
        name: "Gurjyot Singh Oberoi",
      },
      {
        lead: "Srn. Tarvinder Kaur Oberoi & S. Jagmohan Singh Oberoi invite you to join us for the wedding ceremony of their son",
        name: "Gurjyot Singh Oberoi",
        partner: {
          name: "Meenal Kaur Saluja",
          parents: "Daughter of Srn. Davinder Kaur Saluja & S. Tanveer Singh Saluja",
        },
        details: ["9th & 10th January 2027", "Myra Resort, Raipur (Chhattisgarh)"],
      },
    ] satisfies FamilyCard[],
  },

  celebrations: {
    heading: "The Celebrations",
    subtitle: "",
    days: [
      {
        label: "Day 1",
        events: [
          {
            title: "Phoolon Ki Haldi",
            date: "Saturday, 5th December 2026",
            times: ["11:30 AM onwards"],
            venue: "By The Pool, Myra Resort",
            note: "Phoolon ki barsaat & traditional haldi ceremony",
            directionsUrl: directions("Myra Resort, Raipur"),
            image: coupleHaldi,
          },
          {
            title: "Carnival",
            date: "9th January 2027",
            times: ["1:00 PM"],
            venue: "Terminalia Greens Lawn",
            host: "Hosted by Arshveer Singh Oberoi",
            directionsUrl: directions("Terminalia Greens Lawn, Raipur"),
            image: coupleCarnival,
          },
          {
            title: "Sagan & Ring Ceremony",
            date: "9th January 2027",
            times: ["8:00 PM onwards"],
            venue: "Regalia Banquet Hall, Myra Resort",
            host: "Hosted by Neeti & Angad Oberoi",
            directionsUrl: directions("Regalia Banquet Hall, Myra Resort, Raipur"),
            image: coupleSagan,
          },
        ],
      },
      {
        label: "Day 2",
        events: [
          {
            title: "Phoolon Ki Haldi",
            date: "Saturday, 5th December 2026",
            times: ["11:30 AM onwards"],
            venue: "By The Pool, Myra Resort",
            note: "Phoolon ki barsaat & traditional haldi ceremony",
            directionsUrl: directions("Myra Resort, Raipur"),
            image: coupleHaldi,
          },
          {
            title: "Sehra Bandi & Baraat",
            date: "10th January 2027",
            times: ["Sehra Bandi · 10:00 AM", "Baraat Departure · 10:30 AM"],
            image: groomSehra,
          },
          {
            title: "Anand Karaj",
            date: "10th January 2027",
            times: ["11:30 AM"],
            venue: "Gurudwara Singh Sabha, Guru Nanak Nagar, Raipur",
            note: "Followed by lunch at Regalia Banquet, Myra Resort",
            directionsUrl: directions("Gurudwara Singh Sabha, Guru Nanak Nagar, Raipur"),
            image: coupleAnandKaraj,
          },
        ],
      },
    ] satisfies { label: string; events: InvitationEvent[] }[],
  },

  /** Sections without real content yet — hidden while null. */
  noteFromUs: null,
  wardrobe: null,
  travel: null,
  rsvp: null,

  /** Points of contact shown at the end. Hidden while empty. */
  contacts: [] as { name: string; phone: string }[],

  closing: {
    regards: "Regards",
    families: [
      "Srn. Balwant Kaur Oberoi & S. Mohinder Singh Oberoi",
      "Srn. Paramjeet Kaur Dhody & S. Kuldeep Singh Dhody",
      "Srn. Tarvinder Kaur Oberoi & S. Jagmohan Singh Oberoi",
    ],
  },
};
