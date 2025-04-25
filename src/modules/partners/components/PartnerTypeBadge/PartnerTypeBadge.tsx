import { ComponentProps, FC } from "react";

import { Badge } from "@/core/components/ui/badge";
import { PartnerTypesIds } from "@/modules/partners/setup/partners";

type PartnerTypeBadgeProps = { partnerTypeId: string } & ComponentProps<
  typeof Badge
>;
const PartnerTypeBadge: FC<PartnerTypeBadgeProps> = ({
  partnerTypeId,
  children,
  className = "",
  ...rest
}) => {
  /**
   * Get the custom styles for each partner type ID (default styles if not included)
   *
   * @param {string} typeId
   *
   * @returns {string}
   */
  const getPartnerTypeStyles = (type: string) => {
    const styles: Partial<Record<PartnerTypesIds, string>> = {
      [PartnerTypesIds.LOGISTICS_OPERATOR]: "bg-blue-100 text-blue-800",
      [PartnerTypesIds.PORT_AGENT]: "bg-purple-100 text-purple-800",
      [PartnerTypesIds.INSURER]: "bg-yellow-100 text-yellow-800",
      [PartnerTypesIds.CUSTOMS_BROKER]: "bg-green-100 text-green-800",
      // TODO add the rest
    };

    const defaultStyle = "bg-gray-100 text-gray-800";

    return styles?.[type as PartnerTypesIds] || defaultStyle;
  };

  return (
    <Badge
      className={`${getPartnerTypeStyles(partnerTypeId)} ${className}`}
      {...rest}
    >
      {children || "undefined"}
    </Badge>
  );
};

export default PartnerTypeBadge;
