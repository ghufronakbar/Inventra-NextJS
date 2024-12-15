interface LayoutDashboardProps {
  title: string;
  childrenHeader?: React.ReactNode;
  children: React.ReactNode;
}
const LayoutDashboard = ({
  title,
  childrenHeader,
  children,
}: LayoutDashboardProps) => {
  return (
    <div className="px-6 md:p-10 rounded-tl-2xl border border-neutral-200 bg-gray-50 flex flex-col gap-2 flex-1 w-full h-full overflow-auto py-4 md:py-8 lg:py-12">
      <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
        <h2 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl tracking-tight font-semibold text-black">
          {title}
        </h2>
        {childrenHeader}
      </div>
      <div className="flex flex-col gap-2 flex-1 mt-4">{children}</div>
    </div>
  );
};

export default LayoutDashboard;
