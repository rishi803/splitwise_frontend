import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FaSearch, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../../utils/api';
import './GroupSearch.css';

const GroupSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const { data: suggestions, isLoading } = useQuery(
    ['groupSearch', searchTerm],
    () => api.get(`/groups?search=${searchTerm}`),
    {
      enabled: searchTerm.length > 0,
      staleTime: 2000
    }
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSelectGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {showSuggestions && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-loading">Searching...</div>
          ) : suggestions?.data?.groups.length > 0 ? (
            suggestions.data.groups.map((group) => (
              <div
                key={group.id}
                className="suggestion-item"
                onClick={() => handleSelectGroup(group.id)}
              >
                <div className="suggestion-name">{group.name}</div>
                <div className="suggestion-details">
                  <span>
                    <FaUsers /> {group.memberCount}
                  </span>
                  <span>
                    <FaMoneyBillWave /> ₹{group.totalExpense}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-suggestions">No groups found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupSearch;