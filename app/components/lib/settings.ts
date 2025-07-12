import { v4 as uuid } from "uuid"

type Setting = {
  imageId?: string;
  isAudio?: boolean;
  isVideo?: boolean;
}

export async function createSetting({
  imageId,
  isAudio = false,
  isVideo = false
}: Setting): Promise<Setting> {
  const existingSetting = await getSetting();

  const setting: Setting = {
    imageId: existingSetting?.imageId || imageId || uuid(),
    isAudio,
    isVideo
  };

  await setSetting(setting);
  return setting;
}

export async function getSetting(): Promise<Setting | undefined> {
  try {
    const response = localStorage.getItem('setting');
    if (!response) return;
    return JSON.parse(response);
  } catch (err) {
    console.error("Error parsing setting cookie:", err);
    return;
  }
}

export async function clearSetting(): Promise<void> {
  await localStorage.delete('setting');
}

async function setSetting(setting: Setting): Promise<void> {
  await localStorage.setItem('setting', JSON.stringify(setting));
}
