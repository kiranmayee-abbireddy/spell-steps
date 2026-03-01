import { wordList } from '../data/dictionary';

/**
 * Validates if a word exists in our dictionary
 * First checks against local dictionary, then falls back to a free API
 */
export const isValidWord = async (word: string): Promise<boolean> => {
  // Immediately return false for invalid input
  if (!word || word.length < 2) return false;

  // Check if the word has already been used before
  // (This could be implemented by checking against state.words)

  // First try local dictionary (faster)
  if (wordList.includes(word.toLowerCase())) {
    return true;
  }

  try {
    // If not in local dictionary, use free dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    // If the response is ok (status in the range 200-299)
    return response.ok;
  } catch (error) {
    console.error('Error validating word:', error);

    // Fall back to local validation in case of network error
    // Accept words longer than 3 letters as valid
    return word.length >= 3;
  }
};

export interface WordDetails {
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
}

export const fetchWordDetails = async (word: string): Promise<WordDetails | null> => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.length > 0) {
      const entry = data[0];

      let synonyms: string[] = [];
      let antonyms: string[] = [];
      let allDefs: string[] = [];

      entry.meanings.forEach((m: any) => {
        if (m.synonyms) synonyms.push(...m.synonyms);
        if (m.antonyms) antonyms.push(...m.antonyms);
        m.definitions.forEach((d: any) => {
          if (d.definition) allDefs.push(d.definition);
          if (d.synonyms) synonyms.push(...d.synonyms);
          if (d.antonyms) antonyms.push(...d.antonyms);
        });
      });

      // Filter out overly simplistic definitions that just say "something that is X"
      // or that contain the exact word itself
      const wordLower = (entry.word || word).toLowerCase();
      const goodDefs = allDefs.filter(d => {
        const dLower = d.toLowerCase();

        // Filter if the definition contains the actual word being defined (eg "Something that is easy")
        // Check for word presence with boundaries
        const containsWordObj = new RegExp(`\\b${wordLower}\\b`, 'i').test(dLower);

        // Filter overly simplistic placeholder definitions from the API
        const simplistic = [
          `that is ${wordLower}`,
          `who is ${wordLower}`,
          `being ${wordLower}`,
          `to be ${wordLower}`
        ];

        return dLower.length > 5 && !containsWordObj && !simplistic.some(s => dLower.includes(s));
      });

      // Most definitions are ordered by prominence. Picking the absolute shortest
      // frequently results in bizarre semantic secondary/tertiary shorthand meanings.
      // Instead, we just take the first meaning that passes the strict repetition filters!
      // But we will gently avoid massively long definitions over 120 chars if a simpler one exists closer to the front. 
      const conciseDefs = goodDefs.filter(d => d.length < 120);
      const preferredDefs = conciseDefs.length > 0 ? conciseDefs : goodDefs;

      const bestDef = preferredDefs.length > 0
        ? preferredDefs[0]
        : (allDefs[0] || "Meaning unknown.");

      // Deduplicate arrays and slice max 5
      synonyms = Array.from(new Set(synonyms)).slice(0, 5);
      antonyms = Array.from(new Set(antonyms)).slice(0, 5);

      return {
        word: entry.word || word,
        meaning: bestDef,
        synonyms,
        antonyms
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching word details', e);
    return null;
  }
};