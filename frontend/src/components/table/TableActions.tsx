export type TableAction = {
  icon: (className: string) => React.ReactNode;
  onClick: () => void;
};

interface TableActionsProps {
  actions: TableAction[];
}

export default function TableActions({ actions }: TableActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="h-[35px] w-[35px] flex justify-center items-center cursor-pointer text-slate-400 transition-colors 
          hover:bg-pink-100 hover:text-[#cb006b] rounded-md"
          onClick={action.onClick}
        >
          {action.icon("h-5.5 w-5.5 min-h-5.5 min-w-5.5")}
        </button>
      ))}
    </div>
  );
}
