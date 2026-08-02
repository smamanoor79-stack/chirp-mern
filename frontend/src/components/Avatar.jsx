import { initials } from '../utils';

export default function Avatar({ name, picture, size, onClick, className = '' }) {
  const style = picture
    ? { backgroundImage: `url(${picture})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};
  if (size) {
    style.width = size;
    style.height = size;
    style.minWidth = size;
    style.fontSize = Math.max(11, Math.floor(size * 0.37));
  }
  return (
    <div className={`avatar ${className}`} style={{ ...style, cursor: onClick ? 'pointer' : undefined }} onClick={onClick}>
      {!picture && initials(name)}
    </div>
  );
}
