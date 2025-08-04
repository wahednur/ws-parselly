export const generateTrackingId = async (): Promise<string> => {
  const date = new Date();
  const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TRK-${yyyyMMdd}-${random}`;
};
