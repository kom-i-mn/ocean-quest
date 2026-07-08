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
  },
};

export const msilAttribution =
  "出典: 海洋状況表示システム(海しる・海上保安庁)";
