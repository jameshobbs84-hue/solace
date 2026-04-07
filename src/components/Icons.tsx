// SVG icons as React components — matching Figma sidebar icons

interface IconProps { className?: string; style?: React.CSSProperties }

export function HomeIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.75 15V8.25L9 3L2.25 8.25V15C2.25 15.4142 2.58579 15.75 3 15.75H6.75V11.25H11.25V15.75H15C15.4142 15.75 15.75 15.4142 15.75 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function SearchIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.4875 12.4875L15.75 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LibraryIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 4.5H15.75M2.25 9H15.75M2.25 13.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CalendarIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.25" y="3" width="13.5" height="13.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 1.5V4.5M6 1.5V4.5M2.25 7.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CommunityIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11.25C10.8638 11.25 12.375 9.73883 12.375 7.875C12.375 6.01117 10.8638 4.5 9 4.5C7.13617 4.5 5.625 6.01117 5.625 7.875C5.625 9.73883 7.13617 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.375 15C4.09586 13.2627 5.91582 12 9 12C12.0842 12 13.9041 13.2627 14.625 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.625 5.25C15.5 5.625 16.125 6.75 16.125 7.875C16.125 9 15.5 10.125 14.625 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.375 5.25C2.5 5.625 1.875 6.75 1.875 7.875C1.875 9 2.5 10.125 3.375 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BookmarkIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 15.75L9 12.375L4.5 15.75V3.375C4.5 3.17609 4.57902 2.98532 4.71967 2.84467C4.86032 2.70402 5.05109 2.625 5.25 2.625H12.75C12.9489 2.625 13.1397 2.70402 13.2803 2.84467C13.421 2.98532 13.5 3.17609 13.5 3.375V15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function GearIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 2.25L7.125 3.75C6.75 3.9375 6.375 4.125 6.0938 4.3125L4.5938 3.9375L3.0938 6.5625L4.2188 7.6875C4.2188 7.875 4.125 8.4375 4.125 8.625V9.375C4.125 9.5625 4.125 9.75 4.2188 10.3125L3.0938 11.4375L4.5938 14.0625L6.0938 13.6875C6.375 13.875 6.75 14.0625 7.125 14.25L7.5 15.75H10.5L10.875 14.25C11.25 14.0625 11.625 13.875 11.9062 13.6875L13.4062 14.0625L14.9062 11.4375L13.7812 10.3125C13.7812 10.125 13.875 9.5625 13.875 9.375V8.625C13.875 8.4375 13.875 8.25 13.7812 7.6875L14.9062 6.5625L13.4062 3.9375L11.9062 4.3125C11.625 4.125 11.25 3.9375 10.875 3.75L10.5 2.25H7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronDownIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0.5L4 3.5L7 0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronUpIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 3.5L4 0.5L7 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MessagesIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 10.1596 2.54158 11.2527 3.05469 12.2109L2.25 15.75L5.78906 14.9453C6.74722 15.4584 7.84042 15.75 9 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.375 8.25H11.625M6.375 10.5H9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function NotificationsIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 6.75C13.5 5.55653 13.0259 4.41193 12.182 3.56802C11.3381 2.72411 10.1935 2.25 9 2.25C7.80653 2.25 6.66193 2.72411 5.81802 3.56802C4.97411 4.41193 4.5 5.55653 4.5 6.75C4.5 12 2.25 13.5 2.25 13.5H15.75C15.75 13.5 13.5 12 13.5 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.2975 15.75C10.1657 15.9773 9.97614 16.166 9.74831 16.2968C9.52048 16.4277 9.2625 16.4963 9 16.4963C8.7375 16.4963 8.47952 16.4277 8.25169 16.2968C8.02386 16.166 7.83434 15.9773 7.7025 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MenuIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 4.5H15.75M2.25 9H15.75M2.25 13.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CloseIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 1L1.5 8L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 1L7.5 8L1.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DashboardIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.25" y="2.25" width="5.25" height="5.25" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10.5" y="2.25" width="5.25" height="5.25" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2.25" y="10.5" width="5.25" height="5.25" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10.5" y="10.5" width="5.25" height="5.25" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ContentIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 2.25H4.5C3.67157 2.25 3 2.92157 3 3.75V14.25C3 15.0784 3.67157 15.75 4.5 15.75H13.5C14.3284 15.75 15 15.0784 15 14.25V6.75L10.5 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 2.25V6.75H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 9.75H12M6 12.75H9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MembersIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.75 15.75V14.25C12.75 12.5931 11.4069 11.25 9.75 11.25H4.5C2.84315 11.25 1.5 12.5931 1.5 14.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7.125" cy="5.25" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 15.75V14.25C16.5 12.9193 15.5449 11.7931 14.25 11.4375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2.4375C13.2983 2.78999 14.2571 3.91803 14.2571 5.25C14.2571 6.58197 13.2983 7.71001 12 8.0625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ShieldIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.5C9 16.5 15 13.5 15 9V3.75L9 1.5L3 3.75V9C3 13.5 9 16.5 9 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
