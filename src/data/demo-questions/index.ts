export interface DemoQuestionRaw {
    description: string;
    options: string[] | null;
    answer: string;
    skill: "Reading" | "Writing" | "Speaking" | "Listening";
}

export const DEMO_QUESTIONS: DemoQuestionRaw[] = [
    // ─────────────────────────────────────────────────────────────────────────────
    // READING (25 Soal dengan passage/bacaan panjang sesuai ai-prompts & ai-examples)
    // ─────────────────────────────────────────────────────────────────────────────
    {
        description: "<p>The Alaska pipeline starts at the frozen edge of the Arctic Ocean. It stretches southward across the largest and northernmost state in the United States, ending at a remote ice-free seaport village nearly 800 miles from where it begins. It is massive in size and extremely complicated to operate.</p><br/><p>The steel pipe crosses windswept plains and endless miles of delicate tundra. It weaves through crooked canyons, climbs steep mountains, passes forests, and crosses hundreds of rivers and streams. The pipeline can transport millions of gallons of oil each day.</p><br/><p>What is the main topic of the passage?</p>",
        options: ["<p>Operating costs of oil companies</p>", "<p>The construction and geographical span of the Alaska pipeline</p>", "<p>Environmental protection in Alaska</p>", "<p>Transportation speeds of modern seaports</p>"],
        answer: "<p>The construction and geographical span of the Alaska pipeline</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Alaska pipeline starts at the frozen edge of the Arctic Ocean. It stretches southward across the largest and northernmost state in the United States, ending at a remote ice-free seaport village nearly 800 miles from where it begins. It is massive in size and extremely complicated to operate.</p><br/><p>According to the passage, where does the Alaska pipeline end?</p>",
        options: ["<p>At the Arctic Ocean</p>", "<p>In a mountain canyon</p>", "<p>At a remote ice-free seaport village</p>", "<p>In the middle of the delicate tundra</p>"],
        answer: "<p>At a remote ice-free seaport village</p>",
        skill: "Reading"
    },
    {
        description: "<p>Mount Fuji is Japan's highest peak, standing at an elevation of 3,776 meters. It is an active stratovolcano that last erupted in 1707. Mount Fuji is celebrated in Japanese art and literature and was recognized as a UNESCO World Cultural Heritage site in 2013 due to its cultural significance and iconic snow-capped cone shape.</p><br/><p>Which statement about Mount Fuji is true according to the text?</p>",
        options: ["<p>It is the second highest mountain in Japan</p>", "<p>It last erupted in 1707</p>", "<p>It is an extinct volcano</p>", "<p>It became a UNESCO site in 1907</p>"],
        answer: "<p>It last erupted in 1707</p>",
        skill: "Reading"
    },
    {
        description: "<p>Honeybees play a vital role in terrestrial ecosystems by pollinating a vast array of flowering plants, including many crops that supply human food. During foraging, bees transfer pollen grains from the male anther of a flower to the female stigma, enabling fertilization and seed production. However, honeybee populations have faced declining numbers worldwide due to habitat loss, pesticide exposure, and climate disruption.</p><br/><p>What is the primary function of honeybees mentioned in the passage?</p>",
        options: ["<p>Producing chemical pesticides</p>", "<p>Pollinating flowering plants and crops</p>", "<p>Creating new plant species</p>", "<p>Preventing soil erosion in forests</p>"],
        answer: "<p>Pollinating flowering plants and crops</p>",
        skill: "Reading"
    },
    {
        description: "<p>Honeybees play a vital role in terrestrial ecosystems by pollinating a vast array of flowering plants, including many crops that supply human food. During foraging, bees transfer pollen grains from the male anther of a flower to the female stigma, enabling fertilization and seed production. However, honeybee populations have faced declining numbers worldwide due to habitat loss, pesticide exposure, and climate disruption.</p><br/><p>Which of the following is NOT listed as a threat to honeybee populations?</p>",
        options: ["<p>Habitat loss</p>", "<p>Pesticide exposure</p>", "<p>Climate disruption</p>", "<p>Overpopulation of flowers</p>"],
        answer: "<p>Overpopulation of flowers</p>",
        skill: "Reading"
    },
    {
        description: "<p>Artificial Intelligence (AI) has advanced rapidly over the past decade, transforming industries from healthcare to finance. Machine learning algorithms analyze vast datasets to identify patterns and make predictions with remarkable accuracy. Despite these advancements, ethical concerns regarding data privacy, algorithmic bias, and workforce automation remain prominent topics of global debate.</p><br/><p>What is the primary purpose of machine learning algorithms according to the text?</p>",
        options: ["<p>To replace human ethical judgement</p>", "<p>To analyze datasets and identify patterns for predictions</p>", "<p>To eliminate data privacy concerns completely</p>", "<p>To slow down technological growth in finance</p>"],
        answer: "<p>To analyze datasets and identify patterns for predictions</p>",
        skill: "Reading"
    },
    {
        description: "<p>Artificial Intelligence (AI) has advanced rapidly over the past decade, transforming industries from healthcare to finance. Machine learning algorithms analyze vast datasets to identify patterns and make predictions with remarkable accuracy. Despite these advancements, ethical concerns regarding data privacy, algorithmic bias, and workforce automation remain prominent topics of global debate.</p><br/><p>What issue remains a major topic of debate?</p>",
        options: ["<p>High hardware prices</p>", "<p>Ethical concerns such as data privacy and bias</p>", "<p>Lack of interest from healthcare fields</p>", "<p>The decrease in internet bandwidth</p>"],
        answer: "<p>Ethical concerns such as data privacy and bias</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in human history. The shift from manual hand production to machine manufacturing led to rapid urbanization, as rural agricultural workers migrated to cities in search of factory jobs. This technological transition paved the way for modern industrial capitalism.</p><br/><p>Where did the Industrial Revolution originate?</p>",
        options: ["<p>United States</p>", "<p>Britain</p>", "<p>France</p>", "<p>Germany</p>"],
        answer: "<p>Britain</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in human history. The shift from manual hand production to machine manufacturing led to rapid urbanization, as rural agricultural workers migrated to cities in search of factory jobs. This technological transition paved the way for modern industrial capitalism.</p><br/><p>What major social movement occurred as a result of factory jobs?</p>",
        options: ["<p>Migration from cities back to farms</p>", "<p>Rapid urbanization and rural-to-city migration</p>", "<p>A decline in factory production</p>", "<p>The immediate abolition of international trade</p>"],
        answer: "<p>Rapid urbanization and rural-to-city migration</p>",
        skill: "Reading"
    },
    {
        description: "<p>Ocean currents function as a global conveyer belt that regulates the Earth's climate system. Warm water travels from the equator toward the poles, releasing heat energy into the atmosphere, while cold, dense polar ocean water sinks and flows back toward the equator. Disruptions to this ocean current circulation could dramatically alter regional weather patterns.</p><br/><p>How do ocean currents regulate Earth's climate?</p>",
        options: ["<p>By absorbing all sunlight before it reaches land</p>", "<p>By transferring warm equatorial water to polar regions</p>", "<p>By freezing deep underwater sea trenches</p>", "<p>By slowing down atmospheric wind speeds</p>"],
        answer: "<p>By transferring warm equatorial water to polar regions</p>",
        skill: "Reading"
    },
    {
        description: "<p>Renewable energy sources such as solar and wind power generate clean electricity without emitting greenhouse gases. Unlike fossil fuels, solar energy relies on photovoltaic cells to capture sunlight and convert it directly into electrical current. Although initial installation costs can be high, long-term operational costs are significantly lower.</p><br/><p>How do photovoltaic cells function?</p>",
        options: ["<p>They burn fossil fuels efficiently</p>", "<p>They capture sunlight and convert it into electrical current</p>", "<p>They generate wind power inside turbines</p>", "<p>They store steam in high-pressure tanks</p>"],
        answer: "<p>They capture sunlight and convert it into electrical current</p>",
        skill: "Reading"
    },
    {
        description: "<p>Renewable energy sources such as solar and wind power generate clean electricity without emitting greenhouse gases. Unlike fossil fuels, solar energy relies on photovoltaic cells to capture sunlight and convert it directly into electrical current. Although initial installation costs can be high, long-term operational costs are significantly lower.</p><br/><p>What advantage does solar energy have over fossil fuels?</p>",
        options: ["<p>It emits zero greenhouse gases during operation</p>", "<p>It requires zero installation cost</p>", "<p>It works without any sunlight</p>", "<p>It consumes underground water supplies</p>"],
        answer: "<p>It emits zero greenhouse gases during operation</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Great Barrier Reef off the coast of Queensland, Australia, is the world's largest coral reef system. Composed of over 2,900 individual reefs, it supports thousands of species of marine life. However, warming sea temperatures caused by global climate change have led to severe coral bleaching events, threatening the reef's biodiversity.</p><br/><p>What is the primary cause of coral bleaching mentioned in the text?</p>",
        options: ["<p>Overfishing by local vessels</p>", "<p>Warming sea temperatures from climate change</p>", "<p>Volcanic underwater explosions</p>", "<p>Chemical spills from tourist boats</p>"],
        answer: "<p>Warming sea temperatures from climate change</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Great Barrier Reef off the coast of Queensland, Australia, is the world's largest coral reef system. Composed of over 2,900 individual reefs, it supports thousands of species of marine life. However, warming sea temperatures caused by global climate change have led to severe coral bleaching events, threatening the reef's biodiversity.</p><br/><p>Where is the Great Barrier Reef located?</p>",
        options: ["<p>Off the coast of Queensland, Australia</p>", "<p>In the Caribbean Sea</p>", "<p>Along the coast of Japan</p>", "<p>In the Mediterranean Sea</p>"],
        answer: "<p>Off the coast of Queensland, Australia</p>",
        skill: "Reading"
    },
    {
        description: "<p>Photosynthesis is the fundamental biological process by which plants, algae, and some bacteria convert light energy into chemical energy. Using carbon dioxide from the air and water from the soil, plants produce glucose for growth and release oxygen as a byproduct into the atmosphere.</p><br/><p>What gas is released as a byproduct during photosynthesis?</p>",
        options: ["<p>Carbon dioxide</p>", "<p>Methane</p>", "<p>Oxygen</p>", "<p>Nitrogen</p>"],
        answer: "<p>Oxygen</p>",
        skill: "Reading"
    },
    {
        description: "<p>Photosynthesis is the fundamental biological process by which plants, algae, and some bacteria convert light energy into chemical energy. Using carbon dioxide from the air and water from the soil, plants produce glucose for growth and release oxygen as a byproduct into the atmosphere.</p><br/><p>What primary energy source drives photosynthesis?</p>",
        options: ["<p>Geothermal heat</p>", "<p>Light energy</p>", "<p>Wind energy</p>", "<p>Electrical energy</p>"],
        answer: "<p>Light energy</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Silk Road was an ancient network of trade routes that connected East Asia with the Mediterranean world. Merchants traveled across desert terrain and mountain passes to trade silk, spices, ceramics, and precious metals. Beyond physical goods, the Silk Road facilitated cultural exchanges, spreading philosophy, art, and religions across continents.</p><br/><p>Besides physical trade items, what else was exchanged along the Silk Road?</p>",
        options: ["<p>Only modern weaponry</p>", "<p>Cultural ideas, art, philosophy, and religions</p>", "<p>Steam engines and industrial machinery</p>", "<p>Electronic communication cables</p>"],
        answer: "<p>Cultural ideas, art, philosophy, and religions</p>",
        skill: "Reading"
    },
    {
        description: "<p>The Silk Road was an ancient network of trade routes that connected East Asia with the Mediterranean world. Merchants traveled across desert terrain and mountain passes to trade silk, spices, ceramics, and precious metals. Beyond physical goods, the Silk Road facilitated cultural exchanges, spreading philosophy, art, and religions across continents.</p><br/><p>Which regions were connected by the Silk Road network?</p>",
        options: ["<p>East Asia and the Mediterranean world</p>", "<p>North America and South America</p>", "<p>Australia and Antarctica</p>", "<p>West Africa and Northern Europe</p>"],
        answer: "<p>East Asia and the Mediterranean world</p>",
        skill: "Reading"
    },
    {
        description: "<p>Microplastics are tiny plastic particles less than five millimeters in diameter that pollute aquatic ecosystems worldwide. They originate from degraded larger plastic waste, synthetic clothing fibers, and microbeads in cosmetic products. Marine animals frequently ingest microplastics, leading to bioaccumulation throughout the aquatic food chain.</p><br/><p>What defines a microplastic particle?</p>",
        options: ["<p>Plastic pieces larger than ten centimeters</p>", "<p>Plastic particles measuring less than five millimeters in diameter</p>", "<p>Natural organic sand grains</p>", "<p>Liquid chemical pollutants</p>"],
        answer: "<p>Plastic particles measuring less than five millimeters in diameter</p>",
        skill: "Reading"
    },
    {
        description: "<p>Microplastics are tiny plastic particles less than five millimeters in diameter that pollute aquatic ecosystems worldwide. They originate from degraded larger plastic waste, synthetic clothing fibers, and microbeads in cosmetic products. Marine animals frequently ingest microplastics, leading to bioaccumulation throughout the aquatic food chain.</p><br/><p>How do microplastics enter marine animal bodies?</p>",
        options: ["<p>Through evaporation</p>", "<p>Through ingestion by marine wildlife</p>", "<p>By dissolving harmlessly in ocean salt</p>", "<p>Through solar radiation</p>"],
        answer: "<p>Through ingestion by marine wildlife</p>",
        skill: "Reading"
    },
    {
        description: "<p>The James Webb Space Telescope (JWST) is humanity's premier space observatory, designed to investigate the earliest galaxies formed after the Big Bang. Operating primarily in infrared wavelengths, JWST can penetrate dense clouds of interstellar cosmic dust to capture unprecedented imagery of distant planetary systems.</p><br/><p>Which light wavelength spectrum does JWST primarily observe?</p>",
        options: ["<p>Ultraviolet</p>", "<p>Infrared</p>", "<p>X-Ray</p>", "<p>Radio waves</p>"],
        answer: "<p>Infrared</p>",
        skill: "Reading"
    },
    {
        description: "<p>The James Webb Space Telescope (JWST) is humanity's premier space observatory, designed to investigate the earliest galaxies formed after the Big Bang. Operating primarily in infrared wavelengths, JWST can penetrate dense clouds of interstellar cosmic dust to capture unprecedented imagery of distant planetary systems.</p><br/><p>What enables JWST to capture clear imagery of distant stars?</p>",
        options: ["<p>Its ability to penetrate interstellar dust using infrared vision</p>", "<p>Its close proximity to planet Mars</p>", "<p>Its high-powered optical searchlights</p>", "<p>Its reliance on lunar surface bases</p>"],
        answer: "<p>Its ability to penetrate interstellar dust using infrared vision</p>",
        skill: "Reading"
    },
    {
        description: "<p>Bilingualism offers significant cognitive advantages throughout a person's lifespan. Studies indicate that individuals who speak two or more languages demonstrate enhanced executive control, better multitasking capabilities, and improved problem-solving skills compared to monolinguals. Furthermore, bilingualism can delay the onset of cognitive decline in older adults.</p><br/><p>Which cognitive benefit of bilingualism is mentioned in the passage?</p>",
        options: ["<p>Instant photographic memory</p>", "<p>Enhanced executive control and multitasking capabilities</p>", "<p>Complete immunity to all brain diseases</p>", "<p>Increased physical vision accuracy</p>"],
        answer: "<p>Enhanced executive control and multitasking capabilities</p>",
        skill: "Reading"
    },
    {
        description: "<p>Bilingualism offers significant cognitive advantages throughout a person's lifespan. Studies indicate that individuals who speak two or more languages demonstrate enhanced executive control, better multitasking capabilities, and improved problem-solving skills compared to monolinguals. Furthermore, bilingualism can delay the onset of cognitive decline in older adults.</p><br/><p>How does bilingualism impact aging adults according to researchers?</p>",
        options: ["<p>It accelerates memory loss</p>", "<p>It delays the onset of cognitive decline</p>", "<p>It eliminates the need for physical exercise</p>", "<p>It causes sleep pattern disruptions</p>"],
        answer: "<p>It delays the onset of cognitive decline</p>",
        skill: "Reading"
    },
    {
        description: "<p>Urban green spaces, such as public parks and rooftop gardens, provide crucial ecological and social benefits to metropolitan cities. They help mitigate the urban heat island effect, absorb storm water runoff, and reduce atmospheric carbon levels. Additionally, accessible parks promote physical exercise and psychological well-being among urban residents.</p><br/><p>What urban climate problem do green spaces help mitigate?</p>",
        options: ["<p>Noise pollution from airplanes</p>", "<p>The urban heat island effect</p>", "<p>High traffic congestion</p>", "<p>Underground subway flooding</p>"],
        answer: "<p>The urban heat island effect</p>",
        skill: "Reading"
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // WRITING (25 Soal dengan format translation/sentence completion & [blank])
    // ─────────────────────────────────────────────────────────────────────────────
    {
        description: "<p><b>Translate to English:</b> Saya sangat senang bertemu dengan Anda hari ini.</p><p>[blank]</p>",
        options: null,
        answer: "I am very happy to meet you today.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> She has been working at this company [blank] five years.</p>",
        options: null,
        answer: "for",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Apakah Anda bisa membantu saya membawa tas ini?</p><p>[blank]</p>",
        options: null,
        answer: "Can you help me carry this bag?",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> If I had known about the meeting, I [blank] attended it.</p>",
        options: null,
        answer: "would have",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Cuaca hari ini sangat cerah dan hangat.</p><p>[blank]</p>",
        options: null,
        answer: "The weather today is very sunny and warm.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> He prefers reading books [blank] watching movies in his free time.</p>",
        options: null,
        answer: "to",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Jangan lupa untuk mematikan lampu sebelum keluar.</p><p>[blank]</p>",
        options: null,
        answer: "Don't forget to turn off the lights before leaving.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> Neither the manager [blank] the employees were aware of the change.</p>",
        options: null,
        answer: "nor",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Kereta api akan tiba dalam waktu sepuluh menit.</p><p>[blank]</p>",
        options: null,
        answer: "The train will arrive in ten minutes.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> Although it was raining heavily, they [blank] playing soccer outside.</p>",
        options: null,
        answer: "kept",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Kami sedang merencanakan liburan keluarga ke Bali bulan depan.</p><p>[blank]</p>",
        options: null,
        answer: "We are planning a family vacation to Bali next month.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> The harder you study, the [blank] your examination results will be.</p>",
        options: null,
        answer: "better",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Restoran ini menyajikan makanan laut yang sangat lezat.</p><p>[blank]</p>",
        options: null,
        answer: "This restaurant serves very delicious seafood.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> I haven't seen my childhood friend [blank] 2018.</p>",
        options: null,
        answer: "since",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Perpustakaan kota buka dari jam delapan pagi hingga delapan malam.</p><p>[blank]</p>",
        options: null,
        answer: "The city library is open from eight in the morning until eight at night.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> You should drink plenty of water to prevent [blank] during summer.</p>",
        options: null,
        answer: "dehydration",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Bisakah Anda memberi tahu saya di mana stasiun bus terdekat?</p><p>[blank]</p>",
        options: null,
        answer: "Could you tell me where the nearest bus station is?",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> By the time the doctor arrived, the patient [blank] already recovered.</p>",
        options: null,
        answer: "had",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Belajar bahasa asing membutuhkan latihan dan kesabaran setiap hari.</p><p>[blank]</p>",
        options: null,
        answer: "Learning a foreign language requires daily practice and patience.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> The teacher advised the students [blank] make any noise during the test.</p>",
        options: null,
        answer: "not to",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Teknologi seluler telah mengubah cara kita berkomunikasi satu sama lain.</p><p>[blank]</p>",
        options: null,
        answer: "Mobile technology has changed the way we communicate with each other.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> She was so tired [blank] she fell asleep on the couch immediately.</p>",
        options: null,
        answer: "that",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Tolong kirimkan laporan ini sebelum hari Jumat sore.</p><p>[blank]</p>",
        options: null,
        answer: "Please submit this report before Friday afternoon.",
        skill: "Writing"
    },
    {
        description: "<p><b>Complete the sentence:</b> In spite [blank] the traffic congestion, we arrived at the airport on time.</p>",
        options: null,
        answer: "of",
        skill: "Writing"
    },
    {
        description: "<p><b>Translate to English:</b> Kucing itu sedang tidur nyenyak di bawah meja makan.</p><p>[blank]</p>",
        options: null,
        answer: "The cat is sleeping peacefully under the dining table.",
        skill: "Writing"
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // SPEAKING (25 Soal Read Aloud / Listen & Repeat)
    // ─────────────────────────────────────────────────────────────────────────────
    {
        description: "<p><b>Read Aloud:</b> Please say the following sentence clearly into the microphone.</p><br/><p>\"I would like to order a hot coffee and a fresh sandwich, please.\"</p>",
        options: null,
        answer: "I would like to order a hot coffee and a fresh sandwich, please.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Please read this sentence clearly.<br><br>\"The weather today is exceptionally bright and pleasant for a walk.\"</p>",
        options: null,
        answer: "The weather today is exceptionally bright and pleasant for a walk.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read the following phrase into your microphone.<br><br>\"Could you please direct me to the central train station?\"</p>",
        options: null,
        answer: "Could you please direct me to the central train station?",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Please repeat the sentence below.<br><br>\"Learning new skills requires consistent effort and enthusiasm every single day.\"</p>",
        options: null,
        answer: "Learning new skills requires consistent effort and enthusiasm every single day.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read aloud the statement clearly.<br><br>\"Our team successfully completed the project well ahead of the deadline.\"</p>",
        options: null,
        answer: "Our team successfully completed the project well ahead of the deadline.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read this sentence with proper intonation.<br><br>\"Fresh fruits and vegetables are essential components of a healthy diet.\"</p>",
        options: null,
        answer: "Fresh fruits and vegetables are essential components of a healthy diet.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Speak clearly into the microphone.<br><br>\"Technology has revolutionized how people stay connected across the globe.\"</p>",
        options: null,
        answer: "Technology has revolutionized how people stay connected across the globe.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read the sentence aloud.<br><br>\"She enjoys reading historical novels near the quiet lake on weekends.\"</p>",
        options: null,
        answer: "She enjoys reading historical novels near the quiet lake on weekends.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Repeat the following sentence.<br><br>\"Please remember to turn off all electronic devices before leaving the office.\"</p>",
        options: null,
        answer: "Please remember to turn off all electronic devices before leaving the office.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read aloud carefully.<br><br>\"Traveling to different countries expands your perspective on diverse cultures.\"</p>",
        options: null,
        answer: "Traveling to different countries expands your perspective on diverse cultures.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read this sentence clearly into the microphone.<br><br>\"Regular physical exercise improves cardiovascular health and boosts energy levels.\"</p>",
        options: null,
        answer: "Regular physical exercise improves cardiovascular health and boosts energy levels.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Repeat the statement clearly.<br><br>\"The museum exhibition showcases extraordinary ancient artifacts from around the world.\"</p>",
        options: null,
        answer: "The museum exhibition showcases extraordinary ancient artifacts from around the world.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Speak the sentence clearly.<br><br>\"Early morning walks in nature provide a peaceful start to a busy day.\"</p>",
        options: null,
        answer: "Early morning walks in nature provide a peaceful start to a busy day.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read aloud the text below.<br><br>\"Solar energy systems convert sunlight into clean electricity for modern homes.\"</p>",
        options: null,
        answer: "Solar energy systems convert sunlight into clean electricity for modern homes.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Speak into your microphone.<br><br>\"Good communication is the cornerstone of effective leadership in any organization.\"</p>",
        options: null,
        answer: "Good communication is the cornerstone of effective leadership in any organization.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read aloud clearly.<br><br>\"The flight to Tokyo has been delayed due to severe thunderstorm conditions.\"</p>",
        options: null,
        answer: "The flight to Tokyo has been delayed due to severe thunderstorm conditions.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Repeat the sentence.<br><br>\"Practicing mindfulness helps manage stress and enhances mental clarity.\"</p>",
        options: null,
        answer: "Practicing mindfulness helps manage stress and enhances mental clarity.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read aloud the following sentence.<br><br>\"The library offers access to thousands of educational books and digital journals.\"</p>",
        options: null,
        answer: "The library offers access to thousands of educational books and digital journals.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Speak clearly.<br><br>\"Drinking enough water throughout the day keeps your body well hydrated.\"</p>",
        options: null,
        answer: "Drinking enough water throughout the day keeps your body well hydrated.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read this sentence into the microphone.<br><br>\"Music has a universal power to evoke deep emotions across different societies.\"</p>",
        options: null,
        answer: "Music has a universal power to evoke deep emotions across different societies.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Repeat the phrase clearly.<br><br>\"We must protect marine biodiversity to preserve healthy ocean ecosystems.\"</p>",
        options: null,
        answer: "We must protect marine biodiversity to preserve healthy ocean ecosystems.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read aloud the statement.<br><br>\"Innovative scientific research continues to discover new medical treatments.\"</p>",
        options: null,
        answer: "Innovative scientific research continues to discover new medical treatments.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read clearly into the microphone.<br><br>\"Teamwork and mutual respect foster a positive and productive work environment.\"</p>",
        options: null,
        answer: "Teamwork and mutual respect foster a positive and productive work environment.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Repeat the sentence below.<br><br>\"A balanced lifestyle combines hard work, hobbies, and quality sleep.\"</p>",
        options: null,
        answer: "A balanced lifestyle combines hard work, hobbies, and quality sleep.",
        skill: "Speaking"
    },
    {
        description: "<p><b>Read Aloud:</b> Read the sentence aloud.<br><br>\"Thank you for visiting our facility and we look forward to working with you.\"</p>",
        options: null,
        answer: "Thank you for visiting our facility and we look forward to working with you.",
        skill: "Speaking"
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // LISTENING (25 Soal Percakapan MALE/FEMALE/NARRATOR)
    // ─────────────────────────────────────────────────────────────────────────────
    {
        description: "Listen to the following conversation and answer the question.<br/><br/>MALE: Hello, I would like to reserve a table for two people tonight at 7 p.m.<br/>FEMALE: Certainly. May I have your name, please?<br/>MALE: My name is John Smith.<br/><br/>Question: What is the man trying to do?",
        options: ["<p>Order food delivery</p>", "<p>Make a table reservation</p>", "<p>Cancel a hotel booking</p>", "<p>Ask for directions</p>"],
        answer: "<p>Make a table reservation</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: What time does the express train to Chicago depart?<br/>FEMALE: It leaves from Platform 4 at exactly 3:15 PM.<br/>MALE: Thank you, I need to hurry!<br/><br/>Question: When does the train depart?",
        options: ["<p>3:00 PM</p>", "<p>3:15 PM</p>", "<p>3:30 PM</p>", "<p>4:00 PM</p>"],
        answer: "<p>3:15 PM</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Excuse me, where can I find books on world history?<br/>MALE: History books are located on the second floor in Section B.<br/>FEMALE: Great, thank you very much.<br/><br/>Question: Where are the history books located?",
        options: ["<p>First floor in Section A</p>", "<p>Second floor in Section B</p>", "<p>Third floor near the cafe</p>", "<p>Basement archives</p>"],
        answer: "<p>Second floor in Section B</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: Did you hear that the annual company picnic was rescheduled?<br/>FEMALE: Yes, it was moved from Saturday to next Sunday because of the rain forecast.<br/><br/>Question: Why was the picnic rescheduled?",
        options: ["<p>The park was closed</p>", "<p>Because of a rain forecast</p>", "<p>Lack of food catering</p>", "<p>The manager was sick</p>"],
        answer: "<p>Because of a rain forecast</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Have you seen my car keys anywhere?<br/>MALE: I saw them on the kitchen counter next to the fruit bowl earlier.<br/>FEMALE: Oh, got them! Thanks.<br/><br/>Question: Where were the woman's car keys?",
        options: ["<p>In her purse</p>", "<p>On the kitchen counter</p>", "<p>Inside the car</p>", "<p>Under the sofa</p>"],
        answer: "<p>On the kitchen counter</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: Are you going to order the grilled salmon or the steak?<br/>FEMALE: I think I will try the chef's special pasta today.<br/><br/>Question: What dish does the woman choose?",
        options: ["<p>Grilled salmon</p>", "<p>Beef steak</p>", "<p>Chef's special pasta</p>", "<p>Chicken salad</p>"],
        answer: "<p>Chef's special pasta</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Is the library open on Sundays?<br/>MALE: No, it is open Monday through Saturday from 9 AM to 8 PM, but closed on Sundays.<br/><br/>Question: When is the library closed?",
        options: ["<p>Mondays</p>", "<p>Saturdays</p>", "<p>Sundays</p>", "<p>Every evening</p>"],
        answer: "<p>Sundays</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the dialogue and answer the question.<br/><br/>MALE: Can I pay with a credit card for these souvenirs?<br/>FEMALE: We accept cash and credit cards, but there is a two percent discount if you pay with cash.<br/><br/>Question: How can the man get a discount?",
        options: ["<p>By buying five items</p>", "<p>By paying with cash</p>", "<p>By showing a student ID</p>", "<p>By returning tomorrow</p>"],
        answer: "<p>By paying with cash</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: How much is a round-trip ticket to Boston?<br/>MALE: A round-trip ticket is forty-five dollars, while a one-way ticket is thirty dollars.<br/><br/>Question: How much does the round-trip ticket cost?",
        options: ["<p>$30</p>", "<p>$45</p>", "<p>$60</p>", "<p>$75</p>"],
        answer: "<p>$45</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: What time is our doctor's appointment tomorrow?<br/>FEMALE: It is scheduled at 10:30 AM, so we should leave home by 10:00 AM.<br/><br/>Question: What time should they leave their home?",
        options: ["<p>9:30 AM</p>", "<p>10:00 AM</p>", "<p>10:30 AM</p>", "<p>11:00 AM</p>"],
        answer: "<p>10:00 AM</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the dialogue and answer the question.<br/><br/>FEMALE: Did you finish reading the quarterly financial report?<br/>MALE: Almost. I am currently working on the final chapter regarding market trends.<br/><br/>Question: What is the man currently working on?",
        options: ["<p>Writing a new budget proposal</p>", "<p>The final chapter on market trends</p>", "<p>Preparing slides for a seminar</p>", "<p>Interviewing job applicants</p>"],
        answer: "<p>The final chapter on market trends</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: Would you prefer tea or herbal tea after dinner?<br/>FEMALE: I would love a hot cup of chamomile tea, please.<br/><br/>Question: What drink does the woman request?",
        options: ["<p>Black coffee</p>", "<p>Chamomile tea</p>", "<p>Iced water</p>", "<p>Green tea</p>"],
        answer: "<p>Chamomile tea</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Is the swimming pool heated during the winter months?<br/>MALE: Yes, the indoor pool is kept at 28 degrees Celsius year-round.<br/><br/>Question: What temperature is the indoor pool kept at?",
        options: ["<p>20 degrees Celsius</p>", "<p>25 degrees Celsius</p>", "<p>28 degrees Celsius</p>", "<p>32 degrees Celsius</p>"],
        answer: "<p>28 degrees Celsius</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the dialogue and answer the question.<br/><br/>MALE: Where should I submit my completed registration form?<br/>FEMALE: You can submit it at Desk 3 in the main lobby before 5 PM.<br/><br/>Question: Where should the man submit his form?",
        options: ["<p>Desk 1 on the second floor</p>", "<p>Desk 3 in the main lobby</p>", "<p>By emailing the administrator</p>", "<p>At the security gate</p>"],
        answer: "<p>Desk 3 in the main lobby</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Did you book our hotel room near the city center or near the airport?<br/>MALE: I chose the hotel near the city center because it is closer to the historical landmarks.<br/><br/>Question: Why did the man choose the city center hotel?",
        options: ["<p>It was cheaper</p>", "<p>It is closer to historical landmarks</p>", "<p>It has a larger swimming pool</p>", "<p>It offers free shuttle service</p>"],
        answer: "<p>It is closer to historical landmarks</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: Why is the main highway closed today?<br/>FEMALE: Maintenance crews are repairing road resurfacing from 8 AM to 4 PM.<br/><br/>Question: What are the maintenance crews doing?",
        options: ["<p>Installing new street lights</p>", "<p>Repairing road resurfacing</p>", "<p>Cleaning up fallen trees</p>", "<p>Building a new toll bridge</p>"],
        answer: "<p>Repairing road resurfacing</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Which floor is the dental clinic on?<br/>MALE: The dental clinic is on the fourth floor, right next to the pharmacy.<br/><br/>Question: What is located next to the dental clinic?",
        options: ["<p>The cafeteria</p>", "<p>The pharmacy</p>", "<p>The waiting room</p>", "<p>The emergency department</p>"],
        answer: "<p>The pharmacy</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the dialogue and answer the question.<br/><br/>MALE: How long does the guided city tour take?<br/>FEMALE: The walking tour takes about two hours and covers six major landmarks.<br/><br/>Question: How long does the walking tour take?",
        options: ["<p>One hour</p>", "<p>Two hours</p>", "<p>Three hours</p>", "<p>Half a day</p>"],
        answer: "<p>Two hours</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Do we need to bring our own laptops to the workshop?<br/>MALE: Yes, all participants are required to bring their own laptops with software pre-installed.<br/><br/>Question: What must participants bring to the workshop?",
        options: ["<p>Printed textbooks</p>", "<p>Their own laptops</p>", "<p>Notebooks and pens</p>", "<p>An ID card only</p>"],
        answer: "<p>Their own laptops</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the dialogue and answer the question.<br/><br/>MALE: What is the deadline for submitting the grant application?<br/>FEMALE: The portal closes on Friday at midnight sharp.<br/><br/>Question: When does the portal close?",
        options: ["<p>Thursday at noon</p>", "<p>Friday at midnight</p>", "<p>Saturday evening</p>", "<p>Sunday morning</p>"],
        answer: "<p>Friday at midnight</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: What language course are you taking this semester?<br/>MALE: I enrolled in intermediate Conversational French.<br/><br/>Question: What course did the man enroll in?",
        options: ["<p>Beginner Spanish</p>", "<p>Intermediate Conversational French</p>", "<p>Advanced German Grammar</p>", "<p>Japanese Calligraphy</p>"],
        answer: "<p>Intermediate Conversational French</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>MALE: Is wifi included in our room rate?<br/>FEMALE: Yes, high-speed wifi is complimentary for all hotel guests.<br/><br/>Question: Is wifi free for hotel guests?",
        options: ["<p>No, it costs extra</p>", "<p>Yes, it is complimentary</p>", "<p>Only in the lobby</p>", "<p>Only for business suites</p>"],
        answer: "<p>Yes, it is complimentary</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: Where can I park my car while attending the conference?<br/>MALE: You can park in the underground garage located right behind the main auditorium.<br/><br/>Question: Where is the underground parking garage?",
        options: ["<p>Across the street</p>", "<p>Right behind the main auditorium</p>", "<p>In front of the hotel lobby</p>", "<p>Next to the bus stop</p>"],
        answer: "<p>Right behind the main auditorium</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the dialogue and answer the question.<br/><br/>MALE: Has the package from London arrived yet?<br/>FEMALE: Yes, courier delivered it this morning and left it in the mailroom.<br/><br/>Question: Where is the package now?",
        options: ["<p>At the post office</p>", "<p>In the mailroom</p>", "<p>On the man's desk</p>", "<p>Inside the delivery truck</p>"],
        answer: "<p>In the mailroom</p>",
        skill: "Listening"
    },
    {
        description: "Listen to the conversation and answer the question.<br/><br/>FEMALE: What time does the art museum close on Fridays?<br/>MALE: On Fridays, it stays open late until 9:00 PM.<br/><br/>Question: What time does the museum close on Friday evenings?",
        options: ["<p>5:00 PM</p>", "<p>6:00 PM</p>", "<p>8:00 PM</p>", "<p>9:00 PM</p>"],
        answer: "<p>9:00 PM</p>",
        skill: "Listening"
    }
];

export const getRandomDemoQuestions = (count: number, skills: string[]) => {
    let filtered = DEMO_QUESTIONS;
    if (skills && skills.length > 0) {
        filtered = DEMO_QUESTIONS.filter((q) => skills.includes(q.skill));
    }

    if (filtered.length === 0) {
        filtered = DEMO_QUESTIONS;
    }

    const selected = [];
    while (selected.length < count) {
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        const toTake = Math.min(count - selected.length, shuffled.length);
        selected.push(...shuffled.slice(0, toTake));
    }

    return selected.map((q) => ({
        id: crypto.randomUUID(),
        description: q.description,
        options: q.options,
        answer: q.answer,
        skill: q.skill as "Reading" | "Writing" | "Speaking" | "Listening",
    }));
};
