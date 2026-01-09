import { fetchText } from "./http";
import { normalizeServiceKey, toNumber } from "./utils";

const DEFAULT_BASE_URL = "https://apis.data.go.kr";

export type MohwFuneralHomeItem = {
  ctpv?: string;
  sigungu?: string;
  fcltNm?: string;
  addr?: string;
  telno?: string;
  fxno?: string;
  homepageUrl?: string;
  tpkct?: number | string;
  gubun?: string;
  mtaCnt?: number | string;
  ehrCnt?: number | string;
  diningFclt?: string;
  store?: string;
  pklt?: string;
  bereavedWaitRm?: string;
  sdblsPfFclt?: string;
  operType?: string;
};

export type MohwListResult = {
  items: MohwFuneralHomeItem[];
  pageNo: number;
  numOfRows: number;
  totalCount: number;
  resultCode?: string;
  resultMsg?: string;
};

function getTagText(parent: ParentNode, tagName: string): string {
  const el = (parent as Document).getElementsByTagName
    ? (parent as Document).getElementsByTagName(tagName)?.[0]
    : (parent as Element).getElementsByTagName(tagName)?.[0];
  return el?.textContent?.trim() ?? "";
}

function parseXmlList(xmlText: string): MohwListResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror")?.[0];
  if (parserError) {
    throw new Error(`Failed to parse XML response: ${parserError.textContent?.slice(0, 200) ?? ""}`);
  }

  const resultCode = getTagText(doc, "resultCode");
  const resultMsg = getTagText(doc, "resultMsg");

  const pageNo = toNumber(getTagText(doc, "pageNo")) ?? 1;
  const numOfRows = toNumber(getTagText(doc, "numOfRows")) ?? 10;
  const totalCount = toNumber(getTagText(doc, "totalCount")) ?? 0;

  const itemEls = Array.from(doc.getElementsByTagName("item"));
  const items: MohwFuneralHomeItem[] = itemEls.map((el) => ({
    ctpv: getTagText(el, "ctpv"),
    sigungu: getTagText(el, "sigungu"),
    fcltNm: getTagText(el, "fcltNm"),
    addr: getTagText(el, "addr"),
    telno: getTagText(el, "telno"),
    fxno: getTagText(el, "fxno"),
    homepageUrl: getTagText(el, "homepageUrl"),
    tpkct: getTagText(el, "tpkct"),
    gubun: getTagText(el, "gubun"),
    mtaCnt: getTagText(el, "mtaCnt"),
    ehrCnt: getTagText(el, "ehrCnt"),
    diningFclt: getTagText(el, "diningFclt"),
    store: getTagText(el, "store"),
    pklt: getTagText(el, "pklt"),
    bereavedWaitRm: getTagText(el, "bereavedWaitRm"),
    sdblsPfFclt: getTagText(el, "sdblsPfFclt"),
    operType: getTagText(el, "operType"),
  }));

  return { items, pageNo, numOfRows, totalCount, resultCode, resultMsg };
}

export async function getMohwFuneralHomes(options: {
  serviceKey: string;
  pageNo: number;
  numOfRows: number;
  ctpv?: string;
  baseUrl?: string;
  signal?: AbortSignal;
}): Promise<MohwListResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const xmlText = await fetchText({
    baseUrl,
    path: "/1352000/ODMS_DATA_04_1/callData04_1Api",
    query: {
      serviceKey: normalizeServiceKey(options.serviceKey),
      pageNo: options.pageNo,
      numOfRows: options.numOfRows,
      apiType: "XML",
      ctpv: options.ctpv,
    },
    signal: options.signal,
  });

  return parseXmlList(xmlText);
}

