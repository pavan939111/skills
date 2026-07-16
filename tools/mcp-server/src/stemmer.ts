// Simple suffix-stripping stemmer for common endings
export function stem(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length < 3) return w;
  
  // Basic plural/singular mappings
  if (w.endsWith("sses")) {
    w = w.slice(0, -2);
  } else if (w.endsWith("ies")) {
    w = w.slice(0, -3) + "i";
  } else if (w.endsWith("ss")) {
    // leave alone
  } else if (w.endsWith("s") && !w.endsWith("us") && !w.endsWith("is") && !w.endsWith("as")) {
    w = w.slice(0, -1);
  }
  
  // Verb forms / progressive forms
  if (w.endsWith("eed")) {
    if (w.length > 4) {
      w = w.slice(0, -1); // e.g. agreed -> agree
    }
  } else if (w.endsWith("ing")) {
    w = w.slice(0, -3);
    if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) {
      w += "e"; // e.g. rotating -> rotate
    }
  } else if (w.endsWith("ed")) {
    w = w.slice(0, -2);
    if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) {
      w += "e"; // e.g. rotated -> rotate
    }
  }
  
  // Convert ending "y" to "i" if it is preceded by a consonant
  if (w.endsWith("y") && w.length > 3) {
    w = w.slice(0, -1) + "i";
  }
  
  // Standard derivation cleanups
  if (w.endsWith("ational")) w = w.slice(0, -7) + "ate";
  else if (w.endsWith("tional")) w = w.slice(0, -6) + "tion";
  else if (w.endsWith("izer")) w = w.slice(0, -1);
  else if (w.endsWith("alli")) w = w.slice(0, -2);
  else if (w.endsWith("entli")) w = w.slice(0, -2);
  else if (w.endsWith("eli")) w = w.slice(0, -2);
  else if (w.endsWith("ousli")) w = w.slice(0, -2);
  
  return w;
}
