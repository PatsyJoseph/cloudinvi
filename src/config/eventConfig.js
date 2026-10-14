// ─────────────────────────────────────────────────────────────────────────────
//  EVERYTHING YOU NEED TO EDIT LIVES IN THIS FILE.
//
//  • Anything set to `null` shows up as a visible "[… TBD]" placeholder on the
//    page, so nothing is ever invented for you.
//  • In `npm run dev` a small badge in the invitation lists what is still unset.
//  • Put performer photos in /public/performers/ and reference them like
//    "performers/name.jpg". Missing images fall back gracefully.
// ─────────────────────────────────────────────────────────────────────────────

export const eventConfig = {
  // Who this is for / from
  recipientName: "Emma", // e.g. "Maria"
  senderName: "Pat",

  // The event (date is confirmed; everything else is yours to fill in)
  eventName: "Year-End Party",
  companyName: null, // e.g. "Acme Corp"  → shown in the hero eyebrow
  dateISO: "2026-11-08",
  dateLabel: "November 8, 2026",

  // The concert poster shown beside "You're invited". Put the image in /public
  // (e.g. /public/poster.jpg) and set poster: "poster.jpg". Null = placeholder.
  poster: "public/poster.png",
  posterAlt: "Concert poster",

  // Concert poster. Put the image in /public (e.g. public/poster.jpg), then set
  // poster: "poster.jpg". `null` hides the poster section entirely.
  poster: "public/poster.png",
  posterAlt: "Concert poster for the Year-End Party",

  personalNote:
    "Issa prank HAHAHAHAH I wanted to invite you for this. I've been dreaming to be with you in a concert and I think this is the perfect time to do it. I hope you can come with me and enjoy the night together.",

  // Values used inside the details tiles and the personal note below.
  // `null` = placeholder is displayed.
  fields: {
    startTime: "TBA",
    venue: "Gaisano Capital Grounds",
    address: "Iloilo City",
    dressCode: "TBA",
    cost: "around ₱1,500 for food, transportation and extra stuff", 
    transport: "Most probably commute",
    returnHome: "Maybe the next morning, but we'll figure it out",
    meetHalfway: "I will find a way that you can stay the night",
    parentsNote: "I'll ask permission from your parents and assure them that I'll take care of you and make sure you'll be safe.",
  },

  // Interactive tiles in "The night" section. `note` opens on click/tap.
  details: [
    {
      id: "when",
      label: "When",
      note: "I'll share the exact time as soon as they're confirmed.",
    },
    {
      id: "where",
      label: "Where",
      note: "We can go together to the venue.",
    },
    {
      id: "dress",
      label: "Dress code",
      note: "Waiting for the company to announce the full details.",
    },
    {
      id: "home",
      label: "Getting there & home",
      note: "But there is a possibility that we have transportation since Emman is also coming to the concert.",
    },
  ],

  // Bands / performers, shown one per slide in the slideshow, in this order.
  // Leave empty to show three clearly-marked placeholders.
  // {
  //   id: "unique-id",
  //   name: "Artist name",
  //   role: "Headliner",
  //   blurb: "One or two sentences about them.",
  //   photos: ["performers/artist-1.jpg", "performers/artist-2.jpg", "performers/artist-3.jpg"],
  //   songs: [
  //     { title: "Song title", src: "audio/song.mp3" },
  //     { title: "Another song", src: "audio/another-song.mp3" },
  //   ], // optional; visitors press Play, then tracks fade in and play in order
  //   photo: "performers/artist.jpg",         // optional single-photo alternative
  //   link: { label: "Listen", url: "https://…" }, // optional
  // }
 performers: [
  {
    id: "band-one",
    name: "Parokya ni Edgar",
    role: "Headliner",
    blurb: "Harana - Your Song - Pangarap Lang Kita",
    photos: [
      "performers/pne-photo1.jpg",
      "performers/pne-photo2.jpg",
      "performers/pne-photo3.jpg",
    ],
    songs: [
      { title: "Pangarap Lang Kita", src: "audio/pne.mp3" },
    ],
  },
  {
    id: "band-two",
    name: "Fitterkarma",
    role: "Headliner",
    blurb: "Pag-ibig ay Kanibalismo II - Kalapastanganan",
    photos: [
      "performers/fk-photo1.jpg",
      "performers/fk-photo2.jpg",
      "performers/fk-photo3.jpg",
    ],
    songs: [
      { title: "Pag-ibig ay Kanibalismo II", src: "audio/fk.mp3" },
    ],
  },
  {
    id: "band-three",
    name: "December Avenue",
    role: "Headliner",
    blurb: "Sa Ngalan Ng Pag-Ibig - Kung 'Di Rin Lang Ikaw - Saksi ang Langit",
    photos: [
      "performers/da-photo1.jpg",
      "performers/da-photo2.jpg",
      "performers/da-photo3.jpg",
    ],
    songs: [
      { title: "Sa Ngalan Ng Pag-Ibig", src: "audio/da.mp3" },
    ],
  }
],

  // The "Before you decide" letter. Use {tokens} from `fields` above.
  practical: {
    title: "Before you decide",
    paragraphs: [
      "First, the honest part: this night costs {cost}. Whatever that turns out to be, you don't owe me a yes, and nothing here should feel like pressure. If the cost is what gives you pause, tell me — I'd much rather have that conversation than have you agree out of politeness.",
      "Your parents' support matters, to you and to me. I'd want them to feel comfortable with the plan — who you'd be with, where, and how the evening ends. {parentsNote}",
      "Getting there: {transport}. Getting home: {returnHome}. And if distance is a worry, {meetHalfway}.",
      "Take your time with this. Any answer you give is a good one.",
    ],
  },

  // The final question
  question: {
    title: "So — will you come with me?",
    subtitle: "Take all the time you need.",
    options: [
      {
        id: "yes",
        label: "Yes, I'd love to",
        reply:
          "That makes me really happy. Will register for the slots hehe.",
      },
      {
        id: "parents",
        label: "I'd like to, but I need to talk to my parents first",
        reply:
          "Take your time! If you want, I can also talk to your parents and assure them.",
      },
      {
        id: "think",
        label: "I need a little time to think",
        reply:
          "Take all the time you need. There's no pressure at all, and I mean that.",
      },
      {
        id: "no",
        label: "Thank you, but I can't make it",
        reply:
          "Thank you for being honest with me — that means more than a yes you didn't mean. No hard feelings, and I'm glad you opened this.",
      },
    ],
  },

  // How her answer reaches you. There is NO backend: these only build links
  // that open her own email / messaging app with the answer pre-filled.
  // She always also gets a "Copy my answer" button.
  reply: {
    email: "Patrick.Napud@carelon.com or napudpatrickjoseph@gmail.com", // e.g. "you@example.com"
    phone: "Reply on Messenger", // e.g. "+639171234567"
  },
};
