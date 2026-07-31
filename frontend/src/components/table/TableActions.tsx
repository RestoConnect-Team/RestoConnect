export type TableAction = {
  icon: (className: string) => React.ReactNode;
  onClick: () => void;
};

interface TableActionsProps {
  actions: TableAction[];
}

export default function TableActions({ actions }: TableActionsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="cursor-pointer hover:text-slate-500 text-slate-400 transition-colors"
          onClick={action.onClick}
        >
          {action.icon("h-5 w-5 min-h-5 min-w-5")}
        </button>
      ))}
    </div>
  );
}
