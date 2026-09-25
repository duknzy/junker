/**
 * Flora 共通テスト歴史整序特訓（年代順並べ替え）エキスパートエンジン
 * - 時代近接バトル / テーマ別特訓 / 共通テストマーク式6択対応
 * - 因果関係ステップ解説 / ビジュアル時系列軸 / 弱点記録
 */

// 🏛️ 高校歴史・共通テスト 日本史 頻出重要出来事ライブラリ（年代・時代・テーマ・因果関係・ツボ完備）
export const JAPAN_EVENT_DATABASE = [
    // 弥生・古墳・飛鳥
    {
        name: "漢委奴国王の金印授与（後漢書東夷伝）",
        year: "57年",
        year_sort: 57,
        era: "弥生・古墳",
        theme: "外交・対外関係",
        leader: "光武帝 / 奴国王",
        note: "博多湾岸の奴国の王が後漢の光武帝に朝貢し、金印（漢委奴国王）と綬を授かる。",
        cause_effect: "倭の小国分立の中で、中国皇帝の後ろ盾を得て権威づけを図る目的で朝貢した。",
        exam_point: "57年の光武帝の金印授与 ➔ 107年の帥升の生口160人献上 ➔ 239年の卑弥呼の親魏倭王授与の順序は共通テスト超頻出！",
        mnemonics: "57年: こんな(57)立派な金印もらう"
    },
    {
        name: "卑弥呼が魏に朝貢し「親魏倭王」の称号と金印を授かる",
        year: "239年",
        year_sort: 239,
        era: "弥生・古墳",
        theme: "外交・対外関係",
        leader: "卑弥呼 / 魏の明帝",
        note: "邪馬台国の女王卑弥呼が魏の明帝に難升米らを派遣し、銅鏡100枚等を授かる。",
        cause_effect: "狗奴国との争いに備え、中国の大国魏の権威と軍事・外交支援を求めた。",
        exam_point: "後漢滅亡（三国時代）の最中、邪馬台国が接触したのは「魏」である点が正誤問題で狙われる。",
        mnemonics: "239年: 卑弥呼に文(23)句(9)なし金印銅鏡"
    },
    {
        name: "大化の改新（乙巳の変・改新の詔）",
        year: "645年",
        year_sort: 645,
        era: "飛鳥",
        theme: "政治・政変",
        leader: "中大兄皇子 / 中臣鎌足",
        note: "蘇我入鹿・蝦夷を討滅し、公地公民制・国郡制・班田収授・租庸調など国家中央集権化に着手。",
        cause_effect: "唐の東アジア進出に対抗するため、豪族連合から天皇中心の中央集権国家への転換を急いだ。",
        exam_point: "聖徳太子の冠位十二階・十七条憲法（603/604） ➔ 乙巳の変（645） ➔ 白村江の戦い（663）の流れ。",
        mnemonics: "645年: 虫(64)ご(5)ろし乙巳の変で大化改新"
    },
    {
        name: "白村江の戦いでの大敗と防衛網整備",
        year: "663年",
        year_sort: 663,
        era: "飛鳥",
        theme: "外交・対外関係",
        leader: "中大兄皇子（天智天皇）",
        note: "百済復興を支援して出兵するも、唐・新羅連合軍に白村江で大敗。水城や大野城、防人を配備。",
        cause_effect: "大敗によって唐の侵攻を警戒し、防衛のために近江大津宮への遷都や防衛拠点の建設を進めた。",
        exam_point: "白村江の戦い（663）の敗北が契機となって、九州の水城や防人の配置（『万葉集』）が行われた。",
        mnemonics: "663年: ろくろ(66)うさ(3)せる白村江"
    },
    {
        name: "壬申の乱（大海人皇子が近江朝廷を破る）",
        year: "672年",
        year_sort: 672,
        era: "飛鳥",
        theme: "政治・政変",
        leader: "大海人皇子（天武天皇） / 大友皇子",
        note: "天智天皇の後継を巡る最大の内乱。大海人皇子が東国豪族を率いて大友皇子を自害させ天武天皇として即位。",
        cause_effect: "勝利した天武天皇は豪族を排除し、皇親政治を敷き強力な天皇専制国家を推進した。",
        exam_point: "乙巳の変（645） ➔ 白村江（663） ➔ 壬申の乱（672） ➔ 大宝律令（701）は飛鳥時代の鉄板配列！",
        mnemonics: "672年: ろくな(67)に(2)んじん壬申の乱"
    },
    {
        name: "大宝律令の完成と施行",
        year: "701年",
        year_sort: 701,
        era: "飛鳥",
        theme: "政治・制度",
        leader: "刑部親王 / 藤原不比等",
        note: "二官八省・神祇官・太政官などの官制と国郡里制、律（刑法）と令（行政法）が完備された。",
        cause_effect: "半世紀にわたる律令国家建設の総決算であり、これによって日本初の法治国家体制が整った。",
        exam_point: "大宝律令（701） ➔ 平城京遷都（710） ➔ 養老律令（718）の順序に注意。",
        mnemonics: "701年: な(7)お(0)い(1)い律令大宝律令"
    },

    // 奈良時代
    {
        name: "平城京遷都（奈良時代の始まり）",
        year: "710年",
        year_sort: 710,
        era: "奈良",
        theme: "政治・都市",
        leader: "元明天皇 / 藤原不比等",
        note: "藤原京から長安を模した条坊制の都城平城京へ遷都。和同開珎の流通も本格化。",
        cause_effect: "律令体制の威信を内外に示す巨大都市が必要とされた。",
        exam_point: "平城京遷都（710）の直後に三世一身法（723）、墾田永年私財法（743）と土地制度が激変する。",
        mnemonics: "710年: なん(71)と(0)綺麗な平城京"
    },
    {
        name: "墾田永年私財法の制定（公地公民制の動揺）",
        year: "743年",
        year_sort: 743,
        era: "奈良",
        theme: "社会・経済",
        leader: "聖武天皇 / 橘諸兄",
        note: "新たに開墾した土地の永久私有を認め、貴族・寺社による初期荘園形成の引き金となる。",
        cause_effect: "三世一身法（723年）では期限が切れると荒廃したため、永久私有を認めて開墾意欲を刺激した。",
        exam_point: "三世一身法（723） ➔ 墾田永年私財法（743）。私有地の発生が後の寄進地系荘園へと連動。",
        mnemonics: "743年: 墾田な(7)し(4)さ(3)墾田永年私財法"
    },
    {
        name: "東大寺大仏開眼供養会",
        year: "752年",
        year_sort: 752,
        era: "奈良",
        theme: "文化・宗教",
        leader: "聖武太上天皇 / 孝謙天皇 / 菩提僊那",
        note: "天然痘流行や藤原広嗣の乱による社会不安を鎮めるため、鎮護国家思想に基づき盧舎那仏が建立された。",
        cause_effect: "天災・疫病・反乱が相次いだため、仏教の最高権威で国家平穏を祈願した。",
        exam_point: "国分寺建立の詔（741） ➔ 大仏造立の詔（743） ➔ 大仏開眼供養会（752）のプロセスを整理。",
        mnemonics: "752年: な(7)ご(5)に(2)っこり大仏開眼"
    },

    // 平安時代
    {
        name: "平安京遷都（平安時代の始まり）",
        year: "794年",
        year_sort: 794,
        era: "平安",
        theme: "政治・都市",
        leader: "桓武天皇",
        note: "奈良の仏教勢力の影響を断ち切り、長岡京での造営中断（早良親王怨霊問題）を経て山背国へ遷都。",
        cause_effect: "寺院の政治介入を排除し、強力な親政と律令政治の再建を目指した。",
        exam_point: "長岡京遷都（784） ➔ 早良親王配流・怨霊 ➔ 平安京遷都（794） ➔ 坂上田村麻呂の征夷大将軍任官（797）。",
        mnemonics: "794年: 鳴く(79)よ(4)ウグイス平安京"
    },
    {
        name: "薬子の変（平城太上天皇の変）",
        year: "810年",
        year_sort: 810,
        era: "平安",
        theme: "政治・政変",
        leader: "嵯峨天皇 / 藤原冬嗣",
        note: "平城上皇と嵯峨天皇の二頭政治の対立。嵯峨天皇が蔵人頭（藤原冬嗣ら）を新設して機先を制した。",
        cause_effect: "この政変で藤原北家の藤原冬嗣が抜擢され、後の藤原北家による摂関政治の基礎が築かれた。",
        exam_point: "蔵人頭の新設（810）や検非違使の設置など令外官の発展を押さえる。",
        mnemonics: "810年: ハ(8)ー(1)ト(0)破れる薬子の変"
    },
    {
        name: "遣唐使の停止（菅原道真の建議）",
        year: "894年",
        year_sort: 894,
        era: "平安",
        theme: "外交・文化",
        leader: "宇多天皇 / 菅原道真",
        note: "唐の衰退（黄巣の乱後）と航海の危険を理由に、遣唐使大使に任じられた菅原道真が停止を進言。",
        cause_effect: "中国文化の直接摂取から、日本の風土に根ざした「国風文化（仮名文字、寝殿造、大和絵）」が開花。",
        exam_point: "遣唐使停止（894） ➔ 菅原道真左遷・昌泰の変（901） ➔ 延喜の荘園整理令（902）の流れ。",
        mnemonics: "894年: 白紙(894)に戻そう遣唐使"
    },
    {
        name: "承平・天慶の乱（平将門と藤原純友の乱）",
        year: "935年",
        year_sort: 935,
        era: "平安",
        theme: "社会・戦乱",
        leader: "平将門 / 藤原純友",
        note: "関東で平将門が「新皇」を自称し、瀬戸内海で藤原純友が海賊を率いて反乱。武士が武力鎮圧を担当。",
        cause_effect: "朝廷軍事力の無力さが露呈し、反乱を鎮圧した平貞盛・藤原秀郷ら武士階級の地位が急浮上した。",
        exam_point: "10世紀半ばの武士の成長を示す画期的な出来事。",
        mnemonics: "935年: く(9)み(3)こ(5)暴れる将門の乱"
    },
    {
        name: "藤原道長が摂政となり摂関政治が全盛期を迎える",
        year: "1016年",
        year_sort: 1016,
        era: "平安",
        theme: "政治・政変",
        leader: "藤原道長 / 後一条天皇",
        note: "三人の娘を中宮・皇后とし「望月の歌」を詠む。外戚として権力を一身に集めた。",
        cause_effect: "摂関家の権勢が極点に達したが、やがて院政の開始（白河上皇・1086年）へと移行していく。",
        exam_point: "藤原道長（11世紀初頭） ➔ 藤原頼通の平等院鳳凰堂（1053） ➔ 前九年合戦（1051〜） ➔ 院政開始（1086）。",
        mnemonics: "1016年: 遠い(10)む(16)かしの道長全盛"
    },
    {
        name: "白河上皇が院政を開始",
        year: "1086年",
        year_sort: 1086,
        era: "平安",
        theme: "政治・制度",
        leader: "白河上皇 / 堀河天皇",
        note: "幼少の堀河天皇に譲位し、上皇の立場で院庁を開き実権を掌握。北面の武士を設置。",
        cause_effect: "藤原摂関家を排除して天皇家自らが主権を取り戻すとともに、警備のため武士を重用した。",
        exam_point: "院政期の経済基盤＝知行国制と八条院領などの寄進地系荘園。北面の武士が伊勢平氏台頭の母体となる。",
        mnemonics: "1086年: と(10)は(8)ろ(6)く院政始まる"
    },
    {
        name: "保元・平治の乱（武士の中央政界進出）",
        year: "1156年",
        year_sort: 1156,
        era: "平安",
        theme: "政治・戦乱",
        leader: "後白河天皇 / 平清盛 / 源義朝",
        note: "皇位継承と摂関家内紛に武士が動員され、源義朝を破った平清盛が覇権を確立。",
        cause_effect: "貴族社会の抗争が武士の力でしか決着できなくなり、平氏政権樹立への道を開いた。",
        exam_point: "保元の乱（1156） ➔ 平治の乱（1159） ➔ 平清盛の太政大臣就任（1167） ➔ 治承・寿永の乱（1180〜）。",
        mnemonics: "1156年: いい(11)頃(56)保元の乱"
    },

    // 鎌倉時代
    {
        name: "源頼朝が征夷大将軍に任官（鎌倉幕府の確立）",
        year: "1192年",
        year_sort: 1192,
        era: "鎌倉",
        theme: "政治・政変",
        leader: "源頼朝 / 後鳥羽天皇",
        note: "守護・地頭の設置勅許（1185年）を経て、征夷大将軍となり名実ともに武家政権を樹立。",
        cause_effect: "御家人との「御恩と奉公」関係を基盤に、東国を中心とする全国的な武家支配機構が完成。",
        exam_point: "壇ノ浦の戦い・守護地頭設置（1185） ➔ 頼朝将軍任官（1192） ➔ 頼朝急死と北条氏台頭（1199〜）。",
        mnemonics: "1192年: いい(11)国(92)作ろう頼朝将軍"
    },
    {
        name: "承久の乱（後鳥羽上皇の倒幕失敗と六波羅探題設置）",
        year: "1221年",
        year_sort: 1221,
        era: "鎌倉",
        theme: "政治・戦乱",
        leader: "後鳥羽上皇 / 北条政子 / 北条義時",
        note: "後鳥羽上皇が義時追討の院宣を出すも、北条政子の演説で結束した幕府軍が圧勝。上皇らは配流。",
        cause_effect: "朝廷監視と西国支配のため京都に「六波羅探題」を置き、幕府権力が全国西国にまで及んだ。",
        exam_point: "承久の乱（1221）の結果：三上皇配流、新補地頭の設置、六波羅探題の設置。",
        mnemonics: "1221年: 人に(12)不意(21)打ち承久の乱"
    },
    {
        name: "御成敗式目（貞永式目）の制定",
        year: "1232年",
        year_sort: 1232,
        era: "鎌倉",
        theme: "政治・法制",
        leader: "北条泰時（第3代執権）",
        note: "武士社会の慣習法を体系化した日本初の武家法（51条）。御家人相互の紛争を公平に裁く基準。",
        cause_effect: "承久の乱後の西国御家人と荘園領主の紛争を迅速・公平に処理する必要から制定された。",
        exam_point: "公家法や荘園法を全面否定したのではなく、「幕府の裁判所（問注所・引付衆）で適用」された点に留意。",
        mnemonics: "1232年: 人に(12)み(3)に(2)くい裁判なし"
    },
    {
        name: "文永の役・弘安の役（元寇・蒙古襲来）",
        year: "1274年",
        year_sort: 1274,
        era: "鎌倉",
        theme: "外交・戦争",
        leader: "北条時宗 / クビライ（元）",
        note: "元のフビライが2度にわたり博多湾に来襲。暴風雨や防塁・御家人の奮戦により撃退。",
        cause_effect: "防衛戦であったため新規領地（恩賞）が得られず、御家人の困窮と得宗専制の強化を招いた。",
        exam_point: "元寇（1274/1281） ➔ 異国警固番役・防塁構築 ➔ 徳政令（1297年永仁の徳政令）への連動。",
        mnemonics: "1274年: 人に(12)名無し(74)の文永の役"
    },
    {
        name: "永仁の徳政令の発布",
        year: "1297年",
        year_sort: 1297,
        era: "鎌倉",
        theme: "社会・経済",
        leader: "北条貞時（第9代執権）",
        note: "御家人の質入れ・売却した所領の無償返還を命じる。金銭貸借の訴訟不受理。",
        cause_effect: "御家人の一時的救済を狙ったが、かえって借財が難しくなり金融麻痺と社会混乱を拡大させた。",
        exam_point: "元寇後の御家人困窮 ➔ 永仁の徳政令（1297） ➔ 悪党の蜂起 ➔ 鎌倉幕府滅亡（1333）への流れ。",
        mnemonics: "1297年: 皮肉(129)な(7)結果の徳政令"
    },

    // 室町・戦国・安土桃山
    {
        name: "建武の新政と後醍醐天皇の親政",
        year: "1334年",
        year_sort: 1334,
        era: "室町・戦国",
        theme: "政治・政変",
        leader: "後醍醐天皇 / 楠木正成 / 足利尊氏",
        note: "鎌倉幕府滅亡後、天皇親政を復活。記録所や恩賞方などを設置するも武士の不満が爆発。",
        cause_effect: "公家優遇と土地確認の混乱に武士が反発し、足利尊氏が離反して南北朝の内乱へ発展。",
        exam_point: "鎌倉滅亡（1333） ➔ 建武の新政（1334） ➔ 尊氏の建武式目（1336） ➔ 南北朝分裂。",
        mnemonics: "1334年: いざ(13)み(3)よ(4)建武の新政"
    },
    {
        name: "南北朝の合一（室町幕府の全盛期）",
        year: "1392年",
        year_sort: 1392,
        era: "室町・戦国",
        theme: "政治・外交",
        leader: "足利義満（第3代将軍）",
        note: "南朝の後亀山天皇が北朝の後小松天皇に三種の神器を譲る形で約60年の内乱が終結。勘合貿易も開始。",
        cause_effect: "義満は守護大名（土岐・山名・大内）を討伐・統制し、幕府権力を史上最大に高めた。",
        exam_point: "花の御所造営 ➔ 南北朝合一（1392） ➔ 金閣建立（1397） ➔ 勘合貿易開始（1404）。",
        mnemonics: "1392年: いざ(13)国(92)まとまる南北朝"
    },
    {
        name: "応仁の乱の勃発（戦国時代の幕開け）",
        year: "1467年",
        year_sort: 1467,
        era: "室町・戦国",
        theme: "政治・戦乱",
        leader: "足利義政 / 細川勝元 / 山名宗全",
        note: "将軍後継問題（義視 vs 義尚）と畠山・斯波の家督争いに細川・山名が介入。京都が11年間の戦火で灰燼に帰す。",
        cause_effect: "幕府の権威が失墜し、守護大名が没落して下剋上の戦国大名が各地に出現する契機となった。",
        exam_point: "応仁の乱（1467） ➔ 山城国一揆（1485） ➔ 加賀の一向一揆（1488）と民衆・地侍の自力救済へ。",
        mnemonics: "1467年: 人の(14)む(6)な(7)しい応仁の乱"
    },
    {
        name: "種子島への鉄砲伝来",
        year: "1543年",
        year_sort: 1543,
        era: "安土桃山",
        theme: "文化・技術",
        leader: "ポルトガル人商人 / 種子島時尭",
        note: "種子島に漂着したポルトガル商人から火縄銃2挺を購入。堺や根来・国友で国産化が進む。",
        cause_effect: "従来の騎馬・弓矢中心の個人戦から、足軽鉄砲隊による集団戦術へと合戦の様相が一変。",
        exam_point: "鉄砲伝来（1543） ➔ ザビエルキリスト教伝来（1549） ➔ 長篠の戦い（1575）の順。",
        mnemonics: "1543年: 以後(15)よ(4)み(3)がえる合戦戦術"
    },
    {
        name: "織田信長が足利義昭を追放（室町幕府滅亡）",
        year: "1573年",
        year_sort: 1573,
        era: "安土桃山",
        theme: "政治・政変",
        leader: "織田信長 / 足利義昭",
        note: "信長包囲網を敷いた第15代将軍義昭を槙島城から追放。室町幕府が名実ともに滅亡。",
        cause_effect: "信長が畿内を掌握し、楽市楽座や関所撤廃など天下布武に向けた政策を加速させた。",
        exam_point: "桶狭間の戦い（1560） ➔ 義昭奉じて上洛（1568） ➔ 義昭追放（1573） ➔ 長篠の戦い（1575） ➔ 本能寺の変（1582）。",
        mnemonics: "1573年: 以後(15)涙(73)の義昭追放"
    },
    {
        name: "太閤検地と刀狩令（兵農分離の完成）",
        year: "1588年",
        year_sort: 1588,
        era: "安土桃山",
        theme: "社会・制度",
        leader: "豊臣秀吉",
        note: "京枡による石高制と一地一作人の原則を確立し、方広寺大仏建立を口実に百姓から武器を没収。",
        cause_effect: "武士と百姓の身分が明確に分離され、中世の荘園制が完全に解体して近世封建社会の基礎となった。",
        exam_point: "本能寺の変（1582） ➔ 刀狩令（1588） ➔ 小田原攻め・天下統一（1590） ➔ 文禄・慶長の役（1592〜）。",
        mnemonics: "1588年: い(1)ご(5)刃(8)は(8)没収刀狩令"
    },

    // 江戸時代
    {
        name: "関ヶ原の戦い（天下分け目の合戦）",
        year: "1600年",
        year_sort: 1600,
        era: "江戸",
        theme: "政治・戦乱",
        leader: "徳川家康（東軍） / 石田三成（西軍）",
        note: "美濃国関ヶ原で激突。小早川秀秋の寝返り等で東軍が半日で圧勝し、徳川の覇権が決定的に。",
        cause_effect: "西軍大名の改易・減封を行い、家康は1603年に征夷大将軍となって江戸幕府を開府した。",
        exam_point: "関ヶ原の戦い（1600） ➔ 江戸幕府開府（1603） ➔ 大坂の陣・元和偃武（1614/1615）。",
        mnemonics: "1600年: ヒーロー(16)おお(00)いに関ヶ原"
    },
    {
        name: "島原・天草一揆と鎖国の完成（ポルトガル船来航禁止）",
        year: "1637年",
        year_sort: 1637,
        era: "江戸",
        theme: "宗教・外交",
        leader: "天草四郎時貞 / 徳川家光",
        note: "過酷な年貢とキリシタン弾圧に耐えかね農民・浪人が蜂起。鎮圧後、1639年にポルトガル船来航禁止。",
        cause_effect: "幕府は宗門改や寺請制度を強化し、1641年に出島へオランダ商館を移して「鎖国」体制を完成させた。",
        exam_point: "武家諸法度（1615） ➔ 参勤交代義務化（1635） ➔ 島原の乱（1637） ➔ 出島オランダ移転（1641）。",
        mnemonics: "1637年: ヒーロー(16)み(3)な(7)決起す島原一揆"
    },
    {
        name: "享保の改革（上げ米の制・公事方御定書・目安箱）",
        year: "1716年",
        year_sort: 1716,
        era: "江戸",
        theme: "政治・改革",
        leader: "徳川吉宗（第8代将軍）",
        note: "財政再建のため質素倹約、新田開発、上げ米の制、目安箱（小石川養生所）、公事方御定書を制定。",
        cause_effect: "幕府財政は一時的に好転したが、年貢増徴は百姓一揆の増加を招いた。",
        exam_point: "享保の改革（吉宗） ➔ 田沼意次の重商主義 ➔ 寛政の改革（松平定信） ➔ 天保の改革（水野忠邦）の配列は絶対暗記！",
        mnemonics: "1716年: 非難(17)い(1)ろ(6)いろ享保の改革"
    },
    {
        name: "寛政の改革（寛政異学の禁・棄捐令・囲米）",
        year: "1787年",
        year_sort: 1787,
        era: "江戸",
        theme: "政治・改革",
        leader: "松平定信（老中）",
        note: "天明の大飢饉後に就任。朱子学以外の講義を禁じる「寛政異学の禁」、旗本・御家人の借金を免除する「棄捐令」。",
        cause_effect: "厳格すぎる統制政策は「白河の清きに魚も棲みかねて」と狂歌で風刺され、尊号一件で定信は失脚。",
        exam_point: "田沼時代の株仲間公認・印旛沼干拓の反動として農村復興・朱子学正統化に回帰した点。",
        mnemonics: "1787年: 否(17)な(8)な(7)寛政厳しすぎ"
    },
    {
        name: "大塩平八郎の乱（元大坂町奉行所与力の反乱）",
        year: "1837年",
        year_sort: 1837,
        era: "江戸",
        theme: "社会・暴動",
        leader: "大塩平八郎",
        note: "天保の大飢饉での米買い占めに激怒し、陽明学者大塩が民衆救済のため大坂で蜂起。火災が大坂を焼失。",
        cause_effect: "幕府の元役人が天下の台所で反乱を起こした衝撃は全国に波及し、生田万の乱などが続発。",
        exam_point: "大塩の乱（1837） ➔ モリソン号事件（1837） ➔ 蛮社の獄（1839） ➔ 天保の改革（1841〜）。",
        mnemonics: "1837年: いや(18)み(3)な(7)世直し大塩の乱"
    },

    // 幕末・明治・大正・昭和
    {
        name: "ペリー来航（浦賀沖に黒船出現）",
        year: "1853年",
        year_sort: 1853,
        era: "明治・大正",
        theme: "外交・開国",
        leader: "マシュー・ペリー / 阿部正弘",
        note: "アメリカ東インド艦隊司令長官ペリーがフィルモア大統領親書を携え来航。翌1854年に日米和親条約締結。",
        cause_effect: "200年以上の鎖国が破られ、下田・函館の開港により幕末の激動期へ突入。",
        exam_point: "ペリー来航（1853） ➔ 日米和親条約（1854） ➔ ハリス着任（1856） ➔ 日米修好通商条約無勅許調印（1858）。",
        mnemonics: "1853年: いや(18)ご(5)み(3)だらけ黒船来航"
    },
    {
        name: "日米修好通商条約の調印と安政の大獄",
        year: "1858年",
        year_sort: 1858,
        era: "明治・大正",
        theme: "政治・条約",
        leader: "井伊直弼 / タウンゼント・ハリス",
        note: "勅許を得ずに安政の五カ国条約を締結（治外法権・関税自主権喪失の不平等条約）。反対派を安政の大獄で弾圧。",
        cause_effect: "尊王攘夷運動が激化し、1860年に水戸脱藩浪士らによって桜田門外の変で井伊直弼が暗殺された。",
        exam_point: "安政の五カ国条約（1858） ➔ 桜田門外の変（1860） ➔ 坂下門外の変（1862） ➔ 薩長同盟（1866）。",
        mnemonics: "1858年: いや(18)こ(5)わ(8)い条約と大獄"
    },
    {
        name: "薩長同盟の密約締結",
        year: "1866年",
        year_sort: 1866,
        era: "明治・大正",
        theme: "政治・軍事",
        leader: "坂本龍馬 / 西郷隆盛 / 木戸孝允（桂小五郎）",
        note: "敵対していた薩摩藩と長州藩が京都の小松帯刀邸で坂本龍馬らの仲介により軍事同盟を結成。",
        cause_effect: "第二次長州征討で幕府軍が敗北し、倒幕の軍事的中核が固まり大政奉還へ向かう。",
        exam_point: "八・一八の政変（1863） ➔ 蛤御門の変（1864） ➔ 薩長同盟（1866） ➔ 大政奉還（1867）の急展開。",
        mnemonics: "1866年: いや(18)む(6)な(6)しくない薩長同盟"
    },
    {
        name: "大政奉還と王政復古の大号令",
        year: "1867年",
        year_sort: 1867,
        era: "明治・大正",
        theme: "政治・政変",
        leader: "徳川慶喜 / 明治天皇 / 岩倉具視",
        note: "第15代将軍徳川慶喜が政権を朝廷に返上。直後に倒幕派が王政復古の大号令を発し辞官納地を要求。",
        cause_effect: "旧幕府軍の反発から鳥羽・伏見の戦いが勃発し、戊辰戦争へと発展した。",
        exam_point: "大政奉還（1867年10月） ➔ 王政復古の大号令（12月） ➔ 鳥羽伏見の戦い（1868年1月） ➔ 五箇条の御誓文（3月）。",
        mnemonics: "1867年: 人は(18)む(6)な(7)しく幕府返上"
    },
    {
        name: "廃藩置県（中央集権体制の樹立）",
        year: "1871年",
        year_sort: 1871,
        era: "明治・大正",
        theme: "政治・近代化",
        leader: "西郷隆盛 / 大久保利通 / 木戸孝允",
        note: "藩を全廃して県を置き、知藩事を罷免して中央から県令（知事）を派遣。御親兵の武力を背景に断行。",
        cause_effect: "全国の土地・人民が完全に明治政府の直接統治下に置かれ、近代的国家建設の基礎が完成。",
        exam_point: "版籍奉還（1869） ➔ 廃藩置県（1871） ➔ 学制・徴兵令・地租改正（1872〜1873）。",
        mnemonics: "1871年: 言わ(18)な(7)い(1)藩なし廃藩置県"
    },
    {
        name: "西南戦争（最後の士族反乱）",
        year: "1877年",
        year_sort: 1877,
        era: "明治・大正",
        theme: "政治・戦乱",
        leader: "西郷隆盛 / 有栖川宮熾仁親王",
        note: "不平士族が西郷を担いで鹿児島で挙兵。政府の徴兵軍が田原坂などの激戦を経て鎮圧。",
        cause_effect: "武力による反政府運動は不可能となり、言論による「自由民権運動」へと闘争形態が移行した。",
        exam_point: "佐賀の乱（1874） ➔ 神風連の乱・秋月の乱・萩の乱（1876） ➔ 西南戦争（1877） ➔ 国会期成同盟（1880）。",
        mnemonics: "1877年: 人は(18)な(7)な(7)転び西南戦争"
    },
    {
        name: "大日本帝国憲法の発布（欽定憲法）",
        year: "1889年",
        year_sort: 1889,
        era: "明治・大正",
        theme: "政治・法制",
        leader: "伊藤博文 / 明治天皇",
        note: "プロイセン憲法を模範とし、天皇主権・統帥権の独立を定めたアジア初の近代憲法。",
        cause_effect: "翌1890年に第1回帝国議会が開会され、立憲君主制国家としての体裁が整った。",
        exam_point: "明治十四年の政変（1881） ➔ 華族令・内閣制度（1884/1885） ➔ 帝国憲法発布（1889） ➔ 教育勅語（1890）。",
        mnemonics: "1889年: いちは(18)やく(89)発布帝国憲法"
    },
    {
        name: "日清戦争と下関条約の締結",
        year: "1895年",
        year_sort: 1895,
        era: "明治・大正",
        theme: "戦争・条約",
        leader: "伊藤博文 / 陸奥宗光 / 李鴻章",
        note: "朝鮮の支配権を巡り清と交戦し勝利。下関条約で遼東半島・台湾割譲と巨額賠償金を獲得（三国干渉で遼東返還）。",
        cause_effect: "獲得した賠償金を元手に八幡製鉄所建設や金本位制移行が進み、日本の産業革命が急速に進展。",
        exam_point: "条約改正（領事裁判権撤廃・1894） ➔ 日清戦争（1894〜1895） ➔ 三国干渉 ➔ 義和団事件（1900） ➔ 日英同盟（1902）。",
        mnemonics: "1895年: いや(18)く(9)ご(5)く下関条約"
    },
    {
        name: "日露戦争とポーツマス条約",
        year: "1905年",
        year_sort: 1905,
        era: "明治・大正",
        theme: "戦争・条約",
        leader: "小村寿太郎 / ルーズベルト（米大統領）",
        note: "日本海海戦などで勝利するも戦力限界に達しアメリカ仲介で講和。南樺太割譲・南満州鉄道利権を獲得するも無賠償。",
        cause_effect: "賠償金ゼロに不満を抱いた民衆が「日比谷焼打事件」を起こし、戒厳令が敷かれた。",
        exam_point: "日英同盟（1902） ➔ 日露戦争（1904〜1905） ➔ 日比谷焼打事件 ➔ 韓国併合（1910） ➔ 関税自主権回復（1911）。",
        mnemonics: "1905年: 行く(19)お(0)ご(5)りポーツマス講和"
    },
    {
        name: "原敬による本格的政党内閣の成立",
        year: "1918年",
        year_sort: 1918,
        era: "明治・大正",
        theme: "政治・政党",
        leader: "原敬（立憲政友会）",
        note: "米騒動で寺内正毅内閣が退陣後、爵位を持たない衆議院第一党党首の原敬が首相就任（平民宰相）。",
        cause_effect: "政党政治が定着し、いわゆる「憲政の常道」時代（1924〜1932）の幕開けとなった。",
        exam_point: "第一次護憲運動（1912） ➔ 米騒動（1918） ➔ 原敬内閣 ➔ 普通選挙法・治安維持法（1925）。",
        mnemonics: "1918年: 行く(19)い(1)や(8)原敬政党内閣"
    },
    {
        name: "普通選挙法と治安維持法の制定",
        year: "1925年",
        year_sort: 1925,
        era: "昭和・現代",
        theme: "政治・法制",
        leader: "加藤高明（憲政会）",
        note: "満25歳以上の全男子に選挙権を拡大（納税要件撤廃）。同時に社会主義運動を取り締まる治安維持法を抱き合わせで制定。",
        cause_effect: "大衆民主主義が拡大する一方で、思想弾圧の強力な法体制が築かれた。",
        exam_point: "普通選挙法と治安維持法は「同一内閣（加藤高明）・同一の1925年」の制定である点が共通テスト頻出！",
        mnemonics: "1925年: 行く(19)つ(2)ご(5)う普選と治安維持"
    },
    {
        name: "満州事変の勃発（柳条湖事件）",
        year: "1931年",
        year_sort: 1931,
        era: "昭和・現代",
        theme: "戦争・外交",
        leader: "関東軍（石原莞爾ら） / 若槻礼次郎",
        note: "関東軍が南満州鉄道を自作自演で爆破。満州全土を占領し、翌1932年に清朝最後の皇帝溥儀を担いで「満州国」建国。",
        cause_effect: "リットン調査団報告書採択に反発し、日本は1933年に国際連盟を脱退、国際的孤立へ。",
        exam_point: "世界恐慌（1929） ➔ 昭和恐慌（1930） ➔ 満州事変（1931） ➔ 五・一五事件（1932） ➔ 連盟脱退（1933）。",
        mnemonics: "1931年: 行く(19)さ(3)い(1)あく満州事変"
    }
];

// 🌍 高校歴史・共通テスト 世界史 頻出重要出来事ライブラリ
export const WORLD_EVENT_DATABASE = [
    {
        name: "前漢の武帝が即位・塩鉄専売制と儒教官学化",
        year: "前141年",
        year_sort: -141,
        era: "古代",
        theme: "東アジア・中国",
        leader: "武帝 / 董仲舒",
        note: "匈奴を討伐して西域を開拓（張騫派遣）。対外遠征費を賄うため塩・鉄・酒の専売や均輸・平準法を実施。",
        cause_effect: "前漢の最大版図を実現したが、財政難と農民の没落を招き後の王莽による新の成立へとつながる。",
        exam_point: "秦の始皇帝（前221） ➔ 前漢の高祖（前202） ➔ 武帝（前141） ➔ 王莽の新（8年） ➔ 後漢の光武帝（25年）。",
        mnemonics: "前141年: い(14)よ(1)いよ武帝の対外拡大"
    },
    {
        name: "アクティウムの海戦（プトレマイオス朝エジプト滅亡）",
        year: "前31年",
        year_sort: -31,
        era: "古代",
        theme: "地中海・ヨーロッパ",
        leader: "オクタヴィアヌス / アントニウス / クレオパトラ",
        note: "オクタヴィアヌスがアントニウス・クレオパトラ連合軍を破り、ヘレニズム諸国がすべて滅亡して地中海世界が統一。",
        cause_effect: "前27年にアウグストゥスの尊称を得て元首政（プリンキパトゥス）を開始、パクス＝ロマーナの時代へ。",
        exam_point: "カエサル暗殺（前44） ➔ アクティウムの海戦（前31） ➔ アウグストゥス即位（前27）。",
        mnemonics: "前31年: 災(31)い断ち切るオクタヴィアヌス"
    },
    {
        name: "ミラノ勅令（キリスト教の公認）",
        year: "313年",
        year_sort: 313,
        era: "古代",
        theme: "地中海・ヨーロッパ",
        leader: "コンスタンティヌス帝",
        note: "ディオクレティアヌス帝の大迫害を経て、キリスト教を公認して帝国統治の精神的支柱に利用。",
        cause_effect: "教会組織が帝国公認となり、ニケーア公会議（325年）での教義統一、テオドシウス帝による国教化（380年）へ進展。",
        exam_point: "ミラノ勅令（313） ➔ ニケーア公会議（325） ➔ ビザンティウム遷都（330） ➔ キリスト教国教化（380） ➔ 東西分裂（395）。",
        mnemonics: "313年: さい(31)さん(3)迫害されたキリスト教公認"
    },
    {
        name: "ヒジュラ（イスラーム暦元年・聖遷）",
        year: "622年",
        year_sort: 622,
        era: "中世",
        theme: "イスラーム・中東",
        leader: "預言者ムハンマド",
        note: "多神教を奉じるメッカの大商人からの迫害を逃れ、メディナ（ヤスリブ）へ移住して最初の信徒共同体（ウンマ）を建設。",
        cause_effect: "イスラーム共同体が政治・軍事勢力として成長し、630年にメッカを無血征服する原動力となった。",
        exam_point: "ヒジュラ（622） ➔ 正統カリフ時代 ➔ ニハーヴァンドの戦い（642） ➔ ウマイヤ朝成立（661）。",
        mnemonics: "622年: む(6)に(2)むに(2)移るヒジュラ聖遷"
    },
    {
        name: "タラス河畔の戦い（製紙法の西伝）",
        year: "751年",
        year_sort: 751,
        era: "中世",
        theme: "東西交流・中東",
        leader: "アッバース朝（アブー＝ムスリム軍） / 唐（高仙芝）",
        note: "中央アジアの覇権をめぐりアッバース朝軍が唐軍を破る。捕虜となった唐の紙漉き職人からサマルカンド等へ製紙法が伝播。",
        cause_effect: "イスラーム世界に製紙工場が林立し、学問・翻訳運動が飛躍的に発展。やがてヨーロッパへも伝わった。",
        exam_point: "タラス河畔の戦い（751） ➔ 安史の乱（755） ➔ カール大帝戴冠（800）の同時代連動！",
        mnemonics: "751年: な(7)ご(5)い(1)紙の道タラス河畔"
    },
    {
        name: "カノッサの屈辱（教皇権と皇帝権の叙任権闘争）",
        year: "1077年",
        year_sort: 1077,
        era: "中世",
        theme: "中世ヨーロッパ",
        leader: "教皇グレゴリウス7世 / 神聖ローマ皇帝ハインリヒ4世",
        note: "聖職叙任権を巡る対立で破門された皇帝ハインリヒ4世が、カノッサ城の雪の中で教皇に謝罪して破門を解かれた。",
        cause_effect: "教皇権が皇帝権を圧倒する象徴的事件となり、1122年のヴォルムス協約で叙任権闘争は妥協に達した。",
        exam_point: "カノッサの屈辱（1077） ➔ クレルモン公会議・第1回十字軍（1095/1096） ➔ インノケンティウス3世全盛期（13世紀初頭）。",
        mnemonics: "1077年: 人を(10)なな(77)めるカノッサの屈辱"
    },
    {
        name: "第1回十字軍の遠征とイェルサレム王国建国",
        year: "1096年",
        year_sort: 1096,
        era: "中世",
        theme: "中世ヨーロッパ・中東",
        leader: "教皇ウルバヌス2世",
        note: "セルジューク朝の圧迫を受けたビザンツ皇帝の要請でクレルモン公会議が召集され遠征開始。聖地イェルサレムを占領。",
        cause_effect: "遠征の長期化で封建諸侯・騎士が没落し国王権が伸長、地中海東方貿易（レヴァント貿易）で北イタリア諸都市が繁栄。",
        exam_point: "第1回（1096・イェルサレム奪回） ➔ 第3回（1189・サラディンと戦う） ➔ 第4回（1204・コンスタンティノープル占領）。",
        mnemonics: "1096年: と(10)く(9)ろう(6)する十字軍"
    },
    {
        name: "マグナ・カルタ（大憲章）の承認",
        year: "1215年",
        year_sort: 1215,
        era: "中世",
        theme: "イギリス・立憲主義",
        leader: "ジョン王 / イギリス貴族",
        note: "仏王フィリップ2世に敗れ教皇インノケンティウス3世に屈した失地王ジョンに対し、貴族が王権の制限と課税同意権を要求。",
        cause_effect: "「法の支配」やイギリス立憲君主制・議会政治の起源となり、シモン＝ド＝モンフォール議会（1265）へと結実。",
        exam_point: "マグナ・カルタ（1215） ➔ シモン＝ド＝モンフォール議会（1265） ➔ 模範議会（1295） ➔ 百年戦争（1337〜）。",
        mnemonics: "1215年: 人に(12)い(1)こ(5)う大憲章"
    },
    {
        name: "ルターが95か条の論題を発表（宗教改革の始まり）",
        year: "1517年",
        year_sort: 1517,
        era: "近世",
        theme: "宗教改革・ヨーロッパ",
        leader: "マルティン・ルター / レオ10世",
        note: "サン・ピエトロ大聖堂改築資金のための贖宥状（免罪符）販売をヴィッテンベルクの教会門前で批判。「信仰義認説」を提唱。",
        cause_effect: "活版印刷術の普及によりドイツ全土に拡大し、ドイツ農民戦争やアウクスブルクの和議（1555年）へと至る大動乱に。",
        exam_point: "95か条の論題（1517） ➔ ヴォルムス帝国議会（1521） ➔ カルヴァン改革（1536〜） ➔ トリエント公会議（1545〜）。",
        mnemonics: "1517年: 以後(15)人(1)な(7)み宗教改革"
    },
    {
        name: "ウェストファリア条約の締結（主権国家体制の確立）",
        year: "1648年",
        year_sort: 1648,
        era: "近世",
        theme: "国際関係・近世ヨーロッパ",
        leader: "各ヨーロッパ君主",
        note: "最大最後の宗教戦争「三十年戦争」の講和条約。カルヴァン派の公認、スイス・オランダの独立承認、神聖ローマ帝国の事実上解体。",
        cause_effect: "教皇や皇帝の普遍的支配が終わり、国境と対等な主権を持つ国家が並立する「主権国家体制（近代国際秩序）」が誕生。",
        exam_point: "ウェストファリア条約（1648） ➔ イギリスピューリタン革命処刑（1649） ➔ ルイ14世親政（1661〜） ➔ 名誉革命（1688）。",
        mnemonics: "1648年: 人類(16)し(4)あ(8)わせ三十年戦争終結"
    },
    {
        name: "イギリス名誉革命と権利の章典",
        year: "1689年",
        year_sort: 1689,
        era: "近世",
        theme: "イギリス・革命",
        leader: "ウィリアム3世 / メアリ2世 / ジェームズ2世",
        note: "カトリック専制を進めたジェームズ2世を流血なしに追放し、オランダ総督を迎立。「権利の章典」を制定して議会主権を確立。",
        cause_effect: "「王は君臨すれども統治せず」というイギリス立憲君主制・責任内閣制の基礎が築かれた。",
        exam_point: "ピューリタン革命（1642） ➔ 王政復古（1660） ➔ 審査法・人身保護法（1673/1679） ➔ 名誉革命（1688/1689）。",
        mnemonics: "1689年: い(1)ろ(6)は(8)き(9)まった権利の章典"
    },
    {
        name: "アメリカ独立宣言の採択",
        year: "1776年",
        year_sort: 1776,
        era: "近代",
        theme: "アメリカ・市民革命",
        leader: "トマス＝ジェファソン / ワシントン",
        note: "イギリス本国の重商主義課税（印紙法・茶法）に反発しフィラデルフィアで採択。ロックの社会契約説と自然権思想を宣言。",
        cause_effect: "フランス・スペインの支援を得てヨークタウンの戦いで勝利、1783年パリ条約で独立承認を勝ち取った。",
        exam_point: "ボストン茶会事件（1773） ➔ レキシントンの戦い（1775） ➔ 独立宣言（1776） ➔ 合衆国憲法制定（1787） ➔ フランス革命（1789）。",
        mnemonics: "1776年: い(1)な(7)な(7)ろ(6)う自由のアメリカ独立"
    },
    {
        name: "フランス革命勃発（バスティーユ牢獄襲撃）",
        year: "1789年",
        year_sort: 1789,
        era: "近代",
        theme: "フランス・市民革命",
        leader: "ラファイエット / ルイ16世 / ロベスピエール",
        note: "旧体制（アンシャン＝レジーム）の財政破綻から三部会が紛糾し、パリ民衆が蜂起。人権宣言採択、封建的特権の廃止へ。",
        cause_effect: "自由・平等・国民主権の近代市民社会の原理がヨーロッパ全体へ波及し、ナポレオン戦争を経て旧秩序を解体させた。",
        exam_point: "バスティーユ襲撃（1789） ➔ ヴァレンヌ逃亡事件（1791） ➔ 国王処刑（1793） ➔ テルミドール反動（1794） ➔ ナポレオン戴冠（1804）。",
        mnemonics: "1789年: 火(1789)の粉散るフランス革命"
    },
    {
        name: "アヘン戦争と南京条約の締結",
        year: "1840年",
        year_sort: 1840,
        era: "近代",
        theme: "東アジア・帝国主義",
        leader: "林則徐 / ヴィクトリア女王（英） / 道光帝（清）",
        note: "清の阿片厳禁政策に対しイギリスが派兵。敗れた清は南京条約で香港割譲・5港開港・公行廃止を承認させられた。",
        cause_effect: "東アジアの伝統的冊封・朝貢体制が崩壊し、欧米列強による中国の半植民地化と日本への外圧（黒船来航）の契機となった。",
        exam_point: "アヘン戦争（1840〜1842） ➔ 太平天国の乱（1851〜） ➔ アロー戦争（1856〜） ➔ 洋務運動の展開。",
        mnemonics: "1840年: いや(18)よ(4)お(0)アヘン戦争"
    },
    {
        name: "サラエボ事件と第一次世界大戦の勃発",
        year: "1914年",
        year_sort: 1914,
        era: "現代",
        theme: "世界大戦・現代",
        leader: "プリンツィプ / フランツ＝フェルディナント",
        note: "オーストリア皇太子夫妻がセルビア人青年にボスニアの州都サラエボで暗殺される。三国協商と三国同盟の網の目が連鎖発動。",
        cause_effect: "総力戦・新兵器（毒ガス・戦車・飛行機）が投入され、ロシア革命、ドイツ・オーストリア・オスマン帝国の崩壊を招いた。",
        exam_point: "モロッコ事件・バルカン戦争（1911〜1913） ➔ サラエボ事件・開戦（1914） ➔ ロシア革命（1917） ➔ ヴェルサイユ条約（1919）。",
        mnemonics: "1914年: 行く(19)い(1)よ(4)第一次世界大戦"
    },
    {
        name: "世界恐慌（ニューヨーク株式市場の大暴落）",
        year: "1929年",
        year_sort: 1929,
        era: "現代",
        theme: "経済危機・ファシズム",
        leader: "フーヴァー / F.ローズヴェルト / ヒトラー",
        note: "ウォール街の株価大暴落を発端に世界規模の金融恐慌と失業が蔓延。米はニューディール政策、英仏はブロック経済を形成。",
        cause_effect: "持たざる国（ドイツ・イタリア・日本）でファシズム・軍国主義が台頭し、第二次世界大戦への導火線となった。",
        exam_point: "世界恐慌（1929） ➔ ナチス政権獲得（1933） ➔ ニューディール本格化（1933） ➔ 第二次世界大戦勃発（1939）。",
        mnemonics: "1929年: ひ(1)ど(9)く(2)苦(9)しい世界恐慌"
    }
];

// 🎯 特訓出題モード定義（不自然な改行を防ぐすっきりしたタイトル・サブタイトル構造）
export const QUIZ_MODES = [
    {
        id: "era_close",
        name: "⚔️ 時代近接バトル",
        subTitle: "因果関係・前後判定",
        tag: "共テ最重要",
        desc: "前後100〜120年以内の近接した出来事から出題。共通テストで最も差がつく同時代・因果関係の判定力を鍛えます。"
    },
    {
        id: "era_select",
        name: "🏛️ 時代別集中特訓",
        subTitle: "古代・中世・近世・近代",
        tag: "時代攻略",
        desc: "指定した時代に特化して出題。同一時代内の細かな政変や事件の順序を徹底マスター。"
    },
    {
        id: "theme",
        name: "📜 テーマ別特訓",
        subTitle: "外交・政治・文化史",
        tag: "タテの歴史",
        desc: "「外交・対外関係」「政治・政変」「文化・宗教」など時代を縦断したテーマ史の流れを集中的に制覇。"
    },
    {
        id: "mistakes",
        name: "🔥 苦手克服特訓",
        subTitle: "誤答ノート・落とし穴",
        tag: "弱点撃破",
        desc: "過去に間違えた出来事やトラップ注意の重要事項を優先出題。自分の落とし穴をゼロにします。"
    },
    {
        id: "random",
        name: "🌟 全時代ランダム演習",
        subTitle: "古代〜現代の総力戦",
        tag: "実力診断",
        desc: "古代から近現代まで全範囲からランダムにピックアップ。総合的な年代感覚と歴史の巨視的視点をテスト。"
    }
];

// 🎯 6択マークシートの組み合わせ定義
export const KYOTSU_CHOICES = [
    { index: 1, orderIndices: [0, 1, 2], label: "① Ⅰ ➔ Ⅱ ➔ Ⅲ" },
    { index: 2, orderIndices: [0, 2, 1], label: "② Ⅰ ➔ Ⅲ ➔ Ⅱ" },
    { index: 3, orderIndices: [1, 0, 2], label: "③ Ⅱ ➔ Ⅰ ➔ Ⅲ" },
    { index: 4, orderIndices: [1, 2, 0], label: "④ Ⅱ ➔ Ⅲ ➔ Ⅰ" },
    { index: 5, orderIndices: [2, 0, 1], label: "⑤ Ⅲ ➔ Ⅰ ➔ Ⅱ" },
    { index: 6, orderIndices: [2, 1, 0], label: "⑥ Ⅲ ➔ Ⅱ ➔ Ⅰ" }
];

export class TimelineQuizEngine {
    constructor(options = {}) {
        this.containerModal = options.containerModal; // モーダル要素
        this.historyType = options.historyType || "japan"; // "japan" or "world"
        this.customEvents = options.customEvents || []; // 外部（Firebase）から渡されたイベント
        this.onFinish = options.onFinish || null;

        this.currentMode = options.initialMode || "era_close";
        this.currentEraFilter = "ALL";
        this.currentThemeFilter = "ALL";

        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.answered = false;

        this.timerInterval = null;
        this.questionStartTime = 0;
        this._keyHandler = null;

        this.historyResults = []; // 各問の履歴
    }

    // 全出来事データの統合プールを取得
    getAllPool() {
        const base = this.historyType === "japan" ? JAPAN_EVENT_DATABASE : WORLD_EVENT_DATABASE;
        const map = new Map();

        // ベースプリセットを登録
        base.forEach(item => {
            map.set(`${item.name}_${item.year_sort}`, { ...item, source: "preset" });
        });

        // ユーザーの誤答・授業イベントをマージ
        this.customEvents.forEach(item => {
            if (!item || !item.name) return;
            const sortVal = typeof item.year_sort === "number" ? item.year_sort : (typeof item.yearSort === "number" ? item.yearSort : 9999);
            if (sortVal === 9999) return; // 年号不明は除外

            const key = `${item.name}_${sortVal}`;
            if (!map.has(key)) {
                map.set(key, {
                    name: item.name,
                    year: item.year || `${sortVal}年`,
                    year_sort: sortVal,
                    era: item.era || item.category || "総合",
                    theme: item.theme || "総合",
                    note: item.note || "",
                    cause_effect: item.trapNote || "",
                    exam_point: item.trapNote ? `【誤答ノートのツボ】${item.trapNote}` : "",
                    mnemonics: item.mnemonics ? item.mnemonics[0] : "",
                    source: "user",
                    isMistake: !!item.isMistake
                });
            } else {
                const ex = map.get(key);
                if (item.isMistake) ex.isMistake = true;
                if (item.trapNote && !ex.exam_point) ex.exam_point = `【誤答ノートのツボ】${item.trapNote}`;
            }
        });

        return Array.from(map.values()).filter(ev => ev.year_sort !== 9999);
    }

    // モード選択画面をモーダルに描画
    renderModeSelect() {
        const pool = this.getAllPool();
        const eras = Array.from(new Set(pool.map(p => p.era).filter(Boolean)));
        const themes = Array.from(new Set(pool.map(p => p.theme).filter(Boolean)));
        const mistakeCount = pool.filter(p => p.isMistake).length;

        const body = this.containerModal.querySelector(".quiz-content-area");
        if (!body) return;

        body.innerHTML = `
            <div class="tq-mode-select-wrap">
                <div class="tq-hero-banner">
                    <div class="tq-hero-badge">共通テスト・入試特化演習</div>
                    <h2 class="tq-hero-title">${this.historyType === "japan" ? "⛩️ 日本史" : "🌍 世界史"} 年代整序マスター特訓</h2>
                    <p class="tq-hero-desc">
                        本番の共通テストで最大の得点差がつく「年代整序問題（Ⅰ〜Ⅲの配列）」。<br>
                        単なる暗記ではなく、<strong>歴史の因果関係・同時代感覚</strong>を極める本格演習スタジオです。
                    </p>
                </div>

                <div class="tq-section-title">1. 出題モードを選択</div>
                <div class="tq-mode-grid">
                    ${QUIZ_MODES.map(m => `
                        <div class="tq-mode-card ${this.currentMode === m.id ? 'active' : ''}" data-mode="${m.id}">
                            <div class="tq-mode-card-header">
                                <div class="tq-mode-title-wrap">
                                    <span class="tq-mode-name">${m.name}</span>
                                    ${m.subTitle ? `<span class="tq-mode-sub">${m.subTitle}</span>` : ''}
                                </div>
                                <span class="tq-mode-tag">${m.tag}</span>
                            </div>
                            <div class="tq-mode-desc">${m.desc}</div>
                            ${m.id === 'mistakes' ? `<div class="tq-mistake-count">登録誤答: ${mistakeCount}件</div>` : ''}
                        </div>
                    `).join("")}
                </div>

                <!-- 時代セレクト詳細 -->
                <div class="tq-subfilter-panel" id="tq-era-panel" style="${this.currentMode === 'era_select' ? '' : 'display:none;'}">
                    <div class="tq-section-title">2. 対象の時代を選択</div>
                    <div class="tq-chip-group">
                        <button type="button" class="tq-chip ${this.currentEraFilter === 'ALL' ? 'active' : ''}" data-era="ALL">✨ 全時代</button>
                        ${eras.map(e => `
                            <button type="button" class="tq-chip ${this.currentEraFilter === e ? 'active' : ''}" data-era="${e}">${e}</button>
                        `).join("")}
                    </div>
                </div>

                <!-- テーマ詳細 -->
                <div class="tq-subfilter-panel" id="tq-theme-panel" style="${this.currentMode === 'theme' ? '' : 'display:none;'}">
                    <div class="tq-section-title">2. 対象のテーマを選択</div>
                    <div class="tq-chip-group">
                        <button type="button" class="tq-chip ${this.currentThemeFilter === 'ALL' ? 'active' : ''}" data-theme="ALL">✨ 全テーマ</button>
                        ${themes.map(t => `
                            <button type="button" class="tq-chip ${this.currentThemeFilter === t ? 'active' : ''}" data-theme="${t}">${t}</button>
                        `).join("")}
                    </div>
                </div>

                <div class="tq-action-bar">
                    <button type="button" class="tq-btn tq-btn-secondary" id="tq-btn-cancel">
                        キャンセル
                    </button>
                    <button type="button" class="tq-btn tq-btn-primary" id="tq-btn-start-drill">
                        🚀 特訓スタート（全5問）
                    </button>
                </div>
            </div>
        `;

        // イベントバインド
        body.querySelectorAll(".tq-mode-card").forEach(card => {
            card.onclick = () => {
                body.querySelectorAll(".tq-mode-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                this.currentMode = card.getAttribute("data-mode");

                const eraPanel = body.querySelector("#tq-era-panel");
                const themePanel = body.querySelector("#tq-theme-panel");
                if (eraPanel) eraPanel.style.display = this.currentMode === "era_select" ? "" : "none";
                if (themePanel) themePanel.style.display = this.currentMode === "theme" ? "" : "none";
            };
        });

        body.querySelectorAll("[data-era]").forEach(chip => {
            chip.onclick = () => {
                body.querySelectorAll("[data-era]").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                this.currentEraFilter = chip.getAttribute("data-era");
            };
        });

        body.querySelectorAll("[data-theme]").forEach(chip => {
            chip.onclick = () => {
                body.querySelectorAll("[data-theme]").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                this.currentThemeFilter = chip.getAttribute("data-theme");
            };
        });

        const btnCancel = body.querySelector("#tq-btn-cancel");
        if (btnCancel) {
            btnCancel.onclick = () => {
                this.containerModal.style.display = "none";
            };
        }

        const btnStart = body.querySelector("#tq-btn-start-drill");
        if (btnStart) {
            btnStart.onclick = () => {
                this.generateQuestions();
            };
        }
    }

    // 問題生成ロジック（高品質な近接年代・テーマ抽出）
    generateQuestions() {
        const pool = this.getAllPool();
        if (pool.length < 3) {
            alert("出来事データが不足しています。");
            return;
        }

        let filtered = [...pool];

        if (this.currentMode === "mistakes") {
            const mistakes = pool.filter(p => p.isMistake);
            if (mistakes.length >= 3) {
                filtered = mistakes;
            }
        } else if (this.currentMode === "era_select" && this.currentEraFilter !== "ALL") {
            const eraItems = pool.filter(p => p.era === this.currentEraFilter);
            if (eraItems.length >= 3) {
                filtered = eraItems;
            }
        } else if (this.currentMode === "theme" && this.currentThemeFilter !== "ALL") {
            const themeItems = pool.filter(p => p.theme === this.currentThemeFilter);
            if (themeItems.length >= 3) {
                filtered = themeItems;
            }
        }

        this.questions = [];
        const TOTAL = 5;

        for (let q = 0; q < TOTAL; q++) {
            let trio = [];

            if (this.currentMode === "era_close" && filtered.length >= 5) {
                // 時代近接バトル：1つ基準の出来事を選び、年代が近い（前後120年以内）のものを優先ピック！
                const anchor = filtered[Math.floor(Math.random() * filtered.length)];
                const candidates = filtered
                    .filter(item => item.year_sort !== anchor.year_sort)
                    .sort((a, b) => Math.abs(a.year_sort - anchor.year_sort) - Math.abs(b.year_sort - anchor.year_sort));

                trio = [anchor, candidates[0] || filtered[0], candidates[1] || filtered[1]];
            } else {
                // シャッフルして年号が重複しない3件を抽出
                const shuffled = [...filtered].sort(() => Math.random() - 0.5);
                const usedYears = new Set();
                for (const item of shuffled) {
                    if (!usedYears.has(item.year_sort)) {
                        trio.push(item);
                        usedYears.add(item.year_sort);
                        if (trio.length >= 3) break;
                    }
                }
            }

            // フォールバック
            if (trio.length < 3) {
                trio = pool.slice(0, 3);
            }

            // 本番の設問提示順（Ⅰ, Ⅱ, Ⅲ）としてのアイテム配列
            // ランダムに並べて固定
            const presentationItems = [...trio].sort(() => Math.random() - 0.5);

            // 正解の順序（year_sort 昇順）
            const correctOrder = [...presentationItems].sort((a, b) => a.year_sort - b.year_sort);

            // 正解のインデックス順列（例: [1, 0, 2]）
            const correctIndices = correctOrder.map(item => presentationItems.indexOf(item));

            // 正解のマーク番号（1〜6）
            const matchingChoice = KYOTSU_CHOICES.find(c => 
                c.orderIndices[0] === correctIndices[0] &&
                c.orderIndices[1] === correctIndices[1] &&
                c.orderIndices[2] === correctIndices[2]
            );
            const correctChoiceIndex = matchingChoice ? matchingChoice.index : 1;

            // 初期ユーザー並び順（絶対に最初から正解になっていないようにシャッフル）
            let userOrder = [...presentationItems];
            let tries = 0;
            while (userOrder.every((item, idx) => item.year_sort === correctOrder[idx].year_sort) && tries < 10) {
                userOrder.sort(() => Math.random() - 0.5);
                tries++;
            }

            this.questions.push({
                presentationItems, // Ⅰ, Ⅱ, Ⅲ の定義
                correctOrder,      // 正しい時系列
                correctChoiceIndex,// ①〜⑥の正解
                userOrder,         // ユーザーの現在の並び替えカード
                answered: false,
                isCorrect: false,
                userChoiceIndex: null,
                spentSeconds: 0
            });
        }

        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.historyResults = [];
        this.renderQuestion();
    }

    // 設問画面の描画（各問題の開始時に1回だけ呼び出し）
    renderQuestion() {
        this.answered = false;
        this.cleanup();

        this.questionStartTime = Date.now();
        const q = this.questions[this.currentIndex];

        const body = this.containerModal.querySelector(".quiz-content-area");
        if (!body) return;

        body.innerHTML = `
            <div class="tq-question-layout">
                <!-- 上部ステータスバー -->
                <div class="tq-status-bar">
                    <div class="tq-step-indicator">
                        <span class="tq-step-badge">第 ${this.currentIndex + 1} / ${this.questions.length} 問</span>
                        <span class="tq-mode-indicator">${this.getModeName()}</span>
                    </div>
                    <div class="tq-stats-group">
                        <div class="tq-stat-item">
                            <span class="tq-stat-label">連続正解</span>
                            <span class="tq-stat-value" id="tq-streak-val">🔥 ${this.streak}</span>
                        </div>
                        <div class="tq-stat-item">
                            <span class="tq-stat-label">スコア</span>
                            <span class="tq-stat-value" id="tq-score-val">${this.score} pt</span>
                        </div>
                        <div class="tq-stat-item">
                            <span class="tq-stat-label">思考時間</span>
                            <span class="tq-stat-value" id="tq-live-timer">0秒</span>
                        </div>
                    </div>
                </div>

                <!-- 設問見出し（共通テスト仕様） -->
                <div class="tq-prompt-box">
                    <div class="tq-prompt-badge">問題</div>
                    <div class="tq-prompt-text">
                        次の <strong>Ⅰ 〜 Ⅲ</strong> の出来事について、<strong>古いものから年代順に正しく配列したもの</strong>を、下の <strong>① 〜 ⑥</strong> のうちから一つ選べ。<br>
                        <span style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.25rem; display:inline-block;">
                            💡 「▲ ▼」ボタン、ドラッグ移動、または下の「①〜⑥マークシート」をタップして並べ替えます（キーボード数字キー「1〜6」やEnterキーでも操作可能）。
                        </span>
                    </div>
                </div>

                <!-- 本文（Ⅰ, Ⅱ, Ⅲ の定義カード） -->
                <div class="tq-cards-container" id="tq-cards-board">
                    <!-- renderBoardCards() で動的描画 -->
                </div>

                <!-- 共通テスト形式 マーク式 6択パネル -->
                <div class="tq-kyotsu-choices-wrap">
                    <div class="tq-choices-header">
                        <span>🎯 共通テスト 6択マークシート（カード移動と完全連動）:</span>
                    </div>
                    <div class="tq-choices-grid" id="tq-choices-grid">
                        ${KYOTSU_CHOICES.map(c => `
                            <button type="button" class="tq-choice-btn" data-choice-index="${c.index}">
                                <span class="tq-choice-mark">${c.label}</span>
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- 確定ボタンバー -->
                <div class="tq-action-bar">
                    <button type="button" class="tq-btn tq-btn-secondary" id="tq-btn-giveup">
                        中断して年表へ
                    </button>
                    <button type="button" class="tq-btn tq-btn-submit" id="tq-btn-confirm">
                        ✅ この順序で解答・判定する
                    </button>
                </div>
            </div>
        `;

        // 思考時間タイマー（Date.now() 基準で正確に計算。カード移動でリセットされない）
        const updateTimer = () => {
            const timerEl = body.querySelector("#tq-live-timer");
            if (timerEl) {
                const elapsed = Math.max(0, Math.floor((Date.now() - this.questionStartTime) / 1000));
                timerEl.textContent = `${elapsed}秒`;
            }
        };
        updateTimer();
        this.timerInterval = setInterval(updateTimer, 500);

        // カード描画 & イベント
        this.renderBoardCards();

        // 6択マークボタンをクリックした時の双方向連動
        body.querySelectorAll(".tq-choice-btn").forEach(btn => {
            btn.onclick = () => {
                if (this.answered) return;
                const choiceIdx = parseInt(btn.getAttribute("data-choice-index"), 10);
                const choice = KYOTSU_CHOICES.find(c => c.index === choiceIdx);
                if (choice) {
                    q.userOrder = choice.orderIndices.map(i => q.presentationItems[i]);
                    this.renderBoardCards();
                }
            };
        });

        // 中断ボタン
        const btnGiveup = body.querySelector("#tq-btn-giveup");
        if (btnGiveup) {
            btnGiveup.onclick = () => {
                this.cleanup();
                this.containerModal.style.display = "none";
            };
        }

        // 解答決定ボタン
        const btnConfirm = body.querySelector("#tq-btn-confirm");
        if (btnConfirm) {
            btnConfirm.onclick = () => {
                this.submitAnswer();
            };
        }

        // キーボード操作（1〜6で選択、Enterで確定）
        this._keyHandler = (e) => {
            if (this.answered) return;
            // 入力フォーム等フォーカス時は無視
            if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

            const keyNum = parseInt(e.key, 10);
            if (keyNum >= 1 && keyNum <= 6) {
                const choice = KYOTSU_CHOICES.find(c => c.index === keyNum);
                if (choice) {
                    q.userOrder = choice.orderIndices.map(i => q.presentationItems[i]);
                    this.renderBoardCards();
                }
            } else if (e.key === "Enter") {
                this.submitAnswer();
            }
        };
        if (typeof window !== "undefined") {
            window.addEventListener("keydown", this._keyHandler);
        }
    }

    // カード一覧の描画（並べ替え時にのみ再描画。タイマーや全体レイアウトを破壊しない）
    renderBoardCards() {
        const body = this.containerModal.querySelector(".quiz-content-area");
        if (!body) return;
        const board = body.querySelector("#tq-cards-board");
        if (!board) return;

        const q = this.questions[this.currentIndex];
        const roman = ["Ⅰ", "Ⅱ", "Ⅲ"];

        board.innerHTML = q.userOrder.map((item, idx) => {
            const originalRoman = roman[q.presentationItems.indexOf(item)];
            return `
                <div class="tq-event-card" draggable="true" data-index="${idx}" data-item-id="${item.name}">
                    <div class="tq-card-handle" title="ドラッグして並べ替え">
                        <span class="tq-roman-badge">${originalRoman}</span>
                        <span class="tq-drag-grip">⋮⋮</span>
                    </div>
                    <div class="tq-card-content">
                        <div class="tq-card-title">${item.name}</div>
                        <div class="tq-card-meta">
                            <!-- 💡 時代・年号表記はネタバレ防止のため解答後の解説画面で開示 -->
                            <span class="tq-tag-masked" title="解答後に解説で時代と正確な年号が開示されます">🔒 時代・年号非公開</span>
                            ${item.leader ? `<span class="tq-meta-text">👤 主体: ${item.leader}</span>` : ''}
                        </div>
                    </div>
                    <div class="tq-move-btns">
                        <button type="button" class="tq-btn-move" data-move="-1" ${idx === 0 ? 'disabled' : ''} title="上へ移動">▲</button>
                        <button type="button" class="tq-btn-move" data-move="1" ${idx === 2 ? 'disabled' : ''} title="下へ移動">▼</button>
                    </div>
                </div>
            `;
        }).join("");

        // ▲ ▼ 移動ボタンイベント
        board.querySelectorAll(".tq-btn-move").forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (this.answered) return;
                const card = btn.closest(".tq-event-card");
                const fromIdx = parseInt(card.getAttribute("data-index"), 10);
                const delta = parseInt(btn.getAttribute("data-move"), 10);
                const toIdx = fromIdx + delta;

                if (toIdx >= 0 && toIdx < q.userOrder.length) {
                    const temp = q.userOrder[fromIdx];
                    q.userOrder[fromIdx] = q.userOrder[toIdx];
                    q.userOrder[toIdx] = temp;
                    this.renderBoardCards();
                }
            };
        });

        // ドラッグ＆ドロップイベント
        this.setupDragAndDrop();

        // 6択マークシートのハイライト同期
        this.syncChoiceHighlights();
    }

    cleanup() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this._keyHandler && typeof window !== "undefined") {
            window.removeEventListener("keydown", this._keyHandler);
            this._keyHandler = null;
        }
    }

    getModeName() {
        const found = QUIZ_MODES.find(m => m.id === this.currentMode);
        return found ? found.name : "整序特訓";
    }

    // 現在のカード順序に対応するマークシートボタンを光らせる
    syncChoiceHighlights() {
        const body = this.containerModal.querySelector(".quiz-content-area");
        if (!body) return;

        const q = this.questions[this.currentIndex];
        // 現在の userOrder の各要素が presentationItems の何番目（0, 1, 2）か
        const currentIndices = q.userOrder.map(item => q.presentationItems.indexOf(item));

        const matchedChoice = KYOTSU_CHOICES.find(c => 
            c.orderIndices[0] === currentIndices[0] &&
            c.orderIndices[1] === currentIndices[1] &&
            c.orderIndices[2] === currentIndices[2]
        );

        body.querySelectorAll(".tq-choice-btn").forEach(btn => {
            const idx = parseInt(btn.getAttribute("data-choice-index"), 10);
            if (matchedChoice && idx === matchedChoice.index) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // ドラッグ＆ドロップ実装
    setupDragAndDrop() {
        const board = this.containerModal.querySelector("#tq-cards-board");
        if (!board) return;

        let draggedEl = null;

        board.querySelectorAll(".tq-event-card").forEach(card => {
            card.addEventListener("dragstart", (e) => {
                draggedEl = card;
                card.classList.add("dragging");
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", card.getAttribute("data-index"));
            });

            card.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                card.classList.add("drag-over");
            });

            card.addEventListener("dragleave", () => {
                card.classList.remove("drag-over");
            });

            card.addEventListener("dragend", () => {
                card.classList.remove("dragging");
                board.querySelectorAll(".tq-event-card").forEach(c => c.classList.remove("drag-over"));
            });

            card.addEventListener("drop", (e) => {
                e.preventDefault();
                card.classList.remove("drag-over");
                if (draggedEl && draggedEl !== card) {
                    const fromIdx = parseInt(draggedEl.getAttribute("data-index"), 10);
                    const toIdx = parseInt(card.getAttribute("data-index"), 10);
                    const q = this.questions[this.currentIndex];

                    const moved = q.userOrder.splice(fromIdx, 1)[0];
                    q.userOrder.splice(toIdx, 0, moved);
                    this.renderBoardCards();
                }
            });
        });
    }

    // 回答判定と本格解説の描画
    submitAnswer() {
        if (this.answered) return;
        this.answered = true;
        this.cleanup();

        const q = this.questions[this.currentIndex];
        // 正確な実経過秒数を計算（最小1秒）
        const elapsed = Math.max(1, Math.round((Date.now() - (this.questionStartTime || Date.now())) / 1000));
        q.spentSeconds = elapsed;

        // 正解判定
        const isCorrect = q.userOrder.every((item, i) => item.year_sort === q.correctOrder[i].year_sort);
        q.isCorrect = isCorrect;

        // 現在の選択肢インデックス
        const currentIndices = q.userOrder.map(item => q.presentationItems.indexOf(item));
        const userChoice = KYOTSU_CHOICES.find(c => 
            c.orderIndices[0] === currentIndices[0] &&
            c.orderIndices[1] === currentIndices[1] &&
            c.orderIndices[2] === currentIndices[2]
        );
        q.userChoiceIndex = userChoice ? userChoice.index : null;

        if (isCorrect) {
            this.streak++;
            const timeBonus = Math.max(0, 30 - q.spentSeconds) * 2;
            const pts = 100 + (this.streak > 1 ? this.streak * 10 : 0) + timeBonus;
            this.score += pts;
            q.earnedPoints = pts;
        } else {
            this.streak = 0;
            q.earnedPoints = 0;
            // 弱点保存
            this.saveMistakeRecord(q);
        }

        this.renderExplanation();
    }

    // 弱点復習リストに記録
    saveMistakeRecord(q) {
        try {
            const key = "flora_timeline_quiz_mistakes";
            const existing = JSON.parse(localStorage.getItem(key) || "[]");
            existing.unshift({
                historyType: this.historyType,
                date: new Date().toISOString(),
                events: q.correctOrder.map(e => ({ name: e.name, year: e.year, year_sort: e.year_sort }))
            });
            localStorage.setItem(key, JSON.stringify(existing.slice(0, 30)));
        } catch(e) {}
    }

    // 充実の因果関係・ビジュアルタイムライン解説画面
    renderExplanation() {
        const q = this.questions[this.currentIndex];
        const roman = ["Ⅰ", "Ⅱ", "Ⅲ"];
        const body = this.containerModal.querySelector(".quiz-content-area");
        if (!body) return;

        const isCorrect = q.isCorrect;

        // 正解の選択肢ラベル
        const correctChoice = KYOTSU_CHOICES.find(c => c.index === q.correctChoiceIndex);

        body.innerHTML = `
            <div class="tq-explanation-layout">
                <!-- 判定バナー -->
                <div class="tq-result-banner ${isCorrect ? 'correct' : 'wrong'}">
                    <div class="tq-banner-icon">${isCorrect ? '🎯' : '⚠️'}</div>
                    <div class="tq-banner-text">
                        <div class="tq-banner-title">
                            ${isCorrect ? '正解！素晴らしい時系列把握です！' : '不正解…！因果関係と前後関係を確認！'}
                        </div>
                        <div class="tq-banner-sub">
                            正解: <strong>${correctChoice ? correctChoice.label : ''}</strong> ｜ 解答時間: ${q.spentSeconds}秒
                            ${isCorrect ? ` ｜ 獲得: +${q.earnedPoints} pt` : ''}
                        </div>
                    </div>
                </div>

                <!-- ⏳ ビジュアル時系列軸（Visual Chrono Bar） -->
                <div class="tq-chrono-section">
                    <div class="tq-section-header-row">
                        <span class="tq-chrono-title">⏳ 正しい時系列タイムライン軸</span>
                        <span class="tq-chrono-sub">（過去 ➔ 未来）</span>
                    </div>

                    <div class="tq-chrono-axis">
                        ${q.correctOrder.map((ev, idx) => {
                            const originalRoman = roman[q.presentationItems.indexOf(ev)];
                            // 前の出来事との年数差を計算
                            let gapText = "";
                            if (idx > 0) {
                                const diff = ev.year_sort - q.correctOrder[idx - 1].year_sort;
                                gapText = diff > 0 ? `約 ${diff} 年後` : "同年代";
                            }
                            return `
                                ${gapText ? `
                                    <div class="tq-chrono-gap">
                                        <div class="tq-gap-line"></div>
                                        <span class="tq-gap-badge">➔ ${gapText}</span>
                                    </div>
                                ` : ''}
                                <div class="tq-chrono-card">
                                    <div class="tq-chrono-card-top">
                                        <span class="tq-chrono-roman">${originalRoman}</span>
                                        <span class="tq-tag">📍 ${ev.era || '通史'}</span>
                                        <span class="tq-chrono-year">${ev.year}</span>
                                    </div>
                                    <div class="tq-chrono-card-name">${ev.name}</div>
                                    ${ev.leader ? `<div class="tq-chrono-leader">👤 ${ev.leader}</div>` : ''}
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- 💡 各出来事の因果関係・歴史的ストーリー -->
                <div class="tq-detail-section">
                    <div class="tq-section-header-row">
                        <span class="tq-chrono-title">📖 なぜこの順序になるのか？ 歴史の論理・因果関係</span>
                    </div>

                    <div class="tq-steps-list">
                        ${q.correctOrder.map((ev, idx) => {
                            const originalRoman = roman[q.presentationItems.indexOf(ev)];
                            return `
                                <div class="tq-step-card">
                                    <div class="tq-step-header">
                                        <span class="tq-step-number">STEP ${idx + 1}</span>
                                        <span class="tq-step-roman">[ ${originalRoman} ]</span>
                                        <span class="tq-tag" style="margin-left:0.25rem;">📍 ${ev.era || '通史'}</span>
                                        <span class="tq-step-name">${ev.name}</span>
                                        <span class="tq-step-year">${ev.year}</span>
                                    </div>
                                    <div class="tq-step-body">
                                        ${ev.note ? `<div class="tq-step-note">${ev.note}</div>` : ''}
                                        ${ev.cause_effect ? `
                                            <div class="tq-step-causality">
                                                <strong>⚡ 背景と帰結:</strong> ${ev.cause_effect}
                                            </div>
                                        ` : ''}
                                        ${ev.exam_point ? `
                                            <div class="tq-step-point">
                                                <strong>🎯 共通テストの急所:</strong> ${ev.exam_point}
                                            </div>
                                        ` : ''}
                                        ${ev.mnemonics ? `
                                            <div class="tq-step-mnemonic">
                                                🎴 <strong>語呂合わせ:</strong> ${ev.mnemonics}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- 次へボタン -->
                <div class="tq-action-bar">
                    <button type="button" class="tq-btn tq-btn-secondary" id="tq-btn-exit-mid">
                        中断して年表へ
                    </button>
                    <button type="button" class="tq-btn tq-btn-primary" id="tq-btn-next">
                        ${this.currentIndex + 1 < this.questions.length ? '次の問題へ ➔' : '🏆 最終成績を見る ➔'}
                    </button>
                </div>
            </div>
        `;

        const btnNext = body.querySelector("#tq-btn-next");
        if (btnNext) {
            btnNext.onclick = () => {
                this.currentIndex++;
                if (this.currentIndex < this.questions.length) {
                    this.renderQuestion();
                } else {
                    this.renderFinalResult();
                }
            };
        }

        const btnExit = body.querySelector("#tq-btn-exit-mid");
        if (btnExit) {
            btnExit.onclick = () => {
                this.containerModal.style.display = "none";
            };
        }
    }

    // 最終総合リザルト画面
    renderFinalResult() {
        const body = this.containerModal.querySelector(".quiz-content-area");
        if (!body) return;

        const total = this.questions.length;
        const correctCount = this.questions.filter(q => q.isCorrect).length;
        const rate = Math.round((correctCount / total) * 100);

        let rankTitle = "歴史探求者";
        let rankDesc = "基礎年代をもう一度整理して、因果関係でつなげよう！";
        let rankColor = "#3B82F6";

        if (rate === 100) {
            rankTitle = "👑 共通テスト整序マスター・神レベル！";
            rankDesc = "完璧な時系列把握力！本番の歴史整序問題でも満点を狙える実力です！";
            rankColor = "#10B981";
        } else if (rate >= 80) {
            rankTitle = "🎖️ 上級歴史ストラテジスト！";
            rankDesc = "極めて高い年代感覚！間違えた1問の因果関係を押さえれば無敵です！";
            rankColor = "#6366F1";
        } else if (rate >= 60) {
            rankTitle = "✨ 実戦合格ライン到達！";
            rankDesc = "時代の骨格は捉えています。同時代・同世紀の紛らわしい配列を重点補強しましょう！";
            rankColor = "#F59E0B";
        }

        body.innerHTML = `
            <div class="tq-final-layout">
                <div class="tq-final-header">
                    <div class="tq-final-trophy">🏆</div>
                    <h2 class="tq-final-title">整序マスター特訓 完了！</h2>
                    <div class="tq-final-rank" style="color: ${rankColor};">${rankTitle}</div>
                    <div class="tq-final-rank-desc">${rankDesc}</div>
                </div>

                <div class="tq-final-score-cards">
                    <div class="tq-score-box">
                        <div class="tq-score-lbl">正答率</div>
                        <div class="tq-score-big" style="color: ${rankColor};">${rate}%</div>
                        <div class="tq-score-sub">${correctCount} / ${total} 問正解</div>
                    </div>
                    <div class="tq-score-box">
                        <div class="tq-score-lbl">総スコア</div>
                        <div class="tq-score-big">${this.score}</div>
                        <div class="tq-score-sub">pt</div>
                    </div>
                    <div class="tq-score-box">
                        <div class="tq-score-lbl">平均思考時間</div>
                        <div class="tq-score-big">${Math.round(this.questions.reduce((a, b) => a + b.spentSeconds, 0) / total)}</div>
                        <div class="tq-score-sub">秒 / 問</div>
                    </div>
                </div>

                <!-- 復習・見直し一覧 -->
                <div class="tq-review-list-section">
                    <div class="tq-section-title">📝 今回の特訓問題一覧・総復習</div>
                    <div class="tq-review-cards">
                        ${this.questions.map((q, i) => `
                            <div class="tq-review-card ${q.isCorrect ? 'is-correct' : 'is-wrong'}">
                                <div class="tq-review-card-top">
                                    <span class="tq-review-badge">第 ${i + 1} 問</span>
                                    <span class="tq-review-status">${q.isCorrect ? '✅ 正解' : '❌ 不正解'}</span>
                                    <span class="tq-review-time">${q.spentSeconds}秒</span>
                                </div>
                                <div class="tq-review-flow">
                                    ${q.correctOrder.map(e => `
                                        <span class="tq-review-flow-item">
                                            <strong>${e.name}</strong> (${e.year})
                                        </span>
                                    `).join(" ➔ ")}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="tq-action-bar">
                    <button type="button" class="tq-btn tq-btn-secondary" id="tq-btn-finish-close">
                        年表へ戻る
                    </button>
                    <button type="button" class="tq-btn tq-btn-primary" id="tq-btn-restart">
                        🔄 別の問題で再挑戦する
                    </button>
                </div>
            </div>
        `;

        const btnClose = body.querySelector("#tq-btn-finish-close");
        if (btnClose) {
            btnClose.onclick = () => {
                this.containerModal.style.display = "none";
                if (this.onFinish) this.onFinish();
            };
        }

        const btnRestart = body.querySelector("#tq-btn-restart");
        if (btnRestart) {
            btnRestart.onclick = () => {
                this.renderModeSelect();
            };
        }
    }
}

