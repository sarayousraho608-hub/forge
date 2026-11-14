import { useApp } from '../context/AppContext';
import { PROFILE } from '../config';

export default function AvailabilityBadge() {
  const { t } = useApp();
  const on = PROFILE.available;
  return (
    <span className="badge">
      <span className={on ? 'dot' : 'dot busy'} />
      {on ? t('availYes') : t('availNo')}
    </span>
  );
}
