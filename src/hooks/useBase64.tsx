import { useState } from 'react';

const useBase64 = () => {
  const [encoded, setEncoded] = useState<string>('');
  const [decoded, setDecoded] = useState<string>('');

  const encode = (input: string) => {
    try {
      const encodedValue = btoa(input);
      setEncoded(encodedValue);
      return encodedValue;
    } catch (error) {
      console.error('Error encoding to Base64:', error);
      return '';
    }
  };

  const decode = (input: string) => {
    try {
      const decodedValue = atob(input);
      setDecoded(decodedValue);
      return decodedValue;
    } catch (error) {
      console.error('Error decoding from Base64:', error);
      return '';
    }
  };

  return { encoded, decoded, encode, decode };
};

export default useBase64;
