import { useEffect, useState } from 'react';
import serviceService from '../services/serviceService';

export default function useServiceOptions(serviceTypeId) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceTypeId) return;

    setLoading(true);

    serviceService.getServicesByServiceType(serviceTypeId)
      .then((res) => {
        const list = res?.data?.data ?? res?.data ?? [];

        const formatted = Array.isArray(list)
          ? list.map((item) => ({
              value: String(item.service_id),
              label: item.service_name,
            }))
          : [];

        setOptions(formatted);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [serviceTypeId]);

  return { options, loading };
}