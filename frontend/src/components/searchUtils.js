import { useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const navigate = useNavigate();

  const handleSearch = (searchQuery, selectedOption) => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }

    const query = searchQuery.trim();
    const searchBy = selectedOption || 'all';

    fetch(`http://localhost:5000/api/search?searchBy=${searchBy}&query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        navigate('/SearchResults', { state: { results: data, searchQuery: query, searchBy } });
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  };

  return { handleSearch };
};
