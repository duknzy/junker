import fs from 'fs';

const mcPath = 'C:/Users/kokih/OneDrive/ドキュメント/GitHub/hull/src/components/MissionControl.tsx';
let content = fs.readFileSync(mcPath, 'utf8');

// 1. Update imports from wordDatabase
content = content.replace(
  "import { database, PREPOSITION_LIST, getAllMeaningsList } from '../data/wordDatabase';",
  "import { database, PREPOSITION_LIST, getAllMeaningsList, getCategoryWords, getCategoryWordCount } from '../data/wordDatabase';"
);

// 2. Update categoryBaseList
const oldBaseList = `  const categoryBaseList = useMemo(() => {
    if (activeCategory === 'vocab') return database.vocabList;
    if (activeCategory === 'target') return database.targetList;
    if (activeCategory === 'idiom') return database.idiomList;
    if (activeCategory === 'sokudoku') return database.sokudokuList;
    if (activeCategory === 'kobun') return database.kobunList;
    if (activeCategory === 'synonym') return database.synonymList;
    if (activeCategory === 'grammar' || activeCategory === 'prep_guess') return database.grammarList;
    return [];
  }, [activeCategory]);`;

const newBaseList = `  const categoryBaseList = useMemo(() => {
    if (activeCategory === 'vocab') return database.vocabList;
    if (activeCategory === 'target') return database.targetList;
    if (activeCategory === 'idiom') return database.idiomList;
    if (activeCategory === 'sokudoku') return database.sokudokuList;
    if (activeCategory === 'kobun') return database.kobunList;
    if (activeCategory === 'synonym') return database.synonymList;
    if (activeCategory === 'grammar' || activeCategory === 'prep_guess') return database.grammarList;
    if (activeCategory === 'nihonshi') return getCategoryWords('nihonshi');
    if (activeCategory === 'seikei') return getCategoryWords('seikei');
    if (activeCategory === 'chem_base') return getCategoryWords('chem_base');
    return [];
  }, [activeCategory]);`;

if (content.includes(oldBaseList)) {
  content = content.replace(oldBaseList, newBaseList);
  console.log('Updated categoryBaseList.');
} else {
  console.warn('Warning: oldBaseList not matched');
}

// 3. Update filteredWords
const oldFiltered = `    } else if (activeCategory === 'grammar' || activeCategory === 'prep_guess') {
      list = database.grammarList;
    } else if (activeCategory === 'flagged_red') {
      list = database.allWords.filter(w => getFlagStatus(w.w, w.category) === 'red');
    } else if (activeCategory === 'flagged_yellow') {
      list = database.allWords.filter(w => getFlagStatus(w.w, w.category) === 'yellow');
    } else if (activeCategory === 'flagged_all') {
      list = database.allWords.filter(w => getFlagStatus(w.w, w.category) !== 'none');
    }`;

const newFiltered = `    } else if (activeCategory === 'grammar' || activeCategory === 'prep_guess') {
      list = database.grammarList;
    } else if (activeCategory === 'nihonshi') {
      list = getCategoryWords('nihonshi');
    } else if (activeCategory === 'seikei') {
      list = getCategoryWords('seikei');
    } else if (activeCategory === 'chem_base') {
      list = getCategoryWords('chem_base');
    } else if (activeCategory === 'flagged_red') {
      const allPool = [...database.allWords, ...getCategoryWords('nihonshi'), ...getCategoryWords('seikei'), ...getCategoryWords('chem_base')];
      list = allPool.filter(w => getFlagStatus(w.w, w.category) === 'red');
    } else if (activeCategory === 'flagged_yellow') {
      const allPool = [...database.allWords, ...getCategoryWords('nihonshi'), ...getCategoryWords('seikei'), ...getCategoryWords('chem_base')];
      list = allPool.filter(w => getFlagStatus(w.w, w.category) === 'yellow');
    } else if (activeCategory === 'flagged_all') {
      const allPool = [...database.allWords, ...getCategoryWords('nihonshi'), ...getCategoryWords('seikei'), ...getCategoryWords('chem_base')];
      list = allPool.filter(w => getFlagStatus(w.w, w.category) !== 'none');
    }`;

if (content.includes(oldFiltered)) {
  content = content.replace(oldFiltered, newFiltered);
  console.log('Updated filteredWords categories.');
} else {
  console.warn('Warning: oldFiltered not matched');
}

// 4. Update searchQuery search fields
const oldSearch = `      list = list.filter(item =>
        item.w.toLowerCase().includes(q) ||
        item.m.toLowerCase().includes(q) ||
        (item.synonym && item.synonym.toLowerCase().includes(q)) ||
        (item.ex && item.ex.toLowerCase().includes(q))
      );`;

const newSearch = `      list = list.filter(item =>
        item.w.toLowerCase().includes(q) ||
        item.m.toLowerCase().includes(q) ||
        (item.synonym && item.synonym.toLowerCase().includes(q)) ||
        (item.ex && item.ex.toLowerCase().includes(q)) ||
        (item.exTr && item.exTr.toLowerCase().includes(q)) ||
        (item.partTitle && item.partTitle.toLowerCase().includes(q))
      );`;

if (content.includes(oldSearch)) {
  content = content.replace(oldSearch, newSearch);
  console.log('Updated search query fields.');
} else {
  console.warn('Warning: oldSearch not matched');
}

// 5. Update title generation
const oldTitle = "title = `🎯 ${categoryBaseList.length > 0 ? (activeCategory === 'vocab' ? 'シス単' : activeCategory === 'target' ? 'ターゲット1900' : '単語帳') : '単語ライブラリ'} (${Math.min(filteredWords.length, 50)}語)`;";
const newTitle = `const catName =
        activeCategory === 'vocab' ? 'シス単'
        : activeCategory === 'target' ? 'ターゲット1900'
        : activeCategory === 'idiom' ? 'ターゲット1000'
        : activeCategory === 'sokudoku' ? '速読熟語'
        : activeCategory === 'kobun' ? '古文単語'
        : activeCategory === 'synonym' ? '類義語'
        : activeCategory === 'grammar' ? '語法・前置詞'
        : activeCategory === 'nihonshi' ? '日本史'
        : activeCategory === 'seikei' ? '政治・経済'
        : activeCategory === 'chem_base' ? '化学基礎'
        : '単語帳';
      title = \`🎯 \${categoryBaseList.length > 0 ? catName : '単語ライブラリ'} (\${Math.min(filteredWords.length, 50)}語)\`;`;

if (content.includes(oldTitle)) {
  content = content.replace(oldTitle, newTitle);
  console.log('Updated title generation.');
} else {
  console.warn('Warning: oldTitle not matched');
}

// 6. Add tab buttons in JSX
const grammarBtnTarget = `          <button
            onClick={() => handleCategoryChange('grammar')}
            className={\`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 font-bold backdrop-blur-xs border \${
              activeCategory === 'grammar' || activeCategory === 'prep_guess'
                ? 'bg-amber-600/90 text-white shadow-xs border-transparent'
                : 'bg-white/35 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-white/55 dark:hover:bg-white/20 border-white/40 dark:border-white/10'
            }\`}
          >
            🧩 語法・前置詞 ({database.grammarList.length})
          </button>`;

const newCurriculumBtns = `${grammarBtnTarget}

          <button
            onClick={() => handleCategoryChange('nihonshi')}
            className={\`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 font-bold backdrop-blur-xs border \${
              activeCategory === 'nihonshi'
                ? 'bg-rose-700/90 text-white shadow-xs border-transparent'
                : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 hover:bg-rose-500/25 border-rose-400/30'
            }\`}
          >
            🏯 日本史 ({getCategoryWordCount('nihonshi')})
          </button>

          <button
            onClick={() => handleCategoryChange('seikei')}
            className={\`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 font-bold backdrop-blur-xs border \${
              activeCategory === 'seikei'
                ? 'bg-blue-700/90 text-white shadow-xs border-transparent'
                : 'bg-blue-500/15 text-blue-800 dark:text-blue-300 hover:bg-blue-500/25 border-blue-400/30'
            }\`}
          >
            ⚖️ 政治・経済 ({getCategoryWordCount('seikei')})
          </button>

          <button
            onClick={() => handleCategoryChange('chem_base')}
            className={\`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 font-bold backdrop-blur-xs border \${
              activeCategory === 'chem_base'
                ? 'bg-teal-700/90 text-white shadow-xs border-transparent'
                : 'bg-teal-500/15 text-teal-800 dark:text-teal-300 hover:bg-teal-500/25 border-teal-400/30'
            }\`}
          >
            🧪 化学基礎 ({getCategoryWordCount('chem_base')})
          </button>`;

if (content.includes(grammarBtnTarget)) {
  content = content.replace(grammarBtnTarget, newCurriculumBtns);
  console.log('Added curriculum category tab buttons.');
} else {
  console.warn('Warning: grammarBtnTarget not matched');
}

// 7. Update word title wrap for long curriculum questions
const oldWordTitle = `<span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight drop-shadow-2xs whitespace-nowrap">
                        {item.dispW || item.w}
                      </span>`;

const newWordTitle = `<span className={\`text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight drop-shadow-2xs \${
                        (item.category === 'nihonshi' || item.category === 'seikei' || item.category === 'chem_base')
                          ? 'break-words leading-relaxed whitespace-normal'
                          : 'whitespace-nowrap'
                      }\`}>
                        {item.dispW || item.w}
                      </span>`;

if (content.includes(oldWordTitle)) {
  content = content.replace(oldWordTitle, newWordTitle);
  console.log('Updated word title wrapping for curriculum.');
} else {
  console.warn('Warning: oldWordTitle not matched');
}

// 8. Update example/explanation toggle for curriculum
const oldExampleBlock = `{/* 例文表示トグル */}
                        {item.ex && (
                          <div>
                            <button
                              type="button"
                              onClick={() => handleToggleExpand(item.id)}
                              className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>{isExpanded ? '▲ 例文を閉じる' : '▼ 例文を表示'}</span>
                            </button>

                            {isExpanded && (
                              <div className="mt-1 p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/40 dark:border-white/10 text-xs space-y-0.5">
                                <div className="flex items-start justify-between gap-1.5">
                                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                    {item.category === 'kobun' && (
                                      <span className="text-purple-600 dark:text-purple-400 font-bold mr-1">
                                        💡 覚え方:
                                      </span>
                                    )}
                                    {item.ex}
                                  </p>
                                  {item.category !== 'kobun' && (
                                    <button
                                      type="button"
                                      onClick={() => tts.speakSentence(item.ex || '')}
                                      className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0 p-1 cursor-pointer"
                                      title="例文を再生"
                                    >
                                      🔊
                                    </button>
                                  )}
                                </div>
                                {item.category !== 'kobun' && item.exTr && (
                                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                    {item.exTr}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}`;

const newExampleBlock = `{/* 例文 または 単元・解説表示トグル */}
                        {(item.category === 'nihonshi' || item.category === 'seikei' || item.category === 'chem_base') ? (
                          (item.ex || item.exTr) && (
                            <div className="pt-0.5">
                              <button
                                type="button"
                                onClick={() => handleToggleExpand(item.id)}
                                className="text-[10px] text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isExpanded ? '▲ 単元・解説を閉じる' : '▼ 💡 単元・解説を表示'}</span>
                              </button>

                              {isExpanded && (
                                <div className="mt-1.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-400/20 text-xs space-y-1">
                                  {item.ex && (
                                    <div className="text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                                      <span>📚</span>
                                      <span>{item.ex}</span>
                                      {item.partTitle && <span className="opacity-75">（{item.partTitle}）</span>}
                                    </div>
                                  )}
                                  {item.exTr && (
                                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed break-words">
                                      {item.exTr}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          item.ex && (
                            <div>
                              <button
                                type="button"
                                onClick={() => handleToggleExpand(item.id)}
                                className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>{isExpanded ? '▲ 例文を閉じる' : '▼ 例文を表示'}</span>
                              </button>

                              {isExpanded && (
                                <div className="mt-1 p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/40 dark:border-white/10 text-xs space-y-0.5">
                                  <div className="flex items-start justify-between gap-1.5">
                                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                      {item.category === 'kobun' && (
                                        <span className="text-purple-600 dark:text-purple-400 font-bold mr-1">
                                          💡 覚え方:
                                        </span>
                                      )}
                                      {item.ex}
                                    </p>
                                    {item.category !== 'kobun' && (
                                      <button
                                        type="button"
                                        onClick={() => tts.speakSentence(item.ex || '')}
                                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0 p-1 cursor-pointer"
                                        title="例文を再生"
                                      >
                                        🔊
                                      </button>
                                    )}
                                  </div>
                                  {item.category !== 'kobun' && item.exTr && (
                                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                      {item.exTr}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        )}`;

if (content.includes(oldExampleBlock)) {
  content = content.replace(oldExampleBlock, newExampleBlock);
  console.log('Updated example/explanation block.');
} else {
  console.warn('Warning: oldExampleBlock not matched');
}

fs.writeFileSync(mcPath, content, 'utf8');
console.log('MissionControl.tsx successfully patched!');
