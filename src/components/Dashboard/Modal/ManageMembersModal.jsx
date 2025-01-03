
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { debounce } from 'lodash';
import api from '../../../utils/api';

const ManageMembersModal = ({ open, onClose, groupId, currentMembers, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const queryClient = useQueryClient();

  const { data: searchResults } = useQuery(
    ['searchUsers', searchTerm],
    () => api.get(`/users/search?q=${searchTerm}`),
    {
      enabled: searchTerm.length > 2
    }
  );

  const addMembersMutation = useMutation(
    (userIds) => api.post(`/groups/${groupId}/members`, { userIds }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['group', groupId]);
        setSelectedUsers([]);
      }
    }
  );

  const removeMembersMutation = useMutation(
    (userIds) => api.delete(`/groups/${groupId}/members`, { data: { userIds } }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['group', groupId]);
        setSelectedToRemove([]);
      }
    }
  );

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleAddMembers = () => {
    if (selectedUsers.length > 0) {
      addMembersMutation.mutate(selectedUsers.map(user => user.id));
    }
  };

  const handleRemoveMembers = () => {
    if (selectedToRemove.length > 0) {
      removeMembersMutation.mutate(selectedToRemove);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Manage Group Members</DialogTitle>
      <DialogContent>
        {isAdmin && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Add New Members
              </Typography>
              <TextField
                fullWidth
                placeholder="Search users..."
                onChange={(e) => handleSearchChange(e.target.value)}
                variant="outlined"
                size="small"
              />
              
              {searchResults?.data.length > 0 && (
                <List>
                  {searchResults.data.map(user => (
                    <ListItem 
                      key={user.id}
                      button
                      onClick={() => setSelectedUsers([...selectedUsers, user])}
                    >
                      <ListItemText 
                        primary={user.name}
                        secondary={user.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {selectedUsers.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Users
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedUsers.map(user => (
                      <Chip
                        key={user.id}
                        label={user.name}
                        onDelete={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}
                      />
                    ))}
                  </Box>
                  <Button
                    startIcon={<PersonAddIcon />}
                    variant="contained"
                    onClick={handleAddMembers}
                    sx={{ mt: 2 }}
                  >
                    Add Selected Users
                  </Button>
                </Box>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Current Members
        </Typography>
        <List>
          {currentMembers.map(member => (
            <ListItem key={member.id}>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {member.name}
                    {member.isAdmin && (
                      <Chip
                        icon={<AdminIcon />}
                        label="Admin"
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                }
              />
              {isAdmin && !member.isAdmin && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => setSelectedToRemove([...selectedToRemove, member.id])}
                    disabled={selectedToRemove.includes(member.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        {selectedToRemove.length > 0 && (
          <Button
            color="error"
            onClick={handleRemoveMembers}
            startIcon={<DeleteIcon />}
          >
            Remove Selected Members
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageMembersModal;
