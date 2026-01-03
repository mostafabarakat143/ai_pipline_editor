import { useState, useEffect, useCallback } from 'react';
import type { NodeTypeData } from '../types/pipeline';

 // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface UseNodeTypesResult {
  nodeTypes: NodeTypeData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNodeTypes(): UseNodeTypesResult {
  const [nodeTypes, setNodeTypes] = useState<NodeTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodeTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // const response = await fetch(`${API_URL}/api/nodes`, {
      const response = await fetch(`/api/nodes`, {
        signal: AbortSignal.timeout(5000),  
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NodeTypeData[] = await response.json();
      setNodeTypes(data);
    } catch (err) {
      console.warn('API fetch failed, using mock data:', err);
      
       await new Promise((resolve) => setTimeout(resolve, 1000));
      
       const mockData: NodeTypeData[] = [
        { id: '1', name: 'Data Source' },
        { id: '2', name: 'Transformer' },
        { id: '3', name: 'Model' },
        { id: '4', name: 'Sink' },
      ];
      
      setNodeTypes(mockData);
     } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodeTypes();
  }, [fetchNodeTypes]);

  return {
    nodeTypes,
    isLoading,
    error,
    refetch: fetchNodeTypes,
  };
}
