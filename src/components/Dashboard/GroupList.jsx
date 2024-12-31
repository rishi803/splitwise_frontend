import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import GroupCard from './GroupCard';
import Pagination from '../common/Pagination';
import './Dashboard.css';

const ITEMS_PER_PAGE = 6;

const GroupList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;

  const [page, setPage] = useState(pageFromUrl);

  useEffect(() => {
    // Update the URL whenever the page changes
    setSearchParams({ page });
  }, [page, setSearchParams]);

  const { data, isLoading } = useQuery(
    ['groups', page],
    () => api.get(`/groups?page=${page}&limit=${ITEMS_PER_PAGE}`),
    { keepPreviousData: true }
  );
  console.log('groups data from groupList ', data);

  if (isLoading) return <div className="loading">Loading groups...</div>;

  const showPagination = data?.data.total > ITEMS_PER_PAGE;

  return (
    <div className="group-list">
      <div className="group-grid">
        {data?.data.groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(data?.data.total / ITEMS_PER_PAGE)}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default GroupList;