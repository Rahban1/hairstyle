import type {
  FaceAnalysis,
  RecommendedStyle,
  RecommendedStyleExample,
} from "../domain/faceAnalysis"

type StyleTemplate = RecommendedStyle & {
  recommendationText: string
  explanationText: string
}

export type PrimaryHairstylePlan = {
  recommendation: string
  explanation: string
  protocolSteps: string[]
  renderPrompt: string
  referenceExamples: RecommendedStyleExample[]
}

const STYLE_TEMPLATES = {
  upwardVolume: {
    id: "upward-volume",
    name: "Upward Volume",
    recommendationText: "Upward styled hair with volume away from forehead.",
    explanationText:
      "Because you have a compact upper third, exposing it corrects the imbalance and makes it appear larger.",
    summary:
      "Lift hair off the forehead to open the face and visually expand a compact upper third.",
    examples: [
      {
        name: "David Beckham",
        description: "Classic brushed-up quiff with a clean taper.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/David_Beckham_UNICEF_%28cropped2%29.jpg/330px-David_Beckham_UNICEF_%28cropped2%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/David_Beckham",
      },
      {
        name: "Zac Efron",
        description: "Short textured quiff with visible lift through the front.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zac_Efron_at_the_Baywatch_Red_Carpet_Premiere_Sydney_Australia.jpg/330px-Zac_Efron_at_the_Baywatch_Red_Carpet_Premiere_Sydney_Australia.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Zac_Efron",
      },
      {
        name: "Zayn Malik",
        description: "Modern high-texture quiff with an exposed forehead.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Zayn_Wiki_%28cropped%29.jpg/330px-Zayn_Wiki_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Zayn_Malik",
      },
    ],
  },
  texturedFringe: {
    id: "textured-fringe",
    name: "Textured Fringe",
    recommendationText: "Forward styled hair, fringe, or textured bangs.",
    explanationText:
      "You have a prominent or wide upper third, so wearing bangs visually reduces that area and creates balance.",
    summary:
      "Forward movement and a broken fringe soften forehead width and pull visual weight lower.",
    examples: [
      {
        name: "Timothee Chalamet",
        description: "Soft textured fringe with natural separation.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Timoth%C3%A9e_Chalamet-63482_%28cropped%29.jpg/330px-Timoth%C3%A9e_Chalamet-63482_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Timoth%C3%A9e_Chalamet",
      },
      {
        name: "Justin Bieber",
        description: "Forward crop with relaxed bangs and soft texture.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Justin_Bieber_in_2015.jpg/330px-Justin_Bieber_in_2015.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Justin_Bieber",
      },
      {
        name: "Jacob Elordi",
        description: "Loose fringe with controlled volume across the front.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/JacobElordi-TIFF2025-01_%28cropped_2%29.png/330px-JacobElordi-TIFF2025-01_%28cropped_2%29.png",
        sourceUrl: "https://en.wikipedia.org/wiki/Jacob_Elordi",
      },
    ],
  },
  flowSlickMiddlePart: {
    id: "flow-slick-middle-part",
    name: "Flow / Slick Back / Middle Part",
    recommendationText: "Medium length flow, slick back, or middle part.",
    explanationText:
      "Your facial thirds are already balanced, giving you maximum flexibility through the front and crown.",
    summary:
      "Balanced thirds can handle cleaner movement through the front, whether worn loose, slicked back, or parted.",
    examples: [
      {
        name: "Keanu Reeves",
        description: "Medium-length flow that keeps movement around the temples.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Keanu_Reeves_at_TIFF_2025_02_%28Cropped%29.jpg/330px-Keanu_Reeves_at_TIFF_2025_02_%28Cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Keanu_Reeves",
      },
      {
        name: "Brad Pitt",
        description: "Slicked-back volume with a cleaner silhouette.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Brad_Pitt-69858.jpg/330px-Brad_Pitt-69858.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Brad_Pitt",
      },
      {
        name: "Cillian Murphy",
        description: "Controlled parted styling with moderate top length.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg/330px-Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Cillian_Murphy",
      },
    ],
  },
  texturedAsymmetry: {
    id: "textured-asymmetry",
    name: "Messy Textured Volume",
    recommendationText: "Messy, textured, irregular volume.",
    explanationText:
      "Your face has subtle asymmetry, and a messy textured style prevents the eye from locking onto unevenness.",
    summary:
      "Irregular texture breaks up symmetry lines and stops the eye from fixating on minor deviations.",
    examples: [
      {
        name: "Robert Pattinson",
        description: "Piecey, imperfect texture with uneven lift.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Robert_Pattinson_at_Berlinale_2025.jpg/330px-Robert_Pattinson_at_Berlinale_2025.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Robert_Pattinson",
      },
      {
        name: "Austin Butler",
        description: "Loose tousled texture with a broken outline.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Austin_Butler_at_the_2025_Cannes_Film_Festival_02.jpg/330px-Austin_Butler_at_the_2025_Cannes_Film_Festival_02.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Austin_Butler",
      },
      {
        name: "Harry Styles",
        description: "Soft irregular volume with a relaxed finish.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg/330px-HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Harry_Styles",
      },
    ],
  },
  symmetricalPrecision: {
    id: "symmetrical-precision",
    name: "Clean Symmetrical Finish",
    recommendationText: "Clean, symmetrical style.",
    explanationText:
      "Because your face is highly balanced, you can pull off clean, symmetrical hairstyles without exposing deviations.",
    summary:
      "Sharper lines and cleaner direction reinforce already balanced facial structure.",
    examples: [
      {
        name: "Henry Cavill",
        description: "Clean controlled styling with minimal disruption.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Henry_Cavill_%2848417913146%29_%28cropped%29.jpg/330px-Henry_Cavill_%2848417913146%29_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Henry_Cavill",
      },
      {
        name: "Chris Evans",
        description: "Structured short cut with tidy directional control.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Chris_Evans_at_the_2025_Toronto_International_Film_Festival_%28cropped%29.jpg/330px-Chris_Evans_at_the_2025_Toronto_International_Film_Festival_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Chris_Evans_(actor)",
      },
      {
        name: "Ryan Gosling",
        description: "Precise classic styling with a polished finish.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/GoslingBFI081223_%2822_of_30%29_%2853388157347%29_%28cropped%29.jpg/330px-GoslingBFI081223_%2822_of_30%29_%2853388157347%29_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Ryan_Gosling",
      },
    ],
  },
  horizontalEmphasis: {
    id: "horizontal-emphasis",
    name: "Side-Swept Horizontal Emphasis",
    recommendationText: "Flat top styles or side-swept hair (Horizontal emphasis).",
    explanationText:
      "Your face is elongated, so we avoid extra top height and use flatter, side-led movement to counterbalance length.",
    summary:
      "Longer faces benefit from lateral movement that adds width instead of extra vertical stretch.",
    examples: [
      {
        name: "Leonardo DiCaprio",
        description: "Side-swept front with low vertical lift.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/LeoPTABFI191125-28_%28cropped%29.jpg/330px-LeoPTABFI191125-28_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Leonardo_DiCaprio",
      },
      {
        name: "Andrew Garfield",
        description: "Soft side sweep with horizontal movement through the front.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Andrew_Garfield_82nd_Venice_Film_Festival_%28cropped%29.jpg/330px-Andrew_Garfield_82nd_Venice_Film_Festival_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Andrew_Garfield",
      },
      {
        name: "Pedro Pascal",
        description: "Side-led texture that widens the silhouette.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Pedro_Pascal_at_the_2025_Cannes_Film_Festival_04.jpg/330px-Pedro_Pascal_at_the_2025_Cannes_Film_Festival_04.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Pedro_Pascal",
      },
    ],
  },
  highVolumeTop: {
    id: "high-volume-top",
    name: "High Volume Top",
    recommendationText: "High volume styles on top.",
    explanationText:
      "Your face is compressed, so height through the front and crown helps elongate your overall proportions.",
    summary:
      "Shorter vertical proportions benefit from lift through the front and crown to add visual height.",
    examples: [
      {
        name: "Shawn Mendes",
        description: "Full quiff with dense lift at the front.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/191125_Shawn_Mendes_at_the_2019_American_Music_Awards.png/330px-191125_Shawn_Mendes_at_the_2019_American_Music_Awards.png",
        sourceUrl: "https://en.wikipedia.org/wiki/Shawn_Mendes",
      },
      {
        name: "Chris Hemsworth",
        description: "Voluminous top with controlled sides.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Chris_Hemsworth_-_Crime_101.jpg/330px-Chris_Hemsworth_-_Crime_101.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Chris_Hemsworth",
      },
      {
        name: "Glen Powell",
        description: "Structured high-volume top with a polished finish.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Glen_Powell_by_Gage_Skidmore.jpg/330px-Glen_Powell_by_Gage_Skidmore.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Glen_Powell",
      },
    ],
  },
  balancedVersatile: {
    id: "balanced-versatile",
    name: "Balanced-Proportion Styling",
    recommendationText: "Any vertical height works.",
    explanationText:
      "Your vertical length is already balanced, so moderate height or flatter styling can both work without distorting proportion.",
    summary:
      "Balanced length gives you freedom to move between moderate height, flow, and cleaner silhouettes.",
    examples: [
      {
        name: "Paul Mescal",
        description: "Natural moderate volume that stays proportionate.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Paul_Mescal_at_the_Toronto_International_Film_Festival_in_2025_2_%28cropped_2%29.jpg/330px-Paul_Mescal_at_the_Toronto_International_Film_Festival_in_2025_2_%28cropped_2%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Paul_Mescal",
      },
      {
        name: "Dev Patel",
        description: "Balanced medium texture with soft height.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Dev_Patel_%2829870651654%29.jpg/330px-Dev_Patel_%2829870651654%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Dev_Patel",
      },
      {
        name: "Pedro Pascal",
        description: "Controlled medium shape that keeps the silhouette even.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Pedro_Pascal_at_the_2025_Cannes_Film_Festival_04.jpg/330px-Pedro_Pascal_at_the_2025_Cannes_Film_Festival_04.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Pedro_Pascal",
      },
    ],
  },
  shortCuts: {
    id: "short-cuts",
    name: "Buzz Cut / Tight Fade",
    recommendationText: "Shorter styles, buzz cut, or tight fade.",
    explanationText:
      "Your jaw is angular and well-projected, so shorter hair removes distractions and keeps focus on facial structure.",
    summary:
      "A stronger jaw can support shorter lengths that clear visual clutter and emphasize bone structure.",
    examples: [
      {
        name: "Michael B. Jordan",
        description: "Tight fade that keeps focus on facial structure.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Michael_B_Jordan_-_Sinners_%28cropped%29.jpg/330px-Michael_B_Jordan_-_Sinners_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Michael_B._Jordan",
      },
      {
        name: "Tom Hardy",
        description: "Close crop that emphasizes jaw definition.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Tom_Hardy_by_Gage_Skidmore_in_2018.jpg/330px-Tom_Hardy_by_Gage_Skidmore_in_2018.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Tom_Hardy",
      },
      {
        name: "Zayn Malik",
        description: "Short buzzed length with a sharper edge-up.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Zayn_Wiki_%28cropped%29.jpg/330px-Zayn_Wiki_%28cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Zayn_Malik",
      },
    ],
  },
  texturedSideLength: {
    id: "textured-side-length",
    name: "Textured Side Length",
    recommendationText: "Avoid buzz cuts; opt for more textured length around the sides.",
    explanationText:
      "Your jaw is softer, so keeping some width and texture around the sides creates better visual balance than ultra-short cuts.",
    summary:
      "Softer jaws usually benefit from side texture and moderate width instead of very tight crops.",
    examples: [
      {
        name: "Harry Styles",
        description: "Soft side length with textured movement.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg/330px-HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Harry_Styles",
      },
      {
        name: "Dev Patel",
        description: "Medium textured sides that add balance around the jaw.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Dev_Patel_%2829870651654%29.jpg/330px-Dev_Patel_%2829870651654%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Dev_Patel",
      },
      {
        name: "Keanu Reeves",
        description: "Longer side presence that keeps the lower face from dominating.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Keanu_Reeves_at_TIFF_2025_02_%28Cropped%29.jpg/330px-Keanu_Reeves_at_TIFF_2025_02_%28Cropped%29.jpg",
        sourceUrl: "https://en.wikipedia.org/wiki/Keanu_Reeves",
      },
    ],
  },
} as const satisfies Record<string, StyleTemplate>

type PrimaryStyleKey =
  | "softSideSweptQuiff"
  | "cleanQuiff"
  | "texturedQuiff"
  | "softFrenchCrop"
  | "texturedFringe"
  | "sideSweptFlow"
  | "cleanMiddlePart"
  | "texturedMiddlePart"

type PrimaryStyleTemplate = {
  recommendation: string
  referenceExamples: RecommendedStyleExample[]
}

const PRIMARY_STYLE_LIBRARY: Record<PrimaryStyleKey, PrimaryStyleTemplate> = {
  softSideSweptQuiff: {
    recommendation: "Soft side-swept quiff",
    referenceExamples: [
      STYLE_TEMPLATES.horizontalEmphasis.examples[1],
      STYLE_TEMPLATES.horizontalEmphasis.examples[0],
      STYLE_TEMPLATES.upwardVolume.examples[0],
    ],
  },
  cleanQuiff: {
    recommendation: "Clean quiff",
    referenceExamples: [
      STYLE_TEMPLATES.upwardVolume.examples[0],
      STYLE_TEMPLATES.symmetricalPrecision.examples[0],
      STYLE_TEMPLATES.highVolumeTop.examples[2],
    ],
  },
  texturedQuiff: {
    recommendation: "Textured quiff",
    referenceExamples: [
      STYLE_TEMPLATES.upwardVolume.examples[1],
      STYLE_TEMPLATES.upwardVolume.examples[2],
      STYLE_TEMPLATES.highVolumeTop.examples[0],
    ],
  },
  softFrenchCrop: {
    recommendation: "Soft French crop",
    referenceExamples: [
      STYLE_TEMPLATES.texturedFringe.examples[1],
      STYLE_TEMPLATES.texturedFringe.examples[2],
      STYLE_TEMPLATES.texturedFringe.examples[0],
    ],
  },
  texturedFringe: {
    recommendation: "Textured fringe",
    referenceExamples: [
      STYLE_TEMPLATES.texturedFringe.examples[0],
      STYLE_TEMPLATES.texturedFringe.examples[2],
      STYLE_TEMPLATES.texturedAsymmetry.examples[2],
    ],
  },
  sideSweptFlow: {
    recommendation: "Side-swept flow",
    referenceExamples: [
      STYLE_TEMPLATES.horizontalEmphasis.examples[2],
      STYLE_TEMPLATES.flowSlickMiddlePart.examples[0],
      STYLE_TEMPLATES.horizontalEmphasis.examples[0],
    ],
  },
  cleanMiddlePart: {
    recommendation: "Clean middle part",
    referenceExamples: [
      STYLE_TEMPLATES.flowSlickMiddlePart.examples[2],
      STYLE_TEMPLATES.flowSlickMiddlePart.examples[0],
      STYLE_TEMPLATES.flowSlickMiddlePart.examples[1],
    ],
  },
  texturedMiddlePart: {
    recommendation: "Textured middle part",
    referenceExamples: [
      STYLE_TEMPLATES.texturedAsymmetry.examples[2],
      STYLE_TEMPLATES.balancedVersatile.examples[0],
      STYLE_TEMPLATES.flowSlickMiddlePart.examples[0],
    ],
  },
}

function getUpperThirdStyle(upperThird: FaceAnalysis["upperThird"]): StyleTemplate {
  switch (upperThird) {
    case "small_narrow":
      return STYLE_TEMPLATES.upwardVolume
    case "large_wide":
      return STYLE_TEMPLATES.texturedFringe
    case "balanced":
      return STYLE_TEMPLATES.flowSlickMiddlePart
  }
}

function getSymmetryStyle(symmetry: FaceAnalysis["symmetry"]): StyleTemplate {
  switch (symmetry) {
    case "asymmetrical":
      return STYLE_TEMPLATES.texturedAsymmetry
    case "symmetrical":
      return STYLE_TEMPLATES.symmetricalPrecision
  }
}

function getVerticalLengthStyle(verticalLength: FaceAnalysis["verticalLength"]): StyleTemplate {
  switch (verticalLength) {
    case "long":
      return STYLE_TEMPLATES.horizontalEmphasis
    case "short":
      return STYLE_TEMPLATES.highVolumeTop
    case "balanced":
      return STYLE_TEMPLATES.balancedVersatile
  }
}

function getJawProjectionStyle(jawProjection: FaceAnalysis["jawProjection"]): StyleTemplate {
  switch (jawProjection) {
    case "angular_projected":
      return STYLE_TEMPLATES.shortCuts
    case "soft":
      return STYLE_TEMPLATES.texturedSideLength
  }
}

export function buildRecommendedStyles(analysis: FaceAnalysis): StyleTemplate[] {
  return [
    getUpperThirdStyle(analysis.upperThird),
    getSymmetryStyle(analysis.symmetry),
    getVerticalLengthStyle(analysis.verticalLength),
    getJawProjectionStyle(analysis.jawProjection),
  ]
}

function getPrimaryStyleKey(analysis: FaceAnalysis): PrimaryStyleKey {
  switch (analysis.upperThird) {
    case "small_narrow":
      if (analysis.verticalLength === "long") {
        return "softSideSweptQuiff"
      }

      return analysis.symmetry === "symmetrical" ? "cleanQuiff" : "texturedQuiff"
    case "large_wide":
      return analysis.symmetry === "symmetrical" ? "softFrenchCrop" : "texturedFringe"
    case "balanced":
      if (analysis.verticalLength === "long") {
        return "sideSweptFlow"
      }

      if (analysis.verticalLength === "short") {
        return analysis.symmetry === "symmetrical" ? "cleanQuiff" : "texturedQuiff"
      }

      return analysis.symmetry === "symmetrical"
        ? "cleanMiddlePart"
        : "texturedMiddlePart"
  }
}

function getPrimaryStyleName(analysis: FaceAnalysis): string {
  return PRIMARY_STYLE_LIBRARY[getPrimaryStyleKey(analysis)].recommendation
}

function getForeheadReason(analysis: FaceAnalysis): string {
  switch (analysis.upperThird) {
    case "small_narrow":
      return "Lifting the front slightly opens up the top of your face."
    case "large_wide":
      return "A softer fringe makes the forehead look less wide."
    case "balanced":
      return "Your forehead area is already balanced, so the style can stay clean and natural."
  }
}

function getHeightReason(analysis: FaceAnalysis): string {
  switch (analysis.verticalLength) {
    case "long":
      return "Keeping the height controlled stops the face from looking longer."
    case "short":
      return "A little lift on top helps the face look longer."
    case "balanced":
      return "Moderate height keeps your proportions looking even."
  }
}

function getJawReason(analysis: FaceAnalysis): string {
  switch (analysis.jawProjection) {
    case "angular_projected":
      return "Cleaner sides work well with your stronger jawline."
    case "soft":
      return "A bit of fullness around the sides gives the lower face better balance."
  }
}

function getSymmetryStep(analysis: FaceAnalysis): string {
  return analysis.symmetry === "symmetrical"
    ? "Keep the shape neat and balanced, with a clean finish."
    : "Keep the texture soft and natural instead of making the part too sharp."
}

function getHeightStep(analysis: FaceAnalysis): string {
  switch (analysis.verticalLength) {
    case "long":
      return "Keep the top fairly low and push the shape a little to the side instead of straight up."
    case "short":
      return "Leave enough length on top to style a little lift through the front."
    case "balanced":
      return "Keep the height moderate so the haircut stays easy and balanced."
  }
}

function getSideStep(analysis: FaceAnalysis): string {
  return analysis.jawProjection === "angular_projected"
    ? "Ask for a cleaner taper on the sides and around the ears."
    : "Do not cut the sides too tight; leave some soft width through the temples and sides."
}

function getFrontStep(analysis: FaceAnalysis): string {
  switch (analysis.upperThird) {
    case "small_narrow":
      return "Style the front up and away from the forehead."
    case "large_wide":
      return "Bring some texture forward over the forehead."
    case "balanced":
      return "Keep the front clean with a natural part and relaxed texture."
  }
}

export function buildPrimaryHairstylePlan(analysis: FaceAnalysis): PrimaryHairstylePlan {
  const primaryStyle = PRIMARY_STYLE_LIBRARY[getPrimaryStyleKey(analysis)]
  const recommendation = primaryStyle.recommendation
  const explanation = [
    `Best match: ${recommendation}.`,
    getForeheadReason(analysis),
    getHeightReason(analysis),
    getJawReason(analysis),
  ].join(" ")

  const protocolSteps = [
    `Ask for a ${recommendation.toLowerCase()} with medium texture.`,
    getFrontStep(analysis),
    getHeightStep(analysis),
    getSymmetryStep(analysis),
    getSideStep(analysis),
  ]

  const renderPrompt = [
    recommendation.toLowerCase(),
    "single hairstyle only",
    getFrontStep(analysis).toLowerCase(),
    getHeightStep(analysis).toLowerCase(),
    getSymmetryStep(analysis).toLowerCase(),
    getSideStep(analysis).toLowerCase(),
    "barbershop-finished, natural texture, realistic hairline",
  ].join(", ")

  return {
    recommendation,
    explanation,
    protocolSteps,
    renderPrompt,
    referenceExamples: primaryStyle.referenceExamples,
  }
}
