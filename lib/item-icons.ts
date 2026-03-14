export const itemIconsMap: Record<string, string> = {
  "تمن": "/icons/items/rice.png",
  "حمص": "/icons/items/vegetarian.png",
  "زيت": "/icons/items/olive-oil.png",
  "شكر": "/icons/items/sugar.png",
  "طحين": "/icons/items/wheat.png",
  "عدس": "/icons/items/lentils.png",
  "فاصوليا": "/icons/items/bean.png",
  "معجون": "/icons/items/tomato.png",
  "معجون كبير": "/icons/items/tomato-big.png",
};

export function getItemIcon(name: string) {
  const normalized = name.trim().replace(/\s+/g, " ");
  return itemIconsMap[normalized] || "/icons/items/default.png";
}