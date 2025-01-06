
import { useMutation, useQueryClient } from "react-query";
import { showSuccessNotification, showErrorNotification } from "../utils/notifications";
import api from "../utils/api";

const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  const deleteGroup = async (id) => {
    try {
      await api.delete(`/groups/${id}`);
      showSuccessNotification("Group deleted successfully!");
    } catch (error) {
      showErrorNotification(error.response?.data?.message || "Error deleting group.");
    }
  };

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries("groups");
    },
  });

  return deleteGroupMutation;
};

export default useDeleteGroup;
