import { useState, useCallback } from 'react';

type UseBase64Return = {
  json: any;
  base64: string;
  encodeToBase64: (input: any) => string | null;
  decodeFromBase64: (inputBase64: string) => any;
};

const useBase64 = (): UseBase64Return => {
  const [json, setJson] = useState<any>(null);
  const [base64, setBase64] = useState<string>('');

  const encodeToBase64 = useCallback((input: any): string | null => {
    try {
      const jsonString =
        typeof input === 'string' ? input : JSON.stringify(input);
      const encoded = btoa(jsonString);
      setJson(input);
      setBase64(encoded);
      return encoded;
    } catch (error) {
      console.error('Error encoding to Base64:', error);
      return null;
    }
  }, []);

  const decodeFromBase64 = useCallback((inputBase64: string): any => {
    try {
      const decodedString = atob(inputBase64);
      try {
        const parsedJson = JSON.parse(decodedString);
        setJson(parsedJson);
        return parsedJson;
      } catch {
        setJson(decodedString);
        return decodedString;
      }
    } catch (error) {
      console.error('Error decoding from Base64:', error);
      return null;
    }
  }, []);

  return {
    json,
    base64,
    encodeToBase64,
    decodeFromBase64,
  };
};

export default useBase64;
