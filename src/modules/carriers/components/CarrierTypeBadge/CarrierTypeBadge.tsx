import { ComponentProps, FC } from "react";

import { Badge } from "@/core/components/ui/badge";
import { CarrierTypesIds } from "@/modules/carriers/setup/carriers";

type CarrierTypeBadgeProps = { carrierTypeId: string } & ComponentProps<
  typeof Badge
>;
const CarrierTypeBadge: FC<CarrierTypeBadgeProps> = ({
  carrierTypeId,
  children,
  className = "",
  ...rest
}) => {
  /**
   * Get the custom styles for each carrier type ID (default styles if not included)
   *
   * @param {string} typeId
   *
   * @returns {string}
   */
  const getCarrierTypeStyles = (type: string) => {
    const styles: Partial<Record<CarrierTypesIds, string>> = {
      [CarrierTypesIds.AIRLINE]: "bg-blue-100 text-blue-800",
      [CarrierTypesIds.SHIPPING_LINE]: "bg-purple-100 text-purple-800",
      [CarrierTypesIds.ROAD_FREIGHT_INTERNATIONAL]:
        "bg-yellow-100 text-yellow-800",
      [CarrierTypesIds.COURIER]: "bg-green-100 text-green-800",
      // TODO add the rest
    };

    const defaultStyle = "bg-gray-100 text-gray-800";

    return styles?.[type as CarrierTypesIds] || defaultStyle;
  };

  return (
    <Badge
      className={`${getCarrierTypeStyles(carrierTypeId)} ${className}`}
      {...rest}
    >
      {children || "undefined"}
    </Badge>
  );
};

export default CarrierTypeBadge;
