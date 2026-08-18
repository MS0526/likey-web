import { useEffect, useState } from 'react';

/**
 * 물품 이미지를 고정 비율 박스 안에 always object-contain으로 넣는다.
 * 제품 사진이 잘리면 안 되므로 object-cover 대신 여백(연한 회색)을 허용한다.
 * 이미지가 없거나 로드에 실패하면 같은 비율의 placeholder 아이콘으로 대체한다.
 */
export default function ItemImage({
  src,
  alt,
  aspect = 'aspect-square',
  placeholderIcon,
  className = '',
  children,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const showImage = Boolean(src) && !failed;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gray-100 ${aspect} ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        placeholderIcon
      )}
      {children}
    </div>
  );
}
