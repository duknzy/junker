// sushida-engine.js - Complete Romaji / Kana Typing Engine for Japanese (Sushida Style)

export const BASE_MORA_MAP = {
  'あ': ['a'], 'い': ['i', 'yi'], 'う': ['u', 'wu'], 'え': ['e'], 'お': ['o'],
  'か': ['ka', 'ca'], 'き': ['ki'], 'く': ['ku', 'cu', 'qu'], 'け': ['ke'], 'こ': ['ko', 'co'],
  'さ': ['sa'], 'し': ['si', 'shi', 'ci'], 'す': ['su'], 'せ': ['se', 'ce'], 'そ': ['so'],
  'た': ['ta'], 'ち': ['ti', 'chi'], 'つ': ['tu', 'tsu'], 'て': ['te'], 'と': ['to'],
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  'わ': ['wa'], 'を': ['wo', 'o'], 'ん': ['nn', 'xn'],
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  'ざ': ['za'], 'じ': ['zi', 'ji'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  'ぁ': ['la', 'xa'], 'ぃ': ['li', 'xi'], 'ぅ': ['lu', 'xu'], 'ぇ': ['le', 'xe'], 'ぉ': ['lo', 'xo'],
  'ゃ': ['lya', 'xya'], 'ゅ': ['lyu', 'xyu'], 'ょ': ['lyo', 'xyo'],
  'っ': ['ltu', 'xtu', 'ltsu', 'xtsu'],
  'ヴ': ['vu'], 'ゔ': ['vu'],
  'ー': ['-'], '、': [',', '、'], '。': ['.', '。'],
  '「': ['[', '「', '"', "'"], '」': [']', '」', '"', "'"],
  '『': ['[', '『', '"', "'"], '』': [']', '』', '"', "'"],
  '（': ['(', '（'], '）': [')', '）'],
  '(': ['(', '（'], ')': [')', '）'],
  '[': ['[', '「'], ']': [']', '」'],
  '【': ['[', '【'], '】': [']', '】'],
  '：': [':', '：'], ':': [':', '：'],
  '；': [';', '；'], ';': [';', '；'],
  '！': ['!', '！'], '!': ['!', '！'],
  '？': ['?', '？'], '?': ['?', '？'],
  '・': ['/'], '/': ['/'],
  ' ': [' '], '　': [' ']
};

export const COMPOUND_MORA_MAP = {
  'きゃ': ['kya', 'kilya', 'kixya'], 'きゅ': ['kyu', 'kilyu', 'kixyu'], 'きょ': ['kyo', 'kilyo', 'kixyo'],
  'しゃ': ['sya', 'sha', 'silya', 'sixya', 'shilya', 'shixya'],
  'しゅ': ['syu', 'shu', 'silyu', 'sixyu', 'shilyu', 'shixyu'],
  'しょ': ['syo', 'sho', 'silyo', 'sixyo', 'shilyo', 'shixyo'],
  'しぇ': ['sye', 'she'],
  'ちゃ': ['tya', 'cha', 'tilya', 'chilya'],
  'ちゅ': ['tyu', 'chu', 'tilyu', 'chilyu'],
  'ちょ': ['tyo', 'cho', 'tilyo', 'chilyo'],
  'ちぇ': ['tye', 'che'],
  'にゃ': ['nya', 'nilya'], 'にゅ': ['nyu', 'nilyu'], 'にょ': ['nyo', 'nilyo'],
  'ひゃ': ['hya', 'hilya'], 'ひゅ': ['hyu', 'hilyu'], 'ひょ': ['hyo', 'hilyo'],
  'みゃ': ['mya', 'milya'], 'みゅ': ['myu', 'milyu'], 'みょ': ['myo', 'milyo'],
  'りゃ': ['rya', 'rilya'], 'りゅ': ['ryu', 'rilyu'], 'りょ': ['ryo', 'rilyo'],
  'ぎゃ': ['gya', 'gilya'], 'ぎゅ': ['gyu', 'gilyu'], 'ぎょ': ['gyo', 'gilyo'],
  'じゃ': ['ja', 'zya', 'jya', 'zilya'],
  'じゅ': ['ju', 'zyu', 'jyu', 'zilyu'],
  'じょ': ['jo', 'zyo', 'jyo', 'zilyo'],
  'じぇ': ['je', 'zye'],
  'びゃ': ['bya', 'bilya'], 'びゅ': ['byu', 'bilyu'], 'びょ': ['byo', 'bilyo'],
  'ぴゃ': ['pya', 'pilya'], 'ぴゅ': ['pyu', 'pilyu'], 'ぴょ': ['pyo', 'pilyo'],
  'ふぁ': ['fa', 'fua'], 'ふぃ': ['fi', 'fui'], 'ふぇ': ['fe', 'fue'], 'ふぉ': ['fo', 'fuo'],
  'てぃ': ['thi', 'texi', 'teli'], 'でぃ': ['dhi', 'dexi', 'deli'],
  'とぅ': ['twu', 'texu', 'telu'], 'どぅ': ['dwu', 'dexu', 'delu'],
  'うぃ': ['wi', 'uxi', 'uli'], 'うぇ': ['we', 'uxe', 'ule'],
  'ヴぁ': ['va'], 'ヴぃ': ['vi'], 'ヴ': ['vu'], 'ヴぇ': ['ve'], 'ヴぉ': ['vo']
};

export function katakanaToHiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

export class SushidaGame {
  constructor(originalText, hiraganaText) {
    this.originalText = originalText || '';
    this.hiraganaText = katakanaToHiragana(hiraganaText || originalText || '');
    this.moras = [];
    this.currentMoraIdx = 0;
    this.totalKeys = 0;
    this.errorKeys = 0;
    this.isCompleted = false;

    this.initMoras();
  }

  initMoras() {
    const text = this.hiraganaText;
    const len = text.length;
    let i = 0;

    while (i < len) {
      const ch = text[i];
      const nextCh = i + 1 < len ? text[i + 1] : '';
      const pair = ch + nextCh;

      if (COMPOUND_MORA_MAP[pair]) {
        this.moras.push({
          kana: pair,
          options: [...COMPOUND_MORA_MAP[pair]],
          activeOption: COMPOUND_MORA_MAP[pair][0],
          typed: '',
          isDone: false
        });
        i += 2;
      } else if (BASE_MORA_MAP[ch]) {
        this.moras.push({
          kana: ch,
          options: [...BASE_MORA_MAP[ch]],
          activeOption: BASE_MORA_MAP[ch][0],
          typed: '',
          isDone: false
        });
        i += 1;
      } else {
        // Alphanumeric, ascii, symbol or kanji fallback
        const lower = ch.toLowerCase();
        this.moras.push({
          kana: ch,
          options: [lower],
          activeOption: lower,
          typed: '',
          isDone: false
        });
        i += 1;
      }
    }

    // Post-process: sokuon (っ) and hatsuon (ん)
    for (let k = 0; k < this.moras.length; k++) {
      const cur = this.moras[k];
      const next = k + 1 < this.moras.length ? this.moras[k + 1] : null;

      if (cur.kana === 'っ' && next) {
        // Find leading consonant of next mora
        const nextConsonants = new Set();
        next.options.forEach(opt => {
          const firstChar = opt[0];
          if (firstChar && !'aiueo'.includes(firstChar)) {
            nextConsonants.add(firstChar);
          }
        });
        // Sokuon can be typed by duplicating the first consonant of next mora!
        const extraOpts = [];
        nextConsonants.forEach(c => {
          extraOpts.push(c);
        });
        cur.options = [...extraOpts, ...cur.options];
        cur.activeOption = cur.options[0];
      } else if (cur.kana === 'ん') {
        // Check next mora
        let canSingleN = true;
        if (next) {
          const nextFirstChars = next.options.map(o => o[0]);
          // If followed by vowel, y, or n, single 'n' would form na/ni/nu/ne/no/nya etc.
          if (nextFirstChars.some(c => 'aiueoyn'.includes(c))) {
            canSingleN = false;
          }
        }
        if (canSingleN) {
          cur.options = ['n', ...cur.options];
          cur.activeOption = cur.options[0];
        }
      }
    }
  }

  getCurrentMora() {
    if (this.currentMoraIdx >= this.moras.length) return null;
    return this.moras[this.currentMoraIdx];
  }

  feedKey(key) {
    if (this.isCompleted) return { status: 'already_completed' };
    this.totalKeys++;

    const mora = this.getCurrentMora();
    if (!mora) {
      this.isCompleted = true;
      return { status: 'completed' };
    }

    const inputChar = key.toLowerCase();
    const currentTyped = mora.typed + inputChar;

    // Check which options match currentTyped as prefix
    const matchingOptions = mora.options.filter(opt => opt.startsWith(currentTyped));

    if (matchingOptions.length > 0) {
      // Valid keystroke!
      mora.typed = currentTyped;
      mora.activeOption = matchingOptions[0];

      // Did we finish this mora?
      if (mora.typed === mora.activeOption) {
        mora.isDone = true;
        this.currentMoraIdx++;

        if (this.currentMoraIdx >= this.moras.length) {
          this.isCompleted = true;
          return { status: 'completed', mora, moraIndex: this.currentMoraIdx - 1 };
        }
        return { status: 'mora_completed', mora, moraIndex: this.currentMoraIdx - 1 };
      }

      return { status: 'char_matched', mora, moraIndex: this.currentMoraIdx };
    } else {
      // Mistake!
      this.errorKeys++;
      return {
        status: 'error',
        expectedKey: mora.activeOption[mora.typed.length] || '',
        mora,
        moraIndex: this.currentMoraIdx
      };
    }
  }

  // Handle direct Kana / IME input without conversion
  feedKana(kanaInput) {
    if (this.isCompleted || !kanaInput) return { status: 'already_completed' };
    const hiraInput = katakanaToHiragana(kanaInput);
    let matchedAny = false;

    for (const ch of hiraInput) {
      if (this.isCompleted) break;
      const mora = this.getCurrentMora();
      if (!mora) break;

      if (mora.kana === ch || mora.kana.startsWith(ch)) {
        this.totalKeys++;
        mora.typed = mora.activeOption;
        mora.isDone = true;
        this.currentMoraIdx++;
        matchedAny = true;
        if (this.currentMoraIdx >= this.moras.length) {
          this.isCompleted = true;
          return { status: 'completed' };
        }
      } else {
        // Try feeding as romaji key in case input is romaji
        const res = this.feedKey(ch);
        if (res.status !== 'error') {
          matchedAny = true;
        }
      }
    }

    return {
      status: this.isCompleted ? 'completed' : (matchedAny ? 'char_matched' : 'error'),
      moraIndex: this.currentMoraIdx
    };
  }

  backspace() {
    if (this.isCompleted) return;
    const mora = this.getCurrentMora();
    if (mora && mora.typed.length > 0) {
      mora.typed = mora.typed.slice(0, -1);
      return { status: 'char_removed' };
    }
  }

  // Get full display state for UI rendering
  getDisplayState() {
    const romajiParts = [];
    const kanaParts = [];

    this.moras.forEach((mora, idx) => {
      const activeOpt = mora.activeOption;
      const typedLen = mora.typed.length;

      // Romaji characters for this mora
      const chars = [];
      for (let c = 0; c < activeOpt.length; c++) {
        const char = activeOpt[c];
        if (idx < this.currentMoraIdx) {
          chars.push({ char, state: 'matched' });
        } else if (idx === this.currentMoraIdx) {
          if (c < typedLen) {
            chars.push({ char, state: 'matched' });
          } else if (c === typedLen) {
            chars.push({ char, state: 'current' });
          } else {
            chars.push({ char, state: 'remaining' });
          }
        } else {
          chars.push({ char, state: 'remaining' });
        }
      }

      romajiParts.push({ moraIdx: idx, kana: mora.kana, chars });

      // Kana state
      let kanaState = 'remaining';
      if (idx < this.currentMoraIdx) {
        kanaState = 'matched';
      } else if (idx === this.currentMoraIdx) {
        kanaState = typedLen > 0 ? 'in_progress' : 'current';
      }
      kanaParts.push({ moraIdx: idx, kana: mora.kana, state: kanaState });
    });

    return {
      isCompleted: this.isCompleted,
      currentMoraIdx: this.currentMoraIdx,
      totalMoras: this.moras.length,
      romajiParts,
      kanaParts
    };
  }
}
