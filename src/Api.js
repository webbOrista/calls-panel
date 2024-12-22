const token = "testtoken";

export const fetchCallList = async (params = {}) => {
  try {
    const url = new URL("https://api.skilla.ru/mango/getList");

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
};

const audioCache = {};

export const fetchCallRecord = async (recordId, partnerId) => {
  const cacheKey = `${recordId}-${partnerId}`;

  if (audioCache[cacheKey]) {
    return audioCache[cacheKey];
  }

  const url = `https://api.skilla.ru/mango/getRecord?record=${recordId}&partnership_id=${partnerId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "audio/mpeg",
        "Content-Transfer-Encoding": "binary",
        "Content-Disposition": 'filename="record.mp3"',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    audioCache[cacheKey] = audioUrl;

    return audioUrl;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};
