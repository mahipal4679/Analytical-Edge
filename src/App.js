import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttribute, setFilterAttribute] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Fetch data from JSON Placeholder API
  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await usersResponse.json();
      setUsers(users);

      const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await postsResponse.json();
      setPosts(posts);

      const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
      const comments = await commentsResponse.json();
      setComments(comments);
    };

    fetchData();
  }, [users,posts,comments]);

  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filtering
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterAttributeChange = (event) => {
    setFilterAttribute(event.target.value);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  // Sorting
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Apply filters and sorting to the data
  const filteredAndSortedData = posts
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((post) => {
      if (filterAttribute === '') {
        return true;
      } else {
        return post[filterAttribute] === filterValue;
      }
    })
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

  // Pagination logic
  const pageSize = 10;
  const totalPosts = filteredAndSortedData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalPosts - 1);
  const totalPagesCount = Math.ceil(totalPosts / pageSize);

  useEffect(() => {
    setTotalPages(totalPagesCount);
  }, [totalPagesCount]);

  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex + 1);

  return (
    <div className="container">
      <table className="data-grid">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('userId')}>User ID</th>
            <th onClick={() => handleSort('body')}>Body</th>
            <th onClick={() => handleSort('title')}>Title</th> 
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.userId}</td>
              <td>{post.body}</td>
              <td>{post.title}</td>           
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="page-info">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <div className="filter">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="filter-select"
          value={filterAttribute}
          onChange={handleFilterAttributeChange}
        >
          <option value="">No filter</option>
          <option value="userId">User ID</option>
        </select>
        <input
          type="text"
          className="filter-value-input"
          placeholder="Filter value"
          value={filterValue}
          onChange={handleFilterValueChange}
        />
      </div>
    </div>
  );
};

export default App;
