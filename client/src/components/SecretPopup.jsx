import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useSecrets, { closePopup } from '../hooks/useSecrets';
import Modal from './Modal';

// تظهر فوق الموقع كلما كُشف سر (والموقع يبقى ظاهراً خلفها).
export default function SecretPopup() {
  const { t } = useApp();
  const { popup, count, total } = useSecrets();
  if (!popup) return null;
  return (
    <Modal title={t('secretFoundTitle')} onClose={closePopup} burst>
      <p>{t('secretText_' + popup.id)}</p>
      <p className="secret-count">{count}/{total}</p>
      <Link to="/prize#prize-secrets" onClick={closePopup} className="btn btn-primary">{t('secretSeePrize')}</Link>
    </Modal>
  );
}
