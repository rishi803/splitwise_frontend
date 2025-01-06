import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import './RemoveGroupMembersModal.css'

const RemoveMembersModal = ({ groupId, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch group members with balances
  const { data: groupMembersData, isLoading } = useQuery(
    ['groupMembersWithBalances', groupId],
    async () => {
      const [membersResponse, groupDetailsResponse] = await Promise.all([
        api.get(`/groups/${groupId}/members`),
        api.get(`/groups/${groupId}`)
      ]);
      
      const adminId = groupDetailsResponse?.data.created_by;

      console.log("memberresponse ", membersResponse);
      
      return membersResponse?.data.map(member => ({
        ...member,
        isAdmin: member.id === adminId,
        balance: groupDetailsResponse.data.memberBalances.find(
          balance => balance.id === member.id
        )?.balance || 0
      }));
    }
  );

  // Remove members mutation
  const removeMembersMutation = useMutation(
    (memberIds) => api.post(`/groups/${groupId}/remove-members`, { memberIds }),
    {
      onSuccess: (response) => {
        toast.success('Members removed successfully');
        queryClient.invalidateQueries(['groupMembers', groupId]);
        queryClient.invalidateQueries(['groupMembersWithBalances', groupId]);
        onClose();
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || 'Failed to remove members';
        toast.error(errorMessage);
      }
    }
  );

  const handleMemberSelect = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleRemoveMembers = () => {
    removeMembersMutation.mutate(selectedMembers);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Remove Group Members</h2>
        <div className="member-list">
          {groupMembersData?.map(member => {
            const isSelectable = 
              !member.isAdmin && 
              Math.abs(member.balance) < 0.01;
            
            const isSelected = selectedMembers.includes(member.id);

            return (
              <div 
                key={member.id}
                className={`member-item 
                  ${isSelectable ? 'selectable' : 'disabled'}
                  ${isSelected ? 'selected' : ''}
                `}
                onClick={() => isSelectable && handleMemberSelect(member.id)}
              >
                <span>{member.name}</span>
                {member.isAdmin && <span className="admin-tag">Admin</span>}
                <span className="balance">
                  Balance: ₹{Math.abs(member.balance).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <button className='submit-button' 
            onClick={handleRemoveMembers}
            disabled={selectedMembers.length === 0 || removeMembersMutation.isLoading}
          >
            {removeMembersMutation.isLoading ? 'Removing...' : 'Remove Selected'}
          </button>
          
          <button className='cancel-button' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RemoveMembersModal;