export interface AlumniStory {
  name: string;
  photoUrl: string;
  thenLabel: string;
  nowLabel: string;
  quote: string;
}

// Sourced from real CodeDay Labs testimonials (graph.codeday.org, cms.testimonials).
// Confirm each person's current title/employer and get their OK to be featured in a
// donation appeal (a higher bar than a general testimonial) before this goes live.
export const ALUMNI_STORIES: AlumniStory[] = [
  {
    name: "Luiza Cartaxo",
    photoUrl:
      "https://f2.codeday.org/d5pti1xheuyu/4ZIbKznpY100CznvLxg0ob/83f81f937519a2243577d68872f6e771/Maria-Luiza-Cartaxo-Picture-768x1024.jpeg?h=320&fit=fill&w=320",
    thenLabel: "International student, first internship",
    nowLabel: "Software Engineer at Microsoft",
    quote:
      "As an international student in a programming major, you guys totally helped me start my career path! I had CodeDay Labs as my first experience, Meta as my second, and Microsoft as my third — and this last one gave me a full-time return offer.",
  },
  {
    name: "Daniel Lobaton",
    photoUrl:
      "https://f2.codeday.org/d5pti1xheuyu/50CgDg3alYgGekfYS3lLmd/b1be3c8a0f56fef878aa1ec5c8a21992/Daniel_Lobaton.jpg?h=320&fit=fill&w=320",
    thenLabel: "Venezuelan immigrant, new to the tech community",
    nowLabel: "Incoming Software Engineer, Microsoft HQ",
    quote:
      "Labs was the first time I got true exposure to a community of tech people I could rely on. Fast forward a couple of years, and I have a job as a SWE at Microsoft HQ right after I graduate.",
  },
];
