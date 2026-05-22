const imagesData = {
  selectedWork: {
    id: 'selected-work',
    title: 'Selected Work',
    slug: 'photography-selected-work',
    heroText: 'A focused edit of the strongest images across portraiture, atmosphere, still life, and visual experimentation.',
    webDescription: 'This shortlist is built as a first portfolio edit for a professional website. The selection favors range, clarity, and visual confidence, bringing together images that feel most capable of attracting clients, creative collaborators, and job opportunities. It is less about showing everything and more about presenting a sharp point of view.',
    metaDescription: 'A curated portfolio shortlist featuring standout portrait, conceptual, still life, and atmospheric photography.',
    sourceFolder: '00_Portfolio_Shortlist'
  },
  categories: [
    {
      id: 'portrait-narratives',
      title: 'Portrait Narratives',
      slug: 'photography-portrait-narratives',
      heroText: 'Human-centered portraits built around presence, character, and quiet storytelling.',
      webDescription: 'These portraits focus on people, mood, and connection. The images feel cleaner and more grounded than the conceptual work, but still carry a clear sense of style through light, color, pose, and framing. This section is suited to editorial portraiture, personal branding, lifestyle stories, and artist-focused work.',
      metaDescription: 'Editorial and story-driven portrait photography centered on mood, identity, and presence.',
      sourceFolder: '02_Portrait_Narratives',
      isPrimary: true
    },
    {
      id: 'posters-key-art',
      title: 'Posters And Key Art',
      slug: 'photography-posters-key-art',
      heroText: 'Graphic image-making for posters, covers, campaign visuals, and visual identity work.',
      webDescription: 'This section combines photography with design, compositing, and treatment-driven image building. The result is work that feels closer to cover art, poster design, and promotional visuals than to straight photography alone. It is especially relevant for music artists, personal brands, event campaigns, and image-based storytelling that needs a stronger graphic edge.',
      metaDescription: 'Poster design, cover art, and graphic photo treatments for campaigns, music visuals, and branding.',
      sourceFolder: '06_Posters_And_Key_Art',
      isPrimary: true
    },
    {
      id: 'product-commercial',
      title: 'Product And Commercial',
      slug: 'photography-product-commercial',
      heroText: 'Product-focused imagery designed around detail, texture, shape, and visual appeal.',
      webDescription: 'This gallery is the most directly commercial section of the archive. It highlights items, materials, and product details through clean framing, contrast, and emphasis on surface quality. The work fits brands, catalog-style use, campaign assets, and social media visuals that need a polished and saleable look.',
      metaDescription: 'Commercial product photography focused on detail, texture, styling, and brand-ready presentation.',
      sourceFolder: '04_Product_And_Commercial',
      isPrimary: true
    },
    {
      id: 'editorial-still-life',
      title: 'Editorial Still Life',
      slug: 'photography-editorial-still-life',
      heroText: 'Arranged objects, quiet light, and detail-driven compositions with an editorial feel.',
      webDescription: 'This section brings together still life photographs built from books, coffee, props, and everyday textures. The images rely on composition, atmosphere, and restraint to create a slower and more intentional visual rhythm. They can support editorial storytelling, publishing projects, lifestyle brands, and more intimate web layouts.',
      metaDescription: 'Editorial still life photography featuring objects, texture, atmosphere, and carefully arranged compositions.',
      sourceFolder: '03_Editorial_Still_Life',
      isPrimary: true
    },
    {
      id: 'conceptual-portraits',
      title: 'Conceptual Portraits',
      slug: 'photography-conceptual-portraits',
      heroText: 'Portraiture shaped by motion, distortion, layering, and visual experimentation.',
      webDescription: 'This gallery explores portrait photography as mood, tension, and transformation rather than simple representation. Blur, surreal framing, graphic interventions, and altered color create images that feel expressive and cinematic. The work is aimed at viewers looking for a stronger visual signature and a more authored creative voice.',
      metaDescription: 'Experimental portrait photography with motion blur, surreal edits, and cinematic atmosphere.',
      sourceFolder: '01_Conceptual_Portraits',
      isPrimary: true
    },
    {
      id: 'night-neon',
      title: 'Night And Neon',
      slug: 'photography-night-neon',
      heroText: 'Urban night photography driven by glow, shadows, and after-dark atmosphere.',
      webDescription: 'These images are built from street light, neon spill, reflections, and the slower tension of night. The work moves between documentary mood and cinematic suggestion, using darkness as part of the composition rather than a limitation. It is a strong section for atmosphere, music-related visuals, and story-led portfolio pacing.',
      metaDescription: 'Atmospheric night photography with neon light, urban mood, reflections, and cinematic darkness.',
      sourceFolder: '05_Night_And_Neon',
      isPrimary: false
    },
    {
      id: 'architecture-place',
      title: 'Architecture And Place',
      slug: 'photography-architecture-place',
      heroText: 'Buildings, streets, and spatial fragments observed through atmosphere, geometry, and location.',
      webDescription: 'This section focuses on the character of place. Some images emphasize structure and geometry, while others rely on mood, scale, and urban texture. Together they show an eye for environments and visual context, making the work suitable for editorial, travel, cultural, and location-based storytelling.',
      metaDescription: 'Architecture and place photography featuring urban atmosphere, geometry, and environmental storytelling.',
      sourceFolder: '09_Architecture_And_Place',
      isPrimary: false
    },
    {
      id: 'machines-motion',
      title: 'Machines And Motion',
      slug: 'photography-machines-motion',
      heroText: 'Mechanical detail, automotive energy, and object-focused motion imagery.',
      webDescription: 'This gallery is centered on motorcycles, vehicles, and machine surfaces. Some images emphasize precision and texture, while others lean into speed, stance, and attitude. Together they present a sharper, more industrial side of the portfolio that can connect with automotive, sport, and product-driven clients.',
      metaDescription: 'Motorcycle and machine photography focused on detail, movement, texture, and visual attitude.',
      sourceFolder: '07_Machines_And_Motion',
      isPrimary: false
    },
    {
      id: 'experimental-objects',
      title: 'Experimental Object Studies',
      slug: 'photography-experimental-objects',
      heroText: 'Symbolic object work shaped by abstraction, play, and visual experimentation.',
      webDescription: 'These images treat everyday objects as material for concept, mood, and visual play. Rather than functioning as classic still life, they push toward symbolism, abstraction, and image-based ideas. This section is useful for showing creative range and for demonstrating a more exploratory way of thinking through photography.',
      metaDescription: 'Experimental object photography exploring abstraction, symbolism, and concept-driven image making.',
      sourceFolder: '08_Experimental_Object_Studies',
      isPrimary: false
    },
    {
      id: 'nature-animals',
      title: 'Nature And Animal Details',
      slug: 'photography-nature-animals',
      heroText: 'Organic studies of plants, animals, color, and texture.',
      webDescription: 'This gallery gathers smaller observations from the natural world, from flowers and foliage to animal portraits and surface detail. The images add softness, contrast, and breathing space to the broader portfolio while still keeping a clear visual style. They work well as supporting material in a portfolio that wants variation without losing coherence.',
      metaDescription: 'Nature detail photography featuring plants, animals, color, texture, and quiet visual studies.',
      sourceFolder: '10_Nature_And_Animal_Details',
      isPrimary: false
    }
  ],
  getCategory(id) {
    return this.categories.find(c => c.id === id);
  },
  getPrimary() {
    return this.categories.filter(c => c.isPrimary);
  },
  getSecondary() {
    return this.categories.filter(c => !c.isPrimary);
  },
  getPrev(id) {
    const i = this.categories.findIndex(c => c.id === id);
    return this.categories[(i - 1 + this.categories.length) % this.categories.length];
  },
  getNext(id) {
    const i = this.categories.findIndex(c => c.id === id);
    return this.categories[(i + 1) % this.categories.length];
  }
};
