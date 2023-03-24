export const getPublicIp = async (): Promise<string> => {
  const res = await fetch('https://api64.ipify.org?format=json');
  const { ip } = await res.json();
  return ip;
}
