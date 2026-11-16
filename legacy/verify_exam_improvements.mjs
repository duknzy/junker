import fs from 'fs';

const html = fs.readFileSync('past-exam.html', 'utf8');
console.log('1. examSelect listener handles presetList:', html.includes('presetList.find'));
console.log('2. initModalAnswersGrid has startNum:', html.includes('function initModalAnswersGrid(totalQ, startNum = 1)'));
console.log('3. submitCreateExam has startQ:', html.includes('new-exam-start-q'));
console.log('4. result-total-denom dynamic:', html.includes('result-total-denom'));
console.log('5. currentExam.sections handled properly:', html.includes('(currentExam.sections || []).forEach'));
