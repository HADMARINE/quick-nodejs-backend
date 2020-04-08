export default function checkJong(value: any): boolean {
  value = value.charCodeAt(value.length - 1);
  return (value - 0xac00) % 28 > 0;
}
