import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container = ({
  className,
  children,
  ...props
}: ContainerProps) => (
  <div className={cn("container", className)} {...props}>
    {children}
  </div>
);
