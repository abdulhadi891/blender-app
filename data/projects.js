/* ============================================================
   MY WORK

   To add a new piece: open add.html, drag in the image and the
   .blend, and copy the block it writes. Paste it at the top of
   this list — newest work goes first.
   ============================================================ */

window.PROJECTS = [

  {
    title: "Rolex Dome",
    year: "2026",
    category: "Product",

    cover: "assets/renders/rolex-dome.jpg",

    description:
      "An advertising still built almost entirely out of light. The watch "  +
      "floats inside a thin brass arc, lit by a soft gradient that keeps "   +
      "the steel bright against a near-neutral grey. Everything under it - " +
      "the lacquered dome and the mirrored floor - exists to give the "      +
      "reflection somewhere to go. No image textures at all; every surface " +
      "is procedural.",

    software: ["Blender", "Cycles"],

    stats: {
      "Resolution": "2160 × 2160",
      "Samples": "700",
      "Tris": "184,739",
      "Materials": "20, all procedural"
    },

    blend: {
      url: "files/rolex-dome.blend",
      size: "8.7 MB",
      license: "Free to use · credit appreciated"
    }
  },

  {
    title: "GT3 RS Studio",
    featured: true,
    year: "2026",
    category: "Automotive",

    cover: "assets/renders/gt3-rs.jpg",

    description:
      "White-on-black studio setup for the 911 GT3 RS. Long soft strip "     +
      "lights run down each flank to draw the body line from the front "    +
      "arch to the rear wing, and a polished floor doubles the car in "     +
      "reflection. The background falls off to near-black so the silhouette "+
      "carries the shot.",

    software: ["Blender", "Cycles"],

    stats: {
      "Resolution": "768 × 432",
      "Samples": "64",
      "Tris": "368,855",
      "Objects": "128"
    },

    blend: {
      url: "files/gt3-rs.blend",
      size: "13.0 MB"
    }
  },

  {
    title: "9mm Hero Scene",
    featured: true,
    year: "2026",
    category: "Hard Surface",

    cover: "assets/renders/9mm-hero-scene.jpg",

    description:
      "A hard-surface hero shot lit with a single warm key raking across the "  +
      "slide, so the whole read of the gun comes from that one falloff. The "   +
      "detached magazine in the foreground sits inside the depth-of-field "     +
      "blur to give the frame some depth. Textures are packed into the file, "  +
      "so it opens ready to render.",

    software: ["Blender", "EEVEE"],

    stats: {
      "Resolution": "1920 × 1080",
      "Samples": "192",
      "Tris": "3,769",
      "Textures": "4K PBR set, packed"
    },

    blend: {
      url: "files/9mm-hero-scene.blend",
      size: "14.9 MB",
      license: "Free to use · credit appreciated"
    }
  },

  {
    title: "World Cup Podium",
    year: "2026",
    category: "Advertising",

    cover: "assets/renders/worldcup-podium.jpg",

    description:
      "A stadium ad scene — the match ball floating above a gold-trimmed " +
      "podium, stadium lights flaring behind it and a burst of confetti " +
      "catching the light. Shallow depth of field pulls the crowd into bokeh " +
      "so the ball stays the only sharp thing in frame.",

    software: ["Blender"],

    stats: {
      "Resolution": "2400 × 1600"
    },

    blend: {
      url: "files/worldcup-stadium-ad.blend",
      size: "4.1 MB",
      license: "Free to use · credit appreciated"
    }
  }

];
