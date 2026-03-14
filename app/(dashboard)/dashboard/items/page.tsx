import { getItems } from "@/lib/db";
import { ItemsPageClient } from "@/components/items-page-client";

function formatQuantity(value: number | string) {
  const num = Number(value);

  if (!Number.isFinite(num)) return String(value);
  if (Number.isInteger(num)) return num.toString();

  return num
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
}

export default async function ItemsPage() {
  const items = await getItems();

  const normalizedItems = items.map((item: any) => ({
    ...item,
    default_quantity_formatted: formatQuantity(item.default_quantity),
  }));

  const activeItemsCount = items.filter((item: any) => item.is_active).length;
  const inactiveItemsCount = items.length - activeItemsCount;

  return (
    <ItemsPageClient
      items={normalizedItems}
      totalItemsCount={items.length}
      activeItemsCount={activeItemsCount}
      inactiveItemsCount={inactiveItemsCount}
    />
  );
}