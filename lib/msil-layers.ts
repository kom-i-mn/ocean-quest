// 海しる(海上保安庁 海洋状況表示システム)公開APIのレイヤー定義。
// https://portal.msil.go.jp/ で公開されている REST API (ArcGIS MapServer互換) を利用する。
// 利用にはサブスクリプションキーが必要 (env: MSIL_SUBSCRIPTION_KEY)。

export type MsilLayerKey =
  | "aquarium"
  | "museum"
  | "experience"
  | "port"
  | "lighthouse"
  | "cable"
  | "current";

export type MsilLayerDef = {
  key: MsilLayerKey;
  label: string;
  description: string;
  // api.msil.go.jp 配下のパス (MapServer レイヤー番号まで)
  service: string;
  kind: "point" | "line";
  // all: 全件を一括取得(少量) / bbox: 表示中の地図範囲のみ取得(大量データ)
  load: "all" | "bbox";
  // bbox読み込み時に必要な最小ズーム
  minZoom?: number;
  color: string;
  // ポップアップ表示に使うプロパティ名
  titleField?: string;
  fields?: string[];
  linkField?: string;
  // サーバー側キャッシュ秒数
  revalidate: number;
  // ライン系の間引き(度)。ArcGISのmaxAllowableOffsetに渡す
  simplify?: number;
  // 地図下に一覧を表示するか(ポイント系の少量レイヤーのみ)
  listable?: boolean;
  // レイヤー有効時に表示する「これはなに?」の解説
  about?: string;
};

export const msilLayers: Record<MsilLayerKey, MsilLayerDef> = {
  current: {
    key: "current",
    label: "海流(黒潮・親潮の流軸)",
    description: "海上保安庁の海洋速報から、最新の解析による海流の流れの軸",
    service: "quick-bulletin/v2/MapServer/6",
    kind: "line",
    load: "all",
    color: "#ff8a2a",
    titleField: "海流の種別",
    fields: ["解析対象日", "速報号数"],
    revalidate: 21600,
    simplify: 0.005,
    about:
      "オレンジの線は、海上保安庁「海洋速報」の最新解析による海流の中心線(流軸)です。黒潮は日本の南岸を流れる世界有数の暖流で、蛇行の仕方が海運の燃費、漁場の位置、沿岸の気候にまで影響します。親潮は栄養豊富な寒流で、三陸沖の豊かな漁場を支えています。線をクリックすると、どの海流か・いつの解析かを確認できます。",
  },
  aquarium: {
    key: "aquarium",
    label: "水族館",
    description: "全国の水族館。海の生き物と産業への入口",
    service: "aquarium/v2/MapServer/1",
    kind: "point",
    load: "all",
    color: "#0e7c8c",
    titleField: "施設の名称",
    fields: ["住所", "主な内容"],
    linkField: "リンク",
    revalidate: 86400,
    listable: true,
    about:
      "海の生き物に出会える全国の水族館です。飼育員・獣医師だけでなく、展示企画・教育普及・広報など、海の面白さを伝える多様な仕事の現場でもあります。",
  },
  museum: {
    key: "museum",
    label: "海の展示施設",
    description: "海洋に関する博物館・資料館などの展示施設",
    service: "museum/v2/MapServer/1",
    kind: "point",
    load: "all",
    color: "#5b8c2a",
    titleField: "施設の名称",
    fields: ["住所", "主な内容"],
    linkField: "リンク",
    revalidate: 86400,
    listable: true,
    about:
      "海・船・港をテーマにした博物館や資料館です。造船の歴史、海運のしくみ、海の環境など、海洋産業の背景知識を体系的に学べる場所です。",
  },
  experience: {
    key: "experience",
    label: "体験学習施設",
    description: "海に親しむ体験学習ができる施設",
    service: "nature-experience-facility/v2/MapServer/1",
    kind: "point",
    load: "all",
    color: "#b3421f",
    titleField: "施設の名称",
    fields: ["住所", "主な内容"],
    linkField: "リンク",
    revalidate: 86400,
    listable: true,
    about:
      "海に親しむ体験学習ができる施設です。マリンスポーツや水辺の安全教室など、まず「海を好きになる」入口としておすすめです。",
  },
  port: {
    key: "port",
    label: "港湾",
    description: "全国の港湾(国際戦略港湾〜地方港湾)。海運・物流の現場",
    service: "port-point/v2/MapServer/1",
    kind: "point",
    load: "all",
    color: "#005866",
    titleField: "港湾名",
    fields: ["港湾種類", "所在地"],
    revalidate: 86400,
    about:
      "全国の港湾です。港湾には法律上の区分があり、国際コンテナ輸送の中枢となる「国際戦略港湾」(京浜・阪神など)、地域の国際輸送を担う「国際拠点港湾」、国の利害に重大な関係を持つ「重要港湾」、地域の「地方港湾」に分かれます。点をクリックすると区分と所在地を確認できます。",
  },
  lighthouse: {
    key: "lighthouse",
    label: "灯台",
    description: "航路標識としての灯台(拡大すると表示されます)",
    service: "lights/lighthouse/v2/MapServer/1",
    kind: "point",
    load: "bbox",
    minZoom: 9,
    color: "#8a6d1f",
    titleField: "名称",
    fields: ["読み"],
    revalidate: 86400,
    listable: true,
    about:
      "灯台は、船が自分の位置を確かめるための「航路標識」のひとつです。全国に3,000基以上あり、それぞれに航路標識番号が振られています。今も海上保安庁が維持管理しており、船の安全を支える現役のインフラです。地図を拡大すると表示され、一覧には表示範囲内の灯台が並びます。",
  },
  cable: {
    key: "cable",
    label: "海底ケーブル",
    description: "海底に敷設された通信ケーブル(拡大すると表示されます)",
    service: "submarine-cable-line/v2/MapServer/2",
    kind: "line",
    load: "bbox",
    minZoom: 6,
    color: "#6b5b95",
    revalidate: 86400,
    simplify: 0.005,
    about:
      "紫の線は海底に敷設された通信ケーブルです。国際通信の大部分は衛星ではなく海底ケーブルで運ばれており、インターネットを物理的に支える「海の通信インフラ」です。敷設・保守には専用のケーブル敷設船と海洋の専門人材が関わっています。個々のケーブル名は海しるAPIでは公開されていません。",
  },
};

export const msilAttribution =
  "出典: 海洋状況表示システム(海しる・海上保安庁)";
