function SortBy(
    sortBy,
    sortDirection,
    onSortByChange,
    onSortDirectionChange,
  ) {
    return (
        <div>
          <label htmlFor="sortBy">Sort by</label>
      
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="creationDate">Creation Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      );
  }