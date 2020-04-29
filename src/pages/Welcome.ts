export default function welcome(
  serverName: string,
  nextline: string | null = null,
): string {
  return `<style> @import url("https://fonts.googleapis.com/css?family=Zilla+Slab|Zilla+Slab+Highlight");body { background: linear-gradient(to bottom, #7474bf, #348ac7);display: flex;flex-direction: column;justify-content: center;align-items: center;min-height: 100vh;font-family: 'Zilla Slab', serif;text-align:center;font-size: 2em;letter-spacing: -1px;}quote::before {content: "\\201C";}quote::after {content: "\\201D";}ins {font-family: 'Zilla Slab Highlight', cursive;color: rgba(132, 175, 155, 0.75);cursor: help;position: relative;}ins::before {content: "(${
    process.env.NODE_ENV
  })";display: block;pointer-events: none;position: absolute;font-family: 'Zilla Slab', serif;color: #659b82;font-size: 0.5em;transition: all 500ms ease;top: -2em;left: 0;opacity: 0;}ins:hover del {max-width: 9em;}ins:hover::before {opacity: 1;top: -1.2em;}ins del {color: rgba(255, 107, 107, 0.75);text-decoration: none;display: inline-block;vertical-align: bottom;overflow: hidden;transition: all 500ms ease;max-width: 0;}ins del::before {content: "\\00a0";visibility: hidden;}</style><quote>Welcome to <ins>${serverName}<del>${(
    process.env.NODE_ENV || 'undefined'
  ).toUpperCase()}</del></ins> server.</quote>${
    nextline ? `<br/>${nextline}` : ''
  }`;
}
