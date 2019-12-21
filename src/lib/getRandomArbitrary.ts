export default function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
