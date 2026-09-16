// client/src/components/PostCard.jsx
export function PostCard({ post }) {
  return (
    <li className="border-b border-gray-200 pb-4">
      <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
      <p className="mt-1 text-gray-600 line-clamp-3">{post.body}</p>
    </li>
  );
}
