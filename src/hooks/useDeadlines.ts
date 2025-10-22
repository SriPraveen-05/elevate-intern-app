import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  addDeadline as addDeadlineApi,
  updateDeadline as updateDeadlineApi,
  deleteDeadline as deleteDeadlineApi,
  getUpcomingDeadlines,
  type Deadline
} from "@/lib/deadline-utils";

export function useDeadlines(userName: string) {
  const queryClient = useQueryClient();
  
  // Get all deadlines
  const { 
    data: deadlines = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['deadlines', userName],
    queryFn: () => getUpcomingDeadlines(userName, { includeCompleted: false }),
    enabled: !!userName,
  });

  // Add a new deadline
  const addDeadline = useMutation({
    mutationFn: (deadline: Omit<Deadline, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => 
      addDeadlineApi(userName, deadline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', userName] });
    },
  });

  // Update an existing deadline
  const updateDeadline = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Deadline> }) => 
      updateDeadlineApi(userName, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', userName] });
    },
  });

  // Toggle deadline completion
  const toggleDeadline = (id: string, completed: boolean) => {
    return updateDeadline.mutateAsync({ 
      id, 
      updates: { completed } 
    });
  };

  // Delete a deadline
  const deleteDeadline = useMutation({
    mutationFn: (id: string) => deleteDeadlineApi(userName, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', userName] });
    },
  });

  return {
    deadlines,
    isLoading,
    error,
    addDeadline: addDeadline.mutateAsync,
    updateDeadline: updateDeadline.mutateAsync,
    toggleDeadline,
    deleteDeadline: deleteDeadline.mutate,
    isAdding: addDeadline.isPending,
    isUpdating: updateDeadline.isPending,
    isDeleting: deleteDeadline.isPending,
  };
}
