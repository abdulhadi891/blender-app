/* ============================================================
   MY WORK

   To add a new piece: open add.html, drag in the image and the
   .blend, and copy the block it writes. Paste it at the top of
   this list — newest work goes first.
   ============================================================ */

window.PROJECTS = [

  {
    title: "9mm Hero Scene",
    year: "2026",
    category: "Hard Surface",
    featured: true,

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
