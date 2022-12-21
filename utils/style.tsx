export const LAYERS = {
  TINT: 9999,
};

export const toHex = (color: number) => {
  const x = color.toString(16);
  return x.length === 1 ? '0' + x : x;
};
export const gradientPicker = (
  color1: string,
  color2: string,
  ratio: number
) => {
  const r = Math.ceil(
    parseInt(color1.substring(0, 2), 16) * ratio +
      parseInt(color2.substring(0, 2), 16) * (1 - ratio)
  );
  const g = Math.ceil(
    parseInt(color1.substring(2, 4), 16) * ratio +
      parseInt(color2.substring(2, 4), 16) * (1 - ratio)
  );
  const b = Math.ceil(
    parseInt(color1.substring(4, 6), 16) * ratio +
      parseInt(color2.substring(4, 6), 16) * (1 - ratio)
  );

  return toHex(r) + toHex(g) + toHex(b);
};
