export default function SocialSearch({ searchText, setSearchText }) {
  return (
    <div id="search-bar" className="social-search-bar">
      <input
        type="text"
        placeholder="Search for recipes or grocery lists!"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}
