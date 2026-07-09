export const computeChecksum = (data: string): string => {
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) + hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const verifyChecksum = (data: string, checksum: string): boolean => {
  return computeChecksum(data) === checksum;
};