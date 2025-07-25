import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

export async function getAutoData() {
  const urls = {
    users: '/users',
    branch: '/branch',
    department: '/department',
    position: '/position',
    section: '/section'
  };

  const fetchMultipleUrls = async (urls: { [key: string]: string }) => {
    try {
      const response = Object.entries(urls).map(async ([key, url]) => {
        const response = await client.get(dataConfig().http + url, { method: 'GET', headers: dataConfig().header });
        const data = await response.data;
        return { key, data };
      });
      return await Promise.all(response);
    } catch (error) {
      console.error('ข้อผิดพลาด:', error);
    }
  };

  return fetchMultipleUrls(urls);
}

