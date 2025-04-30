import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

type OptionalFieldTagProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

const OptionalFieldTag: FC<OptionalFieldTagProps> = ({
  className = "",
  ...rest
}) => {
  return (
    <span className={`text-xs text-muted-foreground ${className}`} {...rest}>
      (optional)
    </span>
  );
};

export default OptionalFieldTag;
