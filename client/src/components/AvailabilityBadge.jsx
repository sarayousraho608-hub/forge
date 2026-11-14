import { useApp } from '../context/AppContext';
import { PROFILE } from '../config';
import useFetch from '../hooks/useFetch';
import { USE_API, apiUrl } from '../api';

export default function AvailabilityBadge() {
  const { t } = useApp();
  // مع الخادم: الإتاحة تأتي منه. بدونه: من config.js
  const { data } = useFetch(USE_API ? apiUrl('/api/settings') : null);
  const on = data ? data.available : PROFILE.available;
  return (
    <span className="badge">
      <span className={on ? 'dot' : 'dot busy'} />
      {on ? t('availYes') : t('availNo')}
    </span>
  );
}
