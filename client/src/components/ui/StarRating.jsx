import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, numReviews, size = 'sm' }) => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-amber-500" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-amber-500" />);
    else stars.push(<FaRegStar key={i} className="text-amber-500" />);
  }
  return (
    <div className={`flex items-center gap-1 ${sizes[size]}`}>
      {stars}
      {numReviews !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({numReviews})</span>
      )}
    </div>
  );
};
export default StarRating;
