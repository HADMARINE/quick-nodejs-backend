export default function checkJong(value: string): boolean {
  const result = value.charCodeAt(value.length - 1);
  return (result - 0xac00) % 28 > 0;
}
