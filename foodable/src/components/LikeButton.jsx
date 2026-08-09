export default function LikeButton({ likes, onClick }) {
  return (
    <button className="pill-render likes-render" onClick={onClick}>
      ♥ {likes}
    </button>
  );
}
