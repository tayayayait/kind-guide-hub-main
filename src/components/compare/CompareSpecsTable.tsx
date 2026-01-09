import { ServiceItem } from "@/data/mockServices";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CompareSpecsTableProps {
  items: ServiceItem[];
}

export function CompareSpecsTable({ items }: CompareSpecsTableProps) {
  const formatPrice = (value: number) => new Intl.NumberFormat("ko-KR").format(value);

  const rows = [
    {
      key: "price",
      label: "가격 범위",
      render: (item: ServiceItem) => `₩${formatPrice(item.priceMin)}만 ~ ₩${formatPrice(item.priceMax)}만`,
    },
    {
      key: "location",
      label: "지역",
      render: (item: ServiceItem) => item.location,
    },
    {
      key: "distance",
      label: "거리",
      render: (item: ServiceItem) => item.distance ?? "미제공",
    },
    {
      key: "tags",
      label: "주요 태그",
      render: (item: ServiceItem) => (item.tags.length > 0 ? item.tags.slice(0, 3).join(", ") : "없음"),
    },
    {
      key: "trust",
      label: "신뢰도",
      render: (item: ServiceItem) => <TrustBadge type={item.trustType} />,
    },
    {
      key: "rating",
      label: "평점",
      render: (item: ServiceItem) =>
        item.rating ? `${item.rating.toFixed(1)} (${item.reviewCount ?? 0}개)` : "미제공",
    },
  ];

  return (
    <Table className="min-w-[640px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">항목</TableHead>
          {items.map((item) => (
            <TableHead key={item.id} className="min-w-[180px]">
              {item.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="font-medium">{row.label}</TableCell>
            {items.map((item) => (
              <TableCell key={`${row.key}-${item.id}`}>{row.render(item)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
