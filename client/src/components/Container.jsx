/**
 * 페이지 콘텐츠 폭을 통일하는 래퍼. 배경을 화면 전체 폭으로 깔고 싶은 헤더/배너 같은
 * 요소는 바깥 태그(예: <header>)에 배경색을 주고, 그 안의 실제 내용만 이 컴포넌트로 감싼다.
 */
export default function Container({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`box-border mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</Tag>
  );
}
