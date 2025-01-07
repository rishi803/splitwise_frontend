import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../store/slices/pageSlice';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const dispatch = useDispatch();

  const handlePageChange = (newPage) => {
    // update global state
    dispatch(setCurrentPage(newPage));
    // onPageChange function to update the local state
    onPageChange(newPage);
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-button"
      >
        Previous
      </button>
      
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;