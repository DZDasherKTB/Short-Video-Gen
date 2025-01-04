const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate 30 seconds video on topic :Interesting historical story along with Al image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and Content Text as field",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "video_script": [\n    {\n      "scene": 1,\n      "duration": 3,\n      "imagePrompt": "A wide, overcast sky over the English Channel, a small fleet of wooden longships with square sails approaching a sandy beach, warriors in Viking attire visible on the decks.",\n      "content_text": "The year is 793 AD. The age of Vikings has dawned, and their longships are slicing through the waves towards the shores of England."\n    },\n    {\n      "scene": 2,\n      "duration": 4,\n       "imagePrompt":"A detailed close-up of a Viking warrior\'s face, etched with determination and wearing a horned helmet, his eyes fixed on the horizon. He grips a battle axe.",\n      "content_text":"Driven by a thirst for plunder and glory, these Norse seafarers were not just raiders; they were skilled explorers and formidable warriors."\n    },\n     {\n      "scene": 3,\n      "duration": 5,\n      "imagePrompt": "A chaotic scene of the Viking raid on Lindisfarne monastery, monks in robes scattering in fear, Vikings with swords and axes smashing wooden doors, flames starting to lick at thatched roofs, early morning light.",\n      "content_text": "Their first major target: the monastery at Lindisfarne. This brutal attack sent shockwaves through Europe, marking the beginning of the Viking Age in earnest."\n    },\n      {\n      "scene": 4,\n      "duration": 4,\n       "imagePrompt":"A Viking longship, partially beached, with Vikings carrying wooden chests filled with gold and silver, a few villagers looking on from a distance in terror",\n      "content_text":"Their raids were swift, brutal, and effective. They plundered monasteries and villages, amassing riches and establishing a fearsome reputation."\n    },\n     {\n      "scene": 5,\n      "duration": 4,\n       "imagePrompt":"A close up of a piece of intricately designed Viking jewelry, perhaps a Thor\'s hammer pendant or a silver brooch with complex knot work, laid on a wooden table.",\n      "content_text":"But the Vikings were more than just warriors. They were also skilled craftsmen, leaving behind beautiful artifacts that tell of their culture and beliefs."\n    },\n    {\n      "scene": 6,\n      "duration": 5,\n       "imagePrompt": "A map of Europe with small Viking ships icon moving along the coast, with areas highlight where they are majorly conquered.",\n       "content_text":"Over centuries, they established settlements, traded far and wide, and their influence spread, shaping the course of history, from Scandinavia to the British Isles."\n    },\n       {\n      "scene": 7,\n      "duration": 5,\n       "imagePrompt": "A panoramic view of a peaceful Icelandic landscape, with a small Viking village in the distance nestled in a valley, with green fields and grazing animals, the sun starting to set.",\n      "content_text": " From raiders to settlers, the Vikings left an indelible mark on the world, their stories echoing through time, reminding us of their bravery and resilience."\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});
