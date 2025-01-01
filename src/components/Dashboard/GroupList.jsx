import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import GroupCard from "./GroupCard";
import Pagination from "../common/Pagination";
import "./Dashboard.css";

const ITEMS_PER_PAGE = 6;

const GroupList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageFromUrl);

  useEffect(() => {
    setSearchParams({ page });
  }, [page, setSearchParams]);

  const { data, isLoading } = useQuery(
    ["groups", page],
    () => api.get(`/groups?page=${page}&limit=${ITEMS_PER_PAGE}`),
    { keepPreviousData: true }
  );

  if (isLoading) return <div className="loading">Loading groups...</div>;

  const showPagination = data?.data.total > ITEMS_PER_PAGE;

  return (
    <div className="group-list-container">
      <div className="group-list">
        <div className="group-grid">
          {data?.data.groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
          {data?.data.groups.length === 0 && (
            <div className="no-group-found">No groups found</div>
          )}
        </div>
        {showPagination && (
          <div className="pagination-wrapper">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data?.data.total / ITEMS_PER_PAGE)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
