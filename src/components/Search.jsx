const Search = ({ searchVal, setSearchVal }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="" />

        <input
          type="input"
          placeholder="What's on your mind ?"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
