import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) { start = 2; end = 4; }
      if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1; }
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((p, i) => (
      typeof p === 'number' ? (
        <button
          key={i}
          onClick={() => onPageChange(p)}
          className={`min-w-[32px] h-8 flex items-center justify-center rounded border text-sm transition-colors ${
            currentPage === p
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ) : (
        <span key={i} className="px-2 text-gray-400 self-end mb-1">...</span>
      )
    ));
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
      {/* Left: Info & Size Changer */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
         <div className="flex items-center gap-2">
           <span>每页</span>
           <select
             value={pageSize}
             onChange={(e) => {
                 onPageSizeChange(Number(e.target.value));
                 onPageChange(1); // Reset to page 1 on size change
             }}
             className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary-500 bg-white cursor-pointer"
           >
             {[10, 20, 50, 100].map(size => (
               <option key={size} value={size}>{size}</option>
             ))}
           </select>
           <span>条</span>
         </div>
         <span className="hidden sm:inline">显示 {startItem}-{endItem} 条，共 {totalItems} 条</span>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex gap-1">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;