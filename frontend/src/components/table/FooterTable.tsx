import { ChevronLeft, ChevronRight } from "lucide-react";

type FooterTableProps = {
  numberOfPages: number;
  pageIndex: number;
  setPageIndex: (pageNumber: number) => void;
  listLength: number;
  numberPerPageList?: number[];
  numberPerPage: number;
  setNumberPerPage: (value: number) => void;
  itemLabel?: string;
};

export function FooterTable({
  numberOfPages,
  pageIndex,
  setPageIndex,
  listLength,
  numberPerPage = 10,
  numberPerPageList = [10, 20, 50, 100],
  setNumberPerPage,
  itemLabel = "matériel(s)",
}: FooterTableProps) {
  return (
    <div className="border border-slate-200 rounded-b-xl bg-white ">
      <div className="py-2 px-3 border-t-1 border-slate-100">
        <div className="flex justify-between w-full">
          <button
            onClick={() => {
              if (pageIndex > 0) setPageIndex(pageIndex - 1);
            }}
            className={`flex gap-2 items-center p-2 pr-3 rounded-md border text-sm transition-all duration-500
            ${pageIndex > 0 ? "cursor-pointer border-slate-300 text-slate-600 hover:text-slate-700 hover:border-slate-400 hover:shadow-sm" : "border-slate-200 text-slate-400"}`}
          >
            <ChevronLeft className="h-5 w-5 min-h-5 min-w-5" />
            Précédente
          </button>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: numberOfPages }).map((_, pageNumber) => (
              <button
                onClick={() => {
                  setPageIndex(pageNumber);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-md p-2 
                ${pageNumber === pageIndex ? "bg-[#e6007e] text-white" : "cursor-pointer"}`}
                key={pageNumber}
              >
                {pageNumber + 1}
              </button>
            ))}
          </div>
          <button
            className={`flex gap-2 items-center p-2 pr-3 rounded-md border text-sm transition-all duration-500
            ${pageIndex < numberOfPages - 1 ? "cursor-pointer border-slate-300 text-slate-600 hover:text-slate-700 hover:border-slate-400 hover:shadow-sm" : "border-slate-200 text-slate-400"}`}
            onClick={() => {
              if (pageIndex < numberOfPages - 1) setPageIndex(pageIndex + 1);
            }}
          >
            Suivante
            <ChevronRight className="h-5 w-5 min-h-5 min-w-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-between border-t-1 border-slate-100 py-2 px-3 text-[12px] text-slate-400">
        <div className="flex gap-2">
          <select
            onChange={(e) => {
              setNumberPerPage(parseInt(e.target.value));
            }}
            defaultValue={numberPerPage}
          >
            {numberPerPageList.map((npp) => (
              <option key={npp}>{npp}</option>
            ))}
          </select>
          éléments par page
        </div>
        {listLength} {itemLabel} trouvé(s)
      </div>
    </div>
  );
}
