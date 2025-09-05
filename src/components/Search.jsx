const Search = ({ searchVal, setSearchVal, query }) => {
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      query();
    }
  }

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="" />
        <input
          type="input"
          placeholder="What's on your mind ?"
          value={searchVal}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
