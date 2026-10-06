// The one call this site makes to the Handy REST API (v3): what device is
// behind a connection key. `/info` only answers while the device is connected
// to the server, so a result doubles as "it is online" — one request, where
// /connected followed by /info would be two.

const HANDY_API = "https://www.handyfeeling.com/api/handy-rest/v3";

export interface DeviceInfo {
  fwVersion: string;
  fwFeatureFlags: string | null;
  hwModelNo: number | null;
  hwModelName: string | null;
  hwModelVariant: number | null;
}

interface InfoResponse {
  result?: {
    fw_version?: string;
    fw_feature_flags?: string;
    hw_model_no?: number;
    hw_model_name?: string;
    hw_model_variant?: number;
  };
}

/** The device behind a connection key, or null when it is offline, the key
 * is unknown, or the call fails for any other reason — every one of which
 * means the same thing to the caller: not now. */
export async function getDeviceInfo(
  connectionKey: string,
  apiKey: string,
  timeoutMs = 8000
): Promise<DeviceInfo | null> {
  try {
    const response = await fetch(`${HANDY_API}/info`, {
      headers: {
        "X-Connection-Key": connectionKey,
        "X-Api-Key": apiKey
      },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) return null;
    const body = (await response.json()) as InfoResponse;
    const info = body.result;
    if (!info?.fw_version) return null;
    return {
      fwVersion: info.fw_version,
      fwFeatureFlags: info.fw_feature_flags ?? null,
      hwModelNo: info.hw_model_no ?? null,
      hwModelName: info.hw_model_name ?? null,
      hwModelVariant: info.hw_model_variant ?? null
    };
  } catch {
    return null;
  }
}
