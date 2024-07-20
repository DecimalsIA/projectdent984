// utils/base64Utils.ts

export const base64Decode = (base64: string): any => {
  const buffer: Buffer = Buffer.from(base64, 'base64');
  const decodedString: string = buffer.toString('utf-8');
  try {
    const json: object = JSON.parse(decodedString);
    return json;
  } catch (error) {
    return decodedString;
  }
};

export const base64Encode = (data: string | object): string => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  const buffer: Buffer = Buffer.from(stringData, 'utf-8');
  return buffer.toString('base64');
};
