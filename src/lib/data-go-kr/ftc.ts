import { fetchJson } from "./http";
import { coerceArray, normalizeServiceKey, toNumber } from "./utils";

const DEFAULT_BASE_URL = "https://apis.data.go.kr";

export type FtcRegistrationStatusItem = {
  opnSn?: number | string;
  pitbRgsDate?: string;
  prmmiMnno?: string;
  bzmnNm?: string;
  crno?: string;
  brno?: string;
  lctnAddr?: string;
  corpEmladr?: string;
  rprsvNm?: string;
  operSttusCdNm?: string;
  buzplcLctnAddr?: string;
};

export type FtcBusinessInfoItem = {
  opnSn?: number | string;
  conmNm?: string;
  rprsvNm?: string;
  opnPrmmiNo?: string;
  pitbRgsDate?: string;
  crno?: string;
  brno?: string;
  bzmnAddr?: string;
  rnAddr?: string;
  buzplcLctnAddr?: string;
  buzplcRnAddr?: string;
  telno?: string;
  emladr?: string;
  bsnSttusNm?: string;
};

type DataGoListResponse<T> = {
  resultCode?: string;
  resultMsg?: string;
  numOfRows?: string | number;
  pageNo?: string | number;
  totalCount?: string | number;
  items?: { item?: T | T[] };
};

export type FtcListResult<T> = {
  items: T[];
  pageNo: number;
  numOfRows: number;
  totalCount: number;
  resultCode?: string;
  resultMsg?: string;
};

export async function getFtcRegistrationStatusList(options: {
  serviceKey: string;
  pageNo: number;
  numOfRows: number;
  bzmnNm?: string;
  brno?: string;
  operSttusCdNm?: string;
  prmmiMnno?: string;
  fromYmd?: string;
  toYmd?: string;
  baseUrl?: string;
  signal?: AbortSignal;
}): Promise<FtcListResult<FtcRegistrationStatusItem>> {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const json = await fetchJson<DataGoListResponse<FtcRegistrationStatusItem>>({
    baseUrl,
    path: "/1130000/InstallplanBs_2Service/getInstallplanBsInfo_2",
    query: {
      serviceKey: normalizeServiceKey(options.serviceKey),
      pageNo: options.pageNo,
      numOfRows: options.numOfRows,
      resultType: "json",
      bzmnNm: options.bzmnNm,
      brno: options.brno,
      operSttusCdNm: options.operSttusCdNm,
      prmmiMnno: options.prmmiMnno,
      fromYmd: options.fromYmd,
      toYmd: options.toYmd,
    },
    signal: options.signal,
  });

  const items = coerceArray(json.items?.item);
  return {
    items,
    pageNo: toNumber(json.pageNo) ?? options.pageNo,
    numOfRows: toNumber(json.numOfRows) ?? options.numOfRows,
    totalCount: toNumber(json.totalCount) ?? items.length,
    resultCode: json.resultCode,
    resultMsg: json.resultMsg,
  };
}

export async function getFtcBusinessInfoByBrno(options: {
  serviceKey: string;
  brno: string;
  pageNo?: number;
  numOfRows?: number;
  baseUrl?: string;
  signal?: AbortSignal;
}): Promise<FtcBusinessInfoItem | null> {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const json = await fetchJson<DataGoListResponse<FtcBusinessInfoItem>>({
    baseUrl,
    path: "/1130000/InstallplanBsIf_2Service/getInstallplanBsIfBiznoInfo_2",
    query: {
      serviceKey: normalizeServiceKey(options.serviceKey),
      pageNo: options.pageNo ?? 1,
      numOfRows: options.numOfRows ?? 10,
      resultType: "json",
      brno: options.brno,
    },
    signal: options.signal,
  });

  const items = coerceArray(json.items?.item);
  return items[0] ?? null;
}

