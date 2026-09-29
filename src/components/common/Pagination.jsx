import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Reusable Pagination Component for Products and Catalogs
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total available pages
 * @param {number} [props.totalCount] - Total item count across all pages
 * @param {number} [props.limit] - Items per page
 * @param {Function} props.onPageChange - Callback when a page is selected
 * @param {boolean} [props.scrollToTop=true] - Whether to scroll to page top on change
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalCount,
  limit = 12,
  onPageChange,
  scrollToTop = true
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    onPageChange(newPage);
    if (scrollToTop) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Generate intelligent page numbers list
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount || currentPage * limit);

  return (
    <div
      className="custom-pagination-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginTop: '44px',
        marginBottom: '24px',
        width: '100%'
      }}
    >
      {/* Optional Counter Summary */}
      {totalCount !== undefined && totalCount > 0 && (
        <div
          style={{
            fontSize: '13px',
            fontFamily: 'Space Mono, monospace',
            color: 'var(--ink-soft)',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          Showing <span style={{ color: 'var(--pitch)', fontWeight: 800 }}>{startItem}</span> -{' '}
          <span style={{ color: 'var(--pitch)', fontWeight: 800 }}>{endItem}</span> of{' '}
          <span style={{ color: 'var(--gold-dark)', fontWeight: 800 }}>{totalCount}</span> products
        </div>
      )}

      {/* Main Pagination Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'var(--white)',
          padding: '8px 16px',
          borderRadius: '50px',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* First Page Button */}
        <button
          type="button"
          aria-label="First page"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'var(--white)',
            color: currentPage === 1 ? 'var(--ink-soft)' : 'var(--pitch)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: 'all 0.2s ease'
          }}
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 14px',
            height: '38px',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            background: 'var(--white)',
            color: currentPage === 1 ? 'var(--ink-soft)' : 'var(--pitch)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            fontWeight: 700,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  style={{
                    padding: '0 8px',
                    color: 'var(--ink-soft)',
                    fontWeight: 700,
                    fontFamily: 'Space Mono, monospace'
                  }}
                >
                  ...
                </span>
              );
            }

            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '38px',
                  height: '38px',
                  padding: '0 10px',
                  borderRadius: '50%',
                  border: isActive ? '2px solid var(--gold)' : '1px solid var(--line)',
                  background: isActive ? 'var(--pitch)' : 'var(--white)',
                  color: isActive ? '#ffffff' : 'var(--pitch)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 700,
                  cursor: isActive ? 'default' : 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(17, 54, 43, 0.25)' : 'none',
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 14px',
            height: '38px',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            background: 'var(--white)',
            color: currentPage === totalPages ? 'var(--ink-soft)' : 'var(--pitch)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            fontWeight: 700,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.4 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>

        {/* Last Page Button */}
        <button
          type="button"
          aria-label="Last page"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'var(--white)',
            color: currentPage === totalPages ? 'var(--ink-soft)' : 'var(--pitch)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.4 : 1,
            transition: 'all 0.2s ease'
          }}
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
