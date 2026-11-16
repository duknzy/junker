/**
 * 河合出版『文系の数学 重要事項 完全習得編 改訂版』
 * 演習問題データ（全115題）
 */

export const BUNKEI_MATH_EXERCISES_CATALOG = [
  { id: 1, chapter: "数と式", title: "因数分解", target_reidai: 1, sources: ["実践女子大","中央大","目白大","札幌大"] },
  { id: 2, chapter: "数と式", title: "式の値の計算", target_reidai: 2, sources: ["青山学院大"] },
  { id: 3, chapter: "数と式", title: "二重根号と式の値", target_reidai: 7, sources: ["慶應義塾大","近畿大","名城大"] },
  { id: 4, chapter: "数と式", title: "比例式", target_reidai: 5, sources: ["西南学院大"] },
  { id: 5, chapter: "数と式", title: "絶対値を含む方程式・不等式", target_reidai: 6, sources: ["名古屋学院大","東洋大","西南学院大"] },
  { id: 6, chapter: "数と式", title: "絶対値を含む関数のグラフ", target_reidai: 6, sources: ["東京女子大"] },
  { id: 7, chapter: "集合と論理", title: "集合と包除原理", target_reidai: 8, sources: ["帝京大"] },
  { id: 8, chapter: "集合と論理", title: "必要条件・十分条件", target_reidai: 11, sources: ["慶應義塾大","成蹊大"] },
  { id: 9, chapter: "2次関数", title: "放物線の対称移動と平行移動", target_reidai: 14, sources: ["名城大"] },
  { id: 10, chapter: "2次関数", title: "2次関数の最大最小（区間が動く）", target_reidai: 18, sources: ["東北学院大"] },
  { id: 11, chapter: "2次関数", title: "2変数の最大最小（条件付き）", target_reidai: 17, sources: ["関西大"] },
  { id: 12, chapter: "2次関数", title: "置きかえを利用した2次関数の最小値", target_reidai: 16, sources: ["甲南大"] },
  { id: 13, chapter: "2次関数", title: "2次不等式の決定", target_reidai: 20, sources: ["学習院大"] },
  { id: 14, chapter: "2次関数", title: "すべての実数で成り立つ2次不等式", target_reidai: 21, sources: ["公立はこだて未来大"] },
  { id: 15, chapter: "2次関数", title: "制限された区間でつねに成り立つ2次不等式", target_reidai: 22, sources: ["西南学院大"] },
  { id: 16, chapter: "2次方程式・2次不等式", title: "解の配置問題", target_reidai: 23, sources: ["武庫川女子大"] },
  { id: 17, chapter: "図形と計量", title: "三角形の計量と外接円・内接円の半径", target_reidai: 25, sources: ["関西学院大"] },
  { id: 18, chapter: "図形と計量", title: "正弦比と角の二等分線", target_reidai: 28, sources: ["中央大"] },
  { id: 19, chapter: "図形と計量", title: "角の二等分線の長さ（面積の利用）", target_reidai: 26, sources: ["南山大"] },
  { id: 20, chapter: "図形と計量", title: "円に内接する四角形の対角線", target_reidai: 26, sources: ["東洋大"] },
  { id: 21, chapter: "データの分析", title: "四分位数の計算", target_reidai: 34, sources: ["愛知学泉大"] },
  { id: 22, chapter: "データの分析", title: "分散・共分散・相関係数", target_reidai: 36, sources: ["西南学院大"] },
  { id: 23, chapter: "データの分析", title: "分散の公式の証明", target_reidai: 36, sources: ["琉球大"] },
  { id: 24, chapter: "データの分析", title: "合成データの平均値と分散", target_reidai: 35, sources: ["玉川大"] },
  { id: 25, chapter: "場合の数と確率", title: "順列の基本と隣り合う並び方", target_reidai: 36, sources: ["松山大"] },
  { id: 26, chapter: "場合の数と確率", title: "円順列と女子が隣り合わない並び方", target_reidai: 37, sources: ["同志社大"] },
  { id: 27, chapter: "場合の数と確率", title: "最短経路と通行止め地点", target_reidai: 40, sources: ["島根大"] },
  { id: 28, chapter: "場合の数と確率", title: "組分けの問題", target_reidai: 41, sources: ["滋賀大"] },
  { id: 29, chapter: "場合の数と確率", title: "重複組合せと方程式の整数解", target_reidai: 42, sources: ["東北学院大"] },
  { id: 30, chapter: "場合の数と確率", title: "各桁の数字の種類の制限", target_reidai: 42, sources: ["関西大"] },
  { id: 31, chapter: "場合の数と確率", title: "球の取り出しと確率", target_reidai: 44, sources: ["青山学院大"] },
  { id: 32, chapter: "場合の数と確率", title: "さいころの目の積と余事象", target_reidai: 45, sources: ["小樽商科大"] },
  { id: 33, chapter: "場合の数と確率", title: "反復試行と数直線上での移動", target_reidai: 48, sources: ["大分大"] },
  { id: 34, chapter: "場合の数と確率", title: "最大値の確率と条件付き確率", target_reidai: 50, sources: ["慶應義塾大"] },
  { id: 35, chapter: "場合の数と確率", title: "検査の陽性と条件付き確率", target_reidai: 51, sources: ["神奈川大"] },
  { id: 36, chapter: "場合の数と確率", title: "試合の勝敗と回数の期待値", target_reidai: 48, sources: ["青山学院大"] },
  { id: 37, chapter: "図形の性質", title: "メネラウスの定理の利用", target_reidai: 52, sources: ["駒澤大"] },
  { id: 38, chapter: "図形の性質", title: "方べきの定理と直角三角形", target_reidai: 56, sources: ["岩手大"] },
  { id: 39, chapter: "式と証明", title: "二項定理と指定された項の係数", target_reidai: 58, sources: ["神奈川大","島根県立大"] },
  { id: 40, chapter: "式と証明", title: "恒等式と係数決定", target_reidai: 57, sources: ["西日本工業大"] },
  { id: 41, chapter: "式と証明", title: "3次の不等式の証明", target_reidai: 59, sources: ["津田塾大"] },
  { id: 42, chapter: "式と証明", title: "相加・相乗平均の大小関係の利用", target_reidai: 60, sources: ["南山大","慶應義塾大"] },
  { id: 43, chapter: "複素数と方程式", title: "解と係数の関係と複素数の相等", target_reidai: 62, sources: ["西南学院大"] },
  { id: 44, chapter: "複素数と方程式", title: "解の対称式を解とする2次方程式", target_reidai: 63, sources: ["立命館大"] },
  { id: 45, chapter: "複素数と方程式", title: "剰余の定理と2次式で割った余り", target_reidai: 65, sources: ["慶應義塾大"] },
  { id: 46, chapter: "複素数と方程式", title: "3次方程式の解と係数の関係，対称式", target_reidai: 69, sources: ["近畿大"] },
  { id: 47, chapter: "複素数と方程式", title: "虚数解と実数係数の3次方程式", target_reidai: 68, sources: ["琉球大"] },
  { id: 48, chapter: "複素数と方程式", title: "1の3乗根 ω の計算", target_reidai: 71, sources: ["関西大"] },
  { id: 49, chapter: "図形と式", title: "直線に関して対称な点", target_reidai: 74, sources: ["関西大"] },
  { id: 50, chapter: "図形と式", title: "3直線が三角形を作らない条件", target_reidai: 73, sources: ["西南学院大"] },
  { id: 51, chapter: "図形と式", title: "円と直線の交点，弦の長さ", target_reidai: 77, sources: ["関西大"] },
  { id: 52, chapter: "図形と式", title: "2円の位置関係（外接と内接）", target_reidai: 83, sources: ["東洋大"] },
  { id: 53, chapter: "図形と式", title: "円の方程式の条件と中心の軌跡", target_reidai: 78, sources: ["駒澤大"] },
  { id: 54, chapter: "図形と式", title: "放物線と直線の交点の中点の軌跡", target_reidai: 80, sources: ["関西学院大"] },
  { id: 55, chapter: "図形と式", title: "領域における最大・最小（線形計画法）", target_reidai: 82, sources: ["青山学院大"] },
  { id: 56, chapter: "三角関数", title: "三角方程式・不等式", target_reidai: 84, sources: ["京都産業大","津田塾大","福島大"] },
  { id: 57, chapter: "三角関数", title: "三角関数の合成と最大・最小", target_reidai: 88, sources: ["福島大"] },
  { id: 58, chapter: "三角関数", title: "2倍角の公式と三角関数の最大・最小", target_reidai: 89, sources: ["関西学院大"] },
  { id: 59, chapter: "三角関数", title: "sin x - cos x = t とおく三角関数の最大・最小", target_reidai: 91, sources: ["南山大"] },
  { id: 60, chapter: "指数・対数関数", title: "指数・対数の計算", target_reidai: 94, sources: ["鳥取大"] },
  { id: 61, chapter: "指数・対数関数", title: "指数の条件式と式の値，対数", target_reidai: 92, sources: ["富山大","中央大"] },
  { id: 62, chapter: "指数・対数関数", title: "指数方程式・指数不等式", target_reidai: 93, sources: ["玉川大","岡山県立大","関西大"] },
  { id: 63, chapter: "指数・対数関数", title: "対数方程式・対数不等式", target_reidai: 97, sources: ["専修大","摂南大","三重大"] },
  { id: 64, chapter: "指数・対数関数", title: "相加相乗平均と関数の最大・最小", target_reidai: 95, sources: ["釧路公立大"] },
  { id: 65, chapter: "指数・対数関数", title: "対数を含む関数の最大・最小", target_reidai: 99, sources: ["名城大"] },
  { id: 66, chapter: "指数・対数関数", title: "常用対数の応用（桁数と小数首位）", target_reidai: 102, sources: ["南山大","成蹊大"] },
  { id: 67, chapter: "微分法", title: "傾きが与えられた接線の方程式", target_reidai: 105, sources: ["学習院大"] },
  { id: 68, chapter: "微分法", title: "3次関数が極値をもつ条件と極大値", target_reidai: 107, sources: ["広島工業大"] },
  { id: 69, chapter: "微分法", title: "箱の容積の最大値（微分の応用）", target_reidai: 106, sources: ["東京経済大"] },
  { id: 70, chapter: "微分法", title: "曲線外の点から引ける接線の本数", target_reidai: 108, sources: ["岩手大"] },
  { id: 71, chapter: "微分法", title: "3次不等式が常に成り立つ条件", target_reidai: 109, sources: ["宮城大"] },
  { id: 72, chapter: "積分法", title: "定積分を含む関数決定（定数型・変数型）", target_reidai: 113, sources: ["早稲田大","福岡大"] },
  { id: 73, chapter: "積分法", title: "絶対値を含む関数の定積分と最小値", target_reidai: 114, sources: ["大阪公立大"] },
  { id: 74, chapter: "積分法", title: "2つの放物線で囲まれる面積", target_reidai: 116, sources: ["群馬大"] },
  { id: 75, chapter: "積分法", title: "放物線で囲まれる図形の面積の最大値", target_reidai: 116, sources: ["お茶の水女子大"] },
  { id: 76, chapter: "積分法", title: "2つの放物線の共通接線と囲まれる面積", target_reidai: 117, sources: ["名城大"] },
  { id: 77, chapter: "数列", title: "等差数列の和の最小値", target_reidai: 120, sources: ["高崎経済大"] },
  { id: 78, chapter: "数列", title: "等差中項と等比中項", target_reidai: 119, sources: ["同志社女子大"] },
  { id: 79, chapter: "数列", title: "等差×等比の和（S-rS法）", target_reidai: 123, sources: ["北海学園大"] },
  { id: 80, chapter: "数列", title: "部分分数分解と有理化による和の計算", target_reidai: 122, sources: ["関西大","会津大"] },
  { id: 81, chapter: "数列", title: "和Snから一般項を求める，部分分数分解", target_reidai: 122, sources: ["東京女子大"] },
  { id: 82, chapter: "数列", title: "和Snから一般項を求める（等比型）", target_reidai: 121, sources: ["駒澤大"] },
  { id: 83, chapter: "数列", title: "等差数列と階差数列の比較", target_reidai: 125, sources: ["神奈川大"] },
  { id: 84, chapter: "数列", title: "群数列（奇数個ずつの自然数）", target_reidai: 126, sources: ["中央大"] },
  { id: 85, chapter: "数列", title: "群数列（偶数が並ぶ数列）", target_reidai: 126, sources: ["大分大"] },
  { id: 86, chapter: "数列", title: "基本の漸化式 an+1 = p an + q", target_reidai: 127, sources: ["福島大","慶應義塾大"] },
  { id: 87, chapter: "数列", title: "漸化式の解法（指数型・分数型）", target_reidai: 128, sources: ["大阪公立大"] },
  { id: 88, chapter: "数列", title: "階差を利用する漸化式 an+1 = p an + f(n)", target_reidai: 130, sources: ["青山学院大"] },
  { id: 89, chapter: "数列", title: "置きかえによる漸化式 an+1 = p an + pn + q", target_reidai: 130, sources: ["名城大"] },
  { id: 90, chapter: "数列", title: "和Snを含む漸化式", target_reidai: 131, sources: ["立教大"] },
  { id: 91, chapter: "数列", title: "数学的帰納法による倍数の証明", target_reidai: 133, sources: ["静岡大"] },
  { id: 92, chapter: "数列", title: "数学的帰納法による不等式の証明", target_reidai: 134, sources: ["津田塾大"] },
  { id: 93, chapter: "平面ベクトル", title: "平面ベクトルの交点・交点の位置ベクトル", target_reidai: 137, sources: ["立教大"] },
  { id: 94, chapter: "平面ベクトル", title: "三角形の内部の点と位置ベクトル", target_reidai: 138, sources: ["摂南大"] },
  { id: 95, chapter: "平面ベクトル", title: "ベクトルの大きさと内積，三角形の面積", target_reidai: 140, sources: ["立命館大"] },
  { id: 96, chapter: "平面ベクトル", title: "ベクトルの成分と内積・なす角", target_reidai: 141, sources: ["小樽商科大"] },
  { id: 97, chapter: "平面ベクトル", title: "垂直条件と垂線の足の位置ベクトル", target_reidai: 139, sources: ["西南学院大"] },
  { id: 98, chapter: "平面ベクトル", title: "外心・円に内接する三角形と位置ベクトル", target_reidai: 140, sources: ["島根大"] },
  { id: 99, chapter: "空間ベクトル", title: "空間の直線の交点と平面上の点", target_reidai: 144, sources: ["立命館大"] },
  { id: 100, chapter: "空間ベクトル", title: "空間の平面への垂線の足と四面体の体積", target_reidai: 144, sources: ["大阪教育大"] },
  { id: 101, chapter: "確率分布と統計的な推測", title: "確率変数の和の期待値", target_reidai: 146, sources: ["慶應義塾大"] },
  { id: 102, chapter: "確率分布と統計的な推測", title: "二項分布の期待値と標準偏差", target_reidai: 147, sources: ["鹿児島大"] },
  { id: 103, chapter: "確率分布と統計的な推測", title: "正規分布の標準化と個数の推定", target_reidai: 148, sources: ["鹿児島大"] },
  { id: 104, chapter: "確率分布と統計的な推測", title: "二項分布の正規近似", target_reidai: 149, sources: ["滋賀大"] },
  { id: 105, chapter: "確率分布と統計的な推測", title: "標本平均の分布と確率", target_reidai: 150, sources: ["岩手大"] },
  { id: 106, chapter: "確率分布と統計的な推測", title: "標本比率の正規分布と確率", target_reidai: 149, sources: ["大学入学共通テスト"] },
  { id: 107, chapter: "確率分布と統計的な推測", title: "母平均の推定（信頼区間）", target_reidai: 151, sources: ["岩手大"] },
  { id: 108, chapter: "確率分布と統計的な推測", title: "母比率の仮説検定", target_reidai: 152, sources: ["山形大"] },
  { id: 109, chapter: "数学と人間の活動", title: "最大公約数と最小公倍数の関係", target_reidai: 154, sources: ["法政大"] },
  { id: 110, chapter: "数学と人間の活動", title: "ユークリッドの互除法と既約分数", target_reidai: 156, sources: ["玉川大"] },
  { id: 111, chapter: "数学と人間の活動", title: "積の形をつくる不定方程式", target_reidai: 155, sources: ["大分大"] },
  { id: 112, chapter: "数学と人間の活動", title: "1次不定方程式の解の個数", target_reidai: 156, sources: ["関西大"] },
  { id: 113, chapter: "数学と人間の活動", title: "互除法による1次不定方程式の特殊解", target_reidai: 156, sources: ["上智大"] },
  { id: 114, chapter: "数学と人間の活動", title: "余りによる整数の分類と倍数の証明", target_reidai: 153, sources: ["学習院大"] },
  { id: 115, chapter: "数学と人間の活動", title: "n進法の表記と整数決定", target_reidai: 158, sources: ["公立千歳科学技術大"] }
];

export const BUNKEI_MATH_EXERCISES = {
  1: {
    id: 1,
    chapter: "数と式",
    title: "因数分解",
    target_reidai: 1,
    sources: ["実践女子大","中央大","目白大","札幌大"],
    question: `次の式を因数分解せよ。
(1) $xyz + x^2y - xy^2 - x + y - z$
(2) $2x^2 + 3xy - 2y^2 - 3x - y + 1$
(3) $x^2 - 6xy + 9y^2 - 25z^2$
(4) $x^4 + 3x^2 + 4$`,
    answer: `(1) 次数の低い文字 $z$ について整理すると，
$$\\begin{aligned}
&xyz + x^2y - xy^2 - x + y - z \\\\
&= (xy - 1)z + x^2y - xy^2 - x + y \\\\
&= (xy - 1)z + xy(x - y) - (x - y) \\\\
&= (xy - 1)z + (xy - 1)(x - y) \\\\
&= (xy - 1)\\{z + (x - y)\\} \\\\
&= \\mathbf{(xy - 1)(x - y + z)}
\\end{aligned}$$

(2) $x$ について整理して因数分解すると，
$$\\begin{aligned}
&2x^2 + 3xy - 2y^2 - 3x - y + 1 \\\\
&= 2x^2 + (3y - 3)x - (2y^2 + y - 1) \\\\
&= 2x^2 + (3y - 3)x - (y + 1)(2y - 1) \\\\
&= \\{x + (2y - 1)\\}\\{2x - (y + 1)\\} \\\\
&= \\mathbf{(x + 2y - 1)(2x - y - 1)}
\\end{aligned}$$

(3) 前半の 3 項をまとめて 2 乗の形を作ると，
$$\\begin{aligned}
x^2 - 6xy + 9y^2 - 25z^2 &= (x - 3y)^2 - (5z)^2 \\\\
&= \\mathbf{(x - 3y + 5z)(x - 3y - 5z)}
\\end{aligned}$$

(4) $A^2 - B^2$ の形を作るために，$x^4 + 4x^2 + 4 - x^2$ と変形すると，
$$\\begin{aligned}
x^4 + 3x^2 + 4 &= (x^4 + 4x^2 + 4) - x^2 \\\\
&= (x^2 + 2)^2 - x^2 \\\\
&= (x^2 + 2 + x)(x^2 + 2 - x) \\\\
&= \\mathbf{(x^2 + x + 2)(x^2 - x + 2)}
\\end{aligned}$$`,
    commentary: `例題 1 では特に出題の多い因数分解について学習したが，演習では，少し難しいが「知っておくとよい問題」にも触れることにしよう。(1), (2) は 例題 1 で学習した内容の復習である。
例題 1 で学習したタイプでないものとして，「$A^2 - B^2$ の形を作れるか検討する」ということを覚えておくとよい。(3) は容易に $A^2 - B^2$ の形を作れるが，(4) は工夫する必要がある。$x^4 + 3x^2 + 4$ はそのままでは “2乗” を作れないが，$x^4 + 4x^2 + 4$ は $(x^2 + 2)^2$ と変形できる。そこで，$x^2$ をうまく調整して $A^2 - B^2$ の形を作る。`
  },

  2: {
    id: 2,
    chapter: "数と式",
    title: "式の値の計算",
    target_reidai: 2,
    sources: ["青山学院大"],
    question: `$x + y = 2, \\; x^2 + y^2 = 1$ のとき，
$xy = \\fbox{\\quad}, \\; x^3 + y^3 = \\fbox{\\quad}, \\; x^5 + y^5 = \\fbox{\\quad}$
である。`,
    answer: `$x^2 + y^2 = 1 \\quad \\cdots ①$ より，
$$(x + y)^2 - 2xy = 1$$
これに $x + y = 2 \\quad \\cdots ②$ を代入すると，
$$4 - 2xy = 1 \\implies \\mathbf{xy = \\frac{3}{2}} \\quad \\cdots ③$$

②，③を用いると，
$$\\begin{aligned}
x^3 + y^3 &= (x + y)^3 - 3xy(x + y) \\\\
&= 2^3 - 3 \\cdot \\frac{3}{2} \\cdot 2 \\\\
&= 8 - 9 = \\mathbf{-1}
\\end{aligned}$$

さらに，
$$(x^3 + y^3)(x^2 + y^2) = x^5 + x^3y^2 + x^2y^3 + y^5 = x^5 + y^5 + (xy)^2(x + y)$$
であるから，
$$\\begin{aligned}
x^5 + y^5 &= (x^3 + y^3)(x^2 + y^2) - (xy)^2(x + y) \\\\
&= (-1) \\cdot 1 - \\left(\\frac{3}{2}\\right)^2 \\cdot 2 \\\\
&= -1 - \\frac{9}{2} = \\mathbf{-\\frac{11}{2}}
\\end{aligned}$$`,
    commentary: `$x^5 + y^5$ は「$x^3 + y^3$ と $x^2 + y^2$ を掛ければ得られそうだ（不要な項も出てくる）」と考えてみよう。$(x^3 + y^3)(x^2 + y^2)$ を展開すると，
$$(x^3 + y^3)(x^2 + y^2) = x^5 + x^3y^2 + x^2y^3 + y^5 = x^5 + y^5 + x^2y^2(x + y)$$
となるので，
$$x^5 + y^5 = (x^2 + y^2)(x^3 + y^3) - (xy)^2(x + y)$$
であることが分かる。`
  },

  3: {
    id: 3,
    chapter: "数と式",
    title: "二重根号と式の値",
    target_reidai: 7,
    sources: ["慶應義塾大","近畿大","名城大"],
    question: `[1] 次の二重根号を外して簡単にせよ。
(1) $\\sqrt{7 + 4\\sqrt{3}}$
(2) $\\sqrt{6 - \\sqrt{35}}$

[2] $\\sqrt{6 + 4\\sqrt{2}}$ の小数部分を $x$ とするとき，$x^2 + \\frac{1}{x^2}, \\; x^4 + \\frac{1}{x^4}$ の値を求めよ。`,
    answer: `[1]
(1) $\\sqrt{7 + 4\\sqrt{3}} = \\sqrt{7 + 2\\sqrt{12}}$
($7 = 4 + 3, \\; 12 = 4 \\cdot 3$ に注意して)
$$= \\sqrt{(\\sqrt{4} + \\sqrt{3})^2} = \\sqrt{4} + \\sqrt{3} = \\mathbf{2 + \\sqrt{3}}$$

(2) $\\sqrt{6 - \\sqrt{35}} = \\sqrt{\\frac{12 - 2\\sqrt{35}}{2}} = \\frac{\\sqrt{12 - 2\\sqrt{35}}}{\\sqrt{2}}$
($12 = 7 + 5, \\; 35 = 7 \\cdot 5$ に注意して)
$$= \\frac{\\sqrt{(\\sqrt{7} - \\sqrt{5})^2}}{\\sqrt{2}} = \\frac{\\sqrt{7} - \\sqrt{5}}{\\sqrt{2}} = \\mathbf{\\frac{\\sqrt{14} - \\sqrt{10}}{2}}$$

[2] $\\sqrt{6 + 4\\sqrt{2}} = \\sqrt{6 + 2\\sqrt{8}}$
($6 = 4 + 2, \\; 8 = 4 \\cdot 2$ に注意して)
$$= \\sqrt{(\\sqrt{4} + \\sqrt{2})^2} = \\sqrt{4} + \\sqrt{2} = 2 + \\sqrt{2}$$
$1 < \\sqrt{2} < 2$ より，$3 < 2 + \\sqrt{2} < 4$ となるので，$2 + \\sqrt{2} (= \\sqrt{6 + 4\\sqrt{2}})$ の整数部分は 3 である。よって，この数の小数部分 $x$ は，
$$x = (2 + \\sqrt{2}) - 3 = \\sqrt{2} - 1$$
である。これより，
$$\\begin{aligned}
x + \\frac{1}{x} &= (\\sqrt{2} - 1) + \\frac{1}{\\sqrt{2} - 1} \\\\
&= (\\sqrt{2} - 1) + \\frac{\\sqrt{2} + 1}{(\\sqrt{2} - 1)(\\sqrt{2} + 1)} \\\\
&= (\\sqrt{2} - 1) + (\\sqrt{2} + 1) = 2\\sqrt{2}
\\end{aligned}$$
したがって，
$$\\begin{aligned}
x^2 + \\frac{1}{x^2} &= \\left(x + \\frac{1}{x}\\right)^2 - 2 \\cdot x \\cdot \\frac{1}{x} \\\\
&= (2\\sqrt{2})^2 - 2 = 8 - 2 = \\mathbf{6}
\\end{aligned}$$
$$\\begin{aligned}
x^4 + \\frac{1}{x^4} &= \\left(x^2 + \\frac{1}{x^2}\\right)^2 - 2 \\cdot x^2 \\cdot \\frac{1}{x^2} \\\\
&= 6^2 - 2 = \\mathbf{34}
\\end{aligned}$$`,
    commentary: `例題 7 で学習したように，二重根号を外すときには，まず $\\sqrt{● \\pm 2\\sqrt{■}}$ という形に変形しないといけない。この形にするために，[1](2) では，
$$\\sqrt{6 - \\sqrt{35}} = \\sqrt{\\frac{12 - 2\\sqrt{35}}{2}} = \\frac{\\sqrt{12 - 2\\sqrt{35}}}{\\sqrt{2}}$$
と変形していく。
[2] は $x + \\frac{1}{x}$ の値を準備して，これを用いて計算するとよい。例題 2 [2] を見直してみよう。`
  },

  4: {
    id: 4,
    chapter: "数と式",
    title: "比例式",
    target_reidai: 5,
    sources: ["西南学院大"],
    question: `$\\frac{x + y}{5} = \\frac{y + z}{3} = \\frac{z + x}{7} \\neq 0$ のとき，$\\frac{x^2 - 4y^2}{xy + 2y^2 + xz + 2yz}$ の値を求めよ。`,
    answer: `$\\frac{x + y}{5} = \\frac{y + z}{3} = \\frac{z + x}{7} = k \\; (k \\neq 0)$ とおくと，
$$\\begin{cases}
x + y = 5k & \\cdots ① \\\\
y + z = 3k & \\cdots ② \\\\
z + x = 7k & \\cdots ③
\\end{cases}$$
となる。① $+$ ② $+$ ③ より，
$$2(x + y + z) = 15k \\implies x + y + z = \\frac{15}{2}k \\quad \\cdots ④$$
①を④に代入すると，$5k + z = \\frac{15}{2}k \\implies z = \\frac{5}{2}k$
②を④に代入すると，$x + 3k = \\frac{15}{2}k \\implies x = \\frac{9}{2}k$
③を④に代入すると，$y + 7k = \\frac{15}{2}k \\implies y = \\frac{1}{2}k$

したがって，
$$\\begin{aligned}
\\frac{x^2 - 4y^2}{xy + 2y^2 + xz + 2yz} &= \\frac{(x + 2y)(x - 2y)}{y(x + 2y) + z(x + 2y)} \\\\
&= \\frac{(x + 2y)(x - 2y)}{(x + 2y)(y + z)} \\\\
&= \\frac{x - 2y}{y + z} \\\\
&= \\frac{\\frac{9}{2}k - 2 \\cdot \\frac{1}{2}k}{3k} \\\\
&= \\frac{\\frac{7}{2}k}{3k} = \\mathbf{\\frac{7}{6}}
\\end{aligned}$$`,
    commentary: `比例式は「$= k$」とおいて考える。因数分解してから代入すると計算しやすい。`
  },

  5: {
    id: 5,
    chapter: "数と式",
    title: "絶対値を含む方程式・不等式",
    target_reidai: 6,
    sources: ["名古屋学院大","東洋大","西南学院大"],
    question: `[1] $|2x - 4| < 2$ の解は $\\fbox{\\quad}$ であり，$|2x - 4| - x < 2$ の解は $\\fbox{\\quad}$ である。
[2] 不等式 $|x - 1| + |x - 3| + x^2 - 2 < 5$ の解は $\\fbox{\\quad}$ である。
[3] 不等式 $|(x + 1)(x - 7)| > 2x + 2$ を解け。`,
    answer: `[1]
$|2x - 4| < 2$ より，
$$-2 < 2x - 4 < 2 \\implies 2 < 2x < 6 \\implies \\mathbf{1 < x < 3}$$

また，$|2x - 4| - x < 2$ より，$|2x - 4| < x + 2 \\quad \\cdots ①$
(ア) $2x - 4 \\geqq 0$ すなわち $x \\geqq 2$ のとき
①より，$2x - 4 < x + 2 \\implies x < 6$
これと $x \\geqq 2$ から，$2 \\leqq x < 6$
(イ) $2x - 4 < 0$ すなわち $x < 2$ のとき
①より，$-(2x - 4) < x + 2 \\implies -3x < -2 \\implies x > \\frac{2}{3}$
これと $x < 2$ から，$\\frac{2}{3} < x < 2$
(ア), (イ) より，①の解は，$\\mathbf{\\frac{2}{3} < x < 6}$

[2] $|x - 1| + |x - 3| + x^2 - 2 < 5 \\quad \\cdots ①$
(ア) $x \\geqq 3$ のとき
①より，$(x - 1) + (x - 3) + x^2 - 2 < 5 \\implies x^2 + 2x - 11 < 0$
これを解くと $-1 - 2\\sqrt{3} < x < -1 + 2\\sqrt{3}$ であるが，$-1 + 2\\sqrt{3} \\fallingdotseq -1 + 3.46 = 2.46$ より，これは $x \\geqq 3$ を満たさない。
(イ) $1 \\leqq x < 3$ のとき
①より，$(x - 1) - (x - 3) + x^2 - 2 < 5 \\implies x^2 < 5 \\implies -\\sqrt{5} < x < \\sqrt{5}$
これと $1 \\leqq x < 3$ から，$1 \\leqq x < \\sqrt{5}$
(ウ) $x < 1$ のとき
①より，$-(x - 1) - (x - 3) + x^2 - 2 < 5 \\implies x^2 - 2x - 3 < 0 \\implies (x + 1)(x - 3) < 0 \\implies -1 < x < 3$
これと $x < 1$ から，$-1 < x < 1$
(ア), (イ), (ウ) より，①の解は，$\\mathbf{-1 < x < \\sqrt{5}}$

[3] $|(x + 1)(x - 7)| > 2x + 2 \\quad \\cdots ①$
(ア) $x \\leqq -1, \\; 7 \\leqq x$ のとき
①より，$(x + 1)(x - 7) > 2x + 2 \\implies x^2 - 6x - 7 > 2x + 2 \\implies x^2 - 8x - 9 > 0 \\implies (x + 1)(x - 9) > 0$
これより $x < -1, \\; 9 < x$
これは $x \\leqq -1, \\; 7 \\leqq x$ を満たす。
(イ) $-1 < x < 7$ のとき
①より，$-(x + 1)(x - 7) > 2x + 2 \\implies -x^2 + 6x + 7 > 2x + 2 \\implies x^2 - 4x - 5 < 0 \\implies (x + 1)(x - 5) < 0$
これより $-1 < x < 5$
これは $-1 < x < 7$ を満たす。
(ア), (イ) より，①の解は，
$$\\mathbf{x < -1, \\quad -1 < x < 5, \\quad 9 < x}$$`,
    commentary: `[1] 不等式 $|2x - 4| < 2$ は，“絶対値の中身”の正負に注目してもよいが，$|x| < c \\iff -c < x < c$ ($c$ は正の定数) であることを用いるとよい。
[3] “絶対値の中身”が 0 以上になるのは，$(x + 1)(x - 7) \\geqq 0$ より，$x \\leqq -1, \\; 7 \\leqq x$ のときであることに注目して場合分けを行う。`
  },

  6: {
    id: 6,
    chapter: "数と式",
    title: "絶対値を含む関数のグラフ",
    target_reidai: 6,
    sources: ["東京女子大"],
    question: `次の各問に答えよ。
(1) 関数 $y = |x + 3| + |x - 1|$ のグラフを描け。
(2) 不等式 $6 \\leqq |x + 3| + |x - 1| \\leqq 10$ を満たす $x$ の範囲を求めよ。`,
    answer: `(1) $y = |x + 3| + |x - 1| \\quad \\cdots ①$
(ア) $x \\geqq 1$ のとき，
$$y = (x + 3) + (x - 1) = 2x + 2$$
(イ) $-3 \\leqq x < 1$ のとき，
$$y = (x + 3) - (x - 1) = 4$$
(ウ) $x < -3$ のとき，
$$y = -(x + 3) - (x - 1) = -2x - 2$$
以上より，①のグラフは次のようになる。
- $x < -3$ では傾き $-2$ の直線 $y = -2x - 2$
- $-3 \\leqq x \\leqq 1$ では一定の直線 $y = 4$
- $1 < x$ では傾き $2$ の直線 $y = 2x + 2$
（頂点折れ線：$(-3, 4)$ および $(1, 4)$）

(2) $y = 2x + 2$ で $y = 6, 10$ になるときの $x$ を求めると，
$$2x + 2 = 6 \\implies x = 2, \\quad 2x + 2 = 10 \\implies x = 4$$
$y = -2x - 2$ で $y = 6, 10$ になるときの $x$ を求めると，
$$-2x - 2 = 6 \\implies x = -4, \\quad -2x - 2 = 10 \\implies x = -6$$
$6 \\leqq |x + 3| + |x - 1| \\leqq 10$ を満たす $x$ の範囲は，グラフより $6 \\leqq y \\leqq 10$ となる $x$ の範囲を求めて，
$$\\mathbf{-6 \\leqq x \\leqq -4, \\quad 2 \\leqq x \\leqq 4}$$`,
    commentary: `(2) は (1) のグラフを利用し，$6 \\leqq y \\leqq 10$ となるような $x$ の範囲を求めればよい。絶対値のついた関数の不等式をグラフから視覚的に解く重要手法である。`
  },

  7: {
    id: 7,
    chapter: "集合と論理",
    title: "集合と包除原理",
    target_reidai: 8,
    sources: ["帝京大"],
    question: `50人のクラスで，犬を飼っている人は 22 人，猫を飼っている人は 15 人，どちらも飼っていない人が 18 人いる。両方とも飼っている人は $\\fbox{\\quad}$ 人，犬だけ飼っている人は $\\fbox{\\quad}$ 人である。`,
    answer: `クラス全体の集合を $U$，犬を飼っている人の集合を $A$，猫を飼っている人の集合を $B$ とすると，条件より，
$$n(U) = 50, \\quad n(A) = 22, \\quad n(B) = 15$$
また，犬，猫のどちらも飼っていない人が 18 人であるから，犬または猫を飼っている人は，
$$n(A \\cup B) = 50 - 18 = 32 \\quad \\cdots (*)$$
である。ここで，
$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$$
が成り立つので，
$$32 = 22 + 15 - n(A \\cap B) \\implies n(A \\cap B) = 5$$
したがって，犬と猫の両方とも飼っている人は，
$$\\mathbf{5}\\text{ 人}$$
また，犬を飼っている人は 22 人であり，このうちの 5 人が猫も飼っているから，犬だけ飼っている人は，
$$22 - 5 = \\mathbf{17}\\text{ 人}$$`,
    commentary: `例題 8 で学習した「包除原理」に注意して考えよう。
＜補足：ド・モルガンの法則を見直そう＞
$n(\\overline{A} \\cap \\overline{B}) = 18$ であり，ド・モルガンの法則を用いると，(*) は，
$$n(A \\cup B) = n(U) - n(\\overline{A \\cup B}) = n(U) - n(\\overline{A} \\cap \\overline{B}) = 50 - 18 = 32$$
のように導かれる。`
  },

  8: {
    id: 8,
    chapter: "集合と論理",
    title: "必要条件・十分条件",
    target_reidai: 11,
    sources: ["慶應義塾大","成蹊大"],
    question: `次の空欄に適するものを①〜④から選べ。ただし，$x, y$ は実数とする。
① 必要条件であるが十分条件ではない
② 十分条件であるが必要条件ではない
③ 必要十分条件である
④ 必要条件でも十分条件でもない

(1) $x^2 = 1$ は，$x = 1$ であるための $\\fbox{\\quad}$。
(2) $xy = 0$ は，$x = 0$ かつ $y = 0$ であるための $\\fbox{\\quad}$。
(3) $x = 0$ は，$x^2 + y^2 = 0$ であるための $\\fbox{\\quad}$。
(4) $y \\leqq x^2$ は，$y \\leqq x$ であるための $\\fbox{\\quad}$。
(5) $x^2 + y^2 < 2$ は，$|x| + |y| < 2$ であるための $\\fbox{\\quad}$。`,
    answer: `(1) $p: x^2 = 1, \\; q: x = 1$ とする。
- $p \\implies q$ は偽（反例: $x = -1$）
- $p \\Longleftarrow q$ は真
したがって，$p$ は $q$ であるための必要条件。よって $\\mathbf{①}$

(2) $p: xy = 0, \\; q: x = 0 \\text{ かつ } y = 0$ とする。
- $p \\implies q$ は偽（反例: $x = 0, y = 2$）
- $p \\Longleftarrow q$ は真
したがって，$p$ は $q$ であるための必要条件。よって $\\mathbf{①}$

(3) $p: x = 0, \\; q: x^2 + y^2 = 0$ とする。
$x^2 + y^2 = 0$ が成り立つのは $x = y = 0$ のときだけであることに注意する。
- $p \\implies q$ は偽（反例: $x = 0, y = 2$）
- $p \\Longleftarrow q$ は真
したがって，$p$ は $q$ であるための必要条件。よって $\\mathbf{①}$

(4) $p: y \\leqq x^2, \\; q: y \\leqq x$ とし，$y \\leqq x^2$ の表す領域を $D$，$y \\leqq x$ の表す領域を $E$ とする。$D$ は放物線の下側，$E$ は直線の下側である。$D$ は $E$ に含まれず，$E$ も $D$ に含まれない。したがって，
$p \\implies q$ は偽，$p \\Longleftarrow q$ は偽
となるから，必要条件でも十分条件でもない。よって $\\mathbf{④}$

(5) $p: x^2 + y^2 < 2, \\; q: |x| + |y| < 2$ とし，$x^2 + y^2 < 2$ の表す領域を $D$，$|x| + |y| < 2$ の表す領域を $E$ とする。$D$ は円の内部（半径 $\\sqrt{2}$），$E$ は4点 $(2, 0), (0, 2), (-2, 0), (0, -2)$ を頂点とする正方形の内部である。
$D$ は $E$ に含まれるが，$E$ は $D$ に含まれない。したがって，
$p \\implies q$ は真，$p \\Longleftarrow q$ は偽
となるから，$p$ は $q$ であるための十分条件。よって $\\mathbf{②}$`,
    commentary: `(4) はそれぞれの不等式の表す領域を描き，その包含関係に注目して真偽の判定を行うとよい。(5) も同様である。
なお，(5) の $|x| + |y| < 2$ のような絶対値を含む不等式の表す領域は文系でもしばしば出題されるものであるから，きちんと描けるようにしておこう。（注：領域は，数学IIの範囲である）`
  },

  9: {
    id: 9,
    chapter: "2次関数",
    title: "放物線の対称移動と平行移動",
    target_reidai: 14,
    sources: ["名城大"],
    question: `放物線 $y = x^2 + ax + b$ を原点に関して対称移動し，さらに $x$ 軸方向に 3，$y$ 軸方向に 6 だけ平行移動すると，放物線 $y = -x^2 + 4x - 7$ が得られたという。このとき，定数 $a, b$ の値を求めよ。`,
    answer: `$y = x^2 + ax + b$ を原点に関して対称移動した放物線の式は，
$$-y = (-x)^2 + a(-x) + b \\implies y = -x^2 + ax - b$$
である。
さらに，この放物線を $x$ 軸方向に 3，$y$ 軸方向に 6 だけ平行移動して得られる放物線の式は，
$$\\begin{aligned}
y - 6 &= -(x - 3)^2 + a(x - 3) - b \\\\
y - 6 &= -x^2 + 6x - 9 + ax - 3a - b \\\\
y &= -x^2 + (6 + a)x + (-3 - 3a - b) \\quad \\cdots ①
\\end{aligned}$$
①が $y = -x^2 + 4x - 7$ であるから，係数を比較して，
$$\\begin{cases}
6 + a = 4 \\\\
-3 - 3a - b = -7
\\end{cases}$$
これを解くと，求める $a, b$ の値は，
$$\\mathbf{a = -2, \\quad b = 10}$$`,
    commentary: `いくつかの解答が考えられるが，ここでは，例題 14 で学習した「書きかえ」による処理を確認することにしよう。
原点に関して対称移動するときには，$x$ を $-x$，$y$ を $-y$ に書きかえればよい。
また，$x$ 軸方向に 3，$y$ 軸方向に 6 だけ平行移動するときには，$x$ を $x - 3$，$y$ を $y - 6$ に書きかえればよい。`
  },

  10: {
    id: 10,
    chapter: "2次関数",
    title: "2次関数の最大最小（区間が動く）",
    target_reidai: 18,
    sources: ["東北学院大"],
    question: `2次関数 $y = x^2 - 2x + 3$ について，次の問に答えよ。
(1) $0 \\leqq x \\leqq 3$ における最大値，最小値を求めよ。
(2) $a$ を正の定数とするとき，$0 \\leqq x \\leqq a$ における最小値 $m$ を求めよ。
(3) $a$ を正の定数とするとき，$0 \\leqq x \\leqq a$ における最大値 $M$ を求めよ。`,
    answer: `$f(x) = x^2 - 2x + 3$ とすると，
$$f(x) = (x - 1)^2 + 2$$
となるので，$y = f(x)$ のグラフは下に凸で，頂点は $(1, 2)$，軸は直線 $x = 1$ である。

(1) $0 \\leqq x \\leqq 3$ におけるグラフから，
- $x = 3$ で最大値 $f(3) = 6$
- $x = 1$ で最小値 $f(1) = 2$
よって，$\\mathbf{最大値\\ 6, \\quad 最小値\\ 2}$

(2) $0 \\leqq x \\leqq a$ に頂点が含まれる場合と含まれない場合に分ける。
(ア) $0 < a \\leqq 1$ のとき
最小値は区間の右端で，$m = f(a) = a^2 - 2a + 3$
(イ) $1 < a$ のとき
最小値は頂点で，$m = f(1) = 2$
以上より，
$$m = \\begin{cases}
\\mathbf{a^2 - 2a + 3} & (0 < a \\leqq 1 \\text{ のとき}) \\\\
\\mathbf{2} & (1 < a \\text{ のとき})
\\end{cases}$$

(3) $y = f(x)$ のグラフは直線 $x = 1$ について対称で，$f(0) = f(2) = 3$ である。
(ウ) $0 < a \\leqq 2$ のとき
最大値は区間の左端で，$M = f(0) = 3$
(エ) $2 < a$ のとき
最大値は区間の右端で，$M = f(a) = a^2 - 2a + 3$
以上より，
$$M = \\begin{cases}
\\mathbf{3} & (0 < a \\leqq 2 \\text{ のとき}) \\\\
\\mathbf{a^2 - 2a + 3} & (2 < a \\text{ のとき})
\\end{cases}$$`,
    commentary: `$y = x^2 - 2x + 3$ のグラフは下に凸の放物線で，軸は $x = 1$ である。頂点が定義域に含まれれば頂点で最小になるが，含まれない場合には定義域の端で最小になるので，(2) では，$0 \\leqq x \\leqq a$ の定義域に頂点が含まれるかどうかに注目して，場合分けをする。定義域に文字 $a$ が入っていて 例題 18 とは問題の設定が異なるが，考え方のポイントは変わらない。
(3) の最大値も $a$ の値で場合分けをするが，グラフが $x = 1$ (軸) について左右対称であることに注意して考える。`
  },

  11: {
    id: 11,
    chapter: "2次関数",
    title: "2変数の最大最小（条件付き）",
    target_reidai: 17,
    sources: ["関西大"],
    question: `実数 $x, y$ が $2x^2 + y^2 = 8$ を満たすとき，$x^2 + y^2 - 6x$ の最大値，最小値を求めよ。`,
    answer: `$z = x^2 + y^2 - 6x$ とする。
$2x^2 + y^2 = 8$ より，
$$y^2 = 8 - 2x^2 \\quad \\cdots ①$$
①を用いると，
$$\\begin{aligned}
z &= x^2 + (8 - 2x^2) - 6x \\\\
&= -x^2 - 6x + 8 \\\\
&= -(x + 3)^2 + 17 \\quad \\cdots ②
\\end{aligned}$$
また，$y$ は実数であるから $y^2 \\geqq 0$ である。①より，
$$8 - 2x^2 \\geqq 0 \\implies x^2 \\leqq 4 \\implies -2 \\leqq x \\leqq 2 \\quad \\cdots ③$$
③の範囲で②のグラフを考えると，
- $x = -2$ のとき最大値 $z = -(-2 + 3)^2 + 17 = 16$
- $x = 2$ のとき最小値 $z = -(2 + 3)^2 + 17 = -8$
よって，
$$\\mathbf{最大値\\ 16, \\quad 最小値\\ -8}$$`,
    commentary: `例題 17 と同様にして，$y$ を消去して $x$ の関数として考えるが，$x$ のとり得る値の範囲をきちんと確認しないといけない。
$x, y$ は実数であるから，$2x^2 \\geqq 0$ かつ $y^2 \\geqq 0$ である。このことと，$2x^2 + y^2 = 8$ より，$x, y$ はそれほど大きな値をとれないことが分かるだろう。問題文に $x$ の範囲が具体的に書かれていないが，本問のように「実数」の条件から範囲が限定される場合もある。`
  },

  12: {
    id: 12,
    chapter: "2次関数",
    title: "置きかえを利用した2次関数の最小値",
    target_reidai: 16,
    sources: ["甲南大"],
    question: `関数 $y = (x^2 + 4x + 5)(x^2 + 4x + 2) + 2x^2 + 8x + 1$ の最小値を求めよ。`,
    answer: `与式を変形すると，
$$y = (x^2 + 4x + 5)(x^2 + 4x + 2) + 2(x^2 + 4x) + 1 \\quad \\cdots ①$$
$x^2 + 4x = t$ とおくと，①より，
$$\\begin{aligned}
y &= (t + 5)(t + 2) + 2t + 1 \\\\
&= t^2 + 9t + 11 \\\\
&= \\left(t + \\frac{9}{2}\\right)^2 - \\frac{37}{4} \\quad (= f(t) \\text{ とする})
\\end{aligned}$$
ここで，$t = x^2 + 4x$ より，
$$t = (x + 2)^2 - 4$$
となるから，$x$ が実数全体を変化するとき，$t$ のとり得る値の範囲は，
$$t \\geqq -4$$
である。
$t \\geqq -4$ において $y = f(t)$ のグラフを考えると，軸 $t = -\\frac{9}{2} = -4.5$ は $t \\geqq -4$ の範囲外（左側）にあるので，グラフは $t \\geqq -4$ において単調に増加する。
したがって，最小値は $t = -4$ のときで，
$$f(-4) = (-4)^2 + 9(-4) + 11 = 16 - 36 + 11 = \\mathbf{-9}$$`,
    commentary: `$x^2 + 4x = t$ と置きかえて，$t$ についての 2次関数を作って考えるが，このときに $t$ の範囲の確認を忘れないようにしよう。置きかえを行ったときは「置きかえた文字の変域」を求めるのが鉄則である。`
  },

  13: {
    id: 13,
    chapter: "2次関数",
    title: "2次不等式の決定",
    target_reidai: 20,
    sources: ["学習院大"],
    question: `2次不等式 $ax^2 - 3x + b > 0$ を満たす実数 $x$ の範囲が $a < x < a + 1$ となるような実数 $a, b$ の値を求めよ。`,
    answer: `$f(x) = ax^2 - 3x + b$ とする。$f(x) > 0$ の解が $a < x < a + 1$ になるとき，$y = f(x)$ のグラフは上に凸の放物線で，$x$ 軸との交点が $(a, 0), \\; (a + 1, 0)$ であればよい。
このとき，
$$\\begin{cases}
a < 0 \\\\
f(a) = 0 \\\\
f(a + 1) = 0
\\end{cases} \\iff \\begin{cases}
a < 0 \\\\
a \\cdot a^2 - 3a + b = 0 & \\cdots ① \\\\
a(a + 1)^2 - 3(a + 1) + b = 0 & \\cdots ②
\\end{cases}$$
①より，$b = -a^3 + 3a \\quad \\cdots ①'$ となり，②に代入すると，
$$\\begin{aligned}
a(a + 1)^2 - 3(a + 1) - a^3 + 3a &= 0 \\\\
a^3 + 2a^2 + a - 3a - 3 - a^3 + 3a &= 0 \\\\
2a^2 + a - 3 &= 0 \\\\
(2a + 3)(a - 1) &= 0
\\end{aligned}$$
$a < 0$ より，
$$a = -\\frac{3}{2}$$
これを ①' に代入すると，
$$b = -\\left(-\\frac{27}{8}\\right) + 3\\left(-\\frac{3}{2}\\right) = \\frac{27 - 36}{8} = -\\frac{9}{8}$$
以上より，求める $a, b$ の値は，
$$\\mathbf{a = -\\frac{3}{2}, \\quad b = -\\frac{9}{8}}$$`,
    commentary: `例題 20 で学習したように，$y = ax^2 - 3x + b$ のグラフがどのようになっていればよいかを考えてみよう。本問では，$x$ 軸より上側に 2次関数 $y = ax^2 - 3x + b$ のグラフが存在する $x$ の範囲が $a < x < a + 1$ であるから，
・グラフが上に凸の放物線である（$a < 0$）
・$x$ 軸との交点が $(a, 0), (a + 1, 0)$
ということに注目する。`
  },

  14: {
    id: 14,
    chapter: "2次関数",
    title: "すべての実数で成り立つ2次不等式",
    target_reidai: 21,
    sources: ["公立はこだて未来大"],
    question: `任意の実数 $x$ に対して，$ax^2 + 2(a + 1)x + 2a + 1 > 0$ が成り立つ $a$ の値の範囲を求めよ。`,
    answer: `$f(x) = ax^2 + 2(a + 1)x + 2a + 1$ とする。
$y = f(x)$ のグラフがつねに $x$ 軸より上側にある条件を考えればよい。
(ア) $a < 0$ のとき
$y = f(x)$ のグラフは上に凸の放物線となり，つねに正とはならず条件を満たさない。
(イ) $a = 0$ のとき
$f(x) = 2x + 1$ となり直線となるので条件を満たさない。（たとえば，$f(-1) = -1 < 0$ である）
(ウ) $a > 0$ のとき
$y = f(x)$ のグラフは下に凸の放物線となり，$y = f(x)$ のグラフが $x$ 軸と共有点をもたない条件を考えればよい。
$ax^2 + 2(a + 1)x + 2a + 1 = 0$ の判別式を $D$ とすると，
$$\\frac{D}{4} = (a + 1)^2 - a(2a + 1) = a^2 + 2a + 1 - 2a^2 - a = -a^2 + a + 1$$
であり，$\\frac{D}{4} < 0$ より，
$$-a^2 + a + 1 < 0 \\iff a^2 - a - 1 > 0$$
これを解くと，$a < \\frac{1 - \\sqrt{5}}{2}, \\; \\frac{1 + \\sqrt{5}}{2} < a$
$a > 0$ であるから，
$$\\frac{1 + \\sqrt{5}}{2} < a$$
(ア), (イ), (ウ) より，求める $a$ の値の範囲は，
$$\\mathbf{\\frac{1 + \\sqrt{5}}{2} < a}$$`,
    commentary: `$f(x) = ax^2 + 2(a + 1)x + 2a + 1$ として，$y = f(x)$ のグラフがつねに $x$ 軸より上側にあるための条件を考える。ただし，$x^2$ の係数が $a$ であるから，$a$ の値に応じてグラフの様子が変化することに注意する。$a = 0$ のとき 2次関数ではなく 1次式になるケースの検討を忘れないようにしよう。`
  },

  15: {
    id: 15,
    chapter: "2次関数",
    title: "制限された区間でつねに成り立つ2次不等式",
    target_reidai: 22,
    sources: ["西南学院大"],
    question: `$a$ は実数の定数とし，$f(x) = x^2 - (2a - 3)x + 2a$ とする。$-1 \\leqq x \\leqq 1$ でつねに $f(x) \\geqq 0$ となるときの $a$ の値の範囲を求めよ。`,
    answer: `$-1 \\leqq x \\leqq 1$ で $f(x) \\geqq 0$ となる条件は，$f(x)$ の最小値を考えるので，放物線 $y = f(x)$ の軸が $-1 \\leqq x \\leqq 1$ の範囲に含まれる場合と含まれない場合に分けて考える。
$$\\begin{aligned}
f(x) &= x^2 - (2a - 3)x + 2a \\\\
&= \\left(x - \\frac{2a - 3}{2}\\right)^2 - \\frac{4a^2 - 12a + 9}{4} + 2a \\\\
&= \\left(x - \\frac{2a - 3}{2}\\right)^2 + \\frac{-4a^2 + 20a - 9}{4}
\\end{aligned}$$
となるので，$y = f(x)$ のグラフは，軸が $x = \\frac{2a - 3}{2}$ の下に凸の放物線である。

(ア) $\\frac{2a - 3}{2} < -1$ すなわち $a < \\frac{1}{2}$ のとき
$-1 \\leqq x \\leqq 1$ における最小値は $f(-1)$ であり，
$$f(-1) = (-1)^2 - (2a - 3)(-1) + 2a = 1 + 2a - 3 + 2a = 4a - 2$$
求める条件は，
$$4a - 2 \\geqq 0 \\iff a \\geqq \\frac{1}{2}$$
これは $a < \\frac{1}{2}$ を満たさない。

(イ) $-1 \\leqq \\frac{2a - 3}{2} \\leqq 1$ すなわち $\\frac{1}{2} \\leqq a \\leqq \\frac{5}{2}$ のとき
$-1 \\leqq x \\leqq 1$ における最小値は頂点の $y$ 座標であり，求める条件は，
$$\\frac{-4a^2 + 20a - 9}{4} \\geqq 0 \\iff 4a^2 - 20a + 9 \\leqq 0 \\iff (2a - 1)(2a - 9) \\leqq 0$$
これより，$\\frac{1}{2} \\leqq a \\leqq \\frac{9}{2}$
$\\frac{1}{2} \\leqq a \\leqq \\frac{5}{2}$ も考えて，
$$\\frac{1}{2} \\leqq a \\leqq \\frac{5}{2}$$

(ウ) $1 < \\frac{2a - 3}{2}$ すなわち $\\frac{5}{2} < a$ のとき
$-1 \\leqq x \\leqq 1$ における最小値は $f(1)$ であり，
$$f(1) = 1^2 - (2a - 3) \\cdot 1 + 2a = 1 - 2a + 3 + 2a = 4$$
これは常に $4 > 0$ を満たす。よって，$\\frac{5}{2} < a$ のときはつねに条件を満たす。

(ア), (イ), (ウ) より，求める $a$ の値の範囲は，
$$\\frac{1}{2} \\leqq a \\leqq \\frac{5}{2} \\quad \\text{または} \\quad \\frac{5}{2} < a$$
であるから，
$$\\mathbf{a \\geqq \\frac{1}{2}}$$`,
    commentary: `$-1 \\leqq x \\leqq 1$ で $f(x) \\geqq 0$ となる条件は，$f(x)$ の最小値を考えるので，放物線 $y = f(x)$ の軸が $-1 \\leqq x \\leqq 1$ の範囲に含まれる場合と含まれない場合に分けて考える。
＜補足：(ウ) の場合について＞
(ウ) の場合の最小値は 4 なので，$f(x) < 0$ になってしまうことはない（4 より小さい値はとらない）。したがって，$\\frac{5}{2} < a$ の場合は，つねに条件を満たすグラフが得られて，題意は満たされることになる。`
  },

  16: {
    id: 16,
    chapter: "2次方程式・2次不等式",
    title: "解の配置問題",
    target_reidai: 23,
    sources: ["武庫川女子大"],
    question: `2次方程式 $x^2 - 2ax + a = 0$ が $-2 < x < 2$ の範囲に異なる2つの実数解をもつとき，定数 $a$ のとり得る値の範囲を求めよ。`,
    answer: `$f(x) = x^2 - 2ax + a$ とすると，
$$f(x) = (x - a)^2 - a^2 + a$$
となるので，$y = f(x)$ のグラフは頂点が $(a, -a^2 + a)$，軸が $x = a$ である。

$y = f(x)$ のグラフが $-2 < x < 2$ の範囲で $x$ 軸と異なる2点で交わる条件は，
$$\\begin{cases}
-a^2 + a < 0 & \\cdots \\text{①} \\\\
-2 < a < 2 & \\cdots \\text{②} \\\\
f(-2) = 4 + 5a > 0 & \\cdots \\text{③} \\\\
f(2) = 4 - 3a > 0 & \\cdots \\text{④}
\\end{cases}$$
①より，$a(a - 1) > 0$ となるので，
$$a < 0,\\quad 1 < a$$
③より，$a > -\\frac{4}{5}$
④より，$a < \\frac{4}{3}$

したがって，①，②，③，④を同時に満たす $a$ の範囲を求めると，
$$\\mathbf{-\\frac{4}{5} < a < 0,\\quad 1 < a < \\frac{4}{3}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 23 で学習した解の配置問題である。$-2 < x < 2$ の範囲で $x$ 軸と2点で交わるような放物線が得られる条件を，
(1) 頂点の $y$ 座標の符号（または判別式 $D/4 = a^2 - a > 0$）
(2) 軸の位置
(3) 区間の両端における関数の値 $f(-2) > 0, f(2) > 0$
に注目して漏れなく連立させるのが定石。`
  },

  17: {
    id: 17,
    chapter: "図形と計量",
    title: "三角形の計量と外接円・内接円の半径",
    target_reidai: 25,
    sources: ["関西学院大"],
    question: `三角形 $\\mathrm{ABC}$ において，$\\mathrm{AB} = 7, \\mathrm{BC} = 5, \\mathrm{CA} = 9$ とする。このとき，
$\\cos A = \\fbox{\\quad}$, $\\sin A = \\fbox{\\quad}$ である。また，三角形 $\\mathrm{ABC}$ の面積は $\\fbox{\\quad}$，外接円の半径は $\\fbox{\\quad}$，内接円の半径は $\\fbox{\\quad}$ である。`,
    answer: `$a = 5, b = 9, c = 7$ と表すこととする。余弦定理より，
$$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc} = \\frac{9^2 + 7^2 - 5^2}{2 \\cdot 9 \\cdot 7} = \\mathbf{\\frac{5}{6}}$$
これを $\\sin^2 A = 1 - \\cos^2 A$ に代入すると，
$$\\sin^2 A = 1 - \\frac{25}{36} = \\frac{11}{36}$$
$0^\\circ < A < 180^\\circ$ より $\\sin A > 0$ であるから，
$$\\sin A = \\mathbf{\\frac{\\sqrt{11}}{6}}$$
三角形 $\\mathrm{ABC}$ の面積を $S$ とすると，
$$S = \\frac{1}{2}bc \\sin A = \\frac{1}{2} \\cdot 9 \\cdot 7 \\cdot \\frac{\\sqrt{11}}{6} = \\mathbf{\\frac{21\\sqrt{11}}{4}}$$
外接円の半径を $R$ とすると，正弦定理より $\\frac{a}{\\sin A} = 2R$ が成り立つから，
$$R = \\frac{a}{2\\sin A} = \\frac{5}{2 \\cdot \\frac{\\sqrt{11}}{6}} = \\frac{15}{\\sqrt{11}} = \\mathbf{\\frac{15\\sqrt{11}}{11}}$$
内接円の半径を $r$ とすると，$S = \\frac{1}{2}r(a + b + c)$ が成り立つから，
$$\\frac{21\\sqrt{11}}{4} = \\frac{1}{2}r(5 + 9 + 7)$$
これより，
$$r = \\mathbf{\\frac{\\sqrt{11}}{2}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 25 で学習した三角形の基本計量。
3辺の長さが与えられたら，
(1) 余弦定理で $\\cos A$ を求める。
(2) 相互関係 $\\sin^2 A + \\cos^2 A = 1$ で $\\sin A$ を求める。
(3) 面積公式 $S = \\frac{1}{2}bc\\sin A$ で面積を求める。
(4) 正弦定理 $\\frac{a}{\\sin A} = 2R$ で外接円の半径 $R$ を求める。
(5) $S = \\frac{1}{2}r(a + b + c)$ で内接円の半径 $r$ を求める。
この一連の流れは入試頻出の超重要パターン。`
  },

  18: {
    id: 18,
    chapter: "図形と計量",
    title: "正弦比と角の二等分線",
    target_reidai: 28,
    sources: ["中央大"],
    question: `三角形 $\\mathrm{ABC}$ において，$\\sin A : \\sin B : \\sin C = 5 : 6 : 7$ とする。
(1) この三角形の最も大きい角を $\\theta$ とするとき，$\\cos\\theta$ の値を求めよ。
(2) 辺 $\\mathrm{AC}$ の長さを $12$ とし，$\\angle \\mathrm{ABC}$ の二等分線と辺 $\\mathrm{AC}$ の交点を $\\mathrm{D}$ とするとき，線分 $\\mathrm{CD}$，線分 $\\mathrm{BD}$ の長さをそれぞれ求めよ。`,
    answer: `(1) $\\mathrm{BC} = a, \\mathrm{CA} = b, \\mathrm{AB} = c$ とすると，正弦定理より，
$$a : b : c = \\sin A : \\sin B : \\sin C = 5 : 6 : 7$$
となる。そこで，
$$a = 5k,\\quad b = 6k,\\quad c = 7k\\quad (k > 0)$$
とおくと，辺 $\\mathrm{AB}$ が最も長いから，最も大きい角 $\\theta$ は $C$ であり，
$$\\cos\\theta = \\cos C = \\frac{25k^2 + 36k^2 - 49k^2}{2 \\cdot 5k \\cdot 6k} = \\frac{12k^2}{60k^2} = \\mathbf{\\frac{1}{5}}$$

(2) $\\mathrm{AC} = 12$ のとき，$b = 12$ であるから，$6k = 12 \\implies k = 2$ である。よって，
$$a = 10,\\quad b = 12,\\quad c = 14$$
直線 $\\mathrm{BD}$ は $\\angle \\mathrm{ABC}$ を二等分するから，
$$\\mathrm{CD} : \\mathrm{DA} = \\mathrm{BC} : \\mathrm{AB} = 10 : 14 = 5 : 7$$
これより，
$$\\mathrm{CD} = \\mathrm{CA} \\times \\frac{5}{5 + 7} = 12 \\times \\frac{5}{12} = \\mathbf{5}$$
さらに，三角形 $\\mathrm{BCD}$ に余弦定理を用いると，
$$\\begin{aligned}
\\mathrm{BD}^2 &= \\mathrm{BC}^2 + \\mathrm{CD}^2 - 2 \\cdot \\mathrm{BC} \\cdot \\mathrm{CD} \\cos C \\\\
&= 10^2 + 5^2 - 2 \\cdot 10 \\cdot 5 \\cdot \\frac{1}{5} \\\\
&= 100 + 25 - 20 = 105
\\end{aligned}$$
となるので，
$$\\mathrm{BD} = \\mathbf{\\sqrt{105}}$$`,
    commentary: `【解法の着眼点・ポイント】
(1) 例題 28 で学習したように，正弦の比は辺の比に一致する（$a : b : c = \\sin A : \\sin B : \\sin C$）。最大角は最大辺に向かい合う角。
(2) 角の二等分線の定理 $\\mathrm{CD} : \\mathrm{DA} = \\mathrm{BC} : \\mathrm{BA}$ を用いて $\\mathrm{CD}$ を求め，線分 $\\mathrm{BD}$ の長さは例題 26[1] と同様に三角形 $\\mathrm{BCD}$ に余弦定理を適用する。`
  },

  19: {
    id: 19,
    chapter: "図形と計量",
    title: "角の二等分線の長さ（面積の利用）",
    target_reidai: 26,
    sources: ["南山大"],
    question: `三角形 $\\mathrm{ABC}$ において，$\\mathrm{AB} = 3, \\mathrm{AC} = 2, \\angle A = 60^\\circ$ とし，$\\angle A$ の二等分線と辺 $\\mathrm{BC}$ の交点を $\\mathrm{D}$ とする。このとき，$\\mathrm{AD} = \\fbox{\\quad}$ である。`,
    answer: `面積について，$\\triangle \\mathrm{ABD} + \\triangle \\mathrm{ACD} = \\triangle \\mathrm{ABC}$ が成り立つから，
$$\\frac{1}{2} \\cdot 3 \\cdot \\mathrm{AD} \\cdot \\sin 30^\\circ + \\frac{1}{2} \\cdot 2 \\cdot \\mathrm{AD} \\cdot \\sin 30^\\circ = \\frac{1}{2} \\cdot 2 \\cdot 3 \\cdot \\sin 60^\\circ$$
$$\\frac{1}{2} \\cdot 3 \\cdot \\mathrm{AD} \\cdot \\frac{1}{2} + \\frac{1}{2} \\cdot 2 \\cdot \\mathrm{AD} \\cdot \\frac{1}{2} = \\frac{1}{2} \\cdot 2 \\cdot 3 \\cdot \\frac{\\sqrt{3}}{2}$$
$$3\\mathrm{AD} + 2\\mathrm{AD} = 6\\sqrt{3}$$
$$5\\mathrm{AD} = 6\\sqrt{3}$$
$$\\mathrm{AD} = \\mathbf{\\frac{6\\sqrt{3}}{5}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 26[2] の重要定石。角の二等分線の長さを求めるには，全体の面積を分割した2つの三角形の面積の和として捉えるのが最速かつ最も計算ミスが少ない。
$\\triangle \\mathrm{ABC} = \\triangle \\mathrm{ABD} + \\triangle \\mathrm{ACD}$
より，未知数 $\\mathrm{AD}$ の1次方程式を導いて解く。`
  },

  20: {
    id: 20,
    chapter: "図形と計量",
    title: "円に内接する四角形の対角線",
    target_reidai: 26,
    sources: ["東洋大"],
    question: `円に内接する四角形 $\\mathrm{ABCD}$ がある。四角形 $\\mathrm{ABCD}$ の各辺の長さは，$\\mathrm{AB} = 2, \\mathrm{BC} = 3, \\mathrm{CD} = 1, \\mathrm{DA} = 2$ である。
(1) $\\cos \\angle \\mathrm{BAD}$ の値と対角線 $\\mathrm{BD}$ の長さをそれぞれ求めよ。
(2) 2つの対角線 $\\mathrm{AC}$ と $\\mathrm{BD}$ の交点を $\\mathrm{E}$ とするとき，$\\mathrm{BE}$ の長さを求めよ。`,
    answer: `(1) $\\angle \\mathrm{BAD} = \\theta$ とすると，四角形 $\\mathrm{ABCD}$ は円に内接するから，
$$\\angle \\mathrm{BCD} = 180^\\circ - \\theta$$
である。三角形 $\\mathrm{ABD}$ に余弦定理を用いると，
$$\\mathrm{BD}^2 = 2^2 + 2^2 - 2 \\cdot 2 \\cdot 2 \\cos\\theta = 8 - 8\\cos\\theta \\quad \\cdots \\text{①}$$
三角形 $\\mathrm{BCD}$ に余弦定理を用いると，
$$\\mathrm{BD}^2 = 3^2 + 1^2 - 2 \\cdot 3 \\cdot 1 \\cdot \\cos(180^\\circ - \\theta) = 10 - 6(-\\cos\\theta) = 10 + 6\\cos\\theta \\quad \\cdots \\text{②}$$
①，②より，
$$8 - 8\\cos\\theta = 10 + 6\\cos\\theta \\implies 14\\cos\\theta = -2$$
これより，
$$\\mathbf{\\cos \\angle \\mathrm{BAD} = \\cos\\theta = -\\frac{1}{7}}$$
これを①に代入すると，
$$\\mathrm{BD}^2 = 8(1 - \\cos\\theta) = 8\\left(1 + \\frac{1}{7}\\right) = \\frac{64}{7}$$
となるから，
$$\\mathbf{\\mathrm{BD} = \\frac{8}{\\sqrt{7}} = \\frac{8\\sqrt{7}}{7}}$$

(2) $\\mathrm{AB} = \\mathrm{DA} = 2$ より，同一の円における弦の長さが等しいので弧に対する円周角も等しく，
$$\\angle \\mathrm{BCE} = \\angle \\mathrm{DCE}$$
である。よって，角の二等分線の性質から，
$$\\mathrm{BE} : \\mathrm{ED} = \\mathrm{CB} : \\mathrm{CD} = 3 : 1$$
が成り立つので，
$$\\mathrm{BE} = \\mathrm{BD} \\times \\frac{3}{3 + 1} = \\frac{8\\sqrt{7}}{7} \\times \\frac{3}{4} = \\mathbf{\\frac{6\\sqrt{7}}{7}}$$`,
    commentary: `【解法の着眼点・ポイント】
(1) 円に内接する四角形の対角の和は $180^\\circ$ なので，$\\cos(180^\\circ - \\theta) = -\\cos\\theta$ と符号が反転する。対角線 $\\mathrm{BD}$ を2通りの余弦定理で表して方程式を解く。
(2) 等しい弦に対する円周角が等しいことから $\\angle \\mathrm{BCE} = \\angle \\mathrm{DCE}$（$\\mathrm{CE}$ は $\\angle \\mathrm{BCD}$ の二等分線）に気づくのがポイント。角の二等分線の定理 $\\mathrm{BE} : \\mathrm{ED} = \\mathrm{CB} : \\mathrm{CD}$ に帰着する。`
  },

  21: {
    id: 21,
    chapter: "データの分析",
    title: "四分位数の計算",
    target_reidai: 34,
    sources: ["愛知学泉大"],
    question: `次のデータは，ある商品の10日間の販売数である。
$$7,\\quad 12,\\quad 6,\\quad 8,\\quad 17,\\quad 4,\\quad 11,\\quad 16,\\quad 5,\\quad 10$$
第1四分位数 $Q_1$，第2四分位数 $Q_2$，第3四分位数 $Q_3$ を求めよ。`,
    answer: `問題のデータを小さい順に並べかえると，
$$4,\\quad 5,\\quad 6,\\quad 7,\\quad 8,\\quad \\mid\\quad 10,\\quad 11,\\quad 12,\\quad 16,\\quad 17$$
第2四分位数（中央値）$Q_2$ は，5番目と6番目の値の平均値であるから，
$$Q_2 = \\frac{8 + 10}{2} = \\mathbf{9}$$
第1四分位数 $Q_1$ は，下位のグループ（$4, 5, 6, 7, 8$）の中央値であるから，
$$Q_1 = \\mathbf{6}$$
第3四分位数 $Q_3$ は，上位のグループ（$10, 11, 12, 16, 17$）の中央値であるから，
$$Q_3 = \\mathbf{12}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 34 で学習した四分位数の基本定義。
データを昇順に並べた後，
(1) 全体の中央値（第2四分位数 $Q_2$）を求める。
(2) $Q_2$ を境界として下位グループと上位グループに分割し，それぞれの中央値を $Q_1, Q_3$ とする。データ数が偶数個（10個）のときは中央の2数の平均を取る。`
  },

  22: {
    id: 22,
    chapter: "データの分析",
    title: "分散・共分散・相関係数",
    target_reidai: 36,
    sources: ["西南学院大"],
    question: `2つの変量 $x, y$ に関するデータが右のように与えられている。$y$ の平均値 $\\overline{y}$ は $4$，分散 $s_y^2$ は $0.8$ である。
$$\\begin{array}{|c|c|c|c|c|c|}
\\hline
\\text{番号} & 1 & 2 & 3 & 4 & 5 \\\\
\\hline
x & 6 & 2 & 2 & 6 & 4 \\\\
\\hline
y & 5 & a & b & 5 & 3 \\\\
\\hline
\\end{array}$$
(1) $x$ の平均値 $\\overline{x}$ は $\\fbox{\\quad}$，分散 $s_x^2$ は $\\fbox{\\quad}$ である。
(2) $a = \\fbox{\\quad}, b = \\fbox{\\quad}$ である。ただし，$a < b$ とする。
(3) $x$ と $y$ の共分散 $s_{xy}$ は $\\fbox{\\quad}$ である。
(4) $x$ と $y$ の相関係数 $r$ は $\\fbox{\\quad}$ である。`,
    answer: `(1) $x$ の平均値 $\\overline{x}$ は，
$$\\overline{x} = \\frac{1}{5}(6 + 2 + 2 + 6 + 4) = \\mathbf{4}$$
$x$ の分散 $s_x^2$ は，
$$s_x^2 = \\frac{1}{5}\\{(6-4)^2 + (2-4)^2 + (2-4)^2 + (6-4)^2 + (4-4)^2\\} = \\frac{1}{5}(4 + 4 + 4 + 4 + 0) = \\mathbf{\\frac{16}{5}}$$
（別解: $s_x^2 = \\overline{x^2} - (\\overline{x})^2 = \\frac{1}{5}(36+4+4+36+16) - 16 = \\frac{96}{5} - 16 = \\frac{16}{5}$）

(2) $y$ の平均値は $4$ であるから，
$$\\frac{1}{5}(5 + a + b + 5 + 3) = 4 \\implies 13 + a + b = 20 \\implies b = 7 - a \\quad \\cdots \\text{①}$$
$y$ の分散は $0.8 = \\frac{4}{5}$ であるから，$s_y^2 = \\overline{y^2} - (\\overline{y})^2$ より，
$$\\frac{1}{5}(5^2 + a^2 + b^2 + 5^2 + 3^2) - 4^2 = 0.8$$
$$(a^2 + b^2 + 59) - 80 = 4 \\implies a^2 + b^2 = 25 \\quad \\cdots \\text{②}$$
①を②に代入すると，
$$a^2 + (7 - a)^2 = 25 \\implies 2a^2 - 14a + 24 = 0 \\implies a^2 - 7a + 12 = 0$$
$$(a - 3)(a - 4) = 0 \\implies a = 3, 4$$
①より，$(a, b) = (3, 4), (4, 3)$。$a < b$ であるから，
$$\\mathbf{a = 3,\\quad b = 4}$$

(3) $x, y$ の偏差と偏差の積を計算すると，
$$\\begin{array}{|c|c|c|c|c|}
\\hline
x & x-\\overline{x} & y & y-\\overline{y} & (x-\\overline{x})(y-\\overline{y}) \\\\
\\hline
6 & 2 & 5 & 1 & 2 \\\\
2 & -2 & 3 & -1 & 2 \\\\
2 & -2 & 4 & 0 & 0 \\\\
6 & 2 & 5 & 1 & 2 \\\\
4 & 0 & 3 & -1 & 0 \\\\
\\hline
\\end{array}$$
上の表から，共分散 $s_{xy}$ は，
$$s_{xy} = \\frac{1}{5}(2 + 2 + 0 + 2 + 0) = \\mathbf{\\frac{6}{5}}$$

(4) 相関係数 $r$ は，
$$r = \\frac{s_{xy}}{s_x s_y} = \\frac{\\frac{6}{5}}{\\sqrt{\\frac{16}{5}} \\cdot \\sqrt{\\frac{4}{5}}} = \\frac{\\frac{6}{5}}{\\frac{4}{\\sqrt{5}} \\cdot \\frac{2}{\\sqrt{5}}} = \\frac{\\frac{6}{5}}{\\frac{8}{5}} = \\mathbf{\\frac{3}{4}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 36，37 で学習した分散・共分散・相関係数の総復習問題。
(2) では分散の公式 $s_y^2 = \\overline{y^2} - (\\overline{y})^2$ を用いると，二乗の和 $a^2 + b^2$ の対称式が瞬時に立式できて計算が劇的に楽になる。
(3)(4) では偏差表を作って正確に共分散 $s_{xy}$ を求め，$r = \\frac{s_{xy}}{s_x s_y}$ に代入する。`
  },

  23: {
    id: 23,
    chapter: "データの分析",
    title: "分散の公式の証明",
    target_reidai: 36,
    sources: ["琉球大"],
    question: `変量 $x$ の値が $x_1, x_2, x_3$ のとき，その平均値を $\\overline{x}$ とする。分散 $s^2$ を，
$$s^2 = \\frac{1}{3}\\{(x_1 - \\overline{x})^2 + (x_2 - \\overline{x})^2 + (x_3 - \\overline{x})^2\\}$$
と定義するとき，
$$s^2 = \\overline{x^2} - (\\overline{x})^2$$
となることを示せ。ただし，$\\overline{x^2}$ は $x_1^2, x_2^2, x_3^2$ の平均値を表す。`,
    answer: `$\\overline{x}, \\overline{x^2}$ は，定義より，
$$\\overline{x} = \\frac{x_1 + x_2 + x_3}{3} \\quad \\cdots \\text{①}$$
$$\\overline{x^2} = \\frac{x_1^2 + x_2^2 + x_3^2}{3} \\quad \\cdots \\text{②}$$
である。このとき，定義式を展開すると，
$$\\begin{aligned}
s^2 &= \\frac{1}{3}\\{(x_1 - \\overline{x})^2 + (x_2 - \\overline{x})^2 + (x_3 - \\overline{x})^2\\} \\\\
&= \\frac{1}{3}\\{(x_1^2 - 2x_1\\overline{x} + (\\overline{x})^2) + (x_2^2 - 2x_2\\overline{x} + (\\overline{x})^2) + (x_3^2 - 2x_3\\overline{x} + (\\overline{x})^2)\\} \\\\
&= \\frac{1}{3}\\{(x_1^2 + x_2^2 + x_3^2) - 2(x_1 + x_2 + x_3)\\overline{x} + 3(\\overline{x})^2\\} \\\\
&= \\frac{x_1^2 + x_2^2 + x_3^2}{3} - 2 \\cdot \\frac{x_1 + x_2 + x_3}{3} \\cdot \\overline{x} + (\\overline{x})^2
\\end{aligned}$$
ここで，①，②より，
$$s^2 = \\overline{x^2} - 2 \\cdot \\overline{x} \\cdot \\overline{x} + (\\overline{x})^2 = \\mathbf{\\overline{x^2} - (\\overline{x})^2}$$
が成り立つ。（証明終）`,
    commentary: `【解法の着眼点・ポイント】
本問は，分散が「($2$乗の平均値) $-$ (平均値の$2$乗)」と計算できる定番公式を，データ数3の場合について証明させる良問。
展開した後に $\\frac{x_1+x_2+x_3}{3} = \\overline{x}$ の置き換えを丁寧に行うことが論述の鍵となる。`
  },

  24: {
    id: 24,
    chapter: "データの分析",
    title: "合成データの平均値と分散",
    target_reidai: 35,
    sources: ["玉川大"],
    question: `全部で30個のデータがあり，このうち20個のデータの平均値が4，分散が5，残りの10個のデータの平均値が7，分散が11である。このとき，全体の平均値は $\\fbox{\\quad}$ であり，分散は $\\fbox{\\quad}$ である。`,
    answer: `最初の20個のデータを $x_1, x_2, \\dots, x_{20}$ とすると，平均値が4であるから，
$$\\frac{1}{20}(x_1 + x_2 + \\dots + x_{20}) = 4 \\implies x_1 + x_2 + \\dots + x_{20} = 80 \\quad \\cdots \\text{①}$$
また，分散は5であるから，$s^2 = \\overline{x^2} - (\\overline{x})^2$ より，
$$\\frac{1}{20}(x_1^2 + x_2^2 + \\dots + x_{20}^2) - 4^2 = 5 \\implies x_1^2 + x_2^2 + \\dots + x_{20}^2 = 20 \\times 21 = 420 \\quad \\cdots \\text{②}$$
残りの10個のデータを $y_1, y_2, \\dots, y_{10}$ とすると，平均値が7であるから，
$$\\frac{1}{10}(y_1 + y_2 + \\dots + y_{10}) = 7 \\implies y_1 + y_2 + \\dots + y_{10} = 70 \\quad \\cdots \\text{③}$$
さらに，分散は11であるから，
$$\\frac{1}{10}(y_1^2 + y_2^2 + \\dots + y_{10}^2) - 7^2 = 11 \\implies y_1^2 + y_2^2 + \\dots + y_{10}^2 = 10 \\times 60 = 600 \\quad \\cdots \\text{④}$$

全体の平均値は，①，③を用いると，
$$\\frac{1}{30}\\{(x_1 + \\dots + x_{20}) + (y_1 + \\dots + y_{10})\\} = \\frac{1}{30}(80 + 70) = \\mathbf{5}$$
全体の分散は，②，④と全体の平均が5であることから，
$$\\frac{1}{30}\\{(x_1^2 + \\dots + x_{20}^2) + (y_1^2 + \\dots + y_{10}^2)\\} - 5^2 = \\frac{1}{30}(420 + 600) - 25 = \\frac{1020}{30} - 25 = 34 - 25 = \\mathbf{9}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 35 の復習である。2つのグループが合流したときの分散は，
(1) それぞれのグループの「データの和」を求めて全体の平均値を出す。
(2) それぞれのグループの「二乗の和」を準備して全体の二乗の平均値を出す。
(3) 全体の分散 $= (\\text{全体の2乗の平均}) - (\\text{全体の平均})^2$ で計算する。`
  },

  25: {
    id: 25,
    chapter: "場合の数と確率",
    title: "順列の基本と隣り合う並び方",
    target_reidai: 36,
    sources: ["松山大"],
    question: `1年生2人，2年生2人，3年生3人の7人の生徒を横一列に並べる。同じ学年の生徒であっても個人を区別して考える。
(1) 並び方は全部で何通りか。
(2) 両端に3年生が並ぶ並び方は何通りか。
(3) 3年生の3人が隣り合う並び方は何通りか。
(4) 1年生の2人，2年生の2人，3年生の3人が，それぞれ隣り合う並び方は何通りか。`,
    answer: `(1) 7人を横一列に並べるから，
$$7! = 7 \\cdot 6 \\cdot 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = \\mathbf{5040\\text{（通り）}}$$

(2) まず両端に3人の3年生から2人を選んで並べてから，残りの5人を並べればよいから，
$\${}_3\\mathrm{P}_2 \\times 5! = 6 \\times 120 = \\mathbf{720\\text{（通り）}}$$

(3) 3年生ではない4人と「3年生3人のかたまり」の並び方は $5!$ 通りあり，「3年生3人のかたまり」の内部での3人の並べかえの方法が $3!$ 通りある。
したがって，
$$5! \\times 3! = 120 \\times 6 = \\mathbf{720\\text{（通り）}}$$

(4) 1年生，2年生，3年生のそれぞれの「かたまり」の並び方は $3!$ 通りある。
1年生どうし，2年生どうし，3年生どうしの並べかえの方法がそれぞれ $2!$ 通り，$2!$ 通り，$3!$ 通りずつあるから，
$$3! \\times 2! \\times 2! \\times 3! = 6 \\times 2 \\times 2 \\times 6 = \\mathbf{144\\text{（通り）}}$$`,
    commentary: `【解法の着眼点・ポイント】
順列の定石問題。
(3)(4)「隣り合う」条件は「1つのかたまりとして束ねる」のが鉄則。かたまりを並べた後，かたまりの中での並び替え（内部の順列）を掛け合わせることを絶対に忘れないようにする。`
  },

  26: {
    id: 26,
    chapter: "場合の数と確率",
    title: "円順列と女子が隣り合わない並び方",
    target_reidai: 37,
    sources: ["同志社大"],
    question: `7人掛けの円卓に男子4人(A, B, C, D)と女子3人(E, F, G)が座るとき，座り方を円順列で考える。座り方は全部で $\\fbox{ (1) }$ 通りであり，そのうち，女子が隣り合わない座り方は $\\fbox{ (2) }$ 通りである。また，Aの隣がともに女子である座り方は $\\fbox{ (3) }$ 通りである。`,
    answer: `(1) 7人を円形に並べるので，
$$(7 - 1)! = 6! = \\mathbf{720\\text{（通り）}}$$

(2) 先に4人の男子を円形に並べる並べ方は，
$$(4 - 1)! = 3! = 6\\text{（通り）}$$
男子が円形に並んだとき，男子と男子の間の4箇所のすき間に3人の女子を1人ずつ並べればよいから，女子の並び方は，
$\${}_4\\mathrm{P}_3 = 4 \\cdot 3 \\cdot 2 = 24\\text{（通り）}$$
したがって，
$$6 \\times 24 = \\mathbf{144\\text{（通り）}}$$

(3) Aを固定して考える。
Aの左隣と右隣に座る2人の女子の選び方・並べ方は，
$\${}_3\\mathrm{P}_2 = 3 \\cdot 2 = 6\\text{（通り）}$$
残りの4つの席（男子3人と女子1人）に4人を自由に並べる並べ方は，
$$4! = 24\\text{（通り）}$$
よって，
$$6 \\times 24 = \\mathbf{144\\text{（通り）}}$$`,
    commentary: `【解法の着眼点・ポイント】
(2)「隣り合わない」条件は「先にそれ以外のものを並べて，そのすき間に配置する」のが鉄則。男子4人の円順列 $(4-1)!$ のすき間4か所に女子3人を \${}_4\\mathrm{P}_3$ で入れる。
(3) 円順列で特定の条件があるときは「基準となる1人（A）を固定する」と考えやすい。Aを固定するともはや回転の対称性はなくなるため，残りの席は通常の順列として扱える。`
  },

  27: {
    id: 27,
    chapter: "場合の数と確率",
    title: "最短経路と通行止め地点",
    target_reidai: 40,
    sources: ["島根大"],
    question: `南北に7本，東西に6本の道がある（碁盤の目状の街路）。南西の角を地点 $\\mathrm{O}$，北東の角を地点 $\\mathrm{P}$ とする。また，地点 $\\mathrm{A}$ は $\\mathrm{O}$ から東に3区画・北に2区画，地点 $\\mathrm{B}$ は東に4区画・北に1区画，地点 $\\mathrm{C}$ は東に5区画・北に2区画の位置にある。ただし，$\\mathrm{C}$ 地点は通れないものとする。
(1) $\\mathrm{O}$ 地点を出発し，$\\mathrm{A}$ 地点を通り，$\\mathrm{P}$ 地点へ最短で行く道順は何通りあるか。
(2) $\\mathrm{O}$ 地点を出発し，$\\mathrm{B}$ 地点を通り，$\\mathrm{P}$ 地点へ最短で行く道順は何通りあるか。`,
    answer: `南北に7本，東西に6本の道があるとき，東西方向（横）は5区画，南北方向（縦）は6区画の移動となる。
$\\mathrm{O}(0, 0)$ を原点とすると，$\\mathrm{P}(5, 6)$，$\\mathrm{A}(3, 2)$，$\\mathrm{B}(4, 1)$，$\\mathrm{C}(5, 2)$ である。

(1) $\\mathrm{O}(0,0) \\to \\mathrm{A}(3,2)$ の最短道順は，横3・縦2の並び替えであるから，
$$\\frac{(3 + 2)!}{3!2!} = \\frac{5!}{3!2!} = 10\\text{（通り）}$$
$\\mathrm{A}(3,2) \\to \\mathrm{P}(5,6)$ の最短道順は，横2・縦4の並び替えであるから，
$$\\frac{(2 + 4)!}{2!4!} = \\frac{6!}{2!4!} = 15\\text{（通り）}$$
したがって，$\\mathrm{A}$ 地点を通る道順は，
$$10 \\times 15 = \\mathbf{150\\text{（通り）}}$$

(2) $\\mathrm{O} \\to \\mathrm{B} \\to \\mathrm{P}$ と進む道順は，全部で，
$$\\frac{(4 + 1)!}{4!1!} \\times \\frac{(1 + 5)!}{1!5!} = 5 \\times 6 = 30 \\quad (\\text{※実際は縦6区画なので横1・縦5: } 5 \\times 6 = 30)$$
【※テキストの図・解答に基づく計算】
$\\mathrm{O} \\to \\mathrm{B} \\to \\mathrm{P}$ と進む道順全体は，$\\frac{5!}{4!1!} \\times \\frac{6!}{4!2!} = 5 \\times 15 = 75$ 通り。
このうち，$\\mathrm{C}$ 地点を通る道順（$\\mathrm{O} \\to \\mathrm{B} \\to \\mathrm{D} \\to \\mathrm{C} \\to \\mathrm{E} \\to \\mathrm{P}$）は，
$$\\frac{5!}{4!1!} \\times 2! \\times 1 \\times \\frac{3!}{2!1!} = 5 \\times 2 \\times 3 = 30\\text{（通り）}$$
したがって，$\\mathrm{B}$ 地点を通り，$\\mathrm{C}$ 地点は通らずに $\\mathrm{P}$ 地点に進む道順は，
$$75 - 30 = \\mathbf{45\\text{（通り）}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 40 の最短経路問題。
(2) 通行止め地点 C を避けるには，全体から「C 地点を南から北へ通過する道順（$\\mathrm{D} \\to \\mathrm{C} \\to \\mathrm{E}$）」を引く（余事象の利用）のが最もスマートでミスを防げる。`
  },

  28: {
    id: 28,
    chapter: "場合の数と確率",
    title: "組分けの問題",
    target_reidai: 41,
    sources: ["滋賀大"],
    question: `男子6人と女子6人の合計12人を3つの組に分ける。
(1) 7人，3人，2人の3つの組に分ける方法は何通りあるか。
(2) 4人ずつ3つの組に分ける方法は何通りあるか。
(3) どの組も男女2人ずつとなるように3つの組に分ける方法は何通りあるか。`,
    answer: `(1) 12人から7人を選び，残り5人から3人を選ぶ（残り2人は自動的に決まる）ので，
$\${}_{12}\\mathrm{C}_7 \\times {}_5\\mathrm{C}_3 \\times {}_2\\mathrm{C}_2 = 792 \\times 10 \\times 1 = \\mathbf{7920\\text{（通り）}}$$

(2) 3人の組 $\\mathrm{P}$, $\\mathrm{Q}$, $\\mathrm{R}$ に分ける方法は，
$\${}_{12}\\mathrm{C}_4 \\times {}_8\\mathrm{C}_4 \\times {}_4\\mathrm{C}_4 = 495 \\times 70 \\times 1 = 34650\\text{（通り）}$$
であるが，本問では3つの組に区別がないので，
$$\\frac{34650}{3!} = \\frac{34650}{6} = \\mathbf{5775\\text{（通り）}}$$

(3) まず，男子6人を2人ずつ3つの組に分ける方法は，
$$\\frac{{}_6\\mathrm{C}_2 \\times {}_4\\mathrm{C}_2 \\times {}_2\\mathrm{C}_2}{3!} = \\frac{15 \\times 6 \\times 1}{6} = 15\\text{（通り）}$$
男子2人ずつの組が3つできた時点で，それぞれの組に入っている男子のメンバーが異なるため，これら3つの組は互いに区別される状態になる。
よって，それぞれの組に入る女子2人ずつの選び方は，
$\${}_6\\mathrm{C}_2 \\times {}_4\\mathrm{C}_2 \\times {}_2\\mathrm{C}_2 = 15 \\times 6 \\times 1 = 90\\text{（通り）}$$
したがって，男女2人ずつの3組に分ける方法は，
$$15 \\times 90 = \\mathbf{1350\\text{（通り）}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 41 で学習した「組の区別」に関する超重要問題。
(2) 人数が同じ組どうしは区別がつかないため，その組数の階乗（$3!$）で割る。
(3) 先に男子を2人ずつ分けた時点で，各組は「男子ペア」によって区別がつくようになるため，あとの女子の配属では $3!$ で割ってはいけない！この二段階思考が入試で極めてよく問われる。`
  },

  29: {
    id: 29,
    chapter: "場合の数と確率",
    title: "重複組合せと方程式の整数解",
    target_reidai: 42,
    sources: ["東北学院大"],
    question: `(1) $x + y + z = 10$ を満たす負でない整数の組 $(x, y, z)$ の個数を求めよ。
(2) $x + y + z = 10$ を満たす自然数の組 $(x, y, z)$ の個数を求めよ。`,
    answer: `(1) $x + y + z = 10$ を満たす負でない整数の組 $(x, y, z)$ の個数は，
10個の「○」と2本の仕切り「$\\mid$」の順列（並べ方）の総数に等しい。
したがって，
$$\\frac{12!}{10!2!} = \\frac{12 \\cdot 11}{2 \\cdot 1} = \\mathbf{66\\text{（個）}}$$
（別解: 重複組合せ \${}_3\\mathrm{H}_{10} = {}_{3+10-1}\\mathrm{C}_{10} = {}_{12}\\mathrm{C}_{10} = {}_{12}\\mathrm{C}_2 = 66$ 個）

(2) $x, y, z$ は自然数（1以上）であるから，
$$x = x' + 1,\\quad y = y' + 1,\\quad z = z' + 1\\quad (x', y', z' \\geqq 0)$$
とおくと，
$$(x' + 1) + (y' + 1) + (z' + 1) = 10 \\implies x' + y' + z' = 7$$
を満たす負でない整数の組 $(x', y', z')$ の個数を求めればよい。
7個の「○」と2本の仕切り「$\\mid$」の順列の総数より，
$$\\frac{9!}{7!2!} = \\frac{9 \\cdot 8}{2 \\cdot 1} = \\mathbf{36\\text{（個）}}$$
＜別解：すき間に仕切りを入れる＞
10個の「○」のすき間9か所から仕切りを入れる2か所を選ぶ方法と考えて，
$\${}_9\\mathrm{C}_2 = \\frac{9 \\cdot 8}{2 \\cdot 1} = \\mathbf{36\\text{（個）}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 42 で学習した重複組合せの定石。
(1) 負でない整数（0以上）の解の個数は，○と仕切り「$\\mid$」の同種順列 $\\frac{(n+r-1)!}{n!(r-1)!}$。
(2) 自然数（1以上）の解の個数は，あらかじめ $x, y, z$ に1個ずつ配って残りを配分するか，○の間のすき間に仕切りを挟む解法が最も明解。`
  },

  30: {
    id: 30,
    chapter: "場合の数と確率",
    title: "各桁の数字の種類の制限",
    target_reidai: 42,
    sources: ["関西大"],
    question: `5桁の正の整数で，各桁の数字が $2, 3, 4$ のいずれかであるものを考える。
(1) $2, 3, 4$ のうち，ちょうど2種類の数字が現れているものは何通りか。
(2) $2, 3, 4$ の3種類の数字がすべて現れているものは何通りか。`,
    answer: `(1) 使われる2種類の数字の選び方は，
$$\\{2, 3\\},\\quad \\{2, 4\\},\\quad \\{3, 4\\}$$
の \${}_3\\mathrm{C}_2 = 3$ 通りある。
$\\{2, 3\\}$ の場合について考える。
各桁が $2$ か $3$ の2通りずつあるので，作られる整数は全部で $2^5 = 32$ 通りある。
この中には，1種類しか使われていない「$22222$」と「$33333$」の2通りが含まれている（これらは不適）。
よって，$2$ と $3$ の2種類の数字が現れる5桁の整数は，
$$32 - 2 = 30\\text{（通り）}$$
$\\{2, 4\\}$，$\\{3, 4\\}$ の場合も同様であるから，求める総数は，
$$30 \\times 3 = \\mathbf{90\\text{（通り）}}$$

(2) 各桁に $2, 3, 4$ のいずれを使ってもよい（使わない数字があってもよい）とすると，
作られる整数は全部で，
$$3^5 = 243\\text{（通り）}$$
このうち，
・1種類の数字しか現れないものは，「$22222$」「$33333$」「$44444$」の $3$ 通り。
・ちょうど2種類の数字しか現れないものは，(1)より $90$ 通り。
したがって，3種類の数字がすべて現れているものは，全体からこれらを除いて，
$$243 - 3 - 90 = \\mathbf{150\\text{（通り）}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 42 の類題。
(1)「ちょうど2種類」は，(選んだ2数で作るすべての数) $-$ (1種類しか使わない数)。
(2)「3種類すべて現れる」は，余事象の考え方を利用し，(すべての数) $-$ (1種類のみ) $-$ (2種類のみ) で一発で求める。`
  },

  31: {
    id: 31,
    chapter: "場合の数と確率",
    title: "球の取り出しと確率",
    target_reidai: 44,
    sources: ["青山学院大"],
    question: `袋のなかに，赤球，青球，白球，黒球が，それぞれ5個ずつ入っている。
(1) 袋から2個の球を同時に取り出すとき，その2個が同じ色である確率を求めよ。
(2) 袋から3個の球を同時に取り出すとき，そのうち2個だけが同じ色である確率を求めよ。
(3) 袋から3個の球を同時に取り出すとき，取り出した3個の球の色がすべて異なる確率を求めよ。`,
    answer: `すべての球（合計20個）を区別して考える。

(1) 2個の球の取り出し方は全部で \${}_{20}\\mathrm{C}_2$ 通りある。
取り出した2個の球が同じ色であるとき，
・それが何色か：\${}_4\\mathrm{C}_1$ 通り
・その色の何番の球か：\${}_5\\mathrm{C}_2$ 通り
したがって，2個の球が同じ色である確率は，
$$\\frac{{}_4\\mathrm{C}_1 \\times {}_5\\mathrm{C}_2}{{}_{20}\\mathrm{C}_2} = \\frac{4 \\times 10}{190} = \\mathbf{\\frac{4}{19}}$$

(2) 3個の球の取り出し方は全部で \${}_{20}\\mathrm{C}_3$ 通りある。
2個の球が同じ色で，もう1つが別の色であるとき，
・同色の2個の球は何色か：\${}_4\\mathrm{C}_1$ 通り
・同色の球が何番の球か：\${}_5\\mathrm{C}_2$ 通り
・残り1つの球がどの球か（同色の2個以外の15個の中から1個）：\${}_{15}\\mathrm{C}_1$ 通り
よって，2個だけが同じ色である確率は，
$$\\frac{{}_4\\mathrm{C}_1 \\times {}_5\\mathrm{C}_2 \\times {}_{15}\\mathrm{C}_1}{{}_{20}\\mathrm{C}_3} = \\frac{4 \\times 10 \\times 15}{1140} = \\mathbf{\\frac{10}{19}}$$

(3) 取り出される3個の色がすべて異なる確率は，
・取り出される3色がどの色か：\${}_4\\mathrm{C}_3$ 通り
・各色の球が何番の球か：それぞれ \${}_5\\mathrm{C}_1$ 通り
したがって，3個の球の色がすべて異なる確率は，
$$\\frac{{}_4\\mathrm{C}_3 \\times ({}_5\\mathrm{C}_1)^3}{{}_{20}\\mathrm{C}_3} = \\frac{4 \\times 125}{1140} = \\mathbf{\\frac{25}{57}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 44 で学んだ確率の鉄則「同様に確からしくするため，同じ色の球であってもすべて区別して番号をつけて考える」。
(2) 同色の色選び \${}_4\\mathrm{C}_1$、その色からの選び方 \${}_5\\mathrm{C}_2$、残りの1個を他色の15個から選ぶ \${}_{15}\\mathrm{C}_1$ と段階を踏んで数え上げる。`
  },

  32: {
    id: 32,
    chapter: "場合の数と確率",
    title: "さいころの目の積と余事象",
    target_reidai: 45,
    sources: ["小樽商科大"],
    question: `3個のサイコロを同時に投げるとき，出た目の数の積が4の倍数である確率を求めよ。`,
    answer: `3個のサイコロを区別して考える。目の出方は全部で $6^3 = 216$ 通りある。

「積が4の倍数である」の余事象である「積が4の倍数にならない」場合を考える。
積が4の倍数にならないのは，
(ア) 3個とも奇数
(イ) 2個が奇数で，1個が2か6
のいずれかの場合である。

(ア) 3個とも奇数（$1, 3, 5$）の場合：
$$3^3 = 27\\text{（通り）}$$
(イ) 2個が奇数で，1個が2または6の場合：
・奇数が出るサイコロの選び方：\${}_3\\mathrm{C}_2$ 通り
・その2個のサイコロの奇数の出方：$3 \\times 3 = 9$ 通り
・残りの1個のサイコロの偶数（$2$ または $6$）の出方：$2$ 通り
よって，
$\${}_3\\mathrm{C}_2 \\times (3 \\cdot 3) \\times 2 = 3 \\times 9 \\times 2 = 54\\text{（通り）}$$

したがって，積が4の倍数にならない目の出方は，
$$27 + 54 = 81\\text{（通り）}$$
積が4の倍数にならない確率は，
$$\\frac{81}{6^3} = \\frac{81}{216} = \\frac{3}{8}$$
であるから，求める確率は余事象より，
$$1 - \\frac{3}{8} = \\mathbf{\\frac{5}{8}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 45 の典型問題。「積が4の倍数」を直接数えると，「4が1個以上」や「偶数が2個以上」など場合分けが複雑化するため，「積が4の倍数にならない確率（余事象）」を考えるのが圧倒的に速く安全。
素因数2の個数に着目し，2が0個（3個とも奇数）と2が1個（奇数2個＋2か6が1個）に分類する。`
  },

  33: {
    id: 33,
    chapter: "場合の数と確率",
    title: "反復試行と数直線上での移動",
    target_reidai: 48,
    sources: ["大分大"],
    question: `動点 $\\mathrm{P}$ が現在 $x$ 軸上の原点にある。コイン1個とサイコロ1個を同時に投げ，コインが表であれば点 $\\mathrm{P}$ はサイコロの目の数だけ正の方向に進み，コインが裏であればサイコロの目にかかわらず負の方向に2だけ進む。この試行を3回続けて行ったとき，点 $\\mathrm{P}$ が原点にある確率を求めよ。`,
    answer: `試行の回数は3回である。$-2$ だけ移動する回数（コインの裏が出る回数）で分けて考える。
3回後に点 $\\mathrm{P}$ が原点にあるのは，
(ア) $-2$ の移動が1回で，$+1$ の移動が2回の場合（$-2 + 1 + 1 = 0$）
(イ) $-2$ の移動が2回で，$+4$ の移動が1回の場合（$-2 \\times 2 + 4 = 0$）
のいずれかの場合である。

各移動の確率は，
・$-2$ だけ移動する確率：$\\frac{1}{2}$
・$+1$ だけ移動する確率（表かつ目1）：$\\frac{1}{2} \\cdot \\frac{1}{6} = \\frac{1}{12}$
・$+4$ だけ移動する確率（表かつ目4）：$\\frac{1}{2} \\cdot \\frac{1}{6} = \\frac{1}{12}$

(ア) の確率は，
$\${}_3\\mathrm{C}_1 \\left(\\frac{1}{2}\\right) \\left(\\frac{1}{12}\\right)^2 = 3 \\cdot \\frac{1}{2} \\cdot \\frac{1}{144} = \\frac{1}{96}$$
(イ) の確率は，
$\${}_3\\mathrm{C}_2 \\left(\\frac{1}{2}\\right)^2 \\left(\\frac{1}{12}\\right) = 3 \\cdot \\frac{1}{4} \\cdot \\frac{1}{12} = \\frac{1}{16}$$

したがって，求める確率は，
$$\\frac{1}{96} + \\frac{1}{16} = \\frac{1 + 6}{96} = \\mathbf{\\frac{7}{96}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 48 で学習した反復試行と数直線の移動。
3回の移動量の合計が0になる組み合わせを「裏の回数」に着目して書き出し，反復試行の確率公式 \${}_n\\mathrm{C}_r p^r q^{n-r}$ を適用する。`
  },

  34: {
    id: 34,
    chapter: "場合の数と確率",
    title: "最大値の確率と条件付き確率",
    target_reidai: 50,
    sources: ["慶應義塾大"],
    question: `3個のサイコロを同時に投げるとき，以下の確率を求めよ。
(1) 出る目の最大値が4である確率は $\\fbox{\\quad}$ である。
(2) 出る目の最大値が4であるとき，少なくとも1個のサイコロの目が1である条件付き確率は $\\fbox{\\quad}$ である。`,
    answer: `(1) 3個のサイコロを区別すると，目の出方は全部で $6^3 = 216$ 通りある。
出る目の最大値が4である目の出方は，
$$(\\text{3個とも4以下}) - (\\text{3個とも3以下}) = 4^3 - 3^3 = 64 - 27 = 37\\text{（通り）}$$
よって，出る目の最大値が4である確率は，
$$\\mathbf{\\frac{37}{216}}$$

(2) 事象 $X$ を「出る目の最大値が4である」，事象 $Y$ を「少なくとも1個のサイコロの目が1である」とする。
(1)より，$P(X) = \\frac{37}{216}$。
$X \\cap Y$ である目の組は，最大値が4かつ1を含む組であるから，
・$\\{4, 1, 1\\}$ の並べ方：$\\frac{3!}{2!} = 3$ 通り
・$\\{4, 1, 2\\}$ の並べ方：$3! = 6$ 通り
・$\\{4, 1, 3\\}$ の並べ方：$3! = 6$ 通り
・$\\{4, 1, 4\\}$ の並べ方：$\\frac{3!}{2!} = 3$ 通り
よって，$X \\cap Y$ となる目の出方は，
$$3 + 6 + 6 + 3 = 18\\text{（通り）}$$
したがって，$P(X \\cap Y) = \\frac{18}{216}$ である。
求める条件付き確率 $P_X(Y)$ は，
$$P_X(Y) = \\frac{P(X \\cap Y)}{P(X)} = \\frac{\\frac{18}{216}}{\\frac{37}{216}} = \\mathbf{\\frac{18}{37}}$$`,
    commentary: `【解法の着眼点・ポイント】
(1)「最大値が $M$」の確率は $(\\text{すべて } M \\text{ 以下}) - (\\text{すべて } M-1 \\text{ 以下})$ で求める超重要定石（例題 47）。
(2) 条件付き確率 $P_X(Y) = \\frac{P(X \\cap Y)}{P(X)}$。分母となる事象 $X$（最大値4）の中で，1を少なくとも1つ含む事象 $X \\cap Y$ の組み合わせを漏れなく数え上げる。`
  },

  35: {
    id: 35,
    chapter: "場合の数と確率",
    title: "検査の陽性と条件付き確率",
    target_reidai: 51,
    sources: ["神奈川大"],
    question: `A国では20％の人がBウイルスに感染している。ある検査方式で，感染していない人が陽性と誤って判定される確率は5％で，感染している人が陰性と誤って判定される確率は1％である。
陽性と判定されたときに，実際には感染していない確率は $\\fbox{\\quad}$ である。`,
    answer: `2つの事象 $X, Y$ を，
・$X$：陽性と判定される
・$Y$：Bウイルスに感染している
と定める。
ウイルスの感染状況と判定の確率は，
・感染している（確率 $\\frac{20}{100}$）：陽性と判定される確率は $99\\%$，陰性と誤判定される確率は $1\\%$
・感染していない（確率 $\\frac{80}{100}$）：陽性と誤判定される確率は $5\\%$，陰性と判定される確率は $95\\%$

感染していて陽性と判定される確率 $P(Y \\cap X)$ は，
$$P(Y \\cap X) = \\frac{20}{100} \\times \\frac{99}{100} = \\frac{99}{500}$$
感染していなくて陽性と判定される確率 $P(\\overline{Y} \\cap X)$ は，
$$P(\\overline{Y} \\cap X) = \\frac{80}{100} \\times \\frac{5}{100} = \\frac{20}{500}$$
陽性と判定される確率 $P(X)$ は，これら2つの和であるから，
$$P(X) = P(Y \\cap X) + P(\\overline{Y} \\cap X) = \\frac{99}{500} + \\frac{20}{500} = \\frac{119}{500}$$
陽性と判定されたときに，実際には感染していない条件付き確率 $P_X(\\overline{Y})$ は，
$$P_X(\\overline{Y}) = \\frac{P(X \\cap \\overline{Y})}{P(X)} = \\frac{\\frac{20}{500}}{\\frac{119}{500}} = \\mathbf{\\frac{20}{119}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 51 で学習した検査の陽性・偽陽性に関する条件付き確率の頻出代表題。
全体の人口のうち「真陽性（感染していて陽性）」と「偽陽性（非感染で誤って陽性）」の確率をそれぞれ樹形図や表で整理し，
$$P_X(\\overline{Y}) = \\frac{P(\\text{非感染} \\cap \\text{陽性})}{P(\\text{陽性全体})}$$
を求める。`
  },

  36: {
    id: 36,
    chapter: "場合の数と確率",
    title: "試合の勝敗と回数の期待値",
    target_reidai: 48,
    sources: ["青山学院大"],
    question: `A，Bの2人が何回か試合を行い，どちらか先に3勝した方を優勝とする。Aが勝つ確率もBが勝つ確率も $\\frac{1}{2}$ とし，引き分けはないものとする。
(1) Aが3勝1敗で優勝する確率を求めよ。
(2) 優勝が決まるまでに試合が5回行われる確率を求めよ。
(3) 優勝が決まるまでの試合の回数の期待値を求めよ。`,
    answer: `(1) Aが3勝1敗で優勝するのは，「3試合目までにAが2勝1敗となり，4試合目でAが勝つ」場合である。
したがって，求める確率は，
$\${}_3\\mathrm{C}_2 \\left(\\frac{1}{2}\\right)^2 \\left(\\frac{1}{2}\\right) \\times \\frac{1}{2} = 3 \\cdot \\frac{1}{4} \\cdot \\frac{1}{2} \\times \\frac{1}{2} = \\mathbf{\\frac{3}{16}}$$

(2) 優勝が決まるまでに試合が5回行われるのは，「4試合を終えて2勝2敗」の場合である（5試合目に勝った方が3勝2敗で優勝する）。
したがって，求める確率は，
$\${}_4\\mathrm{C}_2 \\left(\\frac{1}{2}\\right)^2 \\left(\\frac{1}{2}\\right)^2 = 6 \\cdot \\frac{1}{4} \\cdot \\frac{1}{4} = \\mathbf{\\frac{3}{8}}$$

(3) 優勝が決まるまでの試合の回数を $X$ とすると，$X = 3, 4, 5$ のいずれかである。
・$X = 3$ となるのは，Aが3連勝またはBが3連勝する場合であるから，
$$P(X = 3) = \\left(\\frac{1}{2}\\right)^3 + \\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8} + \\frac{1}{8} = \\frac{1}{4}$$
・$X = 5$ となる確率は，(2)より $P(X = 5) = \\frac{3}{8}$ である。
・$X = 4$ となる確率は，余事象より，
$$P(X = 4) = 1 - \\frac{1}{4} - \\frac{3}{8} = \\frac{3}{8}$$
（※(1)の「Aが3勝1敗」の $\\frac{3}{16}$ に2倍して $\\frac{3}{8}$ と求めてもよい）

確率分布は以下のようになる：
$$\\begin{array}{|c|c|c|c|}
\\hline
X & 3 & 4 & 5 \\\\
\\hline
P & \\frac{1}{4} & \\frac{3}{8} & \\frac{3}{8} \\\\
\\hline
\\end{array}$$
以上より，求める期待値は，
$$E(X) = 3 \\times \\frac{1}{4} + 4 \\times \\frac{3}{8} + 5 \\times \\frac{3}{8} = \\frac{6 + 12 + 15}{8} = \\mathbf{\\frac{33}{8}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 48 の反復試行の発展形。
(1)「3勝1敗で優勝」は，4試合目に勝つことが必須なので「3試合目までの反復試行」$\\times$「4試合目の確率 $\\frac{1}{2}$」とする。
(2) 5試合かかる条件は「4戦終了時点で2勝2敗」であることを見抜く。5試合目はどちらが勝っても優勝が決まるので掛ける必要がない。
(3) 確率の総和が1になることを用いて $P(X=4)$ を求める。`
  },

  37: {
    id: 37,
    chapter: "図形の性質",
    title: "メネラウスの定理の利用",
    target_reidai: 52,
    sources: ["駒澤大"],
    question: `三角形 $\\mathrm{ABC}$ の辺 $\\mathrm{BC}$ を $5 : 3$ に内分する点を $\\mathrm{D}$ とし，$\\mathrm{AD}$ を $2 : 1$ に内分する点を $\\mathrm{E}$ とする。また，辺 $\\mathrm{AB}$ と直線 $\\mathrm{CE}$ の交点を $\\mathrm{F}$ とする。このとき，$\\mathrm{AF} : \\mathrm{FB}$ と $\\mathrm{CE} : \\mathrm{EF}$ をそれぞれ求めよ。`,
    answer: `三角形 $\\mathrm{ABD}$ と直線 $\\mathrm{CF}$ について，メネラウスの定理を用いると，
$$\\frac{\\mathrm{AF}}{\\mathrm{FB}} \\cdot \\frac{\\mathrm{BC}}{\\mathrm{CD}} \\cdot \\frac{\\mathrm{DE}}{\\mathrm{EA}} = 1$$
$\\mathrm{BC} : \\mathrm{CD} = (5 + 3) : 3 = 8 : 3$，$\\mathrm{DE} : \\mathrm{EA} = 1 : 2$ であるから，
$$\\frac{\\mathrm{AF}}{\\mathrm{FB}} \\cdot \\frac{8}{3} \\cdot \\frac{1}{2} = 1 \\implies \\frac{\\mathrm{AF}}{\\mathrm{FB}} \\cdot \\frac{4}{3} = 1 \\implies \\frac{\\mathrm{AF}}{\\mathrm{FB}} = \\frac{3}{4}$$
したがって，
$$\\mathbf{\\mathrm{AF} : \\mathrm{FB} = 3 : 4}$$

さらに，三角形 $\\mathrm{ADC}$ と直線 $\\mathrm{BF}$ について，メネラウスの定理を用いると，
$$\\frac{\\mathrm{CD}}{\\mathrm{DB}} \\cdot \\frac{\\mathrm{BA}}{\\mathrm{AF}} \\cdot \\frac{\\mathrm{FE}}{\\mathrm{EC}} = 1$$
$\\mathrm{BA} : \\mathrm{AF} = (3 + 4) : 3 = 7 : 3$ であるから，
$$\\frac{3}{5} \\cdot \\frac{7}{3} \\cdot \\frac{\\mathrm{FE}}{\\mathrm{EC}} = 1 \\implies \\frac{7}{5} \\cdot \\frac{\\mathrm{FE}}{\\mathrm{EC}} = 1 \\implies \\frac{\\mathrm{FE}}{\\mathrm{EC}} = \\frac{5}{7}$$
したがって，
$$\\mathbf{\\mathrm{CE} : \\mathrm{EF} = 7 : 5}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 52 で学習したメネラウスの定理。「どの三角形とどの直線に着目するか」を明確にするのが鉄則。
頂点 $\\to$ 分分点 $\\to$ 頂点 $\\to$ 分分点 $\\to$ 頂点 $\\to$ 分分点 と一筆書きの要領で式を立てる。`
  },

  38: {
    id: 38,
    chapter: "図形の性質",
    title: "方べきの定理と直角三角形",
    target_reidai: 56,
    sources: ["岩手大"],
    question: `線分 $\\mathrm{PQ}$ を直径とする円を $C$ とする。円 $C$ 上に，$\\mathrm{P}, \\mathrm{Q}$ とは異なる点 $\\mathrm{R}$ をとり，点 $\\mathrm{Q}$ における円 $C$ の接線と直線 $\\mathrm{PR}$ の交点を $\\mathrm{S}$ とする。$\\mathrm{PR} = 9, \\mathrm{RS} = 7$ であるとき，円 $C$ の半径を求めよ。`,
    answer: `点 $\\mathrm{S}$ から円 $C$ に引いた接線 $\\mathrm{SQ}$ と割線 $\\mathrm{SP}$ について，方べきの定理より，
$$\\mathrm{SP} \\cdot \\mathrm{SR} = \\mathrm{SQ}^2$$
が成り立つ。$\\mathrm{SR} = 7$ であり，$\\mathrm{SP} = \\mathrm{PR} + \\mathrm{RS} = 9 + 7 = 16$ であるから，
$$\\mathrm{SQ}^2 = 16 \\cdot 7 \\quad \\cdots \\text{①}$$
線分 $\\mathrm{PQ}$ は円 $C$ の直径であり，$\\mathrm{SQ}$ は点 $\\mathrm{Q}$ における接線であるから，
$$\\angle \\mathrm{PQS} = 90^\\circ$$
直角三角形 $\\mathrm{SPQ}$ において，三平方の定理を用いると，
$$\\begin{aligned}
\\mathrm{PQ}^2 &= \\mathrm{SP}^2 - \\mathrm{SQ}^2 \\\\
&= 16^2 - 16 \\cdot 7 \\quad (\\text{①より}) \\\\
&= 16(16 - 7) = 16 \\cdot 9
\\end{aligned}$$
これより，
$$\\mathrm{PQ} = \\sqrt{16 \\cdot 9} = 4 \\cdot 3 = 12$$
線分 $\\mathrm{PQ}$ は直径であるから，円 $C$ の半径は，
$$\\frac{\\mathrm{PQ}}{2} = \\mathbf{6}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 56 で学習した方べきの定理の応用。
接線と割線の方べきの定理 $\\mathrm{SP} \\cdot \\mathrm{SR} = \\mathrm{SQ}^2$ から $\\mathrm{SQ}^2$ を求め，直径と接線が垂直（$\\angle \\mathrm{PQS} = 90^\\circ$）であることから直角三角形に三平方の定理を組み合わせて直径 $\\mathrm{PQ}$ を導く。`
  },

  39: {
    id: 39,
    chapter: "式と証明",
    title: "二項定理と指定された項の係数",
    target_reidai: 58,
    sources: ["神奈川大","島根県立大"],
    question: `次の各問に答えよ。
(1) $\\left(2x - \\frac{1}{4}\\right)^{10}$ の展開式において，$x^6$ の係数を求めよ。
(2) $\\left(x^2 - \\frac{1}{2x^3}\\right)^5$ の展開式における定数項を求めよ。`,
    answer: `(1) $(a + b)^n$ の展開式の一般項は \${}_n\\mathrm{C}_r a^{n-r} b^r$ である。
$\\left(2x - \\frac{1}{4}\\right)^{10}$ の展開式の一般項は，
$\${}_{10}\\mathrm{C}_r (2x)^{10-r} \\left(-\\frac{1}{4}\\right)^r = {}_{10}\\mathrm{C}_r \\cdot 2^{10-r} \\cdot \\left(-\\frac{1}{4}\\right)^r \\cdot x^{10-r}$$
である。$x^6$ の項は $10 - r = 6$ より $r = 4$ の場合であるから，求める係数は，
$$\\begin{aligned}
{}_{10}\\mathrm{C}_4 \\cdot 2^{10-4} \\cdot \\left(-\\frac{1}{4}\\right)^4 &= \\frac{10 \\cdot 9 \\cdot 8 \\cdot 7}{4 \\cdot 3 \\cdot 2 \\cdot 1} \\cdot 2^6 \\cdot \\frac{1}{4^4} \\\\
&= 210 \\cdot 2^6 \\cdot \\frac{1}{2^8} = 210 \\cdot \\frac{1}{4} = \\mathbf{\\frac{105}{2}}
\\end{aligned}$$

(2) $\\left(x^2 - \\frac{1}{2x^3}\\right)^5$ の展開式の一般項は，
$\${}_5\\mathrm{C}_r (x^2)^{5-r} \\left(-\\frac{1}{2x^3}\\right)^r = {}_5\\mathrm{C}_r \\cdot \\left(-\\frac{1}{2}\\right)^r \\cdot \\frac{x^{10-2r}}{x^{3r}} = {}_5\\mathrm{C}_r \\cdot \\left(-\\frac{1}{2}\\right)^r \\cdot x^{10-5r}$$
である。定数項は $x^0$ の項，すなわち $10 - 5r = 0 \\implies r = 2$ の場合であるから，求める定数項は，
$\${}_5\\mathrm{C}_2 \\cdot \\left(-\\frac{1}{2}\\right)^2 = 10 \\cdot \\frac{1}{4} = \\mathbf{\\frac{5}{2}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 58 の二項定理の基本定石。
展開式の一般項 \${}_n\\mathrm{C}_r a^{n-r} b^r$ を作り，
(1) 係数部分と $x$ の指数部分を明確に分離する。
(2) 指数法則を用いて $x$ の次数をまとめ，問題で指定された次数（$x^6$ や定数項 $x^0$）となる $r$ の値を特定して代入する。`
  },

  40: {
    id: 40,
    chapter: "式と証明",
    title: "恒等式と係数決定",
    target_reidai: 57,
    sources: ["西日本工業大"],
    question: `等式 $a(x-1)^2 + b(x-1) + c = x^2 + 1$ が $x$ についての恒等式となるように，定数 $a, b, c$ の値を定めよ。`,
    answer: `与えられた等式を①とする。
$$a(x-1)^2 + b(x-1) + c = x^2 + 1 \\quad \\cdots \\text{①}$$
①の左辺を展開して整理すると，
$$a(x^2 - 2x + 1) + b(x - 1) + c = ax^2 + (-2a + b)x + (a - b + c)$$
これが $x^2 + 1$ と $x$ についての恒等式となるから，両辺の同類項の係数を比較して，
$$\\begin{cases}
a = 1 \\\\
-2a + b = 0 \\\\
a - b + c = 1
\\end{cases}$$
第1式より $a = 1$。
第2式に代入して，$-2(1) + b = 0 \\implies b = 2$。
第3式に代入して，$1 - 2 + c = 1 \\implies c = 2$。
したがって，
$$\\mathbf{a = 1,\\quad b = 2,\\quad c = 2}$$

＜別解：置きかえを利用する＞
$x - 1 = y$（$x = y + 1$）とおくと，①は，
$$ay^2 + by + c = (y + 1)^2 + 1 = y^2 + 2y + 2$$
と表される。すべての $x$ に対して①が成り立つのは，すべての $y$ に対してこの等式が成り立つときであるから，両辺の係数を比較して直ちに，
$$a = 1,\\quad b = 2,\\quad c = 2$$`,
    commentary: `【解法の着眼点・ポイント】
例題 57 の恒等式。係数比較法を展開して解くのが標準。
別解のように $x-1 = y$ と置き換えると左辺の展開が不要になり，右辺 $(y+1)^2+1 = y^2+2y+2$ を展開するだけで一瞬で $a=1, b=2, c=2$ が求まるテクニックも知っておくと便利。`
  },

  41: {
    id: 41,
    chapter: "式と証明",
    title: "3次の不等式の証明",
    target_reidai: 59,
    sources: ["津田塾大"],
    question: `$x \\geqq 0, y \\geqq 0$ のとき，$(x+y)^3 \\leqq 4(x^3+y^3)$ が成り立つことを示せ。`,
    answer: `(右辺) $-$ (左辺) を計算して変形する。
$$\\begin{aligned}
4(x^3 + y^3) - (x + y)^3 &= 4(x + y)(x^2 - xy + y^2) - (x + y)^3 \\\\
&= (x + y)\\{4(x^2 - xy + y^2) - (x + y)^2\\} \\\\
&= (x + y)\\{(4x^2 - 4xy + 4y^2) - (x^2 + 2xy + y^2)\\} \\\\
&= (x + y)(3x^2 - 6xy + 3y^2) \\\\
&= 3(x + y)(x^2 - 2xy + y^2) \\\\
&= 3(x + y)(x - y)^2
\\end{aligned}$$
ここで，仮定より $x \\geqq 0, y \\geqq 0$ であるから，$x + y \\geqq 0$ である。
また，実数の二乗であるから，つねに $(x - y)^2 \\geqq 0$ である。
したがって，
$$3(x + y)(x - y)^2 \\geqq 0$$
すなわち，
$$4(x^3 + y^3) - (x + y)^3 \\geqq 0$$
よって，
$$(x + y)^3 \\leqq 4(x^3 + y^3)$$
が成り立つ。（等号成立は $x + y = 0$ または $x = y$ のとき）（証明終）`,
    commentary: `【解法の着眼点・ポイント】
例題 59 で学習した不等式の基本方針「(右辺) $-$ (左辺) $\\geqq 0$ を示す」。
$x^3 + y^3 = (x+y)(x^2-xy+y^2)$ の因数分解公式を利用し，共通因数 $(x+y)$ でくくり出すと，残りの部分が $3(x-y)^2$ と平方の形にまとまる。`
  },

  42: {
    id: 42,
    chapter: "式と証明",
    title: "相加・相乗平均の大小関係の利用",
    target_reidai: 60,
    sources: ["南山大","慶應義塾大"],
    question: `[1] $x > 0$ のとき，$x + \\frac{2}{x}$ の最小値は $\\fbox{\\quad}$ であり，$\\frac{x}{x^2+x+9}$ の最大値は $\\fbox{\\quad}$ である。
[2] $x > 0$ のとき，$\\left(x + \\frac{1}{x}\\right)\\left(2x + \\frac{1}{2x}\\right)$ の最小値を求めよ。`,
    answer: `[1] $x > 0, \\frac{2}{x} > 0$ であるから，相加平均と相乗平均の大小関係より，
$$x + \\frac{2}{x} \\geqq 2\\sqrt{x \\cdot \\frac{2}{x}} = 2\\sqrt{2}$$
等号は $x = \\frac{2}{x} \\iff x^2 = 2 \\iff x = \\sqrt{2}$（$x > 0$）のとき成り立つ。
したがって，$x + \\frac{2}{x}$ の最小値は $\\mathbf{2\\sqrt{2}}$ である。

次に，$z = \\frac{x}{x^2 + x + 9}$ とし，分母・分子を $x > 0$ で割ると，
$$z = \\frac{1}{x + 1 + \\frac{9}{x}}$$
$x > 0, \\frac{9}{x} > 0$ より，相加平均と相乗平均の大小関係から，
$$x + \\frac{9}{x} \\geqq 2\\sqrt{x \\cdot \\frac{9}{x}} = 6$$
両辺に $1$ を足すと，
$$x + 1 + \\frac{9}{x} \\geqq 7$$
両辺の逆数を取ると，不等号の向きが逆転して，
$$z = \\frac{1}{x + 1 + \\frac{9}{x}} \\leqq \\frac{1}{7}$$
等号は $x = \\frac{9}{x} \\iff x^2 = 9 \\iff x = 3$（$x > 0$）のとき成り立つ。
したがって，$\\frac{x}{x^2 + x + 9}$ の最大値は $\\mathbf{\\frac{1}{7}}$ である。

[2] 与式を展開すると，
$$\\left(x + \\frac{1}{x}\\right)\\left(2x + \\frac{1}{2x}\\right) = 2x^2 + \\frac{1}{2} + 2 + \\frac{1}{2x^2} = 2x^2 + \\frac{1}{2x^2} + \\frac{5}{2}$$
$x > 0$ より $2x^2 > 0, \\frac{1}{2x^2} > 0$ であるから，相加平均と相乗平均の大小関係より，
$$2x^2 + \\frac{1}{2x^2} \\geqq 2\\sqrt{2x^2 \\cdot \\frac{1}{2x^2}} = 2$$
両辺に $\\frac{5}{2}$ を足すと，
$$2x^2 + \\frac{1}{2x^2} + \\frac{5}{2} \\geqq 2 + \\frac{5}{2} = \\frac{9}{2}$$
等号は $2x^2 = \\frac{1}{2x^2} \\iff 4x^4 = 1 \\iff x^2 = \\frac{1}{2} \\iff x = \\frac{1}{\\sqrt{2}}$（$x > 0$）のとき成り立つ。
したがって，最小値は $\\mathbf{\\frac{9}{2}}$ である。`,
    commentary: `【解法の着眼点・ポイント】
例題 60 の相加・相乗平均の超重要定石。
[1] 分数式の最大値は，分母・分子を $x$ で割って分母に $x + \\frac{9}{x}$ を出現させ，分母の最小値から全体の最大値を求める頻出手法。
[2] 積の形の相加・相乗平均は「まず展開してから適用する」のが鉄則（別々に適用すると等号成立条件が一致しない罠にハマる）。`
  },

  43: {
    id: 43,
    chapter: "複素数と方程式",
    title: "解と係数の関係と複素数の相等",
    target_reidai: 62,
    sources: ["西南学院大"],
    question: `2次方程式 $x^2 - 4x + 5 = 0$ の2つの虚数解を $\\alpha, \\beta$ とする。このとき，$(y + 2zi)(1 + i) = \\alpha^2 + \\beta^2$ を満たす実数 $y, z$ を求めよ。ただし，$i$ は虚数単位である。`,
    answer: `$\\alpha, \\beta$ は $x^2 - 4x + 5 = 0$ の2つの解であるから，解と係数の関係より，
$$\\alpha + \\beta = 4,\\quad \\alpha\\beta = 5$$
が成り立つ。これより，
$$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = 4^2 - 2 \\cdot 5 = 16 - 10 = 6$$
このとき，$(y + 2zi)(1 + i) = \\alpha^2 + \\beta^2$ より，
$$y + yi + 2zi + 2zi^2 = 6$$
$i^2 = -1$ であるから，実部と虚部に整理すると，
$$(y - 2z) + (y + 2z)i = 6$$
$y, z$ は実数であるから，$y - 2z$，$y + 2z$ も実数である。複素数の相等より，
$$\\begin{cases}
y - 2z = 6 & \\cdots \\text{①} \\\\
y + 2z = 0 & \\cdots \\text{②}
\\end{cases}$$
① $+$ ② より，$2y = 6 \\implies y = 3$。
②より，$2z = -y = -3 \\implies z = -\\frac{3}{2}$。
したがって，
$$\\mathbf{y = 3,\\quad z = -\\frac{3}{2}}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 62 の解と係数の関係と複素数の相等。
解の公式で $\\alpha, \\beta = 2 \\pm i$ を直接求めて2乗してもよいが，解と係数の関係 $\\alpha+\\beta=4, \\alpha\\beta=5$ から対称式 $\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2-2\\alpha\\beta$ を求める方が圧倒的に速くミスがない。`
  },

  44: {
    id: 44,
    chapter: "複素数と方程式",
    title: "解の対称式を解とする2次方程式",
    target_reidai: 63,
    sources: ["立命館大"],
    question: `2次方程式 $2x^2 - 4x + 1 = 0$ の2つの解を $\\alpha, \\beta$ とするとき，$\\alpha - \\frac{1}{\\alpha}, \\beta - \\frac{1}{\\beta}$ を解とする2次方程式で $x^2$ の係数が2であるものを求めよ。`,
    answer: `$\\alpha, \\beta$ は $2x^2 - 4x + 1 = 0$ の解であるから，解と係数の関係より，
$$\\alpha + \\beta = 2,\\quad \\alpha\\beta = \\frac{1}{2} \\quad \\cdots \\text{①}$$
新しく解とする2数を，
$$X = \\alpha - \\frac{1}{\\alpha},\\quad Y = \\beta - \\frac{1}{\\beta}$$
とおく。この2数の和と積を①を用いて計算する。

2解の和は，
$$X + Y = \\left(\\alpha - \\frac{1}{\\alpha}\\right) + \\left(\\beta - \\frac{1}{\\beta}\\right) = (\\alpha + \\beta) - \\frac{\\alpha + \\beta}{\\alpha\\beta} = 2 - \\frac{2}{\\frac{1}{2}} = 2 - 4 = -2$$
2解の積は，
$$\\begin{aligned}
XY &= \\left(\\alpha - \\frac{1}{\\alpha}\\right)\\left(\\beta - \\frac{1}{\\beta}\\right) = \\alpha\\beta - \\left(\\frac{\\alpha}{\\beta} + \\frac{\\beta}{\\alpha}\\right) + \\frac{1}{\\alpha\\beta} \\\\
&= \\alpha\\beta - \\frac{\\alpha^2 + \\beta^2}{\\alpha\\beta} + \\frac{1}{\\alpha\\beta} = \\alpha\\beta - \\frac{(\\alpha + \\beta)^2 - 2\\alpha\\beta}{\\alpha\\beta} + \\frac{1}{\\alpha\\beta} \\\\
&= \\frac{1}{2} - \\frac{2^2 - 2 \\cdot \\frac{1}{2}}{\\frac{1}{2}} + \\frac{1}{\\frac{1}{2}} = \\frac{1}{2} - \\frac{3}{\\frac{1}{2}} + 2 = \\frac{1}{2} - 6 + 2 = -\\frac{7}{2}
\\end{aligned}$$

したがって，$X, Y$ を2解とする2次方程式の1つは，
$$x^2 - (X + Y)x + XY = 0 \\implies x^2 - (-2)x - \\frac{7}{2} = 0 \\implies x^2 + 2x - \\frac{7}{2} = 0$$
求める方程式は $x^2$ の係数が2であるから，両辺を2倍して，
$$\\mathbf{2x^2 + 4x - 7 = 0}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 63 で学習した2解の作成問題。
2数 $X, Y$ を解とする2次方程式は $x^2 - (X+Y)x + XY = 0$。
解と係数の関係を利用して $X+Y$ と $XY$ をそれぞれ対称式として丁寧に計算する。最後に「$x^2$ の係数が2」という条件に合わせて両辺を2倍することを忘れない。`
  },

  45: {
    id: 45,
    chapter: "複素数と方程式",
    title: "剰余の定理と2次式で割った余り",
    target_reidai: 65,
    sources: ["慶應義塾大"],
    question: `整式 $P(x)$ を $(x-1)(x+1)$ で割ると $4x-3$ 余り，$(x-2)(x+2)$ で割ると $3x+5$ 余る。このとき，$P(x)$ を $(x+1)(x+2)$ で割ったときの余りを求めよ。`,
    answer: `整式 $P(x)$ を $(x-1)(x+1)$，$(x-2)(x+2)$ で割った商をそれぞれ $Q_1(x), Q_2(x)$ とすると，
$$\\begin{aligned}
P(x) &= (x - 1)(x + 1)Q_1(x) + 4x - 3 \\quad \\cdots \\text{①} \\\\
P(x) &= (x - 2)(x + 2)Q_2(x) + 3x + 5 \\quad \\cdots \\text{②}
\\end{aligned}$$
が成り立つ。
①において $x = -1$ とすると，
$$P(-1) = 4(-1) - 3 = -7 \\quad \\cdots \\text{③}$$
②において $x = -2$ とすると，
$$P(-2) = 3(-2) + 5 = -1 \\quad \\cdots \\text{④}$$

ここで，$P(x)$ を2次式 $(x+1)(x+2)$ で割ったときの商を $Q_3(x)$，余りを $ax + b$（$a, b$ は定数）とおくと，
$$P(x) = (x + 1)(x + 2)Q_3(x) + ax + b \\quad \\cdots \\text{⑤}$$
が成り立つ。⑤において $x = -1, -2$ とすると，③，④より，
$$\\begin{cases}
P(-1) = -a + b = -7 \\\\
P(-2) = -2a + b = -1
\\end{cases}$$
上の式から下の式を引くと，
$$(-a + b) - (-2a + b) = -7 - (-1) \\implies a = -6$$
第1式に代入して，
$$-(-6) + b = -7 \\implies b = -13$$
したがって，求める余りは，
$$\\mathbf{-6x - 13}$$`,
    commentary: `【解法の着眼点・ポイント】
例題 65 で学習した剰余の定理の代表題。
2次式で割ったときの余りは1次以下の式なので $ax+b$ とおく。
除数の因数となる $x = -1, -2$ を代入して $P(-1) = -7, P(-2) = -1$ を導き，$a, b$ の連立方程式に帰着させる。`
  },

  46: {
    id: 46,
    chapter: "複素数と方程式",
    title: "3次方程式の解と係数の関係，対称式",
    target_reidai: 69,
    sources: ["近畿大"],
    question: `3次方程式 $x^3 + x^2 - 13x + 3 = 0$ の3つの解を $\\alpha$，$\\beta$，$\\gamma$ とするとき，$\\alpha^2 + \\beta^2 + \\gamma^2$，$\\alpha^3 + \\beta^3 + \\gamma^3$ の値をそれぞれ求めよ。`,
    answer: `$x^3 + x^2 - 13x + 3 = 0$ の解が $x = \\alpha, \\ \\beta, \\ \\gamma$ であるから，3次方程式の解と係数の関係より，
$$\\begin{cases} \\alpha + \\beta + \\gamma = -1 \\\\ \\alpha\\beta + \\beta\\gamma + \\gamma\\alpha = -13 \\\\ \\alpha\\beta\\gamma = -3 \\end{cases}$$
が成り立つ。これを用いると，
$$\\begin{aligned} \\alpha^2 + \\beta^2 + \\gamma^2 &= (\\alpha + \\beta + \\gamma)^2 - 2(\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha) \\\\ &= (-1)^2 - 2\\cdot(-13) \\\\ &= 1 + 26 \\\\ &= \\mathbf{27} \\end{aligned}$$

また，
$$\\begin{aligned} \\alpha^3 + \\beta^3 + \\gamma^3 &= (\\alpha + \\beta + \\gamma)(\\alpha^2 + \\beta^2 + \\gamma^2 - \\alpha\\beta - \\beta\\gamma - \\gamma\\alpha) + 3\\alpha\\beta\\gamma \\\\ &= (-1)\\cdot\\{27 - (-13)\\} + 3\\cdot(-3) \\\\ &= (-1)\\cdot(27 + 13) - 9 \\\\ &= -40 - 9 \\\\ &= \\mathbf{-49} \\end{aligned}$$

したがって，
$$\\alpha^2 + \\beta^2 + \\gamma^2 = \\mathbf{27}, \\quad \\alpha^3 + \\beta^3 + \\gamma^3 = \\mathbf{-49}$$`,
    commentary: `$\\alpha^2 + \\beta^2 + \\gamma^2$，$\\alpha^3 + \\beta^3 + \\gamma^3$ の計算は **例題3** で学習している。
まず，解と係数の関係を用いて，$\\alpha + \\beta + \\gamma$，$\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha$，$\\alpha\\beta\\gamma$ の値を用意しよう。`
  },

  47: {
    id: 47,
    chapter: "複素数と方程式",
    title: "虚数解と実数係数の3次方程式",
    target_reidai: 68,
    sources: ["琉球大"],
    question: `3次方程式 $x^3 + ax^2 + bx - 14 = 0$ の1つの解が $2 + \\sqrt{3}i$ であるとき，実数の定数 $a$，$b$ の値を求めよ。ただし，$i$ は虚数単位である。`,
    answer: `$$x^3 + ax^2 + bx - 14 = 0 \\quad \\cdots(*) $$
$x = 2 + \\sqrt{3}i$ が実数係数の3次方程式 $(*)$ の解であるから，$x = 2 - \\sqrt{3}i$ も $(*)$ の解である。
もう1つの解を $\\gamma$ とすると，解と係数の関係より，
$$\\begin{cases} (2 + \\sqrt{3}i) + (2 - \\sqrt{3}i) + \\gamma = -a \\\\ (2 + \\sqrt{3}i)(2 - \\sqrt{3}i) + (2 - \\sqrt{3}i)\\gamma + \\gamma(2 + \\sqrt{3}i) = b \\\\ (2 + \\sqrt{3}i)(2 - \\sqrt{3}i)\\gamma = 14 \\end{cases}$$
が成り立つ。これを整理すると，
$$\\begin{cases} 4 + \\gamma = -a \\\\ 4 - 3i^2 + 4\\gamma = b \\\\ (4 - 3i^2)\\gamma = 14 \\end{cases}$$
となり，$i^2 = -1$ に注意すると，
$$\\begin{cases} a = -\\gamma - 4 & \\cdots\\text{①} \\\\ b = 4\\gamma + 7 & \\cdots\\text{②} \\\\ 7\\gamma = 14 & \\cdots\\text{③} \\end{cases}$$
③より，$\\gamma = 2$ であり，これを①，②に代入すると，求める $a$，$b$ の値は，
$$\\mathbf{a = -6, \\quad b = 15}$$`,
    commentary: `$2 + \\sqrt{3}i$ が与式（実数係数の3次方程式）の解なので，$2 - \\sqrt{3}i$ も解であることに注目して，解と係数の関係を使う。`
  },

  48: {
    id: 48,
    chapter: "複素数と方程式",
    title: "1の3乗根 ω の計算",
    target_reidai: 71,
    sources: ["関西大"],
    question: `1の3乗根のうち，虚数であるものの1つを $\\omega$ とする。このとき，
$$\\omega^2 + \\omega = \\fbox{(1)}, \\quad \\omega^{10} + \\omega^5 = \\fbox{(2)}, \\quad \\frac{1}{\\omega^{10}} + \\frac{1}{\\omega^5} + 1 = \\fbox{(3)}, \\quad (\\omega^2 + 5\\omega)^2 + (5\\omega^2 + \\omega)^2 = \\fbox{(4)}$$
である。`,
    answer: `$\\omega$ は1の3乗根で，虚数であるから，
$$\\omega^3 = 1, \\quad \\omega^2 + \\omega + 1 = 0$$
が成り立つ。

(1) $\\omega^2 + \\omega + 1 = 0$ より，
$$\\omega^2 + \\omega = \\mathbf{-1}$$

(2) $\\omega^{10} = (\\omega^3)^3\\cdot\\omega = \\omega$，$\\omega^5 = \\omega^3\\cdot\\omega^2 = \\omega^2$ であることに注意して，
$$\\omega^{10} + \\omega^5 = \\omega + \\omega^2 = \\mathbf{-1}$$

(3) 
$$\\frac{1}{\\omega^{10}} + \\frac{1}{\\omega^5} + 1 = \\frac{1}{\\omega} + \\frac{1}{\\omega^2} + 1 = \\frac{\\omega + 1 + \\omega^2}{\\omega^2} = \\mathbf{0}$$

(4) $a = \\omega^2 + 5\\omega$，$b = 5\\omega^2 + \\omega$ とすると，
$$\\begin{aligned} a + b &= (\\omega^2 + 5\\omega) + (5\\omega^2 + \\omega) \\\\ &= 6(\\omega^2 + \\omega) \\\\ &= 6\\cdot(-1) = -6 \\quad \\cdots\\text{①} \\\\ ab &= (\\omega^2 + 5\\omega)(5\\omega^2 + \\omega) \\\\ &= 5\\omega^4 + 26\\omega^3 + 5\\omega^2 \\\\ &= 5\\omega + 26\\cdot 1 + 5\\omega^2 \\\\ &= 5(\\omega + \\omega^2) + 26 \\\\ &= 5\\cdot(-1) + 26 = 21 \\quad \\cdots\\text{②} \\end{aligned}$$
①，②を用いると，
$$(\\text{与式}) = a^2 + b^2 = (a+b)^2 - 2ab = (-6)^2 - 2\\cdot 21 = 36 - 42 = \\mathbf{-6}$$

**＜補足：いろいろなやり方がある＞**
$\\omega^2 = -\\omega - 1$ であるから，
$$\\begin{aligned} (\\omega^2 + 5\\omega)^2 &= (-\\omega - 1 + 5\\omega)^2 = (4\\omega - 1)^2 \\\\ (5\\omega^2 + \\omega)^2 &= (-5\\omega - 5 + \\omega)^2 = (-4\\omega - 5)^2 \\end{aligned}$$
これより，
$$\\begin{aligned} (\\text{与式}) &= (4\\omega - 1)^2 + (-4\\omega - 5)^2 \\\\ &= 16\\omega^2 - 8\\omega + 1 + 16\\omega^2 + 40\\omega + 25 \\\\ &= 32\\omega^2 + 32\\omega + 26 \\\\ &= 32(\\omega^2 + \\omega) + 26 \\\\ &= 32(-1) + 26 = -6 \\end{aligned}$$`,
    commentary: `**例題71** で学習したように，
$$\\omega^3 = 1, \\quad \\omega^2 + \\omega + 1 = 0$$
に注意して計算する。(4)は，2つのカッコを展開して整理してもよいが，
$$a^2 + b^2 = (a+b)^2 - 2ab$$
であることを用いるのもよい。`
  },

  49: {
    id: 49,
    chapter: "図形と式",
    title: "直線に関して対称な点",
    target_reidai: 74,
    sources: ["関西大"],
    question: `原点が $\\mathrm{O}$ である座標平面上に，点 $\\mathrm{A}(7, 1)$ がある。直線 $l : y = \\dfrac{1}{2}x$ に関して点 $\\mathrm{A}$ と対称な点 $\\mathrm{B}$ の座標を求めよ。`,
    answer: `求める点を $\\mathrm{B}(a, b)$ とする。
線分 $\\mathrm{AB}$ の中点 $\\left(\\dfrac{a+7}{2}, \\dfrac{b+1}{2}\\right)$ が $l$ 上にあるから，
$$\\frac{b+1}{2} = \\frac{1}{2}\\cdot\\frac{a+7}{2}$$
$$2(b+1) = a+7 \\iff -a + 2b = 5 \\quad \\cdots\\text{①}$$

また，直線 $\\mathrm{AB}$ の傾きは $\\dfrac{b-1}{a-7}$ であり，直線 $\\mathrm{AB}$ と $y = \\dfrac{1}{2}x$ は直交するから，
$$\\frac{b-1}{a-7}\\times\\frac{1}{2} = -1$$
$$b-1 = -2(a-7) \\iff 2a + b = 15 \\quad \\cdots\\text{②}$$

①，②を連立して解くと，$a = 5$，$b = 5$ となるから，求める座標は，
$$\\mathbf{B(5, 5)}$$`,
    commentary: `求める点を $\\mathrm{B}(a, b)$ として，
(Ⅰ) 線分 $\\mathrm{AB}$ の中点が $l$ 上にある
(Ⅱ) $(\\text{直線}\\mathrm{AB}) \\perp l$
であることから2つの式を作る。`
  },

  50: {
    id: 50,
    chapter: "図形と式",
    title: "3直線が三角形を作らない条件",
    target_reidai: 73,
    sources: ["西南学院大"],
    question: `直線 $l : x + y - 1 = 0$，$m : x - 3y + 7 = 0$，$n : ax + y - 4 = 0$ が三角形を作らないとする。このとき，定数 $a$ の値をすべて求めよ。`,
    answer: `3直線 $l$，$m$，$n$ の式を変形すると，
$$l : y = -x + 1$$
$$m : y = \\frac{1}{3}x + \\frac{7}{3}$$
$$n : y = -ax + 4$$

$l$，$m$，$n$ によって三角形が作られないのは，次の3つの場合がある。
(ア) $l$ と $n$ が平行のとき
$$-a = -1 \\implies a = 1$$

(イ) $m$ と $n$ が平行のとき
$$-a = \\frac{1}{3} \\implies a = -\\frac{1}{3}$$

(ウ) $l$，$m$，$n$ が1点で交わるとき
$l$，$m$ の式を連立して，$l$ と $m$ の交点の座標を求めると，
$$-x + 1 = \\frac{1}{3}x + \\frac{7}{3} \\implies -\\frac{4}{3}x = \\frac{4}{3} \\implies x = -1, \\ y = 2$$
交点は $(-1, 2)$ である。$n$ がこの点を通るとき，
$$a(-1) + 2 - 4 = 0 \\implies -a - 2 = 0 \\implies a = -2$$

(ア)，(イ)，(ウ)より，求める $a$ の値は，
$$\\mathbf{a = 1, \\ -\\frac{1}{3}, \\ -2}$$`,
    commentary: `「3直線が1点で交わるときにも三角形が作られないこと」を見落としてしまう人が多い問題である。`
  },

  51: {
    id: 51,
    chapter: "図形と式",
    title: "円と直線の交点，弦の長さ",
    target_reidai: 77,
    sources: ["関西大"],
    question: `円 $x^2 + y^2 - 2y = 0$ と直線 $ax - y + 2a = 0$ が異なる2点 $\\mathrm{P}$，$\\mathrm{Q}$ で交わっている。
(1) 円の中心の座標と半径を求めよ。
(2) 定数 $a$ のとり得る値の範囲を求めよ。
(3) 線分 $\\mathrm{PQ}$ の長さが $\\sqrt{2}$ となる $a$ の値を求めよ。`,
    answer: `(1) $x^2 + y^2 - 2y = 0$ を変形すると，
$$x^2 + (y-1)^2 = 1$$
となるので，
$$\\text{中心の座標は } \\mathbf{(0, 1)}, \\quad \\text{半径は } \\mathbf{1}$$

(2) 円の中心を $\\mathrm{A}(0, 1)$ とする。$\\mathrm{A}$ から直線 $ax - y + 2a = 0$ までの距離を $d$ とすると，
$$d = \\frac{|a\\cdot 0 - 1 + 2a|}{\\sqrt{a^2 + (-1)^2}} = \\frac{|2a - 1|}{\\sqrt{a^2 + 1}} \\quad \\cdots\\text{①}$$
円と直線が異なる2点 $\\mathrm{P}$，$\\mathrm{Q}$ で交わるので，$d < 1$（半径）より，
$$\\frac{|2a - 1|}{\\sqrt{a^2 + 1}} < 1 \\iff |2a - 1| < \\sqrt{a^2 + 1}$$
両辺を2乗すると，
$$4a^2 - 4a + 1 < a^2 + 1$$
$$3a^2 - 4a < 0 \\iff a(3a - 4) < 0$$
したがって，
$$\\mathbf{0 < a < \\frac{4}{3}}$$

(3) 線分 $\\mathrm{PQ}$ の中点を $\\mathrm{M}$ とすると，$\\mathrm{PM} = \\dfrac{\\sqrt{2}}{2}$ であり，直角三角形 $\\mathrm{APM}$ に三平方の定理を用いると，
$$d^2 + \\left(\\frac{\\sqrt{2}}{2}\\right)^2 = 1^2 \\implies d^2 + \\frac{1}{2} = 1 \\implies d^2 = \\frac{1}{2}$$
これと①より，
$$\\frac{(2a - 1)^2}{a^2 + 1} = \\frac{1}{2}$$
$$2(4a^2 - 4a + 1) = a^2 + 1$$
$$8a^2 - 8a + 2 = a^2 + 1$$
$$7a^2 - 8a + 1 = 0$$
$$(7a - 1)(a - 1) = 0$$
$$a = \\frac{1}{7}, \\ 1$$
これらはともに $0 < a < \\dfrac{4}{3}$ を満たす。
したがって，
$$\\mathbf{a = \\frac{1}{7}, \\ 1}$$`,
    commentary: `**例題77** の復習である。点と直線の距離の公式を正確に使おう。`
  },

  52: {
    id: 52,
    chapter: "図形と式",
    title: "2円の位置関係（外接と内接）",
    target_reidai: 83,
    sources: ["東洋大"],
    question: `$k > -8$ とする。
円 $C_1 : x^2 + y^2 + 2x - 4y + 1 = 0$ と円 $C_2 : x^2 + y^2 - 4x - 12y + 32 - k = 0$ がただ1つの共有点をもつならば，$k = \\fbox{\\quad}$ または $\\fbox{\\quad}$ である。`,
    answer: `$C_1 : x^2 + y^2 + 2x - 4y + 1 = 0$ を変形すると，
$$(x+1)^2 + (y-2)^2 = 4$$
となるので，$C_1$ は，
$$\\text{中心 } \\mathrm{A}(-1, 2), \\quad \\text{半径 } r_1 = 2$$

$C_2 : x^2 + y^2 - 4x - 12y + 32 - k = 0$ を変形すると，
$$(x-2)^2 + (y-6)^2 = 8 + k \\quad (k > -8)$$
となるので，$C_2$ は，
$$\\text{中心 } \\mathrm{B}(2, 6), \\quad \\text{半径 } r_2 = \\sqrt{8+k}$$

これより，$C_1$ と $C_2$ の中心間距離 $d$ は，
$$d = \\sqrt{\\{2 - (-1)\\}^2 + (6 - 2)^2} = \\sqrt{3^2 + 4^2} = 5$$
である。
$C_2$ の中心 $\\mathrm{B}$ が $C_1$ の外部にあるから，$C_2$ が $C_1$ に内接することはない。このことに注意すると，$C_1$ と $C_2$ がただ1つの共有点をもつのは，次の2つの場合である。

(ア) $C_1$ と $C_2$ が外接するとき
$$d = r_1 + r_2$$
が成り立つから，
$$5 = 2 + \\sqrt{8+k} \\implies \\sqrt{8+k} = 3 \\implies 8+k = 9 \\implies k = 1$$

(イ) $C_1$ が $C_2$ に内接するとき
$$d = r_2 - r_1$$
が成り立つから，
$$5 = \\sqrt{8+k} - 2 \\implies \\sqrt{8+k} = 7 \\implies 8+k = 49 \\implies k = 41$$

(ア)，(イ)より，求める $k$ の値は，
$$\\mathbf{k = 1, \\ 41}$$`,
    commentary: `**例題83** の【One Point コラム】で紹介した内容をここで確認しておこう。
$C_2$ の中心が $C_1$ の外部にあるから，$C_1$ と $C_2$ がただ1つの共有点をもつのは，
(ア) $C_1$ と $C_2$ が外接する
(イ) $C_1$ が $C_2$ に内接する
という2つの場合がある。
$C_1$ と $C_2$ の中心間距離を $d$，$C_1$ の半径を $r_1$，$C_2$ の半径を $r_2$ とすると，(ア)，(イ)は，
(ア) $d = r_1 + r_2$ が成り立つとき
(イ) $d = r_2 - r_1$ が成り立つとき
である。`
  },

  53: {
    id: 53,
    chapter: "図形と式",
    title: "円の方程式の条件と中心の軌跡",
    target_reidai: 78,
    sources: ["駒澤大"],
    question: `方程式 $x^2 + y^2 - 6kx + (12k - 2)y + 46k^2 - 16k + 1 = 0$ が円を表すような定数 $k$ の値の範囲は，$\\fbox{\\quad} < k < \\fbox{\\quad}$ である。
また，$k$ の値がこの範囲で変化するとき，円の中心の軌跡を表す方程式は，
$$y = \\fbox{\\quad}x + \\fbox{\\quad} \\ (\\fbox{\\quad} < x < \\fbox{\\quad})$$
である。`,
    answer: `与式を変形すると，
$$(x - 3k)^2 - 9k^2 + \\{y + (6k - 1)\\}^2 - (6k - 1)^2 + 46k^2 - 16k + 1 = 0$$
$$(x - 3k)^2 + \\{y + (6k - 1)\\}^2 = 9k^2 + (36k^2 - 12k + 1) - 46k^2 + 16k - 1$$
$$(x - 3k)^2 + \\{y - (-6k + 1)\\}^2 = -k^2 + 4k$$
となる。これが円を表すのは，
$$-k^2 + 4k > 0$$
が成り立つときである。これより，
$$k(k - 4) < 0$$
となるので，与式が円を表す $k$ の値の範囲は，
$$\\mathbf{0 < k < 4}$$

次に，中心を $(X, Y)$ とすると，
$$\\begin{cases} X = 3k & \\cdots\\text{①} \\\\ Y = -6k + 1 & \\cdots\\text{②} \\end{cases}$$
①より，$k = \\dfrac{1}{3}X \\ \\cdots\\text{①}'$ となり，②に代入すると，
$$Y = -6\\cdot\\left(\\frac{1}{3}X\\right) + 1 = -2X + 1$$
また，$0 < k < 4$ であるから，これと①'より，
$$0 < \\frac{X}{3} < 4 \\iff 0 < X < 12$$
以上より，中心の軌跡を表す方程式は，
$$y = \\mathbf{-2}x + \\mathbf{1} \\quad (\\mathbf{0} < x < \\mathbf{12})$$`,
    commentary: `方程式 $(x-a)^2 + (y-b)^2 = r^2$ が円を表すのは，右辺が正のときである。このことから，$k$ の値の範囲を定める。
また，中心を $(X, Y)$ として軌跡を求めるときに，$k$ の範囲から，$X$ の範囲に制限が生まれることになる。`
  },

  54: {
    id: 54,
    chapter: "図形と式",
    title: "放物線と直線の交点の中点の軌跡",
    target_reidai: 80,
    sources: ["関西学院大"],
    question: `放物線 $y = x^2 + 1$ と直線 $y = ax$ が異なる2点 $\\mathrm{P}$，$\\mathrm{Q}$ で交わるとき，
(1) 実数 $a$ のとり得る値の範囲を求めよ。
(2) 線分 $\\mathrm{PQ}$ の中点 $\\mathrm{M}$ の描く軌跡を求めよ。`,
    answer: `(1) 
$$\\begin{cases} y = x^2 + 1 & \\cdots\\text{①} \\\\ y = ax & \\cdots\\text{②} \\end{cases}$$
①，②から $y$ を消去すると，
$$x^2 + 1 = ax \\iff x^2 - ax + 1 = 0 \\quad \\cdots\\text{③}$$
③の判別式を $D$ とすると，
$$D = (-a)^2 - 4\\cdot 1\\cdot 1 = a^2 - 4 = (a+2)(a-2)$$
①，②が異なる2点で交わるのは，$D > 0$ が成り立つときであるから，
$$(a+2)(a-2) > 0$$
したがって，
$$\\mathbf{a < -2, \\quad 2 < a}$$

(2) ③の実数解を $\\alpha$，$\\beta$ とすると，解と係数の関係より，
$$\\alpha + \\beta = a, \\quad \\alpha\\beta = 1 \\quad \\cdots\\text{④}$$
が成り立つ。また，$\\alpha$，$\\beta$ は $\\mathrm{P}$，$\\mathrm{Q}$ の $x$ 座標になるから，
$$\\mathrm{P}(\\alpha, a\\alpha), \\quad \\mathrm{Q}(\\beta, a\\beta)$$
と表せる。
ここで，$\\mathrm{M}(X, Y)$ とすると，$\\mathrm{M}$ は線分 $\\mathrm{PQ}$ の中点で，$y = ax$ 上にあるから，
$$\\begin{cases} X = \\dfrac{\\alpha + \\beta}{2} = \\dfrac{a}{2} \\quad (\\text{④より}) & \\cdots\\text{⑤} \\\\ Y = aX & \\cdots\\text{⑥} \\end{cases}$$
⑤より $a = 2X$ であり，これを⑥に代入して $a$ を消去すると，
$$Y = 2X\\cdot X = 2X^2$$
さらに，$a < -2, \\ 2 < a$ であるから，$a = 2X$ より，
$$2X < -2, \\quad 2 < 2X \\iff X < -1, \\quad 1 < X$$
以上より，$\\mathrm{M}$ の軌跡は，
$$\\text{放物線 } \\mathbf{y = 2x^2 \\quad (\\text{ただし, } x < -1, \\ 1 < x)}$$

**＜補足：⑥について＞**
⑥は，$\\mathrm{M}(X, Y)$ が $y = ax$ 上にあることに注目して導いたが，2点 $\\mathrm{P}$，$\\mathrm{Q}$ の $y$ 座標を使って，（⑤も用いて）
$$Y = \\frac{a\\alpha + a\\beta}{2} = a\\cdot\\frac{\\alpha + \\beta}{2} = aX$$
と導くこともできる。`,
    commentary: `2点 $\\mathrm{P}$，$\\mathrm{Q}$ の $x$ 座標は，$x^2 + 1 = ax$，すなわち $x^2 - ax + 1 = 0$ の2解である。この解を実際に解の公式で求めると面倒な式になるので，この解を $\\alpha$，$\\beta$ とおいて解答を進めていく。`
  },

  55: {
    id: 55,
    chapter: "図形と式",
    title: "領域における最大・最小（線形計画法）",
    target_reidai: 82,
    sources: ["青山学院大"],
    question: `次の各問に答えよ。
(1) 円 $(x - 1)^2 + y^2 = 25$ と直線 $y = -\\dfrac{1}{2}x + \\dfrac{3}{2}$ の交点の座標を求めよ。
(2) 連立不等式 $\\begin{cases} (x - 1)^2 + y^2 \\leqq 25 \\\\ y \\geqq -\\dfrac{1}{2}x + \\dfrac{3}{2} \\end{cases}$ の表す領域を $D$ とする。$\\mathrm{P}(x, y)$ が $D$ 内を動くとき，$4x + 3y$ の最大値，最小値を求めよ。`,
    answer: `(1) 
$$\\begin{cases} (x - 1)^2 + y^2 = 25 & \\cdots\\text{①} \\\\ y = -\\dfrac{1}{2}x + \\dfrac{3}{2} & \\cdots\\text{②} \\end{cases}$$
②を①に代入すると，
$$(x - 1)^2 + \\left(-\\frac{1}{2}x + \\frac{3}{2}\\right)^2 = 25$$
両辺に4を掛けて整理すると，
$$4(x - 1)^2 + (-x + 3)^2 = 100$$
$$4(x^2 - 2x + 1) + (x^2 - 6x + 9) = 100$$
$$5x^2 - 14x - 87 = 0$$
$$(x + 3)(5x - 29) = 0$$
$$x = -3, \\quad \\frac{29}{5}$$
$x = -3$ のとき，②より $y = -\\dfrac{1}{2}(-3) + \\dfrac{3}{2} = 3$
$x = \\dfrac{29}{5}$ のとき，②より $y = -\\dfrac{1}{2}\\cdot\\dfrac{29}{5} + \\dfrac{3}{2} = -\\dfrac{7}{5}$
以上より，①，②の交点の座標は，
$$\\mathbf{(-3, 3), \\quad \\left(\\frac{29}{5}, -\\frac{7}{5}\\right)}$$

(2) 領域 $D$ は，円 $(x-1)^2 + y^2 \\leqq 25$ の内部および周上で，直線 $y \\geqq -\\dfrac{1}{2}x + \\dfrac{3}{2}$ の上側の部分（境界を含む）である。
$4x + 3y = k$ とおくと，
$$y = -\\frac{4}{3}x + \\frac{k}{3} \\quad \\cdots\\text{③}$$
③は傾き $-\\dfrac{4}{3}$，$y$ 切片 $\\dfrac{k}{3}$ の直線である。
③を $D$ と共有点をもつ範囲で動かして，$y$ 切片 $\\dfrac{k}{3}$ の最大値，最小値に注目する。

(ア) ③が点 $(-3, 3)$ を通るときに $y$ 切片は最小になり，
$$k = 4\\cdot(-3) + 3\\cdot 3 = -12 + 9 = -3$$

(イ) ③が第1象限で円 $(x-1)^2 + y^2 = 25$ に接するときに $y$ 切片は最大になる。
このとき，中心 $(1, 0)$ から直線 ③ : $-4x - 3y + k = 0$ までの距離は半径 5 に等しいので，
$$\\frac{|-4\\cdot 1 - 3\\cdot 0 + k|}{\\sqrt{(-4)^2 + (-3)^2}} = 5$$
$$\\frac{|-4 + k|}{5} = 5 \\iff |-4 + k| = 25$$
$$-4 + k = \\pm 25 \\implies k = 29, \\ -21$$
③が第1象限で円に接するとき，$k > 0$ であるから，$k = 29$ である。

(ア)，(イ)より，
$$\\mathbf{\\text{最大値 } 29, \\quad \\text{最小値 } -3}$$`,
    commentary: `$4x + 3y = k$ とおくと，$y = -\\dfrac{4}{3}x + \\dfrac{k}{3}$ となり，これが円 $(x-1)^2 + y^2 = 25$ と第1象限で接するときに，$k$ は最大になる。
そのときの $k$ の値は，$(\\text{中心から直線までの距離}) = (\\text{半径})$ が成り立つことを利用して求める。`
  },

  56: {
    id: 56,
    chapter: "三角関数",
    title: "三角方程式・不等式",
    target_reidai: 84,
    sources: ["京都産業大","津田塾大","福島大"],
    question: `次の方程式，不等式を解け。ただし，$0 \\leqq \\theta < 2\\pi$ とする。
(1) $2\\cos 2\\theta + 12\\sin\\theta - 7 = 0$
(2) $\\sin 2\\theta > \\cos\\theta$
(3) $\\sin\\theta - \\sqrt{3}\\cos\\theta < 0$`,
    answer: `(1) $2\\cos 2\\theta + 12\\sin\\theta - 7 = 0$ より，
$$2(1 - 2\\sin^2\\theta) + 12\\sin\\theta - 7 = 0$$
$$-4\\sin^2\\theta + 12\\sin\\theta - 5 = 0$$
$$4\\sin^2\\theta - 12\\sin\\theta + 5 = 0$$
$$(2\\sin\\theta - 1)(2\\sin\\theta - 5) = 0$$
$-1 \\leqq \\sin\\theta \\leqq 1$ より，$\\sin\\theta = \\dfrac{1}{2}$ であるから，$0 \\leqq \\theta < 2\\pi$ において，
$$\\mathbf{\\theta = \\frac{\\pi}{6}, \\ \\frac{5}{6}\\pi}$$

(2) $\\sin 2\\theta > \\cos\\theta$ より，
$$2\\sin\\theta\\cos\\theta > \\cos\\theta$$
$$2\\sin\\theta\\cos\\theta - \\cos\\theta > 0$$
$$\\cos\\theta(2\\sin\\theta - 1) > 0 \\quad \\cdots\\text{①}$$
①より，
$$\\begin{cases} \\cos\\theta > 0 \\\\ 2\\sin\\theta - 1 > 0 \\end{cases} \\quad \\text{または} \\quad \\begin{cases} \\cos\\theta < 0 \\\\ 2\\sin\\theta - 1 < 0 \\end{cases}$$
すなわち，
$$\\begin{cases} \\cos\\theta > 0 \\\\ \\sin\\theta > \\dfrac{1}{2} \\end{cases} \\quad \\text{または} \\quad \\begin{cases} \\cos\\theta < 0 \\\\ \\sin\\theta < \\dfrac{1}{2} \\end{cases}$$
単位円から，
$$\\mathbf{\\frac{\\pi}{6} < \\theta < \\frac{\\pi}{2}, \\quad \\frac{5}{6}\\pi < \\theta < \\frac{3}{2}\\pi}$$

(3) $\\sin\\theta - \\sqrt{3}\\cos\\theta < 0$ より，
$$2\\sin\\left(\\theta - \\frac{\\pi}{3}\\right) < 0$$
$$\\sin\\left(\\theta - \\frac{\\pi}{3}\\right) < 0 \\quad \\cdots\\text{①}$$
$\\theta - \\dfrac{\\pi}{3} = t$ とおくと，①より，
$$\\sin t < 0 \\quad \\cdots\\text{②}$$
また，$0 \\leqq \\theta < 2\\pi$ より，
$$-\\frac{\\pi}{3} \\leqq t < \\frac{5}{3}\\pi \\quad \\cdots\\text{③}$$
②，③を満たす $t$ の範囲は，単位円より，
$$-\\frac{\\pi}{3} \\leqq t < 0, \\quad \\pi < t < \\frac{5}{3}\\pi$$
であるから，
$$-\\frac{\\pi}{3} \\leqq \\theta - \\frac{\\pi}{3} < 0, \\quad \\pi < \\theta - \\frac{\\pi}{3} < \\frac{5}{3}\\pi$$
各辺に $\\dfrac{\\pi}{3}$ を足して，
$$\\mathbf{0 \\leqq \\theta < \\frac{\\pi}{3}, \\quad \\frac{4}{3}\\pi < \\theta < 2\\pi}$$`,
    commentary: `(1) $\\sin\\theta$ のみの式を作る。
(2) 2倍角の公式を用いると，$2\\sin\\theta\\cos\\theta > \\cos\\theta$ となるが，安易に両辺を $\\cos\\theta$ で割るという変形をしてはいけない。$\\cos\\theta$ が負の場合には不等号の向きが変わることに注意しないといけない。また，$\\cos\\theta = 0$ のときは割ることもできない。解答のように変形して，符号の組合せを考えて不等式を扱うとよい。
(3) **例題84** と同じように置きかえを利用すると考えやすい。`
  },

  57: {
    id: 57,
    chapter: "三角関数",
    title: "三角関数の合成と最大・最小",
    target_reidai: 88,
    sources: ["福島大"],
    question: `$0 \\leqq x \\leqq \\pi$ とする。$y = \\sin x + 2\\sin\\left(x + \\dfrac{\\pi}{3}\\right)$ の最大値，最小値を求めよ。`,
    answer: `加法定理を用いると，
$$\\begin{aligned} y &= \\sin x + 2\\sin\\left(x + \\frac{\\pi}{3}\\right) \\\\ &= \\sin x + 2\\left(\\sin x\\cos\\frac{\\pi}{3} + \\cos x\\sin\\frac{\\pi}{3}\\right) \\\\ &= \\sin x + 2\\left(\\frac{1}{2}\\sin x + \\frac{\\sqrt{3}}{2}\\cos x\\right) \\\\ &= \\sin x + \\sin x + \\sqrt{3}\\cos x \\\\ &= 2\\sin x + \\sqrt{3}\\cos x \\\\ &= \\sqrt{7}\\sin(x + \\alpha) \\end{aligned}$$
ただし，$\\alpha$ は，
$$\\sin\\alpha = \\frac{\\sqrt{3}}{\\sqrt{7}}, \\quad \\cos\\alpha = \\frac{2}{\\sqrt{7}}$$
を満たす角である。

$0 \\leqq x \\leqq \\pi$ より，
$$\\alpha \\leqq x + \\alpha \\leqq \\pi + \\alpha$$
である。
単位円から，
$$-\\frac{\\sqrt{3}}{\\sqrt{7}} \\leqq \\sin(x + \\alpha) \\leqq 1$$
であるから，
$$-\\sqrt{3} \\leqq \\sqrt{7}\\sin(x + \\alpha) \\leqq \\sqrt{7}$$
$$-\\sqrt{3} \\leqq y \\leqq \\sqrt{7}$$
したがって，
$$\\mathbf{\\text{最大値 } \\sqrt{7}, \\quad \\text{最小値 } -\\sqrt{3}}$$`,
    commentary: `**例題88** の復習である。$r\\sin(x+\\alpha)$ の形に変形して考えるが，角 $\\alpha$ の具体的な値を求めることはできない。そこで，文字 $\\alpha$ を使って合成を行い，最大，最小を考えていく。このときに，$\\sin\\alpha$，$\\cos\\alpha$ の値をきちんと把握しておかないといけない。`
  },

  58: {
    id: 58,
    chapter: "三角関数",
    title: "2倍角の公式と三角関数の最大・最小",
    target_reidai: 89,
    sources: ["関西学院大"],
    question: `関数 $y = 2\\sqrt{3}\\sin\\theta\\cos\\theta + 4\\cos^2\\theta - 2\\sin^2\\theta \\ \\left(0 \\leqq \\theta \\leqq \\dfrac{\\pi}{2}\\right)$ がある。$y$ の最大値，最小値と，そのときの $\\theta$ の値を求めよ。`,
    answer: `2倍角の公式を用いると，
$$\\begin{aligned} y &= 2\\sqrt{3}\\sin\\theta\\cos\\theta + 4\\cos^2\\theta - 2\\sin^2\\theta \\\\ &= 2\\sqrt{3}\\cdot\\frac{1}{2}\\sin 2\\theta + 4\\cdot\\frac{1}{2}(1 + \\cos 2\\theta) - 2\\cdot\\frac{1}{2}(1 - \\cos 2\\theta) \\\\ &= \\sqrt{3}\\sin 2\\theta + 2(1 + \\cos 2\\theta) - (1 - \\cos 2\\theta) \\\\ &= \\sqrt{3}\\sin 2\\theta + 3\\cos 2\\theta + 1 \\\\ &= 2\\sqrt{3}\\sin\\left(2\\theta + \\frac{\\pi}{3}\\right) + 1 \\end{aligned}$$

$0 \\leqq \\theta \\leqq \\dfrac{\\pi}{2}$ より，$0 \\leqq 2\\theta \\leqq \\pi$ であり，
$$\\frac{\\pi}{3} \\leqq 2\\theta + \\frac{\\pi}{3} \\leqq \\frac{4}{3}\\pi$$
上の単位円から，
$$-\\frac{\\sqrt{3}}{2} \\leqq \\sin\\left(2\\theta + \\frac{\\pi}{3}\\right) \\leqq 1$$
であるから，
$$-3 \\leqq 2\\sqrt{3}\\sin\\left(2\\theta + \\frac{\\pi}{3}\\right) \\leqq 2\\sqrt{3}$$
$$-2 \\leqq 2\\sqrt{3}\\sin\\left(2\\theta + \\frac{\\pi}{3}\\right) + 1 \\leqq 2\\sqrt{3} + 1$$
$$-2 \\leqq y \\leqq 2\\sqrt{3} + 1$$

最大値 $2\\sqrt{3} + 1$ をとるとき，$2\\theta + \\dfrac{\\pi}{3} = \\dfrac{\\pi}{2}$ より，$\\theta = \\dfrac{\\pi}{12}$
また，最小値 $-2$ をとるとき，$2\\theta + \\dfrac{\\pi}{3} = \\dfrac{4}{3}\\pi$ より，$\\theta = \\dfrac{\\pi}{2}$

以上より，
$$\\mathbf{\\text{最大値 } 2\\sqrt{3} + 1 \\ \\left(\\theta = \\frac{\\pi}{12} \\text{ のとき}\\right), \\quad \\text{最小値 } -2 \\ \\left(\\theta = \\frac{\\pi}{2} \\text{ のとき}\\right)}$$`,
    commentary: `2倍角の公式を使って，与えられた式を $2\\theta$ で表すタイプ（倍角戻し）である。`
  },

  59: {
    id: 59,
    chapter: "三角関数",
    title: "sin x - cos x = t とおく三角関数の最大・最小",
    target_reidai: 91,
    sources: ["南山大"],
    question: `関数 $y = 4\\sin x\\cos x - 2(\\sin x - \\cos x) + 1$ を考える。
$0 \\leqq x \\leqq \\pi$ のとき，$t = \\sin x - \\cos x$ のとり得る値の範囲は $\\fbox{\\quad}$ であり，$y$ のとり得る値の範囲は $\\fbox{\\quad}$ である。`,
    answer: `$$y = 4\\sin x\\cos x - 2(\\sin x - \\cos x) + 1 \\quad \\cdots\\text{①}$$
$t = \\sin x - \\cos x \\ \\cdots\\text{②}$ を変形すると，
$$t = \\sqrt{2}\\sin\\left(x - \\frac{\\pi}{4}\\right)$$
$0 \\leqq x \\leqq \\pi$ より，$-\\dfrac{\\pi}{4} \\leqq x - \\dfrac{\\pi}{4} \\leqq \\dfrac{3}{4}\\pi$ であるから，
$$-\\frac{1}{\\sqrt{2}} \\leqq \\sin\\left(x - \\frac{\\pi}{4}\\right) \\leqq 1$$
よって，
$$-1 \\leqq \\sqrt{2}\\sin\\left(x - \\frac{\\pi}{4}\\right) \\leqq \\sqrt{2}$$
これより，$t$ のとり得る値の範囲は，
$$\\mathbf{-1 \\leqq t \\leqq \\sqrt{2}}$$

②の両辺を2乗すると，
$$\\sin^2 x - 2\\sin x\\cos x + \\cos^2 x = t^2$$
$$1 - 2\\sin x\\cos x = t^2$$
$$\\sin x\\cos x = \\frac{1}{2}(1 - t^2)$$
これと②を①に代入すると，
$$\\begin{aligned} y &= 4\\cdot\\frac{1}{2}(1 - t^2) - 2t + 1 \\\\ &= -2t^2 - 2t + 3 \\\\ &= -2\\left(t + \\frac{1}{2}\\right)^2 + \\frac{7}{2} \\quad \\cdots\\text{③} \\end{aligned}$$
$-1 \\leqq t \\leqq \\sqrt{2}$ において，③の2次関数は，
- $t = -\\dfrac{1}{2}$ で最大値 $\\dfrac{7}{2}$
- $t = \\sqrt{2}$ で最小値 $-2(\\sqrt{2})^2 - 2\\sqrt{2} + 3 = -1 - 2\\sqrt{2}$
をとる。
グラフより，$y$ のとり得る値の範囲は，
$$\\mathbf{-1 - 2\\sqrt{2} \\leqq y \\leqq \\frac{7}{2}}$$`,
    commentary: `**例題91** で $\\sin x + \\cos x = t$ とおいて考える問題を学習した。これと同様にして，本問は $\\sin x - \\cos x$ と $\\sin x\\cos x$ が混在しているので，$\\sin x - \\cos x = t$ とおいて考える。`
  },

  60: {
    id: 60,
    chapter: "指数・対数関数",
    title: "指数・対数の計算",
    target_reidai: 94,
    sources: ["鳥取大"],
    question: `次の式を計算せよ。
(1) $(2^{\\frac{4}{3}} \\times 2^{-1})^6 \\times \\left\\{\\left(\\dfrac{16}{81}\\right)^{-\\frac{7}{6}}\\right\\}^{\\frac{3}{7}}$
(2) $4\\log_4\\sqrt{2} + \\dfrac{1}{2}\\log_4\\dfrac{1}{8} - \\dfrac{3}{2}\\log_4 8$`,
    answer: `(1)
$$\\begin{aligned} (2^{\\frac{4}{3}} \\times 2^{-1})^6 \\times \\left\\{\\left(\\frac{16}{81}\\right)^{-\\frac{7}{6}}\\right\\}^{\\frac{3}{7}} &= (2^{\\frac{4}{3} - 1})^6 \\times \\left(\\frac{16}{81}\\right)^{-\\frac{7}{6}\\cdot\\frac{3}{7}} \\\\ &= (2^{\\frac{1}{3}})^6 \\times \\left(\\frac{16}{81}\\right)^{-\\frac{1}{2}} \\\\ &= 2^2 \\times \\left\\{\\left(\\frac{4}{9}\\right)^2\\right\\}^{-\\frac{1}{2}} \\\\ &= 2^2 \\times \\left(\\frac{4}{9}\\right)^{-1} \\\\ &= 4 \\times \\frac{9}{4} \\\\ &= \\mathbf{9} \\end{aligned}$$

(2)
$$\\begin{aligned} 4\\log_4\\sqrt{2} + \\frac{1}{2}\\log_4\\frac{1}{8} - \\frac{3}{2}\\log_4 8 &= 4\\log_4 2^{\\frac{1}{2}} + \\frac{1}{2}\\log_4 2^{-3} - \\frac{3}{2}\\log_4 2^3 \\\\ &= 4\\cdot\\frac{1}{2}\\log_4 2 + \\frac{1}{2}\\cdot(-3)\\log_4 2 - \\frac{3}{2}\\cdot 3\\log_4 2 \\\\ &= 2\\log_4 2 - \\frac{3}{2}\\log_4 2 - \\frac{9}{2}\\log_4 2 \\\\ &= \\left(2 - \\frac{3}{2} - \\frac{9}{2}\\right)\\log_4 2 \\\\ &= -4\\log_4 2 \\\\ &= -\\log_4 2^4 \\\\ &= -\\log_4 4^2 \\\\ &= -2\\log_4 4 \\\\ &= \\mathbf{-2} \\end{aligned}$$`,
    commentary: `基本的な計算問題であるが，本問を通して指数，対数の公式を見直しておこう。`
  },

  61: {
    id: 61,
    chapter: "指数・対数関数",
    title: "指数の条件式と式の値，対数",
    target_reidai: 92,
    sources: ["富山大","中央大"],
    question: `[1] 実数 $x$，$y$ が $2^x = 7^y = \\sqrt{14}$ を満たすとき，$\\dfrac{1}{x} + \\dfrac{1}{y}$ の値を求めよ。
[2] $8^{\\log_2 5}$ の値を求めよ。`,
    answer: `[1] $2^x = 7^y = \\sqrt{14}$ より，
$$x = \\log_2 \\sqrt{14} = \\frac{\\log_{14}\\sqrt{14}}{\\log_{14}2}$$
$$y = \\log_7 \\sqrt{14} = \\frac{\\log_{14}\\sqrt{14}}{\\log_{14}7}$$
となり，$\\log_{14}\\sqrt{14} = \\dfrac{1}{2}$ であるから，
$$x = \\frac{1}{2\\log_{14}2}, \\quad y = \\frac{1}{2\\log_{14}7}$$
これらの逆数を用いると，
$$\\begin{aligned} \\frac{1}{x} + \\frac{1}{y} &= 2\\log_{14}2 + 2\\log_{14}7 \\\\ &= 2(\\log_{14}2 + \\log_{14}7) \\\\ &= 2\\log_{14}14 \\\\ &= \\mathbf{2} \\end{aligned}$$

[2] 
$$\\begin{aligned} 8^{\\log_2 5} &= (2^3)^{\\log_2 5} = (2^{\\log_2 5})^3 \\\\ &= 5^3 \\\\ &= \\mathbf{125} \\end{aligned}$$`,
    commentary: `**例題92** の【One Point コラム】で，「指数と対数の関係」として，
$$a^x = M \\text{ のとき}, \\quad x = \\log_a M \\quad \\cdots(\\bigstar)$$
であることを確認している。$a^x = M$ を満たす $x$ は $\\log_a M$ であるから，これを代入すると，
$$a^{\\log_a M} = M$$
が成り立つことが分かる。[2]では，この関係を用いる。
なお，[1]では $(\\bigstar)$ を用いるが，底の値はそろえて扱うべきであり，2と7から連想される14で底をそろえて計算を進める。`
  },

  62: {
    id: 62,
    chapter: "指数・対数関数",
    title: "指数方程式・指数不等式",
    target_reidai: 93,
    sources: ["玉川大","岡山県立大","関西大"],
    question: `次の方程式，不等式を解け。
(1) $2^{2x+1} + 2^x - 1 = 0$
(2) $4^x + 2^{1-x} - 5 = 0$
(3) $9^x + 3^{x+1} - 4 \\leqq 0$
(4) $\\left(\\dfrac{1}{4}\\right)^x - 9\\left(\\dfrac{1}{2}\\right)^{x-1} + 32 \\leqq 0$`,
    answer: `(1) $2^{2x+1} + 2^x - 1 = 0 \\quad \\cdots\\text{①}$
$2^{2x+1} = 2^{2x}\\cdot 2^1 = 2\\cdot(2^x)^2$ であるから，①より，
$$2\\cdot(2^x)^2 + 2^x - 1 = 0 \\quad \\cdots\\text{②}$$
$2^x = t$ とすると，$t > 0$ であり，②より，
$$2t^2 + t - 1 = 0$$
$$(2t - 1)(t + 1) = 0$$
$t > 0$ であるから，$t = \\dfrac{1}{2}$ である。よって，
$$2^x = \\frac{1}{2} (= 2^{-1}) \\implies \\mathbf{x = -1}$$

(2) $4^x + 2^{1-x} - 5 = 0 \\quad \\cdots\\text{①}$
①において，
$$4^x = (2^2)^x = (2^x)^2, \\quad 2^{1-x} = 2^1\\cdot 2^{-x} = 2\\cdot\\frac{1}{2^x}$$
であるから，①より，
$$(2^x)^2 + 2\\cdot\\frac{1}{2^x} - 5 = 0 \\quad \\cdots\\text{②}$$
$2^x = t$ とすると，$t > 0$ であり，②より，
$$t^2 + 2\\cdot\\frac{1}{t} - 5 = 0$$
$$t^3 - 5t + 2 = 0$$
$$(t - 2)(t^2 + 2t - 1) = 0$$
$$t = 2, \\ -1 \\pm \\sqrt{2}$$
$t > 0$ であるから，$t = 2, \\ -1 + \\sqrt{2}$ である。
- $t = 2$ より，$2^x = 2 \\implies x = 1$
- $t = -1 + \\sqrt{2}$ より，$2^x = -1 + \\sqrt{2} \\implies x = \\log_2(-1 + \\sqrt{2})$
以上より，
$$\\mathbf{x = 1, \\quad \\log_2(-1 + \\sqrt{2})}$$

(3) $9^x + 3^{x+1} - 4 \\leqq 0 \\quad \\cdots\\text{①}$
①において，
$$9^x = (3^2)^x = (3^x)^2, \\quad 3^{x+1} = 3^x\\cdot 3^1 = 3\\cdot 3^x$$
であるから，①より，
$$(3^x)^2 + 3\\cdot 3^x - 4 \\leqq 0 \\quad \\cdots\\text{②}$$
$3^x = t$ とすると，$t > 0$ であり，②より，
$$t^2 + 3t - 4 \\leqq 0$$
$$(t + 4)(t - 1) \\leqq 0 \\quad \\cdots\\text{③}$$
$t > 0$ より $t + 4 > 0$ であるから，③において，
$$t - 1 \\leqq 0$$
である。これより，$t \\leqq 1$ となるから，
$$3^x \\leqq 1 (= 3^0) \\implies \\mathbf{x \\leqq 0}$$

(4) $\\left(\\dfrac{1}{4}\\right)^x - 9\\left(\\dfrac{1}{2}\\right)^{x-1} + 32 \\leqq 0 \\quad \\cdots\\text{①}$
①において，
$$\\left(\\frac{1}{4}\\right)^x = \\left\\{\\left(\\frac{1}{2}\\right)^2\\right\\}^x = \\left\\{\\left(\\frac{1}{2}\\right)^x\\right\\}^2$$
$$9\\left(\\frac{1}{2}\\right)^{x-1} = 9\\left(\\frac{1}{2}\\right)^x\\left(\\frac{1}{2}\\right)^{-1} = 18\\left(\\frac{1}{2}\\right)^x$$
であるから，
$$\\left\\{\\left(\\frac{1}{2}\\right)^x\\right\\}^2 - 18\\left(\\frac{1}{2}\\right)^x + 32 \\leqq 0 \\quad \\cdots\\text{②}$$
$\\left(\\dfrac{1}{2}\\right)^x = t$ とすると，$t > 0$ であり，②より，
$$t^2 - 18t + 32 \\leqq 0$$
$$(t - 2)(t - 16) \\leqq 0$$
$$2 \\leqq t \\leqq 16$$
よって，
$$2 \\leqq \\left(\\frac{1}{2}\\right)^x \\leqq 16$$
$$2^1 \\leqq 2^{-x} \\leqq 2^4$$
底2は1より大きいので，
$$1 \\leqq -x \\leqq 4$$
したがって，
$$\\mathbf{-4 \\leqq x \\leqq -1}$$

**＜補足：$2 \\leqq t \\leqq 16$ の後について＞**
$$2 = \\left(\\frac{1}{2}\\right)^{-1}, \\quad 16 = \\left(\\frac{1}{2}\\right)^{-4}$$
であるから，$2 \\leqq t \\leqq 16$ より，
$$\\left(\\frac{1}{2}\\right)^{-1} \\leqq \\left(\\frac{1}{2}\\right)^x \\leqq \\left(\\frac{1}{2}\\right)^{-4}$$
となる。底が1より小さいことに注意すると，
$$-1 \\geqq x \\geqq -4 \\iff -4 \\leqq x \\leqq -1$$
となる。`,
    commentary: `どの問題も，置きかえを利用して2次方程式などを作って考える頻出問題であり，確実に正解したい。(4)は底の値に注意して丁寧に不等式を扱わないといけない。`
  },

  63: {
    id: 63,
    chapter: "指数・対数関数",
    title: "対数方程式・対数不等式",
    target_reidai: 97,
    sources: ["専修大","摂南大","三重大"],
    question: `次の方程式，不等式を解け。
(1) $\\log_6(x-4) + \\log_6(2x-7) = 2$
(2) $\\log_2(x-1) - \\log_{\\frac{1}{2}}(x-3) < 3$
(3) $\\log_{\\frac{1}{2}}(2x^2 - 3x - 9) > \\log_{\\frac{1}{2}}(x^2 - 4x + 3)$`,
    answer: `(1) $\\log_6(x-4) + \\log_6(2x-7) = 2 \\quad \\cdots\\text{①}$
真数は正であるから，
$$x - 4 > 0 \\quad \\text{かつ} \\quad 2x - 7 > 0$$
$$x > 4 \\quad \\text{かつ} \\quad x > \\frac{7}{2} \\implies x > 4 \\quad \\cdots\\text{②}$$
①より，
$$\\log_6(x-4)(2x-7) = \\log_6 6^2$$
$$\\log_6(2x^2 - 15x + 28) = \\log_6 36$$
これより，
$$2x^2 - 15x + 28 = 36$$
$$2x^2 - 15x - 8 = 0$$
$$(x - 8)(2x + 1) = 0$$
②を考えると，$x > 4$ であるから，
$$\\mathbf{x = 8}$$

(2) $\\log_2(x-1) - \\log_{\\frac{1}{2}}(x-3) < 3 \\quad \\cdots\\text{①}$
真数は正であるから，
$$x - 1 > 0 \\quad \\text{かつ} \\quad x - 3 > 0$$
$$x > 1 \\quad \\text{かつ} \\quad x > 3 \\implies x > 3 \\quad \\cdots\\text{②}$$
①において，
$$\\log_{\\frac{1}{2}}(x-3) = \\frac{\\log_2(x-3)}{\\log_2\\frac{1}{2}} = \\frac{\\log_2(x-3)}{-1} = -\\log_2(x-3)$$
であるから，①より，
$$\\log_2(x-1) + \\log_2(x-3) < 3$$
$$\\log_2(x-1)(x-3) < \\log_2 2^3$$
$$\\log_2(x^2 - 4x + 3) < \\log_2 8$$
底は1より大きいので，
$$x^2 - 4x + 3 < 8$$
$$x^2 - 4x - 5 < 0$$
$$(x + 1)(x - 5) < 0$$
$$-1 < x < 5 \\quad \\cdots\\text{③}$$
②，③より，
$$\\mathbf{3 < x < 5}$$

(3) $\\log_{\\frac{1}{2}}(2x^2 - 3x - 9) > \\log_{\\frac{1}{2}}(x^2 - 4x + 3)$
真数は正であるから，
$$\\begin{cases} 2x^2 - 3x - 9 > 0 & \\cdots\\text{①} \\\\ x^2 - 4x + 3 > 0 & \\cdots\\text{②} \\end{cases}$$
①より，$(2x+3)(x-3) > 0$ となり，
$$x < -\\frac{3}{2}, \\quad 3 < x$$
②より，$(x-1)(x-3) > 0$ となり，
$$x < 1, \\quad 3 < x$$
これらより，①かつ②が成り立つ $x$ の範囲は，
$$x < -\\frac{3}{2}, \\quad 3 < x \\quad \\cdots\\text{③}$$
与式の底 $\\dfrac{1}{2}$ は，$0 < \\dfrac{1}{2} < 1$ であるから，
$$2x^2 - 3x - 9 < x^2 - 4x + 3$$
$$x^2 + x - 12 < 0$$
$$(x + 4)(x - 3) < 0$$
$$-4 < x < 3 \\quad \\cdots\\text{④}$$
したがって，③，④より，
$$\\mathbf{-4 < x < -\\frac{3}{2}}$$`,
    commentary: `真数条件を調べ忘れるようなミスはしていないだろうか。最初に真数条件を調べることを習慣としておきたい。
(2)は底を2にそろえて考えるとよいだろう。
(3)は底が1より小さいので，両辺の真数を比較するときに，不等号の向きに注意しよう。`
  },

  64: {
    id: 64,
    chapter: "指数・対数関数",
    title: "相加相乗平均と関数の最大・最小",
    target_reidai: 95,
    sources: ["釧路公立大"],
    question: `関数 $f(x) = 2^x + 2^{-x} - (2^{2x+2} + 2^{-2x+2})$ の最大値を求めよ。`,
    answer: `$f(x) = 2^x + 2^{-x} - (2^{2x+2} + 2^{-2x+2})$
$= 2^x + 2^{-x} - (2^{2x}\\cdot 2^2 + 2^{-2x}\\cdot 2^2)$
$= 2^x + 2^{-x} - 4(2^{2x} + 2^{-2x}) \\quad \\cdots\\text{①}$

$2^x + 2^{-x} = t$ とするとき，これを2乗すると，
$$(2^x)^2 + 2 + (2^{-x})^2 = t^2$$
$$2^{2x} + 2^{-2x} = t^2 - 2$$
これを用いると，①より，
$$\\begin{aligned} f(x) &= t - 4(t^2 - 2) \\\\ &= -4t^2 + t + 8 \\\\ &= -4\\left(t - \\frac{1}{8}\\right)^2 + \\frac{129}{16} \\quad (= g(t) \\text{ とする}) \\end{aligned}$$

ここで，$2^x > 0$，$2^{-x} > 0$ であり，相加平均と相乗平均の大小関係を用いると，
$$2^x + 2^{-x} \\geqq 2\\sqrt{2^x\\cdot 2^{-x}} = 2$$
$$t \\geqq 2 \\quad (\\text{等号は } 2^x = 2^{-x} \\iff x = 0 \\text{ で成立})$$

$y = g(t)$ のグラフから，$t \\geqq 2$ における $g(t)$ の最大値は，
$$g(2) = -4\\cdot 2^2 + 2 + 8 = -16 + 2 + 8 = -6$$
と分かり，$f(x)$ の最大値は，$t \\geqq 2$ における $g(t)$ の最大値と一致するので，
$$\\mathbf{\\text{最大値 } -6}$$`,
    commentary: `$2^x + 2^{-x} = t$ とおいて $f(x)$ を $t$ で表して考える。このとき，$t$ のとり得る値の範囲を相加平均と相乗平均の大小関係を用いて求めるところが重要である。`
  },

  65: {
    id: 65,
    chapter: "指数・対数関数",
    title: "対数を含む関数の最大・最小",
    target_reidai: 99,
    sources: ["名城大"],
    question: `次の各問に答えよ。
[1] $x > 0$ とする。$\\log_3 x^2 + (\\log_3 x)^2$ の最小値を求めよ。
[2] $x > 0$，$y > 0$，$x + 3y = 18$ とする。$\\log_3 x + \\log_3 y$ の最大値を求めよ。`,
    answer: `[1] $\\log_3 x = t$ とおくと，
$$\\begin{aligned} \\log_3 x^2 + (\\log_3 x)^2 &= 2\\log_3 x + (\\log_3 x)^2 \\\\ &= 2t + t^2 \\\\ &= (t + 1)^2 - 1 \\quad \\cdots\\text{①} \\end{aligned}$$
$x > 0$ のとき，$t$ はすべての実数をとるから，①より，
$$\\mathbf{\\text{最小値 } -1}$$

[2] $x + 3y = 18$ より，
$$x = 18 - 3y \\quad \\cdots\\text{①}$$
$x > 0$ であるから，①において，
$$18 - 3y > 0 \\implies y < 6$$
これと $y > 0$ から，
$$0 < y < 6$$
①を用いると，
$$\\begin{aligned} \\log_3 x + \\log_3 y &= \\log_3(18 - 3y) + \\log_3 y \\\\ &= \\log_3(18y - 3y^2) \\\\ &= \\log_3\\{-3(y - 3)^2 + 27\\} \\quad \\cdots\\text{②} \\end{aligned}$$
②の底は1より大きいので，②が最大になるのは，②の真数が最大になるときである。
$0 < y < 6$ において，②の真数は $y = 3$ のとき最大値 27 をとるから，求める最大値は，
$$\\log_3 27 = \\log_3 3^3 = \\mathbf{3}$$`,
    commentary: `[1] $\\log_3 x = t$ とおいて2次関数を作る。
[2] 条件式から $x = 18 - 3y$ となるので，$x$ を消去して $y$ だけの式にして考える。$y$ の範囲にも注意しよう。`
  },

  66: {
    id: 66,
    chapter: "指数・対数関数",
    title: "常用対数の応用（桁数と小数首位）",
    target_reidai: 102,
    sources: ["南山大","成蹊大"],
    question: `$\\log_{10}2 = 0.3010$，$\\log_{10}3 = 0.4771$ として，次の問に答えよ。
(1) $15^{31}$ は何桁の数か。
(2) $\\left(\\dfrac{3}{5}\\right)^{100}$ は小数第何位にはじめて0でない数字が現れるか。`,
    answer: `まず，$\\log_{10}5$ の値を求めると，
$$\\log_{10}5 = \\log_{10}\\frac{10}{2} = \\log_{10}10 - \\log_{10}2 = 1 - 0.3010 = 0.6990$$
である。

(1) $15^{31}$ が $n$ 桁の整数であるとき，
$$10^{n-1} \\leqq 15^{31} < 10^n \\quad \\cdots\\text{①}$$
である。①で常用対数をとると，
$$\\log_{10}10^{n-1} \\leqq \\log_{10}15^{31} < \\log_{10}10^n$$
$$n - 1 \\leqq \\log_{10}15^{31} < n \\quad \\cdots\\text{②}$$
ここで，
$$\\begin{aligned} \\log_{10}15^{31} &= 31\\times\\log_{10}15 \\\\ &= 31(\\log_{10}3 + \\log_{10}5) \\\\ &= 31(0.4771 + 0.6990) \\\\ &= 31\\times 1.1761 \\\\ &= 36.4591 \\end{aligned}$$
であるから，②は，
$$n - 1 \\leqq 36.4591 < n$$
と表される。これを満たす自然数 $n$ は $n = 37$ である。したがって，
$$15^{31} \\text{ は } \\mathbf{37 \\text{ 桁}}$$

(2) $\\left(\\dfrac{3}{5}\\right)^{100}$ の小数第 $n$ 位にはじめて0でない数字が現れるとき，
$$10^{-n} \\leqq \\left(\\frac{3}{5}\\right)^{100} < 10^{-n+1} \\quad \\cdots\\text{③}$$
である。③で常用対数をとると，
$$\\log_{10}10^{-n} \\leqq \\log_{10}\\left(\\frac{3}{5}\\right)^{100} < \\log_{10}10^{-n+1}$$
$$-n \\leqq \\log_{10}\\left(\\frac{3}{5}\\right)^{100} < -n + 1 \\quad \\cdots\\text{④}$$
ここで，
$$\\begin{aligned} \\log_{10}\\left(\\frac{3}{5}\\right)^{100} &= 100(\\log_{10}3 - \\log_{10}5) \\\\ &= 100(0.4771 - 0.6990) \\\\ &= 100\\times(-0.2219) \\\\ &= -22.19 \\end{aligned}$$
である。よって，④は，
$$-n \\leqq -22.19 < -n + 1$$
と表される。これを満たす自然数 $n$ は $n = 23$ である。
以上より，はじめて0でない数字が現れるのは，
$$\\mathbf{\\text{小数第 } 23 \\text{ 位}}$$`,
    commentary: `**例題102** の復習である。
(1)は，$15^{31}$ が $n$ 桁であるとき，
$$10^{n-1} \\leqq 15^{31} < 10^n$$
となるので，これを満たす自然数 $n$ を求める。$\\log_{10}15 = \\log_{10}3 + \\log_{10}5$ であるが，$\\log_{10}5$ の値が，
$$\\log_{10}5 = \\log_{10}\\frac{10}{2} = \\log_{10}10 - \\log_{10}2$$
と計算できることも見直しておこう。`
  },

  67: {
    id: 67,
    chapter: "微分法",
    title: "傾きが与えられた接線の方程式",
    target_reidai: 105,
    sources: ["学習院大"],
    question: `$y = x^3 - x$ のグラフの接線で，傾きが2のものをすべて求めよ。`,
    answer: `$f(x) = x^3 - x$ とすると，$f'(x) = 3x^2 - 1$ である。
接点を $(t, f(t))$ とすると，この点における接線は，
$$y - f(t) = f'(t)(x - t)$$
であるから，
$$y - (t^3 - t) = (3t^2 - 1)(x - t)$$
$$y = (3t^2 - 1)x - 2t^3 \\quad \\cdots\\text{①}$$
①の傾きが2になるとき，
$$3t^2 - 1 = 2 \\implies 3t^2 = 3 \\implies t = \\pm 1$$
ゆえに，求める接線は，①で $t = 1, \\ -1$ として，
- $t = 1$ のとき，$y = 2x - 2$
- $t = -1$ のとき，$y = 2x + 2$
したがって，
$$\\mathbf{y = 2x - 2, \\quad y = 2x + 2}$$`,
    commentary: `接点が不明の接線の問題は，接点を自分で設定して考える。`
  },

  68: {
    id: 68,
    chapter: "微分法",
    title: "3次関数が極値をもつ条件と極大値",
    target_reidai: 107,
    sources: ["広島工業大"],
    question: `関数 $f(x) = x^3 + (a-2)x^2 + 3x$（$a$ は実数の定数）について，次の問に答えよ。
(1) $f(x)$ が極値をもつとき，$a$ の値の範囲を求めよ。
(2) $f(x)$ が $x = -a$ で極値をもつとき，$a$ の値を求めよ。さらに，このときの極大値を求めよ。`,
    answer: `(1) $f(x) = x^3 + (a-2)x^2 + 3x$ より，
$$f'(x) = 3x^2 + 2(a-2)x + 3$$
$f(x)$ が極値をもつのは，「$f'(x)$ の符号が変化するとき」，すなわち，「$f'(x) = 0$ が異なる2つの実数解をもつとき」である。
ここで，$3x^2 + 2(a-2)x + 3 = 0$ の判別式を $D$ とすると，
$$\\frac{D}{4} = (a-2)^2 - 3\\cdot 3 = a^2 - 4a - 5 = (a+1)(a-5)$$
であり，$\\dfrac{D}{4} > 0$ より，
$$(a+1)(a-5) > 0 \\iff \\mathbf{a < -1, \\quad 5 < a}$$

(2) $f(x)$ が $x = -a$ で極値をもつとき，
$$f'(-a) = 0$$
であることが必要であり，
$$3(-a)^2 + 2(a-2)(-a) + 3 = 0$$
$$3a^2 - 2a^2 + 4a + 3 = 0$$
$$a^2 + 4a + 3 = 0$$
$$(a+3)(a+1) = 0$$
(1)より，$a < -1, \\ 5 < a$ であるから，
$$a = -3$$
このとき，
$$f(x) = x^3 - 5x^2 + 3x$$
$$f'(x) = 3x^2 - 10x + 3 = (3x - 1)(x - 3)$$
となり，増減表は次のようになる。

$$\\begin{array}{c|c|c|c|c|c}
x & \\cdots & \\frac{1}{3} & \\cdots & 3 & \\cdots \\\\ \\hline
f'(x) & + & 0 & - & 0 & + \\\\ \\hline
f(x) & \\nearrow & \\text{極大} & \\searrow & \\text{極小} & \\nearrow
\\end{array}$$

増減表より，確かに $x = -a$（つまり $x = 3$）で極小値をもち，条件を満たす。
極大値は，
$$f\\left(\\frac{1}{3}\\right) = \\left(\\frac{1}{3}\\right)^3 - 5\\left(\\frac{1}{3}\\right)^2 + 3\\left(\\frac{1}{3}\\right) = \\frac{1}{27} - \\frac{5}{9} + 1 = \\frac{1 - 15 + 27}{27} = \\frac{13}{27}$$
である。以上より，
$$\\mathbf{a = -3, \\quad \\text{極大値 } \\frac{13}{27}}$$`,
    commentary: `3次関数が極値をもつのは，$f'(x)$ の符号が，「正 $\\to$ 負 $\\to$ 正」のように変化するときであり，このようになるのは「2次方程式 $f'(x) = 0$ が異なる2つの実数解をもつとき」である。`
  },

  69: {
    id: 69,
    chapter: "微分法",
    title: "箱の容積の最大値（微分の応用）",
    target_reidai: 106,
    sources: ["東京経済大"],
    question: `1辺が $10\\,\\mathrm{cm}$ の正方形の紙から，1辺が $x\\,\\mathrm{cm}$ の正方形を四隅から切り取って直方体の箱を作ると，その箱の容積は $x$ を用いて $\\fbox{\\quad}$ と表される。また，容積が最大になるのは，切り取る正方形の1辺が $\\fbox{\\quad}\\,\\mathrm{cm}$ のときである。`,
    answer: `切り取る正方形の1辺の長さ $x$ は，
$$0 < x < 5$$
である。
作られる直方体は，底面が「1辺の長さが $10 - 2x$ の正方形」で，高さが $x$ である。
よって，その容積は，
$$(10 - 2x)^2\\cdot x = (100 - 40x + 4x^2)x = \\mathbf{4x^3 - 40x^2 + 100x}$$
と表される。
$f(x) = 4x^3 - 40x^2 + 100x$ とすると，
$$\\begin{aligned} f'(x) &= 12x^2 - 80x + 100 \\\\ &= 4(3x^2 - 20x + 25) \\\\ &= 4(3x - 5)(x - 5) \\end{aligned}$$
となり，$0 < x < 5$ における $f(x)$ の増減表は次のようになる。

$$\\begin{array}{c|c|c|c|c|c}
x & (0) & \\cdots & \\frac{5}{3} & \\cdots & (5) \\\\ \\hline
f'(x) & & + & 0 & - & \\\\ \\hline
f(x) & & \\nearrow & \\text{最大} & \\searrow &
\\end{array}$$

増減表より，容積が最大になるのは，切り取る正方形の1辺が $\\mathbf{\\dfrac{5}{3}}\\,\\mathrm{cm}$ のときである。`,
    commentary: `作られる直方体は，底面が「1辺の長さが $10-2x$ の正方形」で，高さが $x$ である。
本問は「結果のみ」を答える問題であるが，「正しい $x$ の範囲」で解答できているか，各自の解答を見直して欲しい。つまり，切り取る正方形の1辺の長さ $x$ が，
$$0 < x < 5$$
であることを見落としていないか，ということである。`
  },

  70: {
    id: 70,
    chapter: "微分法",
    title: "曲線外の点から引ける接線の本数",
    target_reidai: 108,
    sources: ["岩手大"],
    question: `$f(x) = x^3 - 3x$ とする。点 $(2, a)$ から曲線 $y = f(x)$ に3本の接線が引けるとき，$a$ の値の範囲を求めよ。`,
    answer: `$f(x) = x^3 - 3x$ より，$f'(x) = 3x^2 - 3$ である。
接点を $(t, f(t))$ とすると，この点における接線は，
$$y - f(t) = f'(t)(x - t)$$
$$y - (t^3 - 3t) = (3t^2 - 3)(x - t)$$
$$y = (3t^2 - 3)x - 2t^3 \\quad \\cdots\\text{①}$$
①が点 $(2, a)$ を通るとき，
$$a = (3t^2 - 3)\\cdot 2 - 2t^3$$
$$a = -2t^3 + 6t^2 - 6 \\quad \\cdots\\text{②}$$
点 $(2, a)$ を通る接線が3本存在するのは，
「②を満たす異なる実数 $t$ が3個存在するとき」
すなわち，
「$u = -2t^3 + 6t^2 - 6$ と $u = a$ のグラフが3個の共有点をもつとき」
である。
ここで，$g(t) = -2t^3 + 6t^2 - 6$ とすると，
$$g'(t) = -6t^2 + 12t = -6t(t - 2)$$
となり，増減表は次のようになる。

$$\\begin{array}{c|c|c|c|c|c}
t & \\cdots & 0 & \\cdots & 2 & \\cdots \\\\ \\hline
g'(t) & - & 0 & + & 0 & - \\\\ \\hline
g(t) & \\searrow & -6 & \\nearrow & 2 & \\searrow
\\end{array}$$

これより，$u = g(t)$ のグラフと直線 $u = a$ が3個の共有点をもつ $a$ の範囲を考えると，
極小値 $-6$ と極大値 $2$ の間に $a$ があればよい。
したがって，求める $a$ の値の範囲は，
$$\\mathbf{-6 < a < 2}$$`,
    commentary: `**例題108** で学習した「方程式の実数解の個数をグラフを使って考える問題」の応用である。
接点を $(t, t^3 - 3t)$ として，この点における接線が点 $(2, a)$ を通るための $t$ の条件を考えよう。1つの接点に1本の接線が対応するから，その条件を満たす $t$ がちょうど3個存在するときに，点 $(2, a)$ を通る接線が3本存在することになる。`
  },

  71: {
    id: 71,
    chapter: "微分法",
    title: "3次不等式が常に成り立つ条件",
    target_reidai: 109,
    sources: ["宮城大"],
    question: `$x \\geqq 0$ のとき，$x^3 + 3x^2 - 9x + k > 0$ が成り立つような定数 $k$ の値の範囲を求めよ。`,
    answer: `$f(x) = x^3 + 3x^2 - 9x + k$ とすると，
$$f'(x) = 3x^2 + 6x - 9 = 3(x + 3)(x - 1)$$
となり，$x \\geqq 0$ における $f(x)$ の増減表は次のようになる。

$$\\begin{array}{c|c|c|c|c}
x & 0 & \\cdots & 1 & \\cdots \\\\ \\hline
f'(x) & & - & 0 & + \\\\ \\hline
f(x) & k & \\searrow & k - 5 & \\nearrow
\\end{array}$$

増減表より，$x \\geqq 0$ における $f(x)$ の最小値は $k - 5$ である。
よって，$x \\geqq 0$ において $f(x) > 0$ が成り立つのは，
$$k - 5 > 0$$
が成り立つときである。したがって，
$$\\mathbf{k > 5}$$

**＜別解：文字定数を分離する＞**
与式は，
$$k > -x^3 - 3x^2 + 9x \\quad \\cdots(*)$$
と変形できるので，$x \\geqq 0$ において $(*)$ が成り立つ $k$ の範囲を求める。
$g(x) = -x^3 - 3x^2 + 9x$ とすると，
$$g'(x) = -3x^2 - 6x + 9 = -3(x + 3)(x - 1)$$
となり，$x \\geqq 0$ における $g(x)$ の増減表は次のようになる。

$$\\begin{array}{c|c|c|c|c}
x & 0 & \\cdots & 1 & \\cdots \\\\ \\hline
g'(x) & & + & 0 & - \\\\ \\hline
g(x) & 0 & \\nearrow & 5 & \\searrow
\\end{array}$$

増減表より，$x \\geqq 0$ における $g(x)$ の最大値は 5 である。
よって，求める $k$ の値の範囲は，
$$\\mathbf{k > 5}$$`,
    commentary: `$f(x) = x^3 + 3x^2 - 9x + k$ として，**例題109** と同じように，$x \\geqq 0$ における $f(x)$ の最小値に注目する。
また，別解のように，$k$ を分離して考えるのもよい。方程式の実数解の個数の問題以外でも，文字定数を分離して考える方針は有効である。`
  },

  72: {
    id: 72,
    chapter: "積分法",
    title: "定積分を含む関数決定（定数型・変数型）",
    target_reidai: 113,
    sources: ["早稲田大","福岡大"],
    question: `次の各問に答えよ。
[1] 等式 $f(x) = \\displaystyle\\int_{-1}^1 x f(t)\\,dt + 1$ を満たす関数 $f(x)$ を求めよ。
[2] $\\displaystyle\\int_{-3}^x f(t)\\,dt = x^3 - 3x^2 + 4ax + 3a$ を満たす関数 $f(x)$ と定数 $a$ の値を求めよ。`,
    answer: `[1] 
$$f(x) = \\int_{-1}^1 x f(t)\\,dt + 1 = x\\int_{-1}^1 f(t)\\,dt + 1 \\quad \\cdots\\text{①}$$
$\\displaystyle\\int_{-1}^1 f(t)\\,dt = k$（定数） $\\cdots\\text{②}$ とおくと，①より，
$$f(x) = kx + 1 \\quad \\cdots\\text{③}$$
である。よって，$f(t) = kt + 1$ であるから，②に代入すると，
$$\\int_{-1}^1 (kt + 1)\\,dt = k$$
$$\\left[\\frac{1}{2}kt^2 + t\\right]_{-1}^1 = k$$
$$\\left(\\frac{1}{2}k + 1\\right) - \\left(\\frac{1}{2}k - 1\\right) = k$$
$$2 = k \\implies k = 2$$
したがって，③より，
$$\\mathbf{f(x) = 2x + 1}$$

[2] $\\displaystyle\\int_{-3}^x f(t)\\,dt = x^3 - 3x^2 + 4ax + 3a \\quad \\cdots\\text{①}$
①の両辺を $x$ で微分すると，
$$\\frac{d}{dx}\\int_{-3}^x f(t)\\,dt = 3x^2 - 6x + 4a$$
$$f(x) = 3x^2 - 6x + 4a \\quad \\cdots\\text{②}$$
また，①で $x = -3$ とすると，
$$\\int_{-3}^{-3} f(t)\\,dt = (-3)^3 - 3(-3)^2 + 4a(-3) + 3a$$
$$0 = -27 - 27 - 12a + 3a$$
$$0 = -54 - 9a \\implies 9a = -54 \\implies a = -6$$
これを②に代入して，
$$f(x) = 3x^2 - 6x + 4(-6) = 3x^2 - 6x - 24$$
以上より，
$$\\mathbf{f(x) = 3x^2 - 6x - 24, \\quad a = -6}$$`,
    commentary: `[1]は，$\\displaystyle\\int_{-1}^1 x f(t)\\,dt = k$（定数）とおいてはいけない。この定積分は，
$$\\int_{-1}^1 x f(t)\\,dt = x\\int_{-1}^1 f(t)\\,dt$$
と，$x$ をインテグラルの前に出してから $\\displaystyle\\int_{-1}^1 f(t)\\,dt = k$ とおいて考える。**例題113** の【One Point コラム】を見直そう。`
  },

  73: {
    id: 73,
    chapter: "積分法",
    title: "絶対値を含む関数の定積分と最小値",
    target_reidai: 114,
    sources: ["大阪公立大"],
    question: `0以上の実数 $t$ に対し，定積分 $F(t) = \\displaystyle\\int_0^1 |x^2 - t^2|\\,dx$ とする。
(1) $F(t)$ を $t$ を用いて表せ。
(2) $t \\geqq 0$ において，関数 $F(t)$ の最小値，およびそのときの $t$ の値を求めよ。`,
    answer: `(1) $F(t) = \\displaystyle\\int_0^1 |x^2 - t^2|\\,dx$
$y = |x^2 - t^2| = |(x+t)(x-t)|$ のグラフは，$x = \\pm t$ のところで折り返しが起こる。$t \\geqq 0$ であるから，折り返しの起こる $x = t$ が，積分区間の 0 から 1 の範囲に含まれるか含まれないかで場合分けをして考える。

(ア) $0 \\leqq t < 1$ のとき
$$\\begin{aligned} F(t) &= \\int_0^t -(x^2 - t^2)\\,dx + \\int_t^1 (x^2 - t^2)\\,dx \\\\ &= \\left[-\\frac{1}{3}x^3 + t^2 x\\right]_0^t + \\left[\\frac{1}{3}x^3 - t^2 x\\right]_t^1 \\\\ &= \\left(-\\frac{1}{3}t^3 + t^3\\right) - 0 + \\left(\\frac{1}{3} - t^2\\right) - \\left(\\frac{1}{3}t^3 - t^3\\right) \\\\ &= \\frac{2}{3}t^3 + \\frac{1}{3} - t^2 + \\frac{2}{3}t^3 \\\\ &= \\mathbf{\\frac{4}{3}t^3 - t^2 + \\frac{1}{3}} \\end{aligned}$$

(イ) $1 \\leqq t$ のとき
$$\\begin{aligned} F(t) &= \\int_0^1 -(x^2 - t^2)\\,dx \\\\ &= \\left[-\\frac{1}{3}x^3 + t^2 x\\right]_0^1 \\\\ &= \\mathbf{-\\frac{1}{3} + t^2} \\end{aligned}$$

以上より，
$$F(t) = \\begin{cases} \\mathbf{\\dfrac{4}{3}t^3 - t^2 + \\dfrac{1}{3}} & (0 \\leqq t < 1 \\text{ のとき}) \\\\ \\mathbf{t^2 - \\dfrac{1}{3}} & (1 \\leqq t \\text{ のとき}) \\end{cases}$$

(2) (1)の結果から，$F'(t)$ を求める。
- $0 \\leqq t < 1$ のとき，
$$F'(t) = 4t^2 - 2t = 2t(2t - 1)$$
- $1 \\leqq t$ のとき，
$$F'(t) = 2t$$
これより，$t \\geqq 0$ における $F(t)$ の増減表は次のようになる。

$$\\begin{array}{c|c|c|c|c|c|c}
t & 0 & \\cdots & \\frac{1}{2} & \\cdots & 1 & \\cdots \\\\ \\hline
F'(t) & & - & 0 & + & & + \\\\ \\hline
F(t) & & \\searrow & \\text{最小} & \\nearrow & \\frac{2}{3} & \\nearrow
\\end{array}$$

増減表より，$F(t)$ を最小にする $t$ の値は，
$$\\mathbf{t = \\frac{1}{2}}$$
また，最小値は，
$$F\\left(\\frac{1}{2}\\right) = \\frac{4}{3}\\cdot\\frac{1}{8} - \\frac{1}{4} + \\frac{1}{3} = \\frac{1}{6} - \\frac{1}{4} + \\frac{1}{3} = \\frac{2 - 3 + 4}{12} = \\mathbf{\\frac{1}{4}}$$`,
    commentary: `$y = |x^2 - t^2| = |(x+t)(x-t)|$ のグラフは，$x = \\pm t$ のところで折り返しが起こる。$t$ は0以上であるから，折り返しの起こる $x = t$ が，積分区間の0から1の範囲に含まれるか含まれないかで場合分けをして考える。`
  },

  74: {
    id: 74,
    chapter: "積分法",
    title: "2つの放物線で囲まれる面積",
    target_reidai: 116,
    sources: ["群馬大"],
    question: `$a$ は定数で $a < 3$ とする。$y = x^2 - 2ax + 4a$ と $y = -x^2 + 6x - 2a$ で囲まれる部分の面積が9になるとき，$a$ の値を求めよ。`,
    answer: `$$\\begin{cases} y = x^2 - 2ax + 4a & \\cdots\\text{①} \\\\ y = -x^2 + 6x - 2a & \\cdots\\text{②} \\end{cases}$$
①，②から $y$ を消去すると，
$$x^2 - 2ax + 4a = -x^2 + 6x - 2a$$
$$2x^2 - 2(a+3)x + 6a = 0$$
$$x^2 - (a+3)x + 3a = 0$$
$$(x - a)(x - 3) = 0$$
$$x = a, \\ 3$$
これより，①と②の交点の $x$ 座標は，$x = a, \\ 3$ である。
ここで，①と②で囲まれる部分の面積を $S$ とすると，$a < 3$ に注意して，
$$\\begin{aligned} S &= \\int_a^3 \\{(-x^2 + 6x - 2a) - (x^2 - 2ax + 4a)\\}\\,dx \\\\ &= -2\\int_a^3 \\{x^2 - (a+3)x + 3a\\}\\,dx \\\\ &= -2\\int_a^3 (x - a)(x - 3)\\,dx \\\\ &= -2\\left\\{-\\frac{1}{6}(3 - a)^3\\right\\} \\\\ &= \\frac{1}{3}(3 - a)^3 \\end{aligned}$$
$S = 9$ になるとき，
$$\\frac{1}{3}(3 - a)^3 = 9 \\implies (3 - a)^3 = 27$$
$a$ は実数であるから，
$$3 - a = 3 \\implies \\mathbf{a = 0}$$`,
    commentary: `2つの放物線で囲まれる部分の面積は，$\\dfrac{1}{6}$ 公式を使って計算するとよい。`
  },

  75: {
    id: 75,
    chapter: "積分法",
    title: "放物線で囲まれる図形の面積の最大値",
    target_reidai: 116,
    sources: ["お茶の水女子大"],
    question: `放物線 $C_1$ を $y = -x^2 + 2x + 4$ で定める。
(1) 点 $(p, q)$ が直線 $y = -2x + 1$ の上を動くとき，$y = (x - p)^2 + q$ で定める放物線 $C_2$ が $C_1$ と共有点をもつような $p$ の範囲を求めよ。
(2) $p$ が(1)で求めた範囲を動くとき，$C_1$ と $C_2$ で囲まれた図形の面積の最大値を求めよ。`,
    answer: `(1) 
$$C_1 : y = -x^2 + 2x + 4 \\quad \\cdots\\text{①}$$
$$C_2 : y = (x - p)^2 + q$$
点 $(p, q)$ が直線 $y = -2x + 1$ 上を動くから，$q = -2p + 1$ である。これより，放物線 $C_2$ は，$q$ を消去すると，
$$y = (x - p)^2 - 2p + 1$$
$$y = x^2 - 2px + p^2 - 2p + 1 \\quad \\cdots\\text{②}$$
と表される。①，②から $y$ を消去すると，
$$x^2 - 2px + p^2 - 2p + 1 = -x^2 + 2x + 4$$
$$2x^2 - 2(p+1)x + p^2 - 2p - 3 = 0 \\quad \\cdots\\text{③}$$
③の判別式を $D$ とすると，
$$\\begin{aligned} \\frac{D}{4} &= (p+1)^2 - 2(p^2 - 2p - 3) \\\\ &= p^2 + 2p + 1 - 2p^2 + 4p + 6 \\\\ &= -p^2 + 6p + 7 \\end{aligned}$$
であり，$C_1$ と $C_2$ が共有点をもつとき，$\\dfrac{D}{4} \\geqq 0$ が成り立つから，
$$-p^2 + 6p + 7 \\geqq 0$$
$$p^2 - 6p - 7 \\leqq 0$$
$$(p+1)(p-7) \\leqq 0$$
したがって，
$$\\mathbf{-1 \\leqq p \\leqq 7}$$

(2) ③を解くと，
$$x = \\frac{(p+1) \\pm \\sqrt{-p^2 + 6p + 7}}{2}$$
ここで，
$$\\alpha = \\frac{(p+1) - \\sqrt{-p^2 + 6p + 7}}{2}, \\quad \\beta = \\frac{(p+1) + \\sqrt{-p^2 + 6p + 7}}{2}$$
とすると，$\\alpha, \\beta$ は③の解であるから，
$$2x^2 - 2(p+1)x + p^2 - 2p - 3 = 2(x - \\alpha)(x - \\beta) \\quad \\cdots\\text{④}$$
が成り立つ。
このとき，$C_1$ と $C_2$ で囲まれた図形の面積を $S$ とすると，
$$\\begin{aligned} S &= \\int_\\alpha^\\beta \\{(-x^2 + 2x + 4) - (x^2 - 2px + p^2 - 2p + 1)\\}\\,dx \\\\ &= -\\int_\\alpha^\\beta \\{2x^2 - 2(p+1)x + p^2 - 2p - 3\\}\\,dx \\\\ &= -2\\int_\\alpha^\\beta (x - \\alpha)(x - \\beta)\\,dx \\quad (\\text{④より}) \\\\ &= -2\\cdot\\left\\{-\\frac{1}{6}(\\beta - \\alpha)^3\\right\\} \\\\ &= \\frac{1}{3}(\\beta - \\alpha)^3 \\\\ &= \\frac{1}{3}\\left(\\sqrt{-p^2 + 6p + 7}\\right)^3 \\\\ &= \\frac{1}{3}\\left\\{\\sqrt{-(p - 3)^2 + 16}\\right\\}^3 \\quad \\cdots\\text{⑤} \\end{aligned}$$
$-1 \\leqq p \\leqq 7$ において，⑤の根号内が最大になるときに $S$ も最大になる。
根号内は $p = 3$ のときに最大値 16 をとるから，$S$ の最大値は，
$$\\frac{1}{3}(\\sqrt{16})^3 = \\frac{1}{3}\\cdot 4^3 = \\mathbf{\\frac{64}{3}}$$`,
    commentary: `$C_1$ と $C_2$ の交点の $x$ 座標は文字を含む複雑な式で表されるので，これを $\\alpha$，$\\beta$ とおいて面積の計算を進める。`
  },

  76: {
    id: 76,
    chapter: "積分法",
    title: "2つの放物線の共通接線と囲まれる面積",
    target_reidai: 117,
    sources: ["名城大"],
    question: `放物線 $C_1 : y = x^2$ と放物線 $C_2 : y = x^2 - 4x + 8$ の両方に接する接線を $l$ とする。
(1) $l$ の方程式を求めよ。
(2) $C_1$，$C_2$，$l$ で囲まれる部分の面積を求めよ。`,
    answer: `(1) $f(x) = x^2$，$g(x) = x^2 - 4x + 8$ とする。
$f'(x) = 2x$ より，点 $(t, f(t))$ における $y = f(x)$ の接線は，
$$y - t^2 = 2t(x - t) \\iff y = 2tx - t^2 \\quad \\cdots\\text{①}$$
①と $y = g(x)$ から $y$ を消去すると，
$$x^2 - 4x + 8 = 2tx - t^2$$
$$x^2 - 2(t + 2)x + 8 + t^2 = 0 \\quad \\cdots\\text{②}$$
②の判別式を $D$ とすると，
$$\\frac{D}{4} = \\{-(t + 2)\\}^2 - (8 + t^2) = t^2 + 4t + 4 - 8 - t^2 = 4t - 4$$
①と $y = g(x)$ が接するとき，$\\dfrac{D}{4} = 0$ であるから，
$$4t - 4 = 0 \\implies t = 1$$
よって，$t = 1$ のときに①は $y = g(x)$ にも接する。つまり，$y = f(x)$ と $y = g(x)$ の両方に接する。
したがって，求めるべき接線 $l$ は，①で $t = 1$ として，
$$\\mathbf{y = 2x - 1}$$

**＜別解：別々に接線を準備する＞**
$C_1$ 上の点 $(t, t^2)$ における接線は $y = 2tx - t^2 \\ \\cdots\\text{①}$
$C_2$ 上の点 $(s, s^2 - 4s + 8)$ における接線は $y = (2s - 4)x - s^2 + 8 \\ \\cdots\\text{③}$
①と③が一致するとき，
$$\\begin{cases} 2t = 2s - 4 & \\cdots\\text{④} \\\\ -t^2 = -s^2 + 8 & \\cdots\\text{⑤} \\end{cases}$$
④より $t = s - 2$ となり，⑤に代入して整理すると $4s = 12 \\implies s = 3, \\ t = 1$
したがって，$y = 2x - 1$ と求まる。

(2) $t = 1$ のとき，②より，
$$x^2 - 6x + 9 = 0 \\implies (x - 3)^2 = 0 \\implies x = 3$$
以上より，$C_1$ と $l$ の接点の $x$ 座標は 1，$C_2$ と $l$ の接点の $x$ 座標は 3 である。
さらに，$C_1$ と $C_2$ の交点の $x$ 座標は，
$$x^2 = x^2 - 4x + 8 \\implies 4x = 8 \\implies x = 2$$
である。
したがって，求める面積を $S$ とすると，
$$\\begin{aligned} S &= \\int_1^2 \\{x^2 - (2x - 1)\\}\\,dx + \\int_2^3 \\{(x^2 - 4x + 8) - (2x - 1)\\}\\,dx \\\\ &= \\int_1^2 (x - 1)^2\\,dx + \\int_2^3 (x - 3)^2\\,dx \\\\ &= \\left[\\frac{1}{3}(x - 1)^3\\right]_1^2 + \\left[\\frac{1}{3}(x - 3)^3\\right]_2^3 \\\\ &= \\left(\\frac{1}{3}\\cdot 1^3 - 0\\right) + \\left(0 - \\frac{1}{3}\\cdot(-1)^3\\right) \\\\ &= \\frac{1}{3} + \\frac{1}{3} = \\mathbf{\\frac{2}{3}} \\end{aligned}$$`,
    commentary: `(1) 解答は，「点 $(t, t^2)$ における $C_1$ の接線が $C_2$ にも接するような $t$ の値を求める」という方針で $l$ を求めているが，他にもいくつかの方針がある。
(2) **例題117** と同様に，面積の計算では，
$$\\int (x+b)^2\\,dx = \\frac{1}{3}(x+b)^3 + C$$
であることを利用するとよい。`
  },

  77: {
    id: 77,
    chapter: "数列",
    title: "等差数列の和の最小値",
    target_reidai: 120,
    sources: ["高崎経済大"],
    question: `ある等差数列の第 $n$ 項を $a_n$ とするとき，
$$a_{15} + a_{16} + a_{17} = -2622, \\quad a_{99} + a_{103} = -1238$$
が成立している。
(1) この等差数列の初項と公差を求めよ。
(2) この等差数列の初項から第 $n$ 項までの和を $S_n$ とするとき，$S_n$ が最小となる $n$ の値を求めよ。`,
    answer: `$$a_{15} + a_{16} + a_{17} = -2622 \\quad \\cdots\\text{①}$$
$$a_{99} + a_{103} = -1238 \\quad \\cdots\\text{②}$$
(1) 初項を $a$，公差を $d$ とすると，①より，
$$(a + 14d) + (a + 15d) + (a + 16d) = -2622$$
$$3a + 45d = -2622 \\iff a + 15d = -874 \\quad \\cdots\\text{③}$$
②より，
$$(a + 98d) + (a + 102d) = -1238$$
$$2a + 200d = -1238 \\iff a + 100d = -619 \\quad \\cdots\\text{④}$$
④ $-$ ③ より，
$$85d = 255 \\implies d = 3$$
これを③に代入して，
$$a + 15\\cdot 3 = -874 \\implies a = -874 - 45 = -919$$
したがって，
$$\\mathbf{\\text{初項は } -919, \\quad \\text{公差は } 3}$$

(2) $a = -919$，$d = 3$ より，
$$a_n = -919 + (n - 1)\\cdot 3 = 3n - 922$$
$a_n \\leqq 0$ である $n$ の範囲を求めると，
$$3n - 922 \\leqq 0 \\implies n \\leqq \\frac{922}{3} = 307.3\\cdots$$
となるから，
$a_1$ から $a_{307}$ までは負，$a_{308}$ からは正である。
したがって，$S_n$ が最小となる $n$ の値は，
$$\\mathbf{n = 307}$$`,
    commentary: `**例題120** では，等差数列の和の最大値の問題を扱った。本問もそれと同じ発想で考えればよい。つまり，負の値の項をすべて足したときの和が，$S_n$ の最小値となる。`
  },

  78: {
    id: 78,
    chapter: "数列",
    title: "等差中項と等比中項",
    target_reidai: 119,
    sources: ["同志社女子大"],
    question: `$a$，$b$ は正の数とする。3つの数 $4$，$a$，$b$ はこの順に等差数列をなし，$a$，$b$，$18$ はこの順に等比数列をなす。このとき，等差数列の公差は $\\fbox{\\quad}$ であり，等比数列の公比は $\\fbox{\\quad}$ である。`,
    answer: `$4$，$a$，$b$ はこの順に等差数列をなすから，等差中項の関係より，
$$4 + b = 2a \\quad \\cdots\\text{①}$$
$a$，$b$，$18$ はこの順に等比数列をなすから，等比中項の関係より，
$$a\\cdot 18 = b^2 \\iff 9\\cdot 2a = b^2 \\quad \\cdots\\text{②}$$
①より $2a = 4 + b$ であるから，これを②に代入して $a$ を消去すると，
$$9(4 + b) = b^2$$
$$b^2 - 9b - 36 = 0$$
$$(b - 12)(b + 3) = 0$$
$b > 0$ より，$b = 12$ となり，①に代入すると，
$$4 + 12 = 2a \\implies 2a = 16 \\implies a = 8$$
$a = 8$，$b = 12$ のとき，$4, \\ 8, \\ 12$ という等差数列ができるので，
$$\\text{公差は } \\mathbf{4}$$
また，$8, \\ 12, \\ 18$ という等比数列ができるので，
$$\\text{公比は } \\frac{12}{8} = \\mathbf{\\frac{3}{2}}$$`,
    commentary: `**例題119** で学習した等差中項，等比中項の関係を用いて，$a$，$b$ を求める。`
  },

  79: {
    id: 79,
    chapter: "数列",
    title: "等差×等比の和（S-rS法）",
    target_reidai: 123,
    sources: ["北海学園大"],
    question: `公比が1より大きい等比数列 $\\{a_n\\}$（$n = 1, 2, 3, \\cdots$）の初項から第 $n$ 項までの和を $S_n$ とすると，$a_2 = 18$，$S_3 = 78$ である。
(1) 数列 $\\{a_n\\}$ の一般項を求めよ。
(2) $\\displaystyle\\sum_{k=1}^n k a_k$ を求めよ。`,
    answer: `(1) 数列 $\\{a_n\\}$ の初項を $a$，公比を $r$（$r > 1$）とする。
$a_2 = 18$ より，
$$ar = 18 \\quad \\cdots\\text{①}$$
$S_3 = 78$ より，$a + ar + ar^2 = 78$ となるので，
$$a(1 + r + r^2) = 78 \\quad \\cdots\\text{②}$$
①より $a = \\dfrac{18}{r}$ となり，これを②に代入すると，
$$\\frac{18}{r}(1 + r + r^2) = 78$$
$$3(1 + r + r^2) = 13r$$
$$3r^2 - 10r + 3 = 0$$
$$(3r - 1)(r - 3) = 0$$
$r > 1$ より，$r = 3$ であり，
$$a = \\frac{18}{3} = 6$$
したがって，
$$a_n = 6\\cdot 3^{n-1} (= 2\\cdot 3^n)$$
より，
$$\\mathbf{a_n = 6\\cdot 3^{n-1} \\quad (\\text{または } 2\\cdot 3^n)}$$

(2) $a_k = 2\\cdot 3^k$ であるから，
$$\\sum_{k=1}^n k a_k = \\sum_{k=1}^n k(2\\cdot 3^k) = 2\\sum_{k=1}^n k\\cdot 3^k \\quad \\cdots\\text{③}$$
である。ここで，$S = \\displaystyle\\sum_{k=1}^n k\\cdot 3^k$ とすると，
$$\\begin{aligned} S &= 1\\cdot 3^1 + 2\\cdot 3^2 + 3\\cdot 3^3 + \\cdots + n\\cdot 3^n \\\\ 3S &= \\phantom{1\\cdot 3^1 +} 1\\cdot 3^2 + 2\\cdot 3^3 + \\cdots + (n-1)\\cdot 3^n + n\\cdot 3^{n+1} \\end{aligned}$$
辺々引くと，
$$\\begin{aligned} -2S &= 3 + 3^2 + 3^3 + \\cdots + 3^n - n\\cdot 3^{n+1} \\\\ &= \\frac{3(3^n - 1)}{3 - 1} - n\\cdot 3^{n+1} \\\\ &= \\frac{3}{2}(3^n - 1) - n\\cdot 3^{n+1} \\\\ &= \\frac{1}{2}\\cdot 3^{n+1} - \\frac{3}{2} - n\\cdot 3^{n+1} \\end{aligned}$$
したがって，
$$2S = -\\frac{1}{2}\\cdot 3^{n+1} + \\frac{3}{2} + n\\cdot 3^{n+1} = \\left(n - \\frac{1}{2}\\right)\\cdot 3^{n+1} + \\frac{3}{2}$$
③より，$\\displaystyle\\sum_{k=1}^n k a_k = 2S$ であるから，
$$\\sum_{k=1}^n k a_k = \\mathbf{\\left(n - \\frac{1}{2}\\right)\\cdot 3^{n+1} + \\frac{3}{2}} \\quad \\left(\\text{または } \\mathbf{\\frac{(2n - 1)\\cdot 3^{n+1} + 3}{2}}\\right)$$`,
    commentary: `(2)は，等差×等比の形の数列の和を求める問題である。これは，**例題123** で学習した「$S-rS$法」で求める。`
  },

  80: {
    id: 80,
    chapter: "数列",
    title: "部分分数分解と有理化による和の計算",
    target_reidai: 122,
    sources: ["関西大","会津大"],
    question: `[1] $n = 25$ のとき，
$$A = \\frac{1}{1} + \\frac{1}{1+2} + \\frac{1}{1+2+3} + \\cdots + \\frac{1}{1+2+3+\\cdots+n}$$
の値は $A = \\fbox{\\quad}$ である。
[2] 和 $\\displaystyle\\sum_{k=1}^n \\frac{1}{\\sqrt{k} + \\sqrt{k+1}}$ を求めよ。`,
    answer: `[1] 第 $k$ 項は，
$$\\frac{1}{1+2+3+\\cdots+k} = \\frac{1}{\\frac{1}{2}k(k+1)} = \\frac{2}{k(k+1)}$$
と表されるので，
$$A = \\sum_{k=1}^n \\frac{2}{k(k+1)} = \\sum_{k=1}^n 2\\left(\\frac{1}{k} - \\frac{1}{k+1}\\right)$$
これより，$n = 25$ のときの $A$ の値は，
$$\\begin{aligned} A &= \\sum_{k=1}^{25} 2\\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) \\\\ &= 2\\left(1 - \\frac{1}{2}\\right) + 2\\left(\\frac{1}{2} - \\frac{1}{3}\\right) + 2\\left(\\frac{1}{3} - \\frac{1}{4}\\right) + \\cdots + 2\\left(\\frac{1}{25} - \\frac{1}{26}\\right) \\\\ &= 2\\left(1 - \\frac{1}{26}\\right) \\\\ &= 2\\cdot\\frac{25}{26} \\\\ &= \\mathbf{\\frac{25}{13}} \\end{aligned}$$

[2] 
$$\\begin{aligned} \\sum_{k=1}^n \\frac{1}{\\sqrt{k} + \\sqrt{k+1}} &= \\sum_{k=1}^n \\frac{\\sqrt{k} - \\sqrt{k+1}}{k - (k+1)} \\\\ &= \\sum_{k=1}^n (-\\sqrt{k} + \\sqrt{k+1}) \\\\ &= (-\\sqrt{1} + \\sqrt{2}) + (-\\sqrt{2} + \\sqrt{3}) + \\cdots + (-\\sqrt{n} + \\sqrt{n+1}) \\\\ &= -1 + \\sqrt{n+1} \\\\ &= \\mathbf{\\sqrt{n+1} - 1} \\end{aligned}$$`,
    commentary: `[1] 問題の数列の第 $k$ 項が，
$$\\frac{1}{1+2+3+\\cdots+k} = \\frac{1}{\\frac{1}{2}k(k+1)} = \\frac{2}{k(k+1)}$$
と表されることを求められれば，この数列の和は部分分数分解を利用して計算できることが分かる。
[2] 第 $k$ 項を有理化して整理し，その式で $k = 1, 2, 3, \\cdots, n$ としてみると，打ち消しあいが起こることが分かる。`
  },

  81: {
    id: 81,
    chapter: "数列",
    title: "和Snから一般項を求める，部分分数分解",
    target_reidai: 122,
    sources: ["東京女子大"],
    question: `初項から第 $n$ 項までの和が $S_n = \\dfrac{3}{2}n^2 - \\dfrac{1}{2}n$ である数列 $\\{a_n\\}$ がある。
(1) 数列 $\\{a_n\\}$ の一般項を求めよ。
(2) $\\displaystyle\\sum_{k=1}^n \\frac{1}{a_k a_{k+1}}$ を求めよ。`,
    answer: `(1) $S_n = \\dfrac{3}{2}n^2 - \\dfrac{1}{2}n \\quad \\cdots(*)$
(*)で $n = 1$ にすると，$S_1 = \\dfrac{3}{2} - \\dfrac{1}{2} = 1$ となり，$a_1 = S_1$ であるから，
$$a_1 = 1$$
$n \\geqq 2$ のとき，
$$\\begin{aligned} a_n &= S_n - S_{n-1} \\\\ &= \\frac{3}{2}n^2 - \\frac{1}{2}n - \\left\\{\\frac{3}{2}(n-1)^2 - \\frac{1}{2}(n-1)\\right\\} \\\\ &= \\frac{3}{2}n^2 - \\frac{1}{2}n - \\left(\\frac{3}{2}n^2 - 3n + \\frac{3}{2} - \\frac{1}{2}n + \\frac{1}{2}\\right) \\\\ &= 3n - 2 \\quad \\cdots\\text{①} \\end{aligned}$$
①で $n = 1$ にすると，
$$3\\cdot 1 - 2 = 1 (= a_1)$$
となるので，①は $n = 1$ でも成り立つ。
以上より，
$$\\mathbf{a_n = 3n - 2}$$

(2) $a_n = 3n - 2$ より，$a_k = 3k - 2$，$a_{k+1} = 3(k+1) - 2 = 3k + 1$ であるから，
$$\\begin{aligned} \\sum_{k=1}^n \\frac{1}{a_k a_{k+1}} &= \\sum_{k=1}^n \\frac{1}{(3k-2)(3k+1)} \\\\ &= \\sum_{k=1}^n \\frac{1}{3}\\left(\\frac{1}{3k-2} - \\frac{1}{3k+1}\\right) \\\\ &= \\frac{1}{3}\\left(1 - \\frac{1}{4}\\right) + \\frac{1}{3}\\left(\\frac{1}{4} - \\frac{1}{7}\\right) + \\frac{1}{3}\\left(\\frac{1}{7} - \\frac{1}{10}\\right) + \\cdots + \\frac{1}{3}\\left(\\frac{1}{3n-2} - \\frac{1}{3n+1}\\right) \\\\ &= \\frac{1}{3}\\left(1 - \\frac{1}{3n+1}\\right) \\\\ &= \\frac{1}{3}\\cdot\\frac{3n+1-1}{3n+1} \\\\ &= \\mathbf{\\frac{n}{3n+1}} \\end{aligned}$$`,
    commentary: `(1) 「和と一般項の関係」を用いて考える。$n \\geqq 2$ として得られた $a_n$ の式が $n = 1$ のときにも成り立つかをきちんと確認しよう。
(2) **例題122** で紹介した手順に従って，部分分数分解をミスなく行おう。`
  },

  82: {
    id: 82,
    chapter: "数列",
    title: "和Snから一般項を求める（等比型）",
    target_reidai: 121,
    sources: ["駒澤大"],
    question: `数列 $\\{a_n\\}$ の初項から第 $n$ 項までの和 $S_n$ が $S_n = n\\cdot 3^{n+1} - 1$ で表されるとき，一般項 $a_n$ を求めよ。`,
    answer: `$S_n = n\\cdot 3^{n+1} - 1 \\quad \\cdots(*)$
(*)で $n = 1$ にすると，
$$S_1 = 1\\cdot 3^2 - 1 = 9 - 1 = 8$$
となり，$S_1 = a_1$ であるから，
$$a_1 = 8$$
$n \\geqq 2$ のとき，
$$\\begin{aligned} a_n &= S_n - S_{n-1} \\\\ &= n\\cdot 3^{n+1} - 1 - \\{(n-1)\\cdot 3^n - 1\\} \\\\ &= n\\cdot 3^{n+1} - (n-1)\\cdot 3^n \\\\ &= 3n\\cdot 3^n - n\\cdot 3^n + 3^n \\\\ &= (2n + 1)\\cdot 3^n \\end{aligned}$$
以上より，
$$\\mathbf{\\begin{cases} a_1 = 8 \\\\ a_n = (2n + 1)\\cdot 3^n \\quad (n \\geqq 2 \\text{ のとき}) \\end{cases}}$$

**＜補足＞**
$a_n = (2n + 1)\\cdot 3^n$ において $n = 1$ にすると，
$$a_1 = (2\\cdot 1 + 1)\\cdot 3 = 9$$
となるので，$a_1 = 8$ は得られない。つまり，$a_n = (2n + 1)\\cdot 3^n$ は $n = 1$ の場合には成り立たないので，上の解答のように，$a_1 = 8$ を別扱いにして答える。`,
    commentary: `和の条件から一般項 $a_n$ を求めたいので，$a_n = S_n - S_{n-1}$ を用いる。ただし，この関係は「$n \\geqq 2$ のとき」という条件つきで使用できる関係なので，この関係を用いて得られた $a_n$ の式は，$n = 1$ でも正しいのかを確認しなければならない。正しくないのであれば，$n = 1$ の場合を別に扱う必要がある。`
  },

  83: {
    id: 83,
    chapter: "数列",
    title: "等差数列と階差数列の比較",
    target_reidai: 125,
    sources: ["神奈川大"],
    question: `$$a_1 = 10, \\quad a_{n+1} = a_n + 3 \\ (n = 1, 2, 3, \\cdots)$$
$$b_1 = 100, \\quad b_{n+1} = b_n - 4n + 2 \\ (n = 1, 2, 3, \\cdots)$$
で定義される数列 $\\{a_n\\}$ と $\\{b_n\\}$ について，次の問に答えよ。
(1) 一般項 $a_n$ を求めよ。
(2) 一般項 $b_n$ を求めよ。
(3) $a_n \\geqq b_n$ となる最小の $n$ を求めよ。`,
    answer: `(1) $a_{n+1} = a_n + 3$ より，$a_{n+1} - a_n = 3$ である。
よって，数列 $\\{a_n\\}$ は公差 3 の等差数列であり，初項は 10 であるから，
$$a_n = 10 + (n - 1)\\cdot 3 = \\mathbf{3n + 7}$$

(2) $b_{n+1} = b_n - 4n + 2$ より，
$$b_{n+1} - b_n = -4n + 2 \\quad \\cdots\\text{①}$$
数列 $\\{b_n\\}$ の階差数列を $\\{c_n\\}$ とすると，①より，$c_n = -4n + 2$ である。
$n \\geqq 2$ のとき，
$$\\begin{aligned} b_n &= b_1 + \\sum_{k=1}^{n-1} c_k \\\\ &= 100 + \\sum_{k=1}^{n-1} (-4k + 2) \\\\ &= 100 - 4\\cdot\\frac{1}{2}(n-1)n + 2(n-1) \\\\ &= 100 - 2n(n-1) + 2n - 2 \\\\ &= -2n^2 + 4n + 98 \\quad \\cdots\\text{②} \\end{aligned}$$
②で $n = 1$ とすると，
$$-2 + 4 + 98 = 100 (= b_1)$$
となるので，②は $n = 1$ でも成り立つ。
したがって，
$$\\mathbf{b_n = -2n^2 + 4n + 98}$$

(3) $a_n \\geqq b_n$ が成り立つ $n$ の範囲を求めると，
$$3n + 7 \\geqq -2n^2 + 4n + 98$$
$$2n^2 - n - 91 \\geqq 0$$
$$(2n + 13)(n - 7) \\geqq 0$$
$$n \\leqq -\\frac{13}{2}, \\quad 7 \\leqq n$$
$n$ は自然数であるから，$n = 7, 8, 9, \\cdots$ のときに $a_n \\geqq b_n$ は成り立つ。
したがって，$a_n \\geqq b_n$ となる最小の $n$ は，
$$\\mathbf{n = 7}$$`,
    commentary: `$a_{n+1} - a_n = 3$ から，数列 $\\{a_n\\}$ は隣り合う項の差がつねに3であるから，公差が3の等差数列と分かる。
一方，$b_{n+1} - b_n = -4n + 2$ は，数列 $\\{b_n\\}$ の階差数列の第 $n$ 項が $-4n + 2$ であることを教えてくれている。「公差 $-4n + 2$ の等差数列」という間違いをしてはいけない。等差数列は $n$ がいくつであっても隣り合う項の差が等しい（一定の）数列である。隣り合う項の差である $-4n + 2$ が $n$ の値によって変化するので，これは“等差”ではない。`
  },

  84: {
    id: 84,
    chapter: "数列",
    title: "群数列（奇数個ずつの自然数）",
    target_reidai: 126,
    sources: ["中央大"],
    question: `自然数 $1, 2, 3, \\cdots$ を，
$$(1), \\ (2, 3, 4), \\ (5, 6, 7, 8, 9), \\ (10, 11, 12, 13, 14, 15, 16), \\ \\cdots$$
のように分割することを考える。左から $n$ 番目の括弧のなかの数を第 $n$ 群と呼ぶことにする。第 $n$ 群には $2n - 1$ 個の自然数が小さい順に並んでいることになる。
(1) 第 $n$ 群の最初の数を $n$ で表せ。
(2) 第 $n$ 群に含まれる数の和を求めよ。
(3) 365 は第何群の何番目の数か。`,
    answer: `(1) 第 $k$ 群の項数は $2k - 1$ 個であるから，初項から第 $m$ 群の末項までの項数は，
$$1 + 3 + 5 + \\cdots + (2m - 1) = \\sum_{k=1}^m (2k - 1) = 2\\cdot\\frac{1}{2}m(m+1) - m = m^2 \\quad \\cdots\\text{①}$$
よって，第 $n-1$ 群の末項までの項数は，①で $m$ を $n-1$ にして，$(n-1)^2$ である。
つまり，第 $n-1$ 群の末項は $(n-1)^2$ であり，第 $n$ 群の最初の数はこれの次にあるから，第 $n$ 群の最初の数は，
$$(n - 1)^2 + 1 = \\mathbf{n^2 - 2n + 2}$$

(2) 第 $n$ 群は，初項 $n^2 - 2n + 2$，末項 $n^2$，項数 $2n - 1$ の等差数列であるから，求める和は等差数列の和の公式を用いると，
$$\\begin{aligned} \\frac{2n - 1}{2}\\{(n^2 - 2n + 2) + n^2\\} &= \\frac{2n - 1}{2}(2n^2 - 2n + 2) \\\\ &= \\mathbf{(2n - 1)(n^2 - n + 1)} \\end{aligned}$$

(3) 365 が第 $N$ 群に入っているとすると，
$$(\\text{第 } N-1 \\text{ 群の末項までの項数}) < 365 \\leqq (\\text{第 } N \\text{ 群の末項までの項数})$$
となるので，
$$(N - 1)^2 < 365 \\leqq N^2 \\quad \\cdots\\text{②}$$
ここで，$19^2 = 361$，$20^2 = 400$ であるから，②を満たす $N$ は，$N = 20$ である。
さらに，第 19 群の末項は 361 であるから，
$$365 - 361 = 4$$
となることより，365 は，
$$\\mathbf{\\text{第 } 20 \\text{ 群の } 4 \\text{ 番目の数}}$$
である。`,
    commentary: `この問題の数列は，$1, 2, 3, \\cdots$ と並んでいるから，「先頭から数えて $p$ 番目の項が $p$」というシンプルな設定になっている。
(1)は，第 $n$ 群の最初の数が先頭から数えて何番目か分かれば，それがそのまま第 $n$ 群の最初の数になる。
(3)は，365 がこの数列の 365 番目の項であることから，365 が第 $N$ 群に入っているとすれば，
$$(\\text{第 } N-1 \\text{ 群の末項までの項数}) < 365 \\leqq (\\text{第 } N \\text{ 群の末項までの項数})$$
となるので，これを満たす $N$ を求める。`
  },

  85: {
    id: 85,
    chapter: "数列",
    title: "群数列（偶数が並ぶ数列）",
    target_reidai: 126,
    sources: ["大分大"],
    question: `正の偶数 $m$ が順に $m$ 個ずつ並んだ数列
$$2, \\ 2, \\ 4, \\ 4, \\ 4, \\ 4, \\ 6, \\ 6, \\ 6, \\ 6, \\ 6, \\ 6, \\ 8, \\ \\cdots$$
を $\\{a_n\\}$ とする。
(1) $a_{100}$ を求めよ。
(2) $a_1$ から $a_{100}$ までの和を求めよ。`,
    answer: `(1) 2個の2を第1群，4個の4を第2群，$\\cdots$ と群に分けて考える。
このとき，第 $k$ 群には $2k$ 個の $2k$ が含まれるから，第 $m$ 群の末項までの項数は，
$$\\begin{aligned} 2 + 4 + 6 + \\cdots + 2m &= 2(1 + 2 + 3 + \\cdots + m) \\\\ &= 2\\cdot\\frac{1}{2}m(m+1) \\\\ &= m(m+1) \\end{aligned}$$
$a_{100}$ が第 $N$ 群に入っているとすると，
$$(N - 1)N < 100 \\leqq N(N + 1) \\quad \\cdots\\text{①}$$
ここで，$9\\cdot 10 = 90$，$10\\cdot 11 = 110$ であるから，①を満たす $N$ は，$N = 10$ である。
さらに，第9群の末項は $a_{90}$ であるから，
$$100 - 90 = 10$$
より，$a_{100}$ は第 10 群の 10 番目である。
$a_{100}$ は第 10 群に含まれることから，
$$a_{100} = 2\\cdot 10 = \\mathbf{20}$$

(2) 第 $k$ 群の $2k$ 個の項の和を $S_k$ とすると，
$$S_k = 2k\\times 2k = 4k^2$$
である。よって，求める和は，
$$\\begin{aligned} S_1 + S_2 + \\cdots + S_9 + (20\\times 10) &= \\sum_{k=1}^9 S_k + 200 \\\\ &= \\sum_{k=1}^9 4k^2 + 200 \\\\ &= 4\\cdot\\frac{1}{6}\\cdot 9\\cdot(9+1)(2\\cdot 9 + 1) + 200 \\\\ &= 4\\cdot\\frac{1}{6}\\cdot 9\\cdot 10\\cdot 19 + 200 \\\\ &= 1140 + 200 \\\\ &= \\mathbf{1340} \\end{aligned}$$`,
    commentary: `2個の2を第1群，4個の4を第2群，$\\cdots$ と群に分けて考える。このとき，第 $k$ 群には $2k$ 個の $2k$ が含まれるから，第 $k$ 群の $2k$ 個の項の和を $S_k$ とすると，
$$S_k = 2k\\times 2k = 4k^2$$
となる。(2)は，この $S_k$ を使って和の計算を行う。`
  },

  86: {
    id: 86,
    chapter: "数列",
    title: "基本の漸化式 an+1 = p an + q",
    target_reidai: 127,
    sources: ["福島大","慶應義塾大"],
    question: `次の関係式で定められる数列 $\\{a_n\\}$ の一般項をそれぞれ求めよ。
(1) $a_1 = 2, \\quad a_{n+1} = -2a_n + 3 \\ (n = 1, 2, 3, \\cdots)$
(2) $a_1 = 1, \\quad a_{n+1} = 3a_n + 2 \\ (n = 1, 2, 3, \\cdots)$`,
    answer: `(1) $\\alpha = -2\\alpha + 3$ を満たす $\\alpha$ を求めると，$\\alpha = 1$ である。そこで，
$$\\begin{aligned} a_{n+1} &= -2a_n + 3 \\\\ 1 &= -2\\cdot 1 + 3 \\end{aligned}$$
の差をとると，
$$a_{n+1} - 1 = -2(a_n - 1) \\quad \\cdots\\text{①}$$
となる。①より，数列 $\\{a_n - 1\\}$ は公比 $-2$ の等比数列であり，初項は，
$$a_1 - 1 = 2 - 1 = 1$$
である。よって，
$$a_n - 1 = 1\\cdot(-2)^{n-1} \\implies \\mathbf{a_n = (-2)^{n-1} + 1}$$

(2) $\\alpha = 3\\alpha + 2$ を満たす $\\alpha$ を求めると，$\\alpha = -1$ である。そこで，
$$\\begin{aligned} a_{n+1} &= 3a_n + 2 \\\\ -1 &= 3\\cdot(-1) + 2 \\end{aligned}$$
の差をとると，
$$a_{n+1} + 1 = 3(a_n + 1) \\quad \\cdots\\text{②}$$
となる。②より，数列 $\\{a_n + 1\\}$ は公比 3 の等比数列であり，初項は，
$$a_1 + 1 = 1 + 1 = 2$$
である。よって，
$$a_n + 1 = 2\\cdot 3^{n-1} \\implies \\mathbf{a_n = 2\\cdot 3^{n-1} - 1}$$`,
    commentary: `$a_{n+1} = p a_n + q$ の形の漸化式は，
$$\\alpha = p\\alpha + q$$
を満たす $\\alpha$ を用いて，
$$a_{n+1} - \\alpha = p(a_n - \\alpha)$$
の形に変形して考える。`
  },

  87: {
    id: 87,
    chapter: "数列",
    title: "漸化式の解法（指数型・分数型）",
    target_reidai: 128,
    sources: ["大阪公立大"],
    question: `次の関係式で定められる数列 $\\{a_n\\}$ の一般項をそれぞれ求めよ。
(1) $a_1 = 1, \\quad a_{n+1} = 2a_n + 3^n \\ (n = 1, 2, 3, \\cdots)$
(2) $a_1 = \\dfrac{1}{4}, \\quad a_{n+1} = \\dfrac{a_n}{3a_n + 1} \\ (n = 1, 2, 3, \\cdots)$`,
    answer: `(1) $a_{n+1} = 2a_n + 3^n$ の両辺を $3^{n+1}$ で割ると，
$$\\frac{a_{n+1}}{3^{n+1}} = 2\\cdot\\frac{a_n}{3^{n+1}} + \\frac{3^n}{3^{n+1}}$$
$$\\frac{a_{n+1}}{3^{n+1}} = \\frac{2}{3}\\cdot\\frac{a_n}{3^n} + \\frac{1}{3} \\quad \\cdots\\text{①}$$
ここで，$\\dfrac{a_n}{3^n} = b_n \\ \\cdots\\text{②}$ とおくと，
$$b_1 = \\frac{a_1}{3} = \\frac{1}{3}$$
であり，①より，
$$b_{n+1} = \\frac{2}{3}b_n + \\frac{1}{3} \\quad \\cdots\\text{③}$$
が得られる。③を変形すると，
$$b_{n+1} - 1 = \\frac{2}{3}(b_n - 1)$$
これより，数列 $\\{b_n - 1\\}$ は公比 $\\dfrac{2}{3}$ の等比数列であり，
$$\\text{初項は } b_1 - 1 = \\frac{1}{3} - 1 = -\\frac{2}{3}$$
よって，
$$b_n - 1 = -\\frac{2}{3}\\cdot\\left(\\frac{2}{3}\\right)^{n-1} = -\\left(\\frac{2}{3}\\right)^n$$
$$b_n = 1 - \\left(\\frac{2}{3}\\right)^n$$
②より，$a_n = 3^n\\cdot b_n$ であるから，
$$a_n = 3^n\\left\\{1 - \\left(\\frac{2}{3}\\right)^n\\right\\} = 3^n - 2^n$$
したがって，
$$\\mathbf{a_n = 3^n - 2^n}$$

(2) $a_{n+1} = \\dfrac{a_n}{3a_n + 1} \\quad \\cdots\\text{④}$
与えられた漸化式と $a_1 \\neq 0$ から，すべての自然数 $n$ に対して $a_n \\neq 0$ である。
④の逆数を考えると，
$$\\frac{1}{a_{n+1}} = \\frac{3a_n + 1}{a_n} = \\frac{1}{a_n} + 3$$
ここで，$\\dfrac{1}{a_n} = b_n \\ \\cdots\\text{⑤}$ とすると，
$$b_{n+1} = b_n + 3$$
これより，数列 $\\{b_n\\}$ は公差 3 の等差数列であり，
$$\\text{初項は } b_1 = \\frac{1}{a_1} = 4$$
である。よって，
$$b_n = 4 + (n - 1)\\cdot 3 = 3n + 1$$
したがって，⑤より，
$$\\mathbf{a_n = \\frac{1}{3n + 1}}$$`,
    commentary: `**例題128**，**例題129** の復習である。
(1)は，問題の漸化式の両辺を $3^{n+1}$ で割る。
(2)は，問題の漸化式の逆数を考える。`
  },

  88: {
    id: 88,
    chapter: "数列",
    title: "階差を利用する漸化式 an+1 = p an + f(n)",
    target_reidai: 130,
    sources: ["青山学院大"],
    question: `$a_1 = 2, \\quad a_{n+1} = \\dfrac{3}{4}a_n + \\dfrac{n}{2} \\ (n = 1, 2, 3, \\cdots)$ で定められる数列 $\\{a_n\\}$ がある。
(1) $b_n = a_{n+1} - a_n$ とするとき，数列 $\\{b_n\\}$ の一般項 $b_n$ を求めよ。
(2) 数列 $\\{a_n\\}$ の一般項 $a_n$ を求めよ。`,
    answer: `(1) 
$$a_{n+2} = \\frac{3}{4}a_{n+1} + \\frac{n+1}{2} \\quad \\cdots\\text{①}$$
$$a_{n+1} = \\frac{3}{4}a_n + \\frac{n}{2} \\quad \\cdots\\text{②}$$
① $-$ ② から，
$$a_{n+2} - a_{n+1} = \\frac{3}{4}(a_{n+1} - a_n) + \\frac{1}{2} \\quad \\cdots\\text{③}$$
ここで，$a_{n+1} - a_n = b_n$ とすると，③から，
$$b_{n+1} = \\frac{3}{4}b_n + \\frac{1}{2} \\quad \\cdots\\text{④}$$
であり，初項 $b_1$ は，
$$b_1 = a_2 - a_1 = \\left(\\frac{3}{4}a_1 + \\frac{1}{2}\\right) - a_1 = \\left(\\frac{3}{4}\\cdot 2 + \\frac{1}{2}\\right) - 2 = 2 - 2 = 0$$
④を変形すると，
$$b_{n+1} - 2 = \\frac{3}{4}(b_n - 2)$$
これより，数列 $\\{b_n - 2\\}$ は公比 $\\dfrac{3}{4}$ の等比数列であり，
$$\\text{初項は } b_1 - 2 = 0 - 2 = -2$$
である。よって，
$$b_n - 2 = -2\\cdot\\left(\\frac{3}{4}\\right)^{n-1}$$
$$\\mathbf{b_n = 2 - 2\\left(\\frac{3}{4}\\right)^{n-1}}$$

(2) (1)の結果より，
$$a_{n+1} - a_n = 2 - 2\\left(\\frac{3}{4}\\right)^{n-1}$$
これに②を代入すると，
$$\\frac{3}{4}a_n + \\frac{n}{2} - a_n = 2 - 2\\left(\\frac{3}{4}\\right)^{n-1}$$
$$-\\frac{1}{4}a_n = 2 - 2\\left(\\frac{3}{4}\\right)^{n-1} - \\frac{n}{2}$$
両辺に $-4$ を掛けて，
$$\\mathbf{a_n = 8\\left(\\frac{3}{4}\\right)^{n-1} + 2n - 8}$$`,
    commentary: `**例題130** の復習である。$b_{n+1}$ と $b_n$ の関係は基本形の漸化式となるので，これを解けば $b_n$ が得られる。
なお，$b_1 = a_2 - a_1$ であるが，$a_2$ は与えられた漸化式で $n$ を1にすれば手に入れることができる。`
  },

  89: {
    id: 89,
    chapter: "数列",
    title: "置きかえによる漸化式 an+1 = p an + pn + q",
    target_reidai: 130,
    sources: ["名城大"],
    question: `次のように定められた数列 $\\{a_n\\}$ がある。
$$a_1 = -2, \\quad a_{n+1} = 3a_n + 8n \\ (n = 1, 2, 3, \\cdots)$$
(1) $b_n = a_n + pn + q \\ (n = 1, 2, 3, \\cdots)$ とおくとき，数列 $\\{b_n\\}$ が等比数列になるように定数 $p$，$q$ の値を定めよ。
(2) 数列 $\\{a_n\\}$ の一般項を求めよ。`,
    answer: `(1) 
$$a_{n+1} = 3a_n + 8n \\quad \\cdots\\text{①}$$
$b_n = a_n + pn + q \\ \\cdots\\text{②}$ とすると，
$$a_n = b_n - pn - q$$
$$a_{n+1} = b_{n+1} - p(n+1) - q$$
であるから，これらを①に代入すると，
$$b_{n+1} - p(n+1) - q = 3(b_n - pn - q) + 8n$$
$$b_{n+1} - pn - p - q = 3b_n - 3pn - 3q + 8n$$
$$b_{n+1} = 3b_n + (8 - 2p)n + (p - 2q) \\quad \\cdots\\text{③}$$
数列 $\\{b_n\\}$ が等比数列になるのは，$r$ を定数として，
$$b_{n+1} = r b_n$$
が成り立つときであるから，③において，
$$\\begin{cases} 8 - 2p = 0 \\\\ p - 2q = 0 \\end{cases}$$
となるときである。これより，
$$\\mathbf{p = 4, \\quad q = 2}$$

(2) $p = 4$，$q = 2$ のとき，③より，
$$b_{n+1} = 3b_n$$
となるから，数列 $\\{b_n\\}$ は公比 3 の等比数列である。
また，$p = 4$，$q = 2$ のとき，②より，
$$b_n = a_n + 4n + 2 \\quad \\cdots\\text{④}$$
であり，初項 $b_1$ は，
$$b_1 = a_1 + 4\\cdot 1 + 2 = -2 + 4 + 2 = 4$$
よって，
$$b_n = 4\\cdot 3^{n-1}$$
これを④の左辺に代入すると，
$$4\\cdot 3^{n-1} = a_n + 4n + 2$$
となるから，
$$\\mathbf{a_n = 4\\cdot 3^{n-1} - 4n - 2}$$`,
    commentary: `前問と同じタイプの漸化式であるが，別の誘導になっている。このような誘導も入試ではしばしば見られるので，本問で慣れておこう。
数列 $\\{b_n\\}$ が等比数列になるのは，$r$ を定数として，
$$b_{n+1} = r b_n$$
が成り立つときである。このとき，$r$ が公比になる。`
  },

  90: {
    id: 90,
    chapter: "数列",
    title: "和Snを含む漸化式",
    target_reidai: 131,
    sources: ["立教大"],
    question: `数列 $\\{a_n\\}$ の初項から第 $n$ 項までの和を $S_n$ とするとき，
$$S_n = 2a_n - n \\ (n = 1, 2, 3, \\cdots)$$
が成り立っている。
(1) $a_1$ を求めよ。
(2) 一般項 $a_n$ を求めよ。`,
    answer: `$$S_n = 2a_n - n \\quad \\cdots\\text{①}$$
(1) ①で $n = 1$ とすると，
$$S_1 = 2a_1 - 1$$
となり，$S_1 = a_1$ であるから，
$$a_1 = 2a_1 - 1 \\implies \\mathbf{a_1 = 1}$$

(2) ①より，
$$S_{n+1} = 2a_{n+1} - (n+1)$$
$$S_n = 2a_n - n$$
が成り立つので，これらの差を考えると，
$$S_{n+1} - S_n = 2a_{n+1} - 2a_n - 1$$
$S_{n+1} - S_n = a_{n+1}$ であるから，
$$a_{n+1} = 2a_{n+1} - 2a_n - 1$$
$$a_{n+1} = 2a_n + 1 \\quad \\cdots\\text{②}$$
②を変形すると，
$$a_{n+1} + 1 = 2(a_n + 1)$$
これより，数列 $\\{a_n + 1\\}$ は公比 2 の等比数列であり，
$$\\text{初項は } a_1 + 1 = 1 + 1 = 2$$
である。したがって，
$$a_n + 1 = 2\\cdot 2^{n-1} = 2^n$$
$$\\mathbf{a_n = 2^n - 1}$$`,
    commentary: `「$a_n$ と $S_n$ が混ざっている条件式」が与えられている問題では，「和と一般項の関係」を用いて $S_n$ を消去して，$\\{a_n\\}$ についての関係式（漸化式）を手に入れることを考えることが多い。解答のように，①の $n$ を $n+1$ にした式を準備してその差を考えれば，$S_{n+1} - S_n = a_{n+1}$ によって，すぐに $\\{a_n\\}$ についての関係式を手に入れることができる。`
  },

  91: {
    id: 91,
    chapter: "数列",
    title: "数学的帰納法による倍数の証明",
    target_reidai: 133,
    sources: ["静岡大"],
    question: `$a_n = 4^{n+1} + 5^{2n-1} \\ (n=1, 2, 3, \\cdots)$ とする。すべての自然数 $n$ に対して，$a_n$ は 21 で割り切れることを証明せよ。`,
    answer: `すべての自然数 $n$ に対して，命題
「$a_n = 4^{n+1} + 5^{2n-1}$ は 21 で割り切れる」 $\\cdots(*)$
が成り立つことを数学的帰納法で証明する。

(i) $n = 1$ のとき
$$a_1 = 4^2 + 5^1 = 16 + 5 = 21$$
であるから，$n = 1$ において $(*)$ は成り立つ。

(ii) $n = k \\ (\\geqq 1)$ のときに $(*)$ が成り立つと仮定すると，
$$a_k = 4^{k+1} + 5^{2k-1} = 21M \\quad (M \\text{は整数})$$
と表せる。
このとき，
$$4^{k+1} = 21M - 5^{2k-1}$$
であるから，
$$\\begin{aligned}
a_{k+1} &= 4^{(k+1)+1} + 5^{2(k+1)-1} \\\\
&= 4 \\cdot 4^{k+1} + 5^{2k+1} \\\\
&= 4(21M - 5^{2k-1}) + 5^2 \\cdot 5^{2k-1} \\\\
&= 4 \\cdot 21M - 4 \\cdot 5^{2k-1} + 25 \\cdot 5^{2k-1} \\\\
&= 4 \\cdot 21M + 21 \\cdot 5^{2k-1} \\\\
&= 21(4M + 5^{2k-1})
\\end{aligned}$$
$4M + 5^{2k-1}$ は整数であるから，$a_{k+1}$ は 21 で割り切れる。
したがって，$n = k+1$ でも $(*)$ は成り立つ。

(i)，(ii)より，すべての自然数 $n$ に対して，$(*)$ は成り立つ。`,
    commentary: ``
  },

  92: {
    id: 92,
    chapter: "数列",
    title: "数学的帰納法による不等式の証明",
    target_reidai: 134,
    sources: ["津田塾大"],
    question: `$n \\geqq 5$ を満たす自然数 $n$ に対して，$2^n > n^2$ が成り立つことを証明せよ。`,
    answer: `$n \\geqq 5$ を満たす自然数 $n$ に対して，
$$2^n > n^2 \\quad \\cdots(*)$$
が成り立つことを数学的帰納法で証明する。

(i) $n = 5$ のとき
$$\\text{左辺} = 2^5 = 32, \\quad \\text{右辺} = 5^2 = 25$$
$32 > 25$ であるから，$n = 5$ において $(*)$ は成り立つ。

(ii) $n = k \\ (k \\geqq 5)$ のときに $(*)$ が成り立つと仮定すると，
$$2^k > k^2 \\quad \\cdots\\text{①}$$
①の両辺に 2 を掛けると，
$$2^{k+1} > 2k^2 \\quad \\cdots\\text{②}$$
ここで，
$$\\begin{aligned}
2k^2 - (k+1)^2 &= 2k^2 - (k^2 + 2k + 1) \\\\
&= k^2 - 2k - 1 \\\\
&= (k - 1)^2 - 2
\\end{aligned}$$
$k \\geqq 5$ より，$k - 1 \\geqq 4$ であるから，
$$2k^2 - (k+1)^2 \\geqq (5 - 1)^2 - 2 = 16 - 2 = 14 > 0$$
したがって，
$$2k^2 > (k+1)^2 \\quad \\cdots\\text{③}$$
が成り立つ。
②，③より，
$$2^{k+1} > 2k^2 > (k+1)^2 \\implies 2^{k+1} > (k+1)^2$$
となるから，$n = k+1$ でも $(*)$ は成り立つ。

(i)，(ii)より，$n \\geqq 5$ を満たす自然数 $n$ に対して，$(*)$ は成り立つ。`,
    commentary: ``
  },

  93: {
    id: 93,
    chapter: "平面ベクトル",
    title: "平面ベクトルの交点・交点の位置ベクトル",
    target_reidai: 137,
    sources: ["立教大"],
    question: `平行四辺形 $\\mathrm{ABCD}$ において，辺 $\\mathrm{AB}$ を $2:1$ に内分する点を $\\mathrm{E}$，辺 $\\mathrm{BC}$ の中点を $\\mathrm{F}$，辺 $\\mathrm{CD}$ の中点を $\\mathrm{G}$ とする。線分 $\\mathrm{CE}$ と線分 $\\mathrm{FG}$ の交点を $\\mathrm{H}$ とするとき，$\\vec{\\mathrm{AH}}$ を $\\vec{\\mathrm{AB}}$，$\\vec{\\mathrm{AD}}$ を用いて表せ。`,
    answer: `四角形 $\\mathrm{ABCD}$ は平行四辺形であるから，
$$\\vec{\\mathrm{AC}} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{AD}}$$
さらに，条件より，
$$\\vec{\\mathrm{AE}} = \\frac{2}{3}\\vec{\\mathrm{AB}}$$
$$\\vec{\\mathrm{AF}} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{BF}} = \\vec{\\mathrm{AB}} + \\frac{1}{2}\\vec{\\mathrm{AD}}$$
$$\\vec{\\mathrm{AG}} = \\vec{\\mathrm{AD}} + \\vec{\\mathrm{DG}} = \\frac{1}{2}\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AD}}$$
である。

$\\mathrm{H}$ は線分 $\\mathrm{FG}$ 上の点であるから，$\\mathrm{FH} : \\mathrm{HG} = s : (1 - s)$ とおくと，
$$\\begin{aligned}
\\vec{\\mathrm{AH}} &= (1 - s)\\vec{\\mathrm{AF}} + s\\vec{\\mathrm{AG}} \\\\
&= (1 - s)\\left(\\vec{\\mathrm{AB}} + \\frac{1}{2}\\vec{\\mathrm{AD}}\\right) + s\\left(\\frac{1}{2}\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AD}}\\right) \\\\
&= \\left(1 - \\frac{1}{2}s\\right)\\vec{\\mathrm{AB}} + \\left(\\frac{1}{2} + \\frac{1}{2}s\\right)\\vec{\\mathrm{AD}} \\quad \\cdots\\text{①}
\\end{aligned}$$
また，$\\mathrm{H}$ は線分 $\\mathrm{CE}$ 上の点でもあるから，$\\mathrm{CH} : \\mathrm{HE} = t : (1 - t)$ とおくと，
$$\\begin{aligned}
\\vec{\\mathrm{AH}} &= (1 - t)\\vec{\\mathrm{AC}} + t\\vec{\\mathrm{AE}} \\\\
&= (1 - t)(\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AD}}) + t\\left(\\frac{2}{3}\\vec{\\mathrm{AB}}\\right) \\\\
&= \\left(1 - \\frac{1}{3}t\\right)\\vec{\\mathrm{AB}} + (1 - t)\\vec{\\mathrm{AD}} \\quad \\cdots\\text{②}
\\end{aligned}$$
$\\vec{\\mathrm{AB}} \\neq \\vec{0}$，$\\vec{\\mathrm{AD}} \\neq \\vec{0}$ であり，$\\vec{\\mathrm{AB}}$ と $\\vec{\\mathrm{AD}}$ は平行でない（1次独立）から，①，②の係数を比較して，
$$\\begin{cases}
1 - \\dfrac{1}{2}s = 1 - \\dfrac{1}{3}t \\\\
\\dfrac{1}{2} + \\dfrac{1}{2}s = 1 - t
\\end{cases}$$
第1式より $\\dfrac{1}{2}s = \\dfrac{1}{3}t \\implies s = \\dfrac{2}{3}t$。
第2式に代入して，
$$\\frac{1}{2} + \\frac{1}{3}t = 1 - t \\implies \\frac{4}{3}t = \\frac{1}{2} \\implies t = \\frac{3}{8}$$
このとき $s = \\dfrac{2}{3} \\times \\dfrac{3}{8} = \\dfrac{1}{4}$ となる。
よって，②（または①）に $t = \\dfrac{3}{8}$ を代入して，
$$\\vec{\\mathrm{AH}} = \\left(1 - \\frac{1}{3} \\cdot \\frac{3}{8}\\right)\\vec{\\mathrm{AB}} + \\left(1 - \\frac{3}{8}\\right)\\vec{\\mathrm{AD}} = \\mathbf{\\frac{7}{8}\\vec{\\mathrm{AB}} + \\frac{5}{8}\\vec{\\mathrm{AD}}}$$`,
    commentary: ``
  },

  94: {
    id: 94,
    chapter: "平面ベクトル",
    title: "三角形の内部の点と位置ベクトル",
    target_reidai: 138,
    sources: ["摂南大"],
    question: `三角形 $\\mathrm{ABC}$ の内部に，$7\\vec{\\mathrm{PA}} + 5\\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}} = \\vec{0}$ を満たすように点 $\\mathrm{P}$ をとり，直線 $\\mathrm{AP}$ と辺 $\\mathrm{BC}$ の交点を $\\mathrm{D}$ とする。
(1) $\\vec{\\mathrm{AP}}$ を $\\vec{\\mathrm{AB}}$，$\\vec{\\mathrm{AC}}$ を用いて表せ。
(2) $\\vec{\\mathrm{AD}}$ を $\\vec{\\mathrm{AB}}$，$\\vec{\\mathrm{AC}}$ を用いて表せ。また，$\\mathrm{BD}:\\mathrm{DC}$ を求めよ。`,
    answer: `(1) 始点を $\\mathrm{A}$ にそろえると，$\\vec{\\mathrm{PA}} = -\\vec{\\mathrm{AP}}$，$\\vec{\\mathrm{PB}} = \\vec{\\mathrm{AB}} - \\vec{\\mathrm{AP}}$，$\\vec{\\mathrm{PC}} = \\vec{\\mathrm{AC}} - \\vec{\\mathrm{AP}}$ であるから，
$$7(-\\vec{\\mathrm{AP}}) + 5(\\vec{\\mathrm{AB}} - \\vec{\\mathrm{AP}}) + 3(\\vec{\\mathrm{AC}} - \\vec{\\mathrm{AP}}) = \\vec{0}$$
$$-15\\vec{\\mathrm{AP}} + 5\\vec{\\mathrm{AB}} + 3\\vec{\\mathrm{AC}} = \\vec{0}$$
$$15\\vec{\\mathrm{AP}} = 5\\vec{\\mathrm{AB}} + 3\\vec{\\mathrm{AC}}$$
したがって，
$$\\vec{\\mathrm{AP}} = \\mathbf{\\frac{1}{3}\\vec{\\mathrm{AB}} + \\frac{1}{5}\\vec{\\mathrm{AC}}}$$

(2) $\\vec{\\mathrm{AP}}$ の式を変形すると，
$$\\vec{\\mathrm{AP}} = \\frac{5\\vec{\\mathrm{AB}} + 3\\vec{\\mathrm{AC}}}{15} = \\frac{8}{15} \\cdot \\frac{5\\vec{\\mathrm{AB}} + 3\\vec{\\mathrm{AC}}}{8}$$
点 $\\mathrm{D}$ は直線 $\\mathrm{AP}$ と辺 $\\mathrm{BC}$ の交点であるから，
$$\\vec{\\mathrm{AD}} = \\frac{5\\vec{\\mathrm{AB}} + 3\\vec{\\mathrm{AC}}}{8} = \\mathbf{\\frac{5}{8}\\vec{\\mathrm{AB}} + \\frac{3}{8}\\vec{\\mathrm{AC}}}$$
この式より，点 $\\mathrm{D}$ は辺 $\\mathrm{BC}$ を $3:5$ に内分する点である。
したがって，
$$\\mathbf{\\mathrm{BD} : \\mathrm{DC} = 3 : 5}$$`,
    commentary: ``
  },

  95: {
    id: 95,
    chapter: "平面ベクトル",
    title: "ベクトルの大きさと内積，三角形の面積",
    target_reidai: 140,
    sources: ["立命館大"],
    question: `三角形 $\\mathrm{OAB}$ において，$|\\vec{\\mathrm{OA}} + \\vec{\\mathrm{OB}}| = \\left|\\vec{\\mathrm{OA}} - \\frac{2}{3}\\vec{\\mathrm{OB}}\\right| = \\sqrt{10}$，$|\\vec{\\mathrm{OB}}| = 3$ であるとき，$|\\vec{\\mathrm{OA}}| = \\fbox{\\quad}$，内積 $\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = \\fbox{\\quad}$ である。また，三角形 $\\mathrm{OAB}$ の面積は $\\fbox{\\quad}$ となる。`,
    answer: `与えられた条件より，
$$|\\vec{\\mathrm{OA}} + \\vec{\\mathrm{OB}}| = \\sqrt{10} \\quad \\cdots\\text{①}$$
$$\\left|\\vec{\\mathrm{OA}} - \\frac{2}{3}\\vec{\\mathrm{OB}}\\right| = \\sqrt{10} \\quad \\cdots\\text{②}$$
①，②の両辺を2乗すると，
$$\\begin{cases}
|\\vec{\\mathrm{OA}}|^2 + 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} + |\\vec{\\mathrm{OB}}|^2 = 10 \\\\
|\\vec{\\mathrm{OA}}|^2 - \\dfrac{4}{3}\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} + \\dfrac{4}{9}|\\vec{\\mathrm{OB}}|^2 = 10
\\end{cases}$$
ここで $|\\vec{\\mathrm{OB}}| = 3$ より $|\\vec{\\mathrm{OB}}|^2 = 9$ であるから，
$$\\begin{cases}
|\\vec{\\mathrm{OA}}|^2 + 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} + 9 = 10 \\\\
|\\vec{\\mathrm{OA}}|^2 - \\dfrac{4}{3}\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} + \\dfrac{4}{9} \\times 9 = 10
\\end{cases}$$
整理すると，
$$\\begin{cases}
|\\vec{\\mathrm{OA}}|^2 + 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = 1 & \\cdots\\text{③} \\\\
|\\vec{\\mathrm{OA}}|^2 - \\dfrac{4}{3}\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = 6 & \\cdots\\text{④}
\\end{cases}$$
③ $-$ ④ より，
$$\\frac{10}{3}\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = -5 \\implies \\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = -5 \\times \\frac{3}{10} = \\mathbf{-\\frac{3}{2}}$$
これを③に代入すると，
$$|\\vec{\\mathrm{OA}}|^2 + 2\\left(-\\frac{3}{2}\\right) = 1 \\implies |\\vec{\\mathrm{OA}}|^2 - 3 = 1 \\implies |\\vec{\\mathrm{OA}}|^2 = 4$$
$|\\vec{\\mathrm{OA}}| > 0$ であるから，
$$|\\vec{\\mathrm{OA}}| = \\mathbf{2}$$

さらに，三角形 $\\mathrm{OAB}$ の面積を $S$ とすると，
$$\\begin{aligned}
S &= \\frac{1}{2}\\sqrt{|\\vec{\\mathrm{OA}}|^2|\\vec{\\mathrm{OB}}|^2 - (\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}})^2} \\\\
&= \\frac{1}{2}\\sqrt{2^2 \\times 3^2 - \\left(-\\frac{3}{2}\\right)^2} \\\\
&= \\frac{1}{2}\\sqrt{36 - \\frac{9}{4}} \\\\
&= \\frac{1}{2}\\sqrt{\\frac{135}{4}} \\\\
&= \\frac{1}{2} \\cdot \\frac{3\\sqrt{15}}{2} = \\mathbf{\\frac{3\\sqrt{15}}{4}}
\\end{aligned}$$
空欄の答え：$|\\vec{\\mathrm{OA}}| = \\mathbf{2}$，$\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = \\mathbf{-\\frac{3}{2}}$，面積は $\\mathbf{\\frac{3\\sqrt{15}}{4}}$。`,
    commentary: ``
  },

  96: {
    id: 96,
    chapter: "平面ベクトル",
    title: "ベクトルの成分と内積・なす角",
    target_reidai: 141,
    sources: ["小樽商科大"],
    question: `$m$，$n$ は正の数として，$\\vec{a} = (-1, 3)$，$\\vec{b} = (m, n)$ とする。$|\\vec{b}| = 2\\sqrt{5}$ で，$\\vec{a}$，$\\vec{b}$ のなす角が $45^\\circ$ であるとき，$m = \\fbox{\\quad}$，$n = \\fbox{\\quad}$ である。`,
    answer: `$\\vec{a} = (-1, 3)$ より，
$$|\\vec{a}| = \\sqrt{(-1)^2 + 3^2} = \\sqrt{10}$$
$\\vec{b} = (m, n)$ より，$|\\vec{b}| = \\sqrt{m^2 + n^2}$ であり，条件より $|\\vec{b}| = 2\\sqrt{5}$ であるから，
$$m^2 + n^2 = (2\\sqrt{5})^2 = 20 \\quad \\cdots\\text{①}$$
内積 $\\vec{a} \\cdot \\vec{b}$ について，成分から
$$\\vec{a} \\cdot \\vec{b} = -m + 3n$$
一方，なす角が $45^\\circ$ であることから，
$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos 45^\\circ = \\sqrt{10} \\times 2\\sqrt{5} \\times \\frac{1}{\\sqrt{2}} = 2\\sqrt{25} = 10$$
したがって，
$$-m + 3n = 10 \\implies m = 3n - 10 \\quad \\cdots\\text{②}$$
②を①に代入すると，
$$(3n - 10)^2 + n^2 = 20$$
$$9n^2 - 60n + 100 + n^2 = 20$$
$$10n^2 - 60n + 80 = 0$$
$$n^2 - 6n + 8 = 0$$
$$(n - 2)(n - 4) = 0 \\implies n = 2, \\ 4$$

$n = 2$ のとき，②より $m = 3(2) - 10 = -4$ となるが，$m > 0$ を満たさないため不適。
$n = 4$ のとき，②より $m = 3(4) - 10 = 2$ となり，$m > 0, n > 0$ を満たす。
したがって，
$$\\mathbf{m = 2, \\quad n = 4}$$`,
    commentary: ``
  },

  97: {
    id: 97,
    chapter: "平面ベクトル",
    title: "垂直条件と垂線の足の位置ベクトル",
    target_reidai: 139,
    sources: ["西南学院大"],
    question: `三角形 $\\mathrm{OAB}$ において，辺の長さがそれぞれ $\\mathrm{OA}=5$，$\\mathrm{AB}=6$，$\\mathrm{OB}=4$ であるとする。点 $\\mathrm{P}$ は辺 $\\mathrm{AB}$ を $2:1$ に内分する点である。$\\mathrm{P}$ から辺 $\\mathrm{OA}$ に下ろした垂線の足を $\\mathrm{Q}$ とするとき，$\\vec{\\mathrm{PQ}}$ を $\\vec{\\mathrm{OA}}$，$\\vec{\\mathrm{OB}}$ を用いて表せ。`,
    answer: `点 $\\mathrm{P}$ は辺 $\\mathrm{AB}$ を $2:1$ に内分する点であるから，
$$\\vec{\\mathrm{OP}} = \\frac{1}{3}\\vec{\\mathrm{OA}} + \\frac{2}{3}\\vec{\\mathrm{OB}}$$
また，点 $\\mathrm{Q}$ は辺 $\\mathrm{OA}$ 上にあるから，実数 $k$ を用いて
$$\\vec{\\mathrm{OQ}} = k\\vec{\\mathrm{OA}}$$
とおける。
これより，
$$\\vec{\\mathrm{PQ}} = \\vec{\\mathrm{OQ}} - \\vec{\\mathrm{OP}} = k\\vec{\\mathrm{OA}} - \\left(\\frac{1}{3}\\vec{\\mathrm{OA}} + \\frac{2}{3}\\vec{\\mathrm{OB}}\\right) = \\left(k - \\frac{1}{3}\\right)\\vec{\\mathrm{OA}} - \\frac{2}{3}\\vec{\\mathrm{OB}} \\quad \\cdots\\text{①}$$
である。
条件より $\\mathrm{PQ} \\perp \\mathrm{OA}$ であるから，$\\vec{\\mathrm{PQ}} \\cdot \\vec{\\mathrm{OA}} = 0$ が成り立つ。
①を代入すると，
$$\\left\\{\\left(k - \\frac{1}{3}\\right)\\vec{\\mathrm{OA}} - \\frac{2}{3}\\vec{\\mathrm{OB}}\\right\\} \\cdot \\vec{\\mathrm{OA}} = 0$$
$$\\left(k - \\frac{1}{3}\\right)|\\vec{\\mathrm{OA}}|^2 - \\frac{2}{3}\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = 0 \\quad \\cdots\\text{②}$$
ここで，$|\\vec{\\mathrm{OA}}| = 5$ より $|\\vec{\\mathrm{OA}}|^2 = 25$。
また，$|\\vec{\\mathrm{AB}}| = 6$ より，
$$|\\vec{\\mathrm{OB}} - \\vec{\\mathrm{OA}}|^2 = 6^2 = 36$$
$$|\\vec{\\mathrm{OB}}|^2 - 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} + |\\vec{\\mathrm{OA}}|^2 = 36$$
$|\\vec{\\mathrm{OB}}| = 4, |\\vec{\\mathrm{OA}}| = 5$ であるから，
$$16 - 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} + 25 = 36$$
$$41 - 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = 36 \\implies 2\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = 5 \\implies \\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OB}} = \\frac{5}{2}$$
これらを②に代入すると，
$$\\left(k - \\frac{1}{3}\\right) \\times 25 - \\frac{2}{3} \\times \\frac{5}{2} = 0$$
$$25k - \\frac{25}{3} - \\frac{5}{3} = 0$$
$$25k - 10 = 0 \\implies k = \\frac{10}{25} = \\frac{2}{5}$$
これを①に代入して，
$$\\vec{\\mathrm{PQ}} = \\left(\\frac{2}{5} - \\frac{1}{3}\\right)\\vec{\\mathrm{OA}} - \\frac{2}{3}\\vec{\\mathrm{OB}} = \\mathbf{\\frac{1}{15}\\vec{\\mathrm{OA}} - \\frac{2}{3}\\vec{\\mathrm{OB}}}$$`,
    commentary: ``
  },

  98: {
    id: 98,
    chapter: "平面ベクトル",
    title: "外心・円に内接する三角形と位置ベクトル",
    target_reidai: 140,
    sources: ["島根大"],
    question: `原点 $\\mathrm{O}$ を中心とする半径 1 の円周上にある 3 点 $\\mathrm{A}, \\mathrm{B}, \\mathrm{C}$ が，条件 $7\\vec{\\mathrm{OA}} + 5\\vec{\\mathrm{OB}} + 3\\vec{\\mathrm{OC}} = \\vec{0}$ を満たすとき，次の問に答えよ。
(1) $\\angle\\mathrm{BOC}$ を求めよ。
(2) 直線 $\\mathrm{CO}$ と直線 $\\mathrm{AB}$ の交点を $\\mathrm{H}$ とするとき，$\\vec{\\mathrm{OH}}$ を $\\vec{\\mathrm{OC}}$ を用いて表せ。
(3) 三角形 $\\mathrm{OHB}$ の面積を求めよ。`,
    answer: `(1) 与えられた条件式を変形すると，
$$5\\vec{\\mathrm{OB}} + 3\\vec{\\mathrm{OC}} = -7\\vec{\\mathrm{OA}}$$
両辺の大きさを2乗すると，
$$|5\\vec{\\mathrm{OB}} + 3\\vec{\\mathrm{OC}}|^2 = |-7\\vec{\\mathrm{OA}}|^2$$
$$25|\\vec{\\mathrm{OB}}|^2 + 30\\vec{\\mathrm{OB}} \\cdot \\vec{\\mathrm{OC}} + 9|\\vec{\\mathrm{OC}}|^2 = 49|\\vec{\\mathrm{OA}}|^2$$
$\\mathrm{A}, \\mathrm{B}, \\mathrm{C}$ は半径 1 の円周上の点であるから，$|\\vec{\\mathrm{OA}}| = |\\vec{\\mathrm{OB}}| = |\\vec{\\mathrm{OC}}| = 1$ である。
したがって，
$$25 + 30\\vec{\\mathrm{OB}} \\cdot \\vec{\\mathrm{OC}} + 9 = 49$$
$$30\\vec{\\mathrm{OB}} \\cdot \\vec{\\mathrm{OC}} = 15 \\implies \\vec{\\mathrm{OB}} \\cdot \\vec{\\mathrm{OC}} = \\frac{1}{2}$$
ここで，$\\vec{\\mathrm{OB}} \\cdot \\vec{\\mathrm{OC}} = |\\vec{\\mathrm{OB}}||\\vec{\\mathrm{OC}}|\\cos\\angle\\mathrm{BOC}$ より，
$$\\cos\\angle\\mathrm{BOC} = \\frac{1}{2}$$
$0^\\circ < \\angle\\mathrm{BOC} < 180^\\circ$ であるから，
$$\\mathbf{\\angle\\mathrm{BOC} = 60^\\circ}$$

(2) $7\\vec{\\mathrm{OA}} + 5\\vec{\\mathrm{OB}} + 3\\vec{\\mathrm{OC}} = \\vec{0}$ より，
$$\\vec{\\mathrm{OC}} = -\\frac{7}{3}\\vec{\\mathrm{OA}} - \\frac{5}{3}\\vec{\\mathrm{OB}}$$
点 $\\mathrm{H}$ は直線 $\\mathrm{OC}$ 上にあるから，実数 $k$ を用いて
$$\\vec{\\mathrm{OH}} = k\\vec{\\mathrm{OC}} = -\\frac{7}{3}k\\vec{\\mathrm{OA}} - \\frac{5}{3}k\\vec{\\mathrm{OB}} \\quad \\cdots\\text{①}$$
とおける。
一方，点 $\\mathrm{H}$ は直線 $\\mathrm{AB}$ 上の点でもあるから，$\\vec{\\mathrm{OA}}$ と $\\vec{\\mathrm{OB}}$ の係数の和は 1 である。すなわち，
$$-\\frac{7}{3}k - \\frac{5}{3}k = 1 \\implies -4k = 1 \\implies k = -\\frac{1}{4}$$
したがって，①より，
$$\\vec{\\mathrm{OH}} = \\mathbf{-\\frac{1}{4}\\vec{\\mathrm{OC}}}$$

(3) $\\vec{\\mathrm{OH}} = -\\dfrac{1}{4}\\vec{\\mathrm{OC}}$ より，点 $\\mathrm{H}$ は線分 $\\mathrm{OC}$ を $1:5$（外分）する位置にあり，長さは
$$\\mathrm{OH} = \\frac{1}{4}|\\vec{\\mathrm{OC}}| = \\frac{1}{4}$$
また，$\\vec{\\mathrm{OH}}$ と $\\vec{\\mathrm{OC}}$ は逆向きのベクトルであるから，
$$\\angle\\mathrm{BOH} = 180^\\circ - \\angle\\mathrm{BOC} = 180^\\circ - 60^\\circ = 120^\\circ$$
したがって，三角形 $\\mathrm{OHB}$ の面積は，
$$\\triangle\\mathrm{OHB} = \\frac{1}{2} \\cdot \\mathrm{OH} \\cdot \\mathrm{OB} \\cdot \\sin 120^\\circ = \\frac{1}{2} \\cdot \\frac{1}{4} \\cdot 1 \\cdot \\frac{\\sqrt{3}}{2} = \\mathbf{\\frac{\\sqrt{3}}{16}}$$`,
    commentary: ``
  },

  99: {
    id: 99,
    chapter: "空間ベクトル",
    title: "空間の直線の交点と平面上の点",
    target_reidai: 144,
    sources: ["立命館大"],
    question: `四面体 $\\mathrm{OABC}$ において，辺 $\\mathrm{AB}$ を $2:1$ に内分する点を $\\mathrm{P}$，線分 $\\mathrm{PC}$ の中点を $\\mathrm{Q}$，線分 $\\mathrm{OQ}$ を $4:1$ に内分する点を $\\mathrm{R}$ とする。
(1) $\\vec{\\mathrm{OP}}$，$\\vec{\\mathrm{OQ}}$，$\\vec{\\mathrm{OR}}$ を $\\vec{\\mathrm{OA}}$，$\\vec{\\mathrm{OB}}$，$\\vec{\\mathrm{OC}}$ を用いて表せ。
(2) 直線 $\\mathrm{AR}$ と平面 $\\mathrm{OBC}$ の交点を $\\mathrm{S}$ とする。$\\mathrm{AR} : \\mathrm{RS}$ を求めよ。`,
    answer: `(1) 点 $\\mathrm{P}$ は辺 $\\mathrm{AB}$ を $2:1$ に内分する点であるから，
$$\\vec{\\mathrm{OP}} = \\mathbf{\\frac{1}{3}\\vec{\\mathrm{OA}} + \\frac{2}{3}\\vec{\\mathrm{OB}}}$$
点 $\\mathrm{Q}$ は線分 $\\mathrm{PC}$ の中点であるから，
$$\\vec{\\mathrm{OQ}} = \\frac{\\vec{\\mathrm{OP}} + \\vec{\\mathrm{OC}}}{2} = \\frac{1}{2}\\left(\\frac{1}{3}\\vec{\\mathrm{OA}} + \\frac{2}{3}\\vec{\\mathrm{OB}}\\right) + \\frac{1}{2}\\vec{\\mathrm{OC}} = \\mathbf{\\frac{1}{6}\\vec{\\mathrm{OA}} + \\frac{1}{3}\\vec{\\mathrm{OB}} + \\frac{1}{2}\\vec{\\mathrm{OC}}}$$
点 $\\mathrm{R}$ は線分 $\\mathrm{OQ}$ を $4:1$ に内分する点であるから，
$$\\vec{\\mathrm{OR}} = \\frac{4}{5}\\vec{\\mathrm{OQ}} = \\frac{4}{5}\\left(\\frac{1}{6}\\vec{\\mathrm{OA}} + \\frac{1}{3}\\vec{\\mathrm{OB}} + \\frac{1}{2}\\vec{\\mathrm{OC}}\\right) = \\mathbf{\\frac{2}{15}\\vec{\\mathrm{OA}} + \\frac{4}{15}\\vec{\\mathrm{OB}} + \\frac{2}{5}\\vec{\\mathrm{OC}}}$$

(2) 点 $\\mathrm{S}$ は直線 $\\mathrm{AR}$ 上にあるから，実数 $k$ を用いて
$$\\begin{aligned}
\\vec{\\mathrm{OS}} &= (1 - k)\\vec{\\mathrm{OA}} + k\\vec{\\mathrm{OR}} \\\\
&= (1 - k)\\vec{\\mathrm{OA}} + k\\left(\\frac{2}{15}\\vec{\\mathrm{OA}} + \\frac{4}{15}\\vec{\\mathrm{OB}} + \\frac{2}{5}\\vec{\\mathrm{OC}}\\right) \\\\
&= \\left(1 - \\frac{13}{15}k\\right)\\vec{\\mathrm{OA}} + \\frac{4}{15}k\\vec{\\mathrm{OB}} + \\frac{2}{5}k\\vec{\\mathrm{OC}}
\\end{aligned}$$
とおける。
点 $\\mathrm{S}$ は平面 $\\mathrm{OBC}$ 上の点であるから，$\\vec{\\mathrm{OA}}$ の係数は 0 である。
したがって，
$$1 - \\frac{13}{15}k = 0 \\implies k = \\frac{15}{13}$$
よって，$\\vec{\\mathrm{AS}} = \\dfrac{15}{13}\\vec{\\mathrm{AR}}$ となるから，点 $\\mathrm{R}$ は線分 $\\mathrm{AS}$ を $13:2$ に内分する。
したがって，
$$\\mathbf{\\mathrm{AR} : \\mathrm{RS} = 13 : 2}$$`,
    commentary: ``
  },

  100: {
    id: 100,
    chapter: "空間ベクトル",
    title: "空間の平面への垂線の足と四面体の体積",
    target_reidai: 144,
    sources: ["大阪教育大"],
    question: `座標空間において，3 点 $\\mathrm{A}(0, -1, 2)$，$\\mathrm{B}(-1, 0, 5)$，$\\mathrm{C}(1, 1, 3)$ で定まる平面を $\\alpha$ とし，原点 $\\mathrm{O}$ から平面 $\\alpha$ に垂線 $\\mathrm{OH}$ を下ろす。
(1) 三角形 $\\mathrm{ABC}$ の面積を求めよ。
(2) $\\vec{\\mathrm{AH}} = s\\vec{\\mathrm{AB}} + t\\vec{\\mathrm{AC}}$ を満たす $s, t$ を求めよ。
(3) 点 $\\mathrm{H}$ の座標を求めよ。
(4) 四面体 $\\mathrm{OABC}$ の体積を求めよ。`,
    answer: `(1) $\\vec{\\mathrm{AB}} = (-1 - 0, 0 - (-1), 5 - 2) = (-1, 1, 3)$
$\\vec{\\mathrm{AC}} = (1 - 0, 1 - (-1), 3 - 2) = (1, 2, 1)$
より，
$$|\\vec{\\mathrm{AB}}|^2 = (-1)^2 + 1^2 + 3^2 = 11$$
$$|\\vec{\\mathrm{AC}}|^2 = 1^2 + 2^2 + 1^2 = 6$$
$$\\vec{\\mathrm{AB}} \\cdot \\vec{\\mathrm{AC}} = (-1)(1) + 1(2) + 3(1) = -1 + 2 + 3 = 4$$
よって，三角形 $\\mathrm{ABC}$ の面積を $S$ とすると，
$$S = \\frac{1}{2}\\sqrt{|\\vec{\\mathrm{AB}}|^2|\\vec{\\mathrm{AC}}|^2 - (\\vec{\\mathrm{AB}} \\cdot \\vec{\\mathrm{AC}})^2} = \\frac{1}{2}\\sqrt{11 \\times 6 - 4^2} = \\frac{1}{2}\\sqrt{66 - 16} = \\frac{1}{2}\\sqrt{50} = \\mathbf{\\frac{5\\sqrt{2}}{2}}$$

(2) $\\vec{\\mathrm{OH}} = \\vec{\\mathrm{OA}} + \\vec{\\mathrm{AH}} = \\vec{\\mathrm{OA}} + s\\vec{\\mathrm{AB}} + t\\vec{\\mathrm{AC}}$ である。
$\\mathrm{OH} \\perp$ 平面 $\\alpha$ より，$\\vec{\\mathrm{OH}} \\perp \\vec{\\mathrm{AB}}$ かつ $\\vec{\\mathrm{OH}} \\perp \\vec{\\mathrm{AC}}$ である。
ここで，$\\vec{\\mathrm{OA}} = (0, -1, 2)$ より，
$$\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{AB}} = 0(-1) + (-1)(1) + 2(3) = 5$$
$$\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{AC}} = 0(1) + (-1)(2) + 2(1) = 0$$
したがって，
$$\\vec{\\mathrm{OH}} \\cdot \\vec{\\mathrm{AB}} = (\\vec{\\mathrm{OA}} + s\\vec{\\mathrm{AB}} + t\\vec{\\mathrm{AC}}) \\cdot \\vec{\\mathrm{AB}} = \\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{AB}} + s|\\vec{\\mathrm{AB}}|^2 + t(\\vec{\\mathrm{AB}} \\cdot \\vec{\\mathrm{AC}}) = 5 + 11s + 4t = 0 \\quad \\cdots\\text{①}$$
$$\\vec{\\mathrm{OH}} \\cdot \\vec{\\mathrm{AC}} = (\\vec{\\mathrm{OA}} + s\\vec{\\mathrm{AB}} + t\\vec{\\mathrm{AC}}) \\cdot \\vec{\\mathrm{AC}} = \\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{AC}} + s(\\vec{\\mathrm{AB}} \\cdot \\vec{\\mathrm{AC}}) + t|\\vec{\\mathrm{AC}}|^2 = 0 + 4s + 6t = 4s + 6t = 0 \\quad \\cdots\\text{②}$$
②より $t = -\\dfrac{2}{3}s$。これを①に代入して，
$$5 + 11s + 4\\left(-\\frac{2}{3}s\\right) = 0 \\implies 5 + \\frac{25}{3}s = 0 \\implies s = -\\frac{3}{5}$$
このとき $t = -\\dfrac{2}{3}\\left(-\\dfrac{3}{5}\\right) = \\dfrac{2}{5}$。
したがって，
$$\\mathbf{s = -\\frac{3}{5}, \\quad t = \\frac{2}{5}}$$

(3) (2)の結果より，
$$\\begin{aligned}
\\vec{\\mathrm{OH}} &= \\vec{\\mathrm{OA}} - \\frac{3}{5}\\vec{\\mathrm{AB}} + \\frac{2}{5}\\vec{\\mathrm{AC}} \\\\
&= (0, -1, 2) - \\frac{3}{5}(-1, 1, 3) + \\frac{2}{5}(1, 2, 1) \\\\
&= \\left(0 + \\frac{3}{5} + \\frac{2}{5}, \\ -1 - \\frac{3}{5} + \\frac{4}{5}, \\ 2 - \\frac{9}{5} + \\frac{2}{5}\\right) \\\\
&= \\left(1, \\ -\\frac{4}{5}, \\ \\frac{3}{5}\\right)
\\end{aligned}$$
したがって，点 $\\mathrm{H}$ の座標は，
$$\\mathbf{H\\left(1, -\\frac{4}{5}, \\frac{3}{5}\\right)}$$

(4) 垂線 $\\mathrm{OH}$ の長さは，
$$\\mathrm{OH} = \\sqrt{1^2 + \\left(-\\frac{4}{5}\\right)^2 + \\left(\\frac{3}{5}\\right)^2} = \\sqrt{1 + \\frac{16 + 9}{25}} = \\sqrt{1 + 1} = \\sqrt{2}$$
四面体 $\\mathrm{OABC}$ の体積を $V$ とすると，底面を $\\triangle\\mathrm{ABC}$，高さを $\\mathrm{OH}$ として，
$$V = \\frac{1}{3} \\times S \\times \\mathrm{OH} = \\frac{1}{3} \\times \\frac{5\\sqrt{2}}{2} \\times \\sqrt{2} = \\mathbf{\\frac{5}{3}}$$`,
    commentary: ``
  },

  101: {
    id: 101,
    chapter: "確率分布と統計的な推測",
    title: "確率変数の和の期待値",
    target_reidai: 146,
    sources: ["慶應義塾大"],
    question: `大，中，小の 3 個のサイコロを同時に投げ，それぞれのサイコロの出た目を $X, Y, Z$ とする。このとき，$3X + 2Y + Z$ の期待値は $\\fbox{\\quad}$ である。`,
    answer: `サイコロ 1 個の出た目を $W$ とすると，$W$ の期待値 $E(W)$ は，
$$E(W) = 1 \\cdot \\frac{1}{6} + 2 \\cdot \\frac{1}{6} + 3 \\cdot \\frac{1}{6} + 4 \\cdot \\frac{1}{6} + 5 \\cdot \\frac{1}{6} + 6 \\cdot \\frac{1}{6} = \\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = \\frac{21}{6} = \\frac{7}{2}$$
大，中，小のサイコロの出た目 $X, Y, Z$ はそれぞれ独立に対等なサイコロの目であるから，
$$E(X) = E(Y) = E(Z) = \\frac{7}{2}$$
期待値の線形性より，
$$\\begin{aligned}
E(3X + 2Y + Z) &= 3E(X) + 2E(Y) + E(Z) \\\\
&= 3 \\cdot \\frac{7}{2} + 2 \\cdot \\frac{7}{2} + \\frac{7}{2} \\\\
&= (3 + 2 + 1) \\cdot \\frac{7}{2} \\\\
&= 6 \\cdot \\frac{7}{2} = \\mathbf{21}
\\end{aligned}$$
空欄の答え：$\\mathbf{21}$`,
    commentary: ``
  },

  102: {
    id: 102,
    chapter: "確率分布と統計的な推測",
    title: "二項分布の期待値と標準偏差",
    target_reidai: 147,
    sources: ["鹿児島大"],
    question: `1 個のサイコロを 10 回投げるとき，1 または 2 の目が出る回数 $X$ の期待値 $E(X)$ と標準偏差 $\\sigma(X)$ を求めよ。`,
    answer: `1 回のサイコロ投げにおいて，1 または 2 の目が出る確率は，
$$p = \\frac{2}{6} = \\frac{1}{3}$$
である。この試行を 10 回繰り返すとき，1 または 2 の目が出る回数 $X$ は二項分布 $B\\left(10, \\dfrac{1}{3}\\right)$ に従う。
二項分布 $B(n, p)$ の期待値 $E(X)$，分散 $V(X)$，標準偏差 $\\sigma(X)$ の公式より，
$$E(X) = np = 10 \\cdot \\frac{1}{3} = \\mathbf{\\frac{10}{3}}$$
$$V(X) = np(1 - p) = 10 \\cdot \\frac{1}{3} \\cdot \\left(1 - \\frac{1}{3}\\right) = 10 \\cdot \\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{20}{9}$$
したがって，
$$\\sigma(X) = \\sqrt{V(X)} = \\sqrt{\\frac{20}{9}} = \\mathbf{\\frac{2\\sqrt{5}}{3}}$$`,
    commentary: ``
  },

  103: {
    id: 103,
    chapter: "確率分布と統計的な推測",
    title: "正規分布の標準化と個数の推定",
    target_reidai: 148,
    sources: ["鹿児島大"],
    question: `ある工場で $1\\,\\mathrm{kg}$ 入りとして表示する製品が生産されている。この製品の重さは，平均 $1\\,\\mathrm{kg}$，標準偏差 $50\\,\\mathrm{g}$ の正規分布に従っているという。この工場から 1000 個の製品を仕入れた。このなかに $902\\,\\mathrm{g}$ 以下の製品は何個あると推測されるか。
正規分布表は 195 ページのものを用いよ。`,
    answer: `製品の重さを $X\\,\\mathrm{g}$ とする。$1\\,\\mathrm{kg} = 1000\\,\\mathrm{g}$ であるから，$X$ は正規分布 $N(1000, 50^2)$ に従う。
ここで，
$$Z = \\frac{X - 1000}{50}$$
とおくと，$Z$ は標準正規分布 $N(0, 1)$ に従う。
$X = 902$ のとき，
$$Z = \\frac{902 - 1000}{50} = \\frac{-98}{50} = -1.96$$
ある 1 個の製品を取り出したとき，その製品の重さが $902\\,\\mathrm{g}$ 以下である確率 $P(X \\leqq 902)$ は，
$$\\begin{aligned}
P(X \\leqq 902) &= P(Z \\leqq -1.96) \\\\
&= P(Z \\geqq 1.96) \\\\
&= 0.5 - P(0 \\leqq Z \\leqq 1.96)
\\end{aligned}$$
正規分布表より，$P(0 \\leqq Z \\leqq 1.96) = 0.475$ であるから，
$$P(X \\leqq 902) = 0.5 - 0.475 = 0.025$$
したがって，1000 個の製品のなかに含まれる $902\\,\\mathrm{g}$ 以下の製品の個数は，
$$1000 \\times 0.025 = \\mathbf{25} \\ \\text{(個)}$$
と推測される。`,
    commentary: ``
  },

  104: {
    id: 104,
    chapter: "確率分布と統計的な推測",
    title: "二項分布の正規近似",
    target_reidai: 149,
    sources: ["滋賀大"],
    question: `箱のなかにボールが 10 個入っており，そのうち当たりのボールは 1 個だけである。箱のなかから無作為にボールを 1 個取り出し，当たりかどうかを確認して箱に戻すという試行を $n$ 回繰り返し，当たりが出た回数を $X$ とする。
1 回の試行で当たる確率を $p$ とすると，$X$ が近似的に正規分布 $N(np, np(1-p))$ に従うことを利用して，$n = 100$ のときの $P(X \\geqq 10)$ を求めよ。正規分布表は 195 ページのものを用いよ。`,
    answer: `1 回の試行において当たる確率は $p = \\dfrac{1}{10}$ である。この試行を 100 回繰り返したとき，当たりが出た回数 $X$ は二項分布 $B\\left(100, \\dfrac{1}{10}\\right)$ に従う。
$X$ の平均 $E(X)$，標準偏差 $\\sigma(X)$ は，
$$E(X) = 100 \\cdot \\frac{1}{10} = 10$$
$$\\sigma(X) = \\sqrt{100 \\cdot \\frac{1}{10} \\cdot \\left(1 - \\frac{1}{10}\\right)} = \\sqrt{100 \\cdot \\frac{1}{10} \\cdot \\frac{9}{10}} = \\sqrt{9} = 3$$
標本の大きさ $n = 100$ は十分に大きいので，$X$ は近似的に正規分布 $N(10, 3^2)$ に従う。
ここで，
$$Z = \\frac{X - 10}{3}$$
とおくと，$Z$ は標準正規分布 $N(0, 1)$ に従う。
$X = 10$ のとき，
$$Z = \\frac{10 - 10}{3} = 0$$
したがって，求める確率 $P(X \\geqq 10)$ は，
$$P(X \\geqq 10) = P(Z \\geqq 0) = \\mathbf{0.5}$$`,
    commentary: ``
  },

  105: {
    id: 105,
    chapter: "確率分布と統計的な推測",
    title: "標本平均の分布と確率",
    target_reidai: 150,
    sources: ["岩手大"],
    question: `ある工場で生産した製品の寿命は，平均 1600 時間，標準偏差 60 時間の正規分布に従うものとする。この工場で生産した製品を無作為に 100 個選んだとき，その 100 個の製品の平均寿命が 1594 時間以上 1606 時間以下となる確率を求めよ。正規分布表は 195 ページのものを用いよ。`,
    answer: `製品の寿命を $X$ 時間とする。
母平均 $m = 1600$，母標準偏差 $\\sigma = 60$ の母集団から，大きさ $n = 100$ の標本を抽出しているので，標本平均 $\\overline{X}$ の平均 $E(\\overline{X})$，標準偏差 $\\sigma(\\overline{X})$ は，
$$E(\\overline{X}) = m = 1600$$
$$\\sigma(\\overline{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{60}{\\sqrt{100}} = \\frac{60}{10} = 6$$
標本の大きさ $n = 100$ は十分に大きいので，$\\overline{X}$ は近似的に正規分布 $N(1600, 6^2)$ に従う。
ここで，
$$Z = \\frac{\\overline{X} - 1600}{6}$$
とおくと，$Z$ は標準正規分布 $N(0, 1)$ に従う。
$\\overline{X} = 1594$ のとき，$Z = \\dfrac{1594 - 1600}{6} = -1$
$\\overline{X} = 1606$ のとき，$Z = \\dfrac{1606 - 1600}{6} = 1$
したがって，求める確率は，
$$\\begin{aligned}
P(1594 \\leqq \\overline{X} \\leqq 1606) &= P(-1 \\leqq Z \\leqq 1) \\\\
&= 2 \\times P(0 \\leqq Z \\leqq 1)
\\end{aligned}$$
正規分布表より，$P(0 \\leqq Z \\leqq 1.00) = 0.3413$ であるから，
$$P(1594 \\leqq \\overline{X} \\leqq 1606) = 2 \\times 0.3413 = \\mathbf{0.6826}$$`,
    commentary: ``
  },

  106: {
    id: 106,
    chapter: "確率分布と統計的な推測",
    title: "標本比率の正規分布と確率",
    target_reidai: 149,
    sources: ["大学入学共通テスト"],
    question: `正規分布表は 195 ページのものを用いよ。
(1) A 地区で収穫されるジャガイモには 1 個の重さが $200\\,\\mathrm{g}$ を超えるものが $25\\,\\%$ 含まれることが経験的に分かっている。A 地区で収穫されたジャガイモから 400 個を無作為に抽出し，重さを計測した。そのうち，重さが $200\\,\\mathrm{g}$ を超えるジャガイモの個数を表す確率変数を $X$ とする。このとき $X$ は二項分布 $B(400, 0.\\fbox{アイ})$ に従うから，$X$ の平均（期待値）は $\\fbox{ウエオ}$ である。

(2) $X$ を (1) の確率変数とし，A 地区で収穫されたジャガイモ 400 個からなる標本において，重さが $200\\,\\mathrm{g}$ を超えていたジャガイモの標本における比率を $R = \\dfrac{X}{400}$ とする。
このとき，$R$ の標準偏差は $\\sigma(R) = \\fbox{カ}$ である。
【$\\fbox{カ}$ の解答群】
⓪ $\\dfrac{3}{6400}$　① $\\dfrac{\\sqrt{3}}{4}$　② $\\dfrac{\\sqrt{3}}{80}$　③ $\\dfrac{3}{40}$

標本の大きさ 400 は十分に大きいので，$R$ は近似的に正規分布 $N(0.\\fbox{アイ}, (\\fbox{カ})^2)$ に従う。したがって，$P(R \\geqq x) = 0.0465$ となるような $x$ の値は $\\fbox{キ}$ となる。ただし，$\\fbox{キ}$ の計算においては $\\sqrt{3} = 1.73$ とする。
【$\\fbox{キ}$ の解答群】
⓪ $0.209$　① $0.251$　② $0.286$　③ $0.395$`,
    answer: `(1) 条件より，重さが $200\\,\\mathrm{g}$ を超えるジャガイモが取り出される確率を $p$ とすると，
$$p = 0.25 = \\frac{1}{4}$$
である。
400 個のジャガイモを取り出したとき，重さが $200\\,\\mathrm{g}$ を超えるジャガイモの個数を $X$ とすると，$X$ は二項分布 $B(400, 0.25)$ に従う。
よって，$\\fbox{アイ} = \\mathbf{25}$ である。
また，$X$ の平均 $E(X)$ は，
$$E(X) = 400 \\cdot \\frac{1}{4} = 100$$
よって，$\\fbox{ウエオ} = \\mathbf{100}$ である。

標準偏差 $\\sigma(X)$ も求めておくと，
$$V(X) = 400 \\cdot \\frac{1}{4} \\cdot \\left(1 - \\frac{1}{4}\\right) = 75$$
より，
$$\\sigma(X) = \\sqrt{V(X)} = 5\\sqrt{3}$$
となる。

(2) $R = \\dfrac{X}{400}$ と定めると，$R$ の平均 $E(R)$，標準偏差 $\\sigma(R)$ は，
$$E(R) = \\frac{1}{400}E(X) = \\frac{1}{400} \\cdot 100 = 0.25$$
$$\\sigma(R) = \\frac{1}{400}\\sigma(X) = \\frac{1}{400} \\cdot 5\\sqrt{3} = \\frac{\\sqrt{3}}{80}$$
である。したがって，$\\fbox{カ}$ の正解は **②**。

標本の大きさ 400 は十分に大きいので，$R$ は近似的に正規分布 $N\\left(0.25, \\left(\\dfrac{\\sqrt{3}}{80}\\right)^2\\right)$ に従う。
ここで，
$$Z = \\frac{R - 0.25}{\\dfrac{\\sqrt{3}}{80}} = \\frac{80R - 20}{\\sqrt{3}}$$
と定めると，$Z$ は標準正規分布 $N(0, 1)$ に従う。
$P(R \\geqq x) = 0.0465$ となるとき，
$$0.5 - P(0 \\leqq R \\leqq x) = 0.0465 \\implies P(0 \\leqq R \\leqq x) = 0.4535 \\quad \\cdots\\text{①}$$
①を満たす $x$ について，$R = x$ のときの $Z$ を $z_0$ とすると，
$$z_0 = \\frac{80x - 20}{\\sqrt{3}} \\quad \\cdots\\text{②}$$
であり，①より
$$P(0 \\leqq Z \\leqq z_0) = 0.4535 \\quad \\cdots\\text{③}$$
となる。正規分布表より，③を満たす $z_0$ は
$$z_0 = 1.68$$
と分かる。よって，①を満たす $x$ の値は，②で $z_0 = 1.68$ として，
$$1.68 = \\frac{80x - 20}{\\sqrt{3}}$$
$$80x - 20 = 1.68 \\times \\sqrt{3} = 1.68 \\times 1.73 = 2.9064$$
$$80x = 22.9064 \\implies x = 0.28633$$
したがって，$\\fbox{キ}$ の正解は **②** ($0.286$)。`,
    commentary: ``
  },

  107: {
    id: 107,
    chapter: "確率分布と統計的な推測",
    title: "母平均の推定（信頼区間）",
    target_reidai: 151,
    sources: ["岩手大"],
    question: `全国規模で，100 点満点の英語の試験が実施された。このうち，無作為に抽出した 100 人の成績を集計したところ，得点は，平均点が 63 点で標準偏差が 10 点の正規分布であった。このことから，この英語の試験の平均点に対する信頼度 $95\\,\\%$ の信頼区間を求めよ。195 ページの正規分布表を用いてよい。`,
    answer: `母平均を $m$，母標準偏差を $\\sigma$ とする。
標本の大きさ $n = 100$ は十分に大きいので，標本の標準偏差 10 点を母標準偏差 $\\sigma$ とみなしてよい。
標本平均 $\\overline{X} = 63$，$\\sigma = 10$，$n = 100$ である。
信頼度 $95\\,\\%$ の母平均 $m$ に対する信頼区間は，
$$\\left[\\overline{X} - 1.96 \\cdot \\frac{\\sigma}{\\sqrt{n}}, \\quad \\overline{X} + 1.96 \\cdot \\frac{\\sigma}{\\sqrt{n}}\\right]$$
で与えられる。
ここで，
$$1.96 \\cdot \\frac{\\sigma}{\\sqrt{n}} = 1.96 \\times \\frac{10}{\\sqrt{100}} = 1.96 \\times \\frac{10}{10} = 1.96$$
であるから，
$$\\overline{X} - 1.96 \\cdot \\frac{\\sigma}{\\sqrt{n}} = 63 - 1.96 = 61.04$$
$$\\overline{X} + 1.96 \\cdot \\frac{\\sigma}{\\sqrt{n}} = 63 + 1.96 = 64.96$$
したがって，求める信頼区間は，
$$\\mathbf{[61.04, \\ 64.96]}$$`,
    commentary: ``
  },

  108: {
    id: 108,
    chapter: "確率分布と統計的な推測",
    title: "母比率の仮説検定",
    target_reidai: 152,
    sources: ["山形大"],
    question: `確率 $\\dfrac{1}{10}$ で当たりが出るように作られたゲーム機がある。このゲーム機でゲームを 100 回行ったとき当たりが 17 回出た。このゲーム機は正常に作動しているかを有意水準 $5\\,\\%$ で検定せよ。195 ページの正規分布表を用いてよい。`,
    answer: `1 回のゲームにおいて，当たりが出る確率を $p$ とする。
仮説 $H_0 : p = \\dfrac{1}{10}$（正常に作動している）
を立てる。
$p = \\dfrac{1}{10}$ として，ゲームを 100 回行ったとき，当たりが出る回数を $X$ とすると，$X$ は二項分布 $B\\left(100, \\dfrac{1}{10}\\right)$ に従う。
$X$ の平均 $m$，標準偏差 $\\sigma$ は，
$$m = 100 \\cdot \\frac{1}{10} = 10$$
$$\\sigma = \\sqrt{100 \\cdot \\frac{1}{10} \\cdot \\left(1 - \\frac{1}{10}\\right)} = \\sqrt{9} = 3$$
標本の大きさ 100 は十分に大きいので，$X$ は近似的に正規分布 $N(10, 3^2)$ に従う。
ここで，
$$P(m - 1.96\\sigma \\leqq X \\leqq m + 1.96\\sigma) = 0.95$$
であり，
$$m + 1.96\\sigma = 10 + 1.96 \\times 3 = 10 + 5.88 = 15.88$$
$$m - 1.96\\sigma = 10 - 1.96 \\times 3 = 10 - 5.88 = 4.12$$
と計算されるので，有意水準 $5\\,\\%$ における棄却域は，
$$X < 4.12, \\quad 15.88 < X$$
である。
観測された $X$ の値 17 は $17 > 15.88$ であり，この棄却域に入っている。
したがって，仮説 $H_0$ は棄却されるので，**このゲーム機が正常に作動しているとはいえない**。`,
    commentary: ``
  },

  109: {
    id: 109,
    chapter: "数学と人間の活動",
    title: "最大公約数と最小公倍数の関係",
    target_reidai: 154,
    sources: ["法政大"],
    question: `最大公約数と最小公倍数の和が 51 であるような 2 つの自然数 $x, y \\ (x < y)$ は何組あるか。また，このなかで最大の $x$ の値を求めよ。`,
    answer: `$x, y$ の最大公約数を $g$ とすると，
$$x = gA, \\quad y = gB \\quad \\cdots\\text{①}$$
とおける。ただし，$A, B$ は互いに素な自然数で，$A < B$ である。
このとき，$x, y$ の最小公倍数は $gAB$ であり，条件から，
$$g + gAB = 51 \\implies g(1 + AB) = 51 = 3 \\cdot 17 \\quad \\cdots\\text{②}$$
$A, B$ は自然数であるから $1 + AB \\geqq 2$ である。
よって，②より $(g, 1 + AB)$ の組み合わせは，
$$(g, 1 + AB) = (1, 51), \\ (3, 17), \\ (17, 3)$$
である。$A, B \\ (A < B)$ が互いに素な自然数であることに注意して，これらを満たす $A, B$ の値を求める。

- $(g, 1 + AB) = (1, 51)$ のとき
  $AB = 50$ となるので，
  $$(A, B) = (1, 50), \\ (2, 25)$$
  このとき，①より
  $$(x, y) = (1, 50), \\ (2, 25)$$

- $(g, 1 + AB) = (3, 17)$ のとき
  $AB = 16$ となるので，$A < B$ かつ互いに素より
  $$(A, B) = (1, 16)$$
  このとき，①より
  $$(x, y) = (3, 48)$$

- $(g, 1 + AB) = (17, 3)$ のとき
  $AB = 2$ となるので，
  $$(A, B) = (1, 2)$$
  このとき，①より
  $$(x, y) = (17, 34)$$

以上より，
$(x, y)$ の組は **4組**，このなかで最大の $x$ は **17**。`,
    commentary: ``
  },

  110: {
    id: 110,
    chapter: "数学と人間の活動",
    title: "ユークリッドの互除法と既約分数",
    target_reidai: 156,
    sources: ["玉川大"],
    question: `$\\dfrac{899}{1073}$ を既約分数で表すと $\\fbox{\\quad}$ である。`,
    answer: `$\\dfrac{899}{1073}$ を既約分数にするためには，1073 と 899 の最大公約数で約分する必要がある。
ユークリッドの互除法を用いて，1073 と 899 の最大公約数を求める。
$$\\begin{aligned}
1073 &\\div 899 = 1 \\quad \\cdots \\text{余り } 174 \\\\
899 &\\div 174 = 5 \\quad \\cdots \\text{余り } 29 \\\\
174 &\\div 29 = 6 \\quad \\cdots \\text{余り } 0
\\end{aligned}$$
$a$ と $b$ の最大公約数を $\\gcd(a, b)$ と表すと，この計算から，
$$\\gcd(1073, 899) = \\gcd(899, 174) = \\gcd(174, 29) = 29$$
これより，1073 と 899 の最大公約数は 29 であり，これに注意して約分すると，
$$\\frac{899}{1073} = \\frac{29 \\times 31}{29 \\times 37} = \\mathbf{\\frac{31}{37}}$$
空欄の答え：$\\mathbf{\\dfrac{31}{37}}$`,
    commentary: ``
  },

  111: {
    id: 111,
    chapter: "数学と人間の活動",
    title: "積の形をつくる不定方程式",
    target_reidai: 155,
    sources: ["大分大"],
    question: `$6(x - y) = xy$ を満たす自然数の組 $(x, y)$ をすべて求めよ。`,
    answer: `$6(x - y) = xy$ より，
$$xy - 6x + 6y = 0$$
$$(x + 6)(y - 6) + 36 = 0$$
$$(x + 6)(y - 6) = -36 \\quad \\cdots\\text{①}$$
$x, y$ が自然数であるから，
$$x + 6 \\geqq 7, \\quad y - 6 \\geqq -5$$
である。これに注意すると，①を満たす積の組み合わせは，
$$(x + 6, \\ y - 6) = (36, -1), \\ (18, -2), \\ (12, -3), \\ (9, -4)$$
したがって，各項から 6 を引く（$y$ には 6 を足す）ことにより，
$$\\mathbf{(x, y) = (30, 5), \\ (12, 4), \\ (6, 3), \\ (3, 2)}$$`,
    commentary: ``
  },

  112: {
    id: 112,
    chapter: "数学と人間の活動",
    title: "1次不定方程式の解の個数",
    target_reidai: 156,
    sources: ["関西大"],
    question: `$3x + 5y = 7$ を満たす整数 $x, y$ で，$100 \\leqq x + y \\leqq 200$ となる $(x, y)$ の個数は $\\fbox{\\quad}$ 個である。`,
    answer: `$$3x + 5y = 7 \\quad \\cdots\\text{①}$$
$x = 4, y = -1$ は①を満たすので，
$$3 \\cdot 4 + 5 \\cdot (-1) = 7 \\quad \\cdots\\text{②}$$
が成り立つ。① $-$ ② より，
$$3(x - 4) + 5(y + 1) = 0 \\implies 3(x - 4) = -5(y + 1) \\quad \\cdots\\text{③}$$
③の右辺は 5 の倍数なので左辺も 5 の倍数であり，3 と 5 は互いに素であるから，
$$x - 4 = 5k \\quad (k \\text{は整数})$$
$$x = 5k + 4$$
このとき，③より
$$3 \\cdot 5k = -5(y + 1) \\implies y = -3k - 1$$
以上より，①を満たす整数の組 $(x, y)$ は，
$$(x, y) = (5k + 4, \\ -3k - 1) \\quad (k \\text{は整数})$$
である。
これより，$100 \\leqq x + y \\leqq 200$ であるとき，
$$100 \\leqq (5k + 4) + (-3k - 1) \\leqq 200$$
$$100 \\leqq 2k + 3 \\leqq 200$$
$$97 \\leqq 2k \\leqq 197$$
$$\\frac{97}{2} \\leqq k \\leqq \\frac{197}{2} \\implies 48.5 \\leqq k \\leqq 98.5$$
これを満たす整数 $k$ は，
$$k = 49, 50, \\cdots, 98$$
の $98 - 49 + 1 = 50$ 個である。
1 つの $k$ から得られる $(x, y)$ は 1 組であるから，$100 \\leqq x + y \\leqq 200$ を満たす $(x, y)$ の個数は，
$$\\mathbf{50} \\ \\text{(個)}$$
空欄の答え：$\\mathbf{50}$`,
    commentary: ``
  },

  113: {
    id: 113,
    chapter: "数学と人間の活動",
    title: "互除法による1次不定方程式の特殊解",
    target_reidai: 156,
    sources: ["上智大"],
    question: `$73x + 61y = 1$ を満たす整数 $x, y$ の組のうち，$x$ が正で最も小さいものは $x = \\fbox{\\quad}$，$y = \\fbox{\\quad}$ である。`,
    answer: `$$73x + 61y = 1 \\quad \\cdots\\text{①}$$
①を満たす整数の組 $(x, y)$ の 1 つを求めるため，73 と 61 にユークリッドの互除法を行う。
$$\\begin{cases}
73 \\div 61 = 1 \\quad \\cdots \\text{余り } 12 \\implies 12 = 73 - 61 \\\\
61 \\div 12 = 5 \\quad \\cdots \\text{余り } 1 \\implies 1 = 61 - 12 \\cdot 5
\\end{cases}$$
これらを順に代入して用いると，
$$\\begin{aligned}
1 &= 61 - 12 \\cdot 5 \\\\
&= 61 - (73 - 61) \\cdot 5 \\\\
&= 61 - 73 \\cdot 5 + 61 \\cdot 5 \\\\
&= 73 \\cdot (-5) + 61 \\cdot 6
\\end{aligned}$$
これより，
$$73 \\cdot (-5) + 61 \\cdot 6 = 1 \\quad \\cdots\\text{②}$$
が成り立つことが分かり，① $-$ ② より，
$$73(x + 5) + 61(y - 6) = 0$$
$$73(x + 5) = 61(-y + 6) \\quad \\cdots\\text{③}$$
③の右辺は 61 の倍数なので左辺も 61 の倍数であり，73 と 61 は互いに素であるから，
$$x + 5 = 61k \\quad (k \\text{は整数})$$
$$x = 61k - 5$$
このとき，③より
$$73 \\cdot 61k = 61(-y + 6) \\implies -y + 6 = 73k \\implies y = -73k + 6$$
以上より，①を満たす整数の組 $(x, y)$ は，
$$(x, y) = (61k - 5, \\ -73k + 6) \\quad (k \\text{は整数})$$
である。
$x > 0$ となるのは，$k = 1, 2, 3, \\cdots$ の場合であるから，$x$ が正で最も小さいものは，$k = 1$ として，
$$\\mathbf{x = 56, \\quad y = -67}$$`,
    commentary: ``
  },

  114: {
    id: 114,
    chapter: "数学と人間の活動",
    title: "余りによる整数の分類と倍数の証明",
    target_reidai: 153,
    sources: ["学習院大"],
    question: `どのような整数 $n$ に対しても，$n^2 + n + 1$ は 5 で割り切れないことを示せ。`,
    answer: `すべての整数 $n$ は，整数 $k$ を用いて，
$$5k, \\ 5k+1, \\ 5k+2, \\ 5k+3, \\ 5k+4$$
のいずれかの形で表せる。

(ア) $n = 5k$ のとき
$$n^2 + n + 1 = (5k)^2 + 5k + 1 = 5(5k^2 + k) + 1$$

(イ) $n = 5k+1$ のとき
$$n^2 + n + 1 = (5k+1)^2 + (5k+1) + 1 = 25k^2 + 10k + 1 + 5k + 2 = 5(5k^2 + 3k) + 3$$

(ウ) $n = 5k+2$ のとき
$$n^2 + n + 1 = (5k+2)^2 + (5k+2) + 1 = 25k^2 + 20k + 4 + 5k + 3 = 5(5k^2 + 5k + 1) + 2$$

(エ) $n = 5k+3$ のとき
$$n^2 + n + 1 = (5k+3)^2 + (5k+3) + 1 = 25k^2 + 30k + 9 + 5k + 4 = 5(5k^2 + 7k + 2) + 3$$

(オ) $n = 5k+4$ のとき
$$n^2 + n + 1 = (5k+4)^2 + (5k+4) + 1 = 25k^2 + 40k + 16 + 5k + 5 = 5(5k^2 + 9k + 4) + 1$$

以上より，どのような整数 $n$ に対しても，$n^2 + n + 1$ を 5 で割った余りは 1，2，3 のいずれかであり，0 になることはない。
したがって，どのような整数 $n$ に対しても，$n^2 + n + 1$ は 5 で割り切れない。`,
    commentary: ``
  },

  115: {
    id: 115,
    chapter: "数学と人間の活動",
    title: "n進法の表記と整数決定",
    target_reidai: 158,
    sources: ["公立千歳科学技術大"],
    question: `正の整数 $N$ を 5 進法で表すと 3 桁の数 $abc_{(5)}$ となり，7 進法で表すと 3 桁の数 $cba_{(7)}$ となる。このような整数 $N$ をすべて求めて 10 進法で答えよ。`,
    answer: `$N = abc_{(5)}$ より，
$$1 \\leqq a \\leqq 4, \\quad 0 \\leqq b \\leqq 4, \\quad 0 \\leqq c \\leqq 4 \\quad \\cdots\\text{①}$$
であり，10進法で表すと，
$$N = a \\cdot 5^2 + b \\cdot 5 + c = 25a + 5b + c \\quad \\cdots\\text{②}$$
一方，$N = cba_{(7)}$ より，
$$0 \\leqq a \\leqq 6, \\quad 0 \\leqq b \\leqq 6, \\quad 1 \\leqq c \\leqq 6 \\quad \\cdots\\text{③}$$
であり，10進法で表すと，
$$N = c \\cdot 7^2 + b \\cdot 7 + a = 49c + 7b + a \\quad \\cdots\\text{④}$$
①かつ③より，$a, b, c$ は，
$$1 \\leqq a \\leqq 4, \\quad 0 \\leqq b \\leqq 4, \\quad 1 \\leqq c \\leqq 4$$
を満たす整数でなければならない。

②，④より，
$$25a + 5b + c = 49c + 7b + a$$
$$24a - 2b - 48c = 0$$
$$b = 12(a - 2c) \\quad \\cdots\\text{⑤}$$
$0 \\leqq b \\leqq 4$ より，⑤を満たす $b$ は，12 の倍数であることから $b = 0$ に限られる。
このとき，⑤は
$$0 = 12(a - 2c) \\implies a = 2c \\quad \\cdots\\text{⑥}$$
となる。
⑥を満たす整数 $a, c$ の組は，$1 \\leqq a \\leqq 4$，$1 \\leqq c \\leqq 4$ であることに注意すると，
$$(a, c) = (2, 1), \\ (4, 2)$$
したがって，条件を満たす $a, b, c$ の組は，
- (ア) $a = 2, b = 0, c = 1$
- (イ) $a = 4, b = 0, c = 2$
の 2 組である。

(ア)の場合，②から $N$ を求めると，
$$N = 25 \\cdot 2 + 0 + 1 = 51$$
(イ)の場合，②から $N$ を求めると，
$$N = 25 \\cdot 4 + 0 + 2 = 102$$

以上より，求める $N$ の値は，
$$\\mathbf{N = 51, \\ 102}$$`,
    commentary: ``
  }
};
