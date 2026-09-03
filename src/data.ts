import { PresetPhrase } from "./types";

export const THAI_PRESETS: PresetPhrase[] = [
  {
    id: "preset-th-1",
    thai: "สวัสดีครับ",
    romanization: "sawatdee khrap",
    meaning: "Hello (polite, male speaker)",
    result: {
      detectedText: "สวัสดีครับ",
      transliteration: "sa-wat-dee khrap",
      translation: "Hello / Greetings (polite, used by male speakers)",
      ipa: "[sà.wàt.diː kʰráp]",
      syllablesCount: 4,
      words: [
        {
          thai: "สวัสดี",
          romanization: "sa-wat-dee",
          tone: "sa (low), wat (low), dee (mid)",
          meaning: "hello / greetings",
          ipa: "[sà.wàt.diː]"
        },
        {
          thai: "ครับ",
          romanization: "khrap",
          tone: "high",
          meaning: "polite ending particle (male speaker)",
          ipa: "[kʰráp]"
        }
      ],
      pronunciationGuide: "Pronounce 'sa' with a low flat tone; 'wat' with a low tone; 'dee' with a flat mid tone; 'khrap' with a high rising tone.",
      languageNotes: "สวัสดี (sawatdee) was created in the 1930s as a standardized modern Thai greeting. ครับ (khrap) is a polite particle indicating respect."
    }
  },
  {
    id: "preset-th-2",
    thai: "ขอบคุณมากค่ะ",
    romanization: "khop khun mak kha",
    meaning: "Thank you very much (polite, female speaker)",
    result: {
      detectedText: "ขอบคุณมากค่ะ",
      transliteration: "khop-khun mak kha",
      translation: "Thank you very much (polite, used by female speakers)",
      ipa: "[kʰɔ̂ːp.kʰūn mâːk kʰâ]",
      syllablesCount: 4,
      words: [
        {
          thai: "ขอบคุณ",
          romanization: "khop-khun",
          tone: "khop (falling), khun (mid)",
          meaning: "thank you",
          ipa: "[kʰɔ̂ːp.kʰūn]"
        },
        {
          thai: "มาก",
          romanization: "mak",
          tone: "falling",
          meaning: "very / much",
          ipa: "[mâːk]"
        },
        {
          thai: "ค่ะ",
          romanization: "kha",
          tone: "falling",
          meaning: "polite ending particle (female speaker)",
          ipa: "[kʰâ]"
        }
      ],
      pronunciationGuide: "The syllable 'khop' has a falling tone. 'khun' is a flat mid tone. 'mak' is a long vowel 'ah' with a deep falling tone. 'kha' is a short syllable with a falling tone.",
      languageNotes: "ขอบคุณ (khop-khun) is the standard polite word for thank you. ค่ะ (kha, falling tone) is the polite particle used by female speakers."
    }
  },
  {
    id: "preset-th-3",
    thai: "สบายดีไหมครับ",
    romanization: "sabai dee mai khrap",
    meaning: "How are you? (polite, male speaker)",
    result: {
      detectedText: "สบายดีไหมครับ",
      transliteration: "sa-bai dee mai khrap",
      translation: "How are you doing? / Are you well?",
      ipa: "[sà.baːj.diː mǎj kʰráp]",
      syllablesCount: 5,
      words: [
        {
          thai: "สบาย",
          romanization: "sa-bai",
          tone: "sa (low), bai (mid)",
          meaning: "comfortable / healthy",
          ipa: "[sà.baːj]"
        },
        {
          thai: "ดี",
          romanization: "dee",
          tone: "mid",
          meaning: "good / fine",
          ipa: "[diː]"
        },
        {
          thai: "ไหม",
          romanization: "mai",
          tone: "rising",
          meaning: "yes/no question particle",
          ipa: "[mǎj]"
        },
        {
          thai: "ครับ",
          romanization: "khrap",
          tone: "high",
          meaning: "polite particle (male)",
          ipa: "[kʰráp]"
        }
      ],
      pronunciationGuide: "Syllable 'sa' is a very short low tone. 'bai' is flat mid tone. 'dee' is flat mid tone. 'mai' has a rising tone. 'khrap' is a short high rising tone.",
      languageNotes: "สบายดี (sabai-dee) literally translates to 'comfortably good'. ไหม (mai) is a yes/no question particle placed at the end of a sentence."
    }
  }
];

export const JAPANESE_PRESETS: PresetPhrase[] = [
  {
    id: "preset-ja-1",
    thai: "こんにちは",
    romanization: "konnichiwa",
    meaning: "Hello / Good afternoon",
    result: {
      detectedText: "こんにちは",
      transliteration: "kon-ni-chi-wa",
      translation: "Hello / Good afternoon",
      ipa: "[kõn.ɲi.tɕi.wa]",
      syllablesCount: 5,
      words: [
        {
          thai: "こん",
          romanization: "kon",
          tone: "low-high",
          meaning: "this (prefix/root context)",
          ipa: "[kõn]"
        },
        {
          thai: "にち",
          romanization: "nichi",
          tone: "high-low",
          meaning: "day",
          ipa: "[ɲi.tɕi]"
        },
        {
          thai: "は",
          romanization: "wa",
          tone: "low",
          meaning: "topic marker particle",
          ipa: "[wa]"
        }
      ],
      pronunciationGuide: "Keep each syllable of equal length (mora). 'wa' is written with the hiragana 'ha' (は) but pronounced as 'wa' because it functions as the topic marker particle.",
      languageNotes: "Literally translates to 'Today is...' or 'As for this day...'. Historically the start of a longer greeting such as 'Konnichi wa gokigen ikaga desu ka' (How are you feeling today?)."
    }
  },
  {
    id: "preset-ja-2",
    thai: "ありがとうございます",
    romanization: "arigatou gozaimasu",
    meaning: "Thank you very much (polite)",
    result: {
      detectedText: "ありがとうございます",
      transliteration: "a-ri-ga-tou go-za-i-ma-su",
      translation: "Thank you very much (formal, polite)",
      ipa: "[a.ɾi.ɡa.toː ɡo.za.i.ma.sɯ̥]",
      syllablesCount: 10,
      words: [
        {
          thai: "ありがとう",
          romanization: "arigatou",
          tone: "low-high-high-low",
          meaning: "thank you (casual)",
          ipa: "[a.ɾi.ɡa.toː]"
        },
        {
          thai: "ございます",
          romanization: "gozaimasu",
          tone: "low-high-high-high-low",
          meaning: "exist / polite verb ending",
          ipa: "[ɡo.za.i.ma.sɯ̥]"
        }
      ],
      pronunciationGuide: "The 'r' sound is a flap (between English 'r', 'l', and 'd'). The final 'u' in 'gozaimasu' is mostly voiceless/silent, sounding like 'gozaimas'.",
      languageNotes: "'Arigatou' derives from 'Arigatashi' (difficult to exist), meaning the action is rare and highly appreciated. 'Gozaimasu' makes the gratitude highly polite."
    }
  }
];

export const KOREAN_PRESETS: PresetPhrase[] = [
  {
    id: "preset-ko-1",
    thai: "안녕하세요",
    romanization: "annyeonghaseyo",
    meaning: "Hello (polite)",
    result: {
      detectedText: "안녕하세요",
      transliteration: "an-nyeong-ha-se-yo",
      translation: "Hello / Hi (peaceful, standard polite greeting)",
      ipa: "[aɲ.ɲʌŋ.ɦa.se.jo]",
      syllablesCount: 5,
      words: [
        {
          thai: "안녕",
          romanization: "annyeong",
          tone: "N/A",
          meaning: "well-being / peace",
          ipa: "[aɲ.ɲʌŋ]"
        },
        {
          thai: "하세요",
          romanization: "haseyo",
          tone: "N/A",
          meaning: "please do / are you doing",
          ipa: "[ɦa.se.jo]"
        }
      ],
      pronunciationGuide: "Pronounce 'an' with a clear short 'a'. The vowel in 'nyeong' (어) is an open 'o' sound like 'uh'. Soften the 'h' in 'haseyo' in fluent speech.",
      languageNotes: "안녕 (Annyeong) comes from Hanja (安寧) meaning 'comfort and peace'. 하세요 (haseyo) is the honorific polite form of 'to do'. The greeting literally inquires if you are in peace."
    }
  },
  {
    id: "preset-ko-2",
    thai: "감사합니다",
    romanization: "gamsahabnida",
    meaning: "Thank you (formal)",
    result: {
      detectedText: "감사합니다",
      transliteration: "gam-sa-ham-ni-da",
      translation: "Thank you (highly formal/polite)",
      ipa: "[kam.sa.ɦap.ni.da]",
      syllablesCount: 5,
      words: [
        {
          thai: "감사",
          romanization: "gamsa",
          tone: "N/A",
          meaning: "appreciation / gratitude",
          ipa: "[kam.sa]"
        },
        {
          thai: "합니다",
          romanization: "habnida",
          tone: "N/A",
          meaning: "to do (formal present statement)",
          ipa: "[ɦam.ni.da]"
        }
      ],
      pronunciationGuide: "Note the phonetic assimilation: '합' is spelled 'hab' but pronounced 'ham' before the 'ni' syllable due to Korean consonant rules (nasalization).",
      languageNotes: "감사 (Gamsa) is Hanja (感謝) meaning thanks. 합니다 (habnida) is the deferential verb ending for 'to do'. Together they form the most formal way to express gratitude."
    }
  }
];

export const CHINESE_PRESETS: PresetPhrase[] = [
  {
    id: "preset-zh-1",
    thai: "你好",
    romanization: "nǐ hǎo",
    meaning: "Hello",
    result: {
      detectedText: "你好",
      transliteration: "nǐ hǎo",
      translation: "Hello / Greetings",
      ipa: "[nǐ xǎu]",
      syllablesCount: 2,
      words: [
        {
          thai: "你",
          romanization: "nǐ",
          tone: "3rd tone (low dipping) -> changes to 2nd tone",
          meaning: "you",
          ipa: "[nǐ]"
        },
        {
          thai: "好",
          romanization: "hǎo",
          tone: "3rd tone (low dipping)",
          meaning: "good / fine",
          ipa: "[xǎu]"
        }
      ],
      pronunciationGuide: "Tone Sandhi Rule: When two third tones occur in succession, the first third tone changes to a second tone (rising tone: 'ní'), while the second syllable remains a third tone.",
      languageNotes: "Literally 'you good'. It is the most common and versatile greeting in the Chinese-speaking world, usable at any time of day."
    }
  },
  {
    id: "preset-zh-2",
    thai: "谢谢你",
    romanization: "xièxie nǐ",
    meaning: "Thank you",
    result: {
      detectedText: "谢谢你",
      transliteration: "xiè-xie nǐ",
      translation: "Thank you / Thanks to you",
      ipa: "[ɕjê.ɕje nǐ]",
      syllablesCount: 3,
      words: [
        {
          thai: "谢谢",
          romanization: "xiè-xie",
          tone: "4th tone (falling) + neutral tone",
          meaning: "to thank / thanks",
          ipa: "[ɕjê.ɕje]"
        },
        {
          thai: "你",
          romanization: "nǐ",
          tone: "3rd tone (dipping)",
          meaning: "you",
          ipa: "[nǐ]"
        }
      ],
      pronunciationGuide: "The first 'xiè' is a sharp falling tone. The second 'xie' is short and lightweight (neutral tone). The vowel sound 'ie' is like 'ee-yeh'.",
      languageNotes: "The character 谢 (xiè) can mean to thank, decay, or wither. Reduplication of verbs is common in Chinese to soften the tone, making it friendly."
    }
  }
];

export const VIETNAMESE_PRESETS: PresetPhrase[] = [
  {
    id: "preset-vi-1",
    thai: "Xin chào",
    romanization: "xin chao",
    meaning: "Hello (standard)",
    result: {
      detectedText: "Xin chào",
      transliteration: "xin chào",
      translation: "Hello / Greetings (general)",
      ipa: "[siŋ˧ t͡ɕaːw˨˩]",
      syllablesCount: 2,
      words: [
        {
          thai: "Xin",
          romanization: "xin",
          tone: "mid flat tone (ngang)",
          meaning: "please / to ask respectfully",
          ipa: "[siŋ˧]"
        },
        {
          thai: "chào",
          romanization: "chào",
          tone: "low falling tone (huyền)",
          meaning: "to greet / salute",
          ipa: "[t͡ɕaːw˨˩]"
        }
      ],
      pronunciationGuide: "The word 'Xin' is pronounced with a soft 's' sound. 'chào' has a low, falling tone. Let the sound drift downwards gracefully.",
      languageNotes: "Literally 'respectfully request to greet'. Often combined with personal pronouns depending on age and gender of the listener to make it polite (e.g. 'Chào anh', 'Chào chị')."
    }
  }
];

export const HINDI_PRESETS: PresetPhrase[] = [
  {
    id: "preset-hi-1",
    thai: "नमस्ते",
    romanization: "namaste",
    meaning: "Hello / Greetings",
    result: {
      detectedText: "नमस्ते",
      transliteration: "na-mas-te",
      translation: "Hello / I bow to you (highly respectful and traditional)",
      ipa: "[nə.məs.teː]",
      syllablesCount: 3,
      words: [
        {
          thai: "नमः",
          romanization: "namas",
          tone: "unstressed",
          meaning: "bow / respectful greeting",
          ipa: "[nə.məs]"
        },
        {
          thai: "ते",
          romanization: "te",
          tone: "stressed long vowel",
          meaning: "to you",
          ipa: "[teː]"
        }
      ],
      pronunciationGuide: "The 'a' in 'na' is a short neutral schwa sound. The 't' in 'te' is dental (tongue touching teeth), NOT alveolar (like English 't').",
      languageNotes: "Derived from Sanskrit: 'namas' (bowing/obeisance) and 'te' (to you). It literally translates to 'the divine in me bows to the divine in you', usually spoken with palms pressed together."
    }
  }
];

export const ARABIC_PRESETS: PresetPhrase[] = [
  {
    id: "preset-ar-1",
    thai: "مرحباً",
    romanization: "marhaban",
    meaning: "Hello / Welcome",
    result: {
      detectedText: "مرحباً",
      transliteration: "mar-ha-ban",
      translation: "Hello / Welcome / Friendly greetings",
      ipa: "[mar.ħa.ban]",
      syllablesCount: 3,
      words: [
        {
          thai: "مرحب",
          romanization: "marhab",
          tone: "N/A",
          meaning: "welcome / spacious place",
          ipa: "[mar.ħab]"
        },
        {
          thai: "اً",
          romanization: "an",
          tone: "N/A",
          meaning: "accusative/adverbial suffix",
          ipa: "[an]"
        }
      ],
      pronunciationGuide: "The 'h' is a pharyngeal voiceless fricative (ح), pronounced deep in the throat with a constricted sigh sound. The 'r' is rolled/tapped.",
      languageNotes: "Derived from 'Rahb' meaning a wide, welcoming open field. It metaphorically tells the visitor 'You have arrived at a place of ease, space, and family'."
    }
  }
];

export const LANGUAGES_PRESETS: Record<string, PresetPhrase[]> = {
  th: THAI_PRESETS,
  ja: JAPANESE_PRESETS,
  ko: KOREAN_PRESETS,
  zh: CHINESE_PRESETS,
  vi: VIETNAMESE_PRESETS,
  hi: HINDI_PRESETS,
  ar: ARABIC_PRESETS
};

export const PRESET_PHRASES = THAI_PRESETS;
